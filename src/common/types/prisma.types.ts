import { PrismaClient as TenantPrismaClient } from 'prisma/tenant/client';

export interface TenantClients {
  write: TenantPrismaClient;
  read: TenantPrismaClient;
}
