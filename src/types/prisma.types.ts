import { PrismaClient as TenantPrismaClient } from '../../prisma/schemas/tenant/generated/tenant-client';

export interface TenantClients {
  write: TenantPrismaClient;
  read: TenantPrismaClient;
}
