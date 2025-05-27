import { Field, ObjectType } from '@nestjs/graphql';
import { TenantData } from '@/types/tenant.types';

@ObjectType({ description: 'Tenant information' })
export class Tenant implements TenantData {
  @Field(() => String, {
    description: 'Internal name used for tenant identification',
  })
  name!: string;

  @Field(() => Date, { description: 'When the tenant was created' })
  createdAt!: Date;

  @Field(() => Date, { description: 'When the tenant was last updated' })
  updatedAt!: Date;
}
