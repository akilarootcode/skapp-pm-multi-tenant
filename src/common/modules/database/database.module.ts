import { Module } from '@nestjs/common';
import { MasterPrismaService } from './master-prisma.service';
import { TenantPrismaService } from './tenant-prisma.service';
import { TenantAwarePrismaService } from '@/common/modules/database/tenant-aware-prisma.service';

@Module({
  providers: [
    MasterPrismaService,
    TenantPrismaService,
    TenantAwarePrismaService,
  ],
  exports: [MasterPrismaService, TenantPrismaService, TenantAwarePrismaService],
})
export class DatabaseModule {}
