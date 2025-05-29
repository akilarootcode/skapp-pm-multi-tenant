import { ErrorCode } from '@/common/enums/errors.enum';
import { VALIDATION_CONSTANTS } from '@/common/constants/validation.constants';
import { ValidationException } from '@/common/exceptions/module.exception';

export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateTenantName(tenantName: string): boolean {
    if (!tenantName) return false;

    return VALIDATION_CONSTANTS.REGEX_PATTERNS.TENANT_NAME.PATTERN.test(
      tenantName,
    );
  }

  static validateAndNormalizeTenantName(tenantName: string): string {
    if (!tenantName?.trim()) {
      throw new ValidationException(ErrorCode.TENANT_NAME_REQUIRED);
    }

    const normalized = tenantName.toLowerCase().trim();

    if (!this.validateTenantName(normalized)) {
      throw new ValidationException(ErrorCode.TENANT_INVALID_FORMAT);
    }

    return normalized;
  }

  static validateUserInput(input: {
    email?: string;
    name?: string;
    description?: string;
  }): void {
    if (input.email && !this.validateEmail(input.email)) {
      throw new ValidationException(ErrorCode.VALIDATION_FAILED, {
        details: 'Invalid email format',
      });
    }
  }

  static validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new ValidationException(ErrorCode.VALIDATION_FAILED, {
        details: 'User ID is required',
      });
    }
  }
}
