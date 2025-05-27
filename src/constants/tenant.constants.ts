export const TENANT_CONSTANTS = {
  HEADER_NAME: 'x-tenant-id',
  NOT_FOUND_ERROR: 'Tenant not found',
  ID_REQUIRED_ERROR: 'The x-tenant-id header is required for this operation',
  NAME_REGEX: /^[a-z0-9_]+$/,
  NAME_ERROR:
    'Tenant name can only contain lowercase letters, numbers, and underscores',
  ALREADY_EXISTS_ERROR: 'Tenant with name {name} already exists',
  CONTEXT_ERROR: 'No tenant context found',
  CLIENT_ERROR: 'No client found for tenant: {tenant}',
};
