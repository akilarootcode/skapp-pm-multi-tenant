import { Module } from '@nestjs/common';
import { HealthResolver } from '@/common/modules/health/health.resolver';

@Module({
  providers: [HealthResolver],
})
export class HealthModule {}
