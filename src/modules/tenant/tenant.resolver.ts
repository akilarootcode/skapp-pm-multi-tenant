import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Tenant } from '@/modules/tenant/tenant.entity';
import { TenantService } from '@/modules/tenant/tenant.service';
import { CreateTenantInput } from '@/modules/tenant/dto/create-tenant-dto';

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

  @Mutation(() => Tenant)
  async createTenant(@Args('input') input: CreateTenantInput): Promise<Tenant> {
    return this.tenantService.createTenant(input);
  }
}
