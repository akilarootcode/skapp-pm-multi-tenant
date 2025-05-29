import { ErrorCode } from '@/common/enums/errors.enum';
import { ErrorResponse, ModuleError } from '@/common/types/error.types';
import { MessageUtils } from '@/common/utils/message.utils';

export class ResponseUtils {
  static createErrorResponse(
    code: ErrorCode,
    params: Record<string, string> = {},
  ): ErrorResponse {
    const error: ModuleError = {
      code,
      message: MessageUtils.formatErrorMessage(code, params),
      timestamp: new Date(),
    };

    return {
      error,
      success: false,
    };
  }

  static createSuccessResponse<T>(data: T) {
    return {
      data,
      success: true,
      timestamp: new Date(),
    };
  }
}
