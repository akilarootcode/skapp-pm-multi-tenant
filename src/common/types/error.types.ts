import { ErrorCode } from '@/common/enums/errors.enum';

export interface ModuleError {
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: Date;
}

export interface ErrorResponse {
  error: ModuleError;
  success: false;
}
