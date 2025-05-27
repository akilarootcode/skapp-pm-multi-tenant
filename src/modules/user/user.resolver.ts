import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantRequiredGuard } from '@/common/guards/tenant-required.guard';
import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { CreateUserInput } from '@/modules/user/dto/create-user.dto';

@Resolver(() => User)
@UseGuards(TenantRequiredGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }
}
