import { DatabaseMode } from '@/enums/database-mode.enum';

export function buildTenantDatabaseUrl(
  tenantName: string,
  mode: DatabaseMode,
): string {
  if (!tenantName) {
    throw new Error('Tenant name is required to build the database URL');
  }

  const writeUrl = process.env.DATABASE_WRITE_URL;
  const readUrl = process.env.DATABASE_READ_URL;

  if (!writeUrl || !readUrl) {
    throw new Error(
      'Database URLs are not configured in the environment variables',
    );
  }

  const replaceTenant = (url: string) => url.replace('{tenant}', tenantName);

  switch (mode) {
    case DatabaseMode.WRITE:
      return replaceTenant(writeUrl);
    case DatabaseMode.READ:
      return replaceTenant(readUrl);
    default:
      throw new Error('Invalid database mode');
  }
}
