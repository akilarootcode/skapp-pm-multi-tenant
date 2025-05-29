import { Args, Query, Resolver } from '@nestjs/graphql';
import { Tenant } from '@/common/modules/tenant/tenant.entity';
import { TenantService } from '@/common/modules/tenant/tenant.service';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant])
  async tenants(): Promise<Tenant[]> {
    return this.tenantService.getAllTenants();
  }

  @Query(() => Tenant, { nullable: true })
  async tenant(@Args('id') id: string): Promise<Tenant> {
    return this.tenantService.getTenantByName(id);
  }
}
