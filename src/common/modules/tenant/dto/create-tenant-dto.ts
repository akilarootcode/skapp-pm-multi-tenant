import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTenantInput {
  @Field(() => String, { description: 'Tenant name' })
  name!: string;
}
