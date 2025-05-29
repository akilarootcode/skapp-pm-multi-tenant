import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserData } from '@/common/types/user.types';

@ObjectType({ description: 'User information' })
export class User implements UserData {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  id!: string;

  @Field(() => String, { description: 'Email address of the user' })
  email!: string;

  @Field(() => String, { description: 'Full name of the user' })
  name!: string;

  @Field(() => Date, { description: 'When the user was created' })
  createdAt!: Date;

  @Field(() => Date, { description: 'When the user was last updated' })
  updatedAt!: Date;
}
