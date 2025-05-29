import { Module } from '@nestjs/common';
import { TenantService } from '@/common/modules/tenant/tenant.service';
import { TenantResolver } from '@/common/modules/tenant/tenant.resolver';
import { DatabaseModule } from '@/common/modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TenantService, TenantResolver],
  exports: [TenantService],
})
export class TenantModule {}
