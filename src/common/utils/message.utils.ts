import { ERROR_MESSAGES, ErrorCode } from '@/common/enums/errors.enum';

export class MessageUtils {
  static formatErrorMessage(
    code: ErrorCode,
    params: Record<string, string> = {},
  ): string {
    let message = ERROR_MESSAGES[code];

    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });

    return message;
  }
}
