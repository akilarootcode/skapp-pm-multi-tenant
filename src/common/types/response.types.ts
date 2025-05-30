export interface SuccessResponse<T> {
  data: T;
  success: true;
  timestamp: Date;
  operation?: string;
}
