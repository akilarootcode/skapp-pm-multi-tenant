import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@/common/enums/errors.enum';
import { ModuleError } from '@/common/types/error.types';
import { MessageUtils } from '@/common/utils/message.utils';

export class ModuleException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly moduleError: ModuleError;

  constructor(
    code: ErrorCode,
    params: Record<string, string> = {},
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    const moduleError: ModuleError = {
      code,
      message: MessageUtils.formatErrorMessage(code, params),
      timestamp: new Date(),
    };

    super(moduleError, status);
    this.errorCode = code;
    this.moduleError = moduleError;
  }
}

export class TenantNotFoundException extends ModuleException {
  constructor(params: { tenantName?: string } = {}) {
    super(ErrorCode.TENANT_NOT_FOUND, params, HttpStatus.NOT_FOUND);
  }
}

export class ValidationException extends ModuleException {
  constructor(code: ErrorCode, params: Record<string, string> = {}) {
    super(code, params, HttpStatus.BAD_REQUEST);
  }
}
