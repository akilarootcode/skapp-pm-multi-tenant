import { Module } from '@nestjs/common';
import { MasterPrismaService } from './master-prisma.service';
import { TenantPrismaService } from './tenant-prisma.service';

@Module({
  providers: [MasterPrismaService, TenantPrismaService],
  exports: [MasterPrismaService, TenantPrismaService],
})
export class DatabaseModule {}
