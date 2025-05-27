import { Module } from '@nestjs/common';
import { TenantService } from '@/modules/tenant/tenant.service';
import { TenantResolver } from '@/modules/tenant/tenant.resolver';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TenantService, TenantResolver],
  exports: [TenantService],
})
export class TenantModule {}
