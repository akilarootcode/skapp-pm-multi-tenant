import { DatabaseMode } from '@/common/enums/database-mode.enum';
import { ModuleException } from '@/common/exceptions/module.exception';
import { ErrorCode } from '@/common/enums/errors.enum';
import { ENV_KEYS } from '@/common/constants/environment.constants';
import { DATABASE_CONSTANTS } from '@/common/constants/database.constants';
import { TENANT_CONSTANTS } from '@/common/constants/tenant.constants';

export const buildTenantDatabaseUrl = (
  tenantName: string,
  mode: DatabaseMode,
): string => {
  const normalizedTenant = validateAndNormalizeTenant(tenantName);
  const baseUrl = getUrl(
    mode === DatabaseMode.WRITE
      ? ENV_KEYS.DATABASE_WRITE_URL
      : ENV_KEYS.DATABASE_READ_URL,
  );

  return addConnectionParams(
    baseUrl.replace('{tenant}', normalizedTenant),
    mode,
    normalizedTenant,
  );
};

export const buildMasterDatabaseUrl = (mode: DatabaseMode): string => {
  const baseUrl = getUrl(
    mode === DatabaseMode.WRITE
      ? ENV_KEYS.MASTER_DATABASE_WRITE_URL
      : ENV_KEYS.MASTER_DATABASE_READ_URL,
  );

  return addConnectionParams(baseUrl, mode);
};

const validateAndNormalizeTenant = (tenantName: string): string => {
  if (!tenantName?.trim())
    throw new ModuleException(ErrorCode.TENANT_NAME_REQUIRED);
  return tenantName.toLowerCase().trim();
};

const getUrl = (envKey: string): string => {
  const url = process.env[envKey];
  if (!url) throw new ModuleException(ErrorCode.DATABASE_URL_NOT_CONFIGURED);
  return url;
};

const addConnectionParams = (
  baseUrl: string,
  mode: DatabaseMode,
  tenantName?: string,
): string => {
  const url = new URL(baseUrl);
  const isWrite = mode === DatabaseMode.WRITE;

  const params = {
    connection_limit: isWrite
      ? DATABASE_CONSTANTS.WRITE_MAX_CONNECTIONS
      : DATABASE_CONSTANTS.READ_MAX_CONNECTIONS,
    pool_timeout: isWrite
      ? DATABASE_CONSTANTS.WRITE_POOL_TIMEOUT
      : DATABASE_CONSTANTS.READ_MAX_CONNECTIONS,
    connect_timeout: DATABASE_CONSTANTS.CONNECT_TIMEOUT,
    socket_timeout: DATABASE_CONSTANTS.SOCKET_TIMEOUT,
    application_name: `${tenantName || TENANT_CONSTANTS.MASTER}_${isWrite ? DatabaseMode.WRITE : DatabaseMode.READ}_${Date.now()}`,
  };

  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v)),
  );
  return url.toString();
};
