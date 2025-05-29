import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from './tenant-prisma.service';
import { PrismaClient as TenantPrismaClient } from 'prisma/tenant/client';
import { TenantContext } from '@/common/context/tenant.context';

@Injectable()
export class TenantAwarePrismaService {
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  async getReadClient(): Promise<TenantPrismaClient> {
    const tenantName = TenantContext.getTenantName();
    return this.tenantPrismaService.readTenantClient(tenantName);
  }

  async getWriteClient(): Promise<TenantPrismaClient> {
    const tenantName = TenantContext.getTenantName();
    return this.tenantPrismaService.writeTenantClient(tenantName);
  }
}
