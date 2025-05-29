import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantRequiredGuard } from '@/common/guards/tenant-required.guard';
import { User } from '@/common/modules/user/user.entity';
import { UserService } from '@/common/modules/user/user.service';
import { CreateUserInput } from '@/common/modules/user/dto/create-user.dto';

@Resolver(() => User)
@UseGuards(TenantRequiredGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
