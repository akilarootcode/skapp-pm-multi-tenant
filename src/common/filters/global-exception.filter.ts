import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { ERROR_MESSAGES, ErrorCode } from '@/common/enums/errors.enum';
import { MessageUtils } from '@/common/utils/message.utils';
import { ModuleException } from '@/common/exceptions/module.exception';
import { ErrorResponse } from '@/common/types/error.types';
import { GqlContext } from '@/common/types/request.types';

@Catch()
export class GlobalExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): ErrorResponse {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext<GqlContext>();

    if (exception instanceof ModuleException) {
      this.logger.error(`Module Exception: ${exception.errorCode}`, {
        code: exception.errorCode,
        message: exception.moduleError.message,
        context: context?.req?.url || 'GraphQL',
      });

      return {
        error: exception.moduleError,
        success: false,
      };
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception);
    }

    if (exception instanceof PrismaClientUnknownRequestError) {
      this.logger.error('Prisma Unknown Error:', exception.message);
      return {
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR],
          timestamp: new Date(),
        },
        success: false,
      };
    }

    if (exception instanceof PrismaClientValidationError) {
      this.logger.error('Prisma Validation Error:', exception.message);
      return {
        error: {
          code: ErrorCode.VALIDATION_FAILED,
          message: MessageUtils.formatErrorMessage(
            ErrorCode.VALIDATION_FAILED,
            {
              details: 'Database validation failed',
            },
          ),
          timestamp: new Date(),
        },
        success: false,
      };
    }

    if (exception instanceof HttpException) {
      this.logger.error(
        `HTTP Exception: ${exception.message}`,
        exception.stack,
      );
      return {
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: exception.message,
          timestamp: new Date(),
        },
        success: false,
      };
    }

    if (this.isError(exception)) {
      this.logger.error(
        'Unhandled Exception:',
        exception.message,
        exception.stack,
      );

      return {
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR],
          timestamp: new Date(),
        },
        success: false,
      };
    }

    this.logger.error('Unknown Exception Type:', String(exception));
    return {
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR],
        timestamp: new Date(),
      },
      success: false,
    };
  }

  private handlePrismaError(
    exception: PrismaClientKnownRequestError,
  ): ErrorResponse {
    this.logger.error('Prisma Known Error:', {
      code: exception.code,
      message: exception.message,
    });

    let errorCode: ErrorCode;
    let params: Record<string, string> = {};

    switch (exception.code) {
      case 'P2002':
        errorCode = ErrorCode.VALIDATION_FAILED;
        params = { details: 'Unique constraint violation' };
        break;
      case 'P2025':
        errorCode = ErrorCode.USER_RETRIEVE_FAILED;
        params = { tenantName: 'unknown' };
        break;
      case 'P2003':
        errorCode = ErrorCode.VALIDATION_FAILED;
        params = { details: 'Foreign key constraint violation' };
        break;
      case 'P1001':
        errorCode = ErrorCode.TENANT_CONNECTION_FAILED;
        params = { tenantName: 'unknown' };
        break;
      default:
        errorCode = ErrorCode.INTERNAL_ERROR;
        break;
    }

    return {
      error: {
        code: errorCode,
        message: MessageUtils.formatErrorMessage(errorCode, params),
        timestamp: new Date(),
      },
      success: false,
    };
  }

  private isError(exception: unknown): exception is Error {
    return exception instanceof Error;
  }
}
