import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;
}
