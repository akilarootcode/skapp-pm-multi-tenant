export enum ErrorCode {
  TENANT_NAME_REQUIRED = 'TENANT_NAME_REQUIRED',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  TENANT_CLIENT_FAILED = 'TENANT_CLIENT_FAILED',
  TENANT_CONNECTION_FAILED = 'TENANT_CONNECTION_FAILED',
  TENANT_DISCONNECT_FAILED = 'TENANT_DISCONNECT_FAILED',
  TENANT_INVALID_FORMAT = 'TENANT_INVALID_FORMAT',
  TENANT_MAX_CONNECTIONS = 'TENANT_MAX_CONNECTIONS',
  MASTER_CLIENT_NOT_INITIALIZED = 'MASTER_CLIENT_NOT_INITIALIZED',
  DATABASE_URL_NOT_CONFIGURED = 'DATABASE_URL_NOT_CONFIGURED',
  USER_RETRIEVE_FAILED = 'USER_RETRIEVE_FAILED',
  USER_CREATE_FAILED = 'USER_CREATE_FAILED',
  USER_UPDATE_FAILED = 'USER_UPDATE_FAILED',
  USER_DELETE_FAILED = 'USER_DELETE_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TENANT_CONTEXT_NOT_FOUND = 'TENANT_CONTEXT_NOT_FOUND',
  TENANT_HEADER_REQUIRED = 'TENANT_HEADER_REQUIRED',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.TENANT_NAME_REQUIRED]: 'Tenant name is required',
  [ErrorCode.TENANT_NOT_FOUND]: 'Tenant {tenantName} not found',
  [ErrorCode.TENANT_CLIENT_FAILED]:
    'Failed to get database client for tenant {tenantName}',
  [ErrorCode.TENANT_CONNECTION_FAILED]:
    'Failed to connect to tenant {tenantName} database',
  [ErrorCode.TENANT_DISCONNECT_FAILED]:
    'Failed to disconnect from tenant {tenantName} database',
  [ErrorCode.TENANT_INVALID_FORMAT]: 'Invalid tenant identifier format',
  [ErrorCode.TENANT_MAX_CONNECTIONS]:
    'Maximum tenant database connections exceeded',
  [ErrorCode.MASTER_CLIENT_NOT_INITIALIZED]:
    'Master database client not initialized',
  [ErrorCode.DATABASE_URL_NOT_CONFIGURED]:
    'Database URLs not configured in environment',
  [ErrorCode.USER_RETRIEVE_FAILED]:
    'User operation failed for tenant {tenantName}',
  [ErrorCode.USER_CREATE_FAILED]:
    'Failed to create user for tenant {tenantName}',
  [ErrorCode.USER_UPDATE_FAILED]:
    'Failed to update user for tenant {tenantName}',
  [ErrorCode.USER_DELETE_FAILED]:
    'Failed to delete user for tenant {tenantName}',
  [ErrorCode.VALIDATION_FAILED]: 'Input validation failed: {details}',
  [ErrorCode.UNAUTHORIZED]: 'Authorization required: {details}',
  [ErrorCode.INTERNAL_ERROR]: 'Internal server error occurred',
  [ErrorCode.TENANT_CONTEXT_NOT_FOUND]: 'No tenant context found',
  [ErrorCode.TENANT_HEADER_REQUIRED]:
    'The x-tenant-id header is required for this operation',
};
