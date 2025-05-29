import { DatabaseMode } from '@/common/enums/database-mode.enum';
import { ModuleException } from '@/common/exceptions/module.exception';
import { ErrorCode } from '@/common/enums/errors.enum';
import { ENV_KEYS } from '@/common/constants/environment.constants';

export function buildTenantDatabaseUrl(
  tenantName: string,
  mode: DatabaseMode,
): string {
  if (!tenantName?.trim()) {
    throw new ModuleException(ErrorCode.TENANT_NAME_REQUIRED);
  }

  const writeUrl = process.env[ENV_KEYS.DATABASE_WRITE_URL];
  const readUrl = process.env[ENV_KEYS.DATABASE_READ_URL];

  if (!writeUrl || !readUrl) {
    throw new ModuleException(ErrorCode.DATABASE_URL_NOT_CONFIGURED);
  }

  const normalizedTenant = tenantName.toLowerCase().trim();
  const replaceTenant = (url: string) =>
    url.replace('{tenant}', normalizedTenant);

  return mode === DatabaseMode.WRITE
    ? replaceTenant(writeUrl)
    : replaceTenant(readUrl);
}
