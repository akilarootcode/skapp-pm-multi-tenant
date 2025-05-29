import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantRequiredGuard } from '@/common/guards/tenant-required.guard';
import { User } from '@/common/modules/user/user.entity';
import { UserService } from '@/common/modules/user/user.service';
import { GqlContext } from '@/common/types/request.types';
import { CreateUserInput } from '@/common/modules/user/dto/create-user.dto';

@Resolver(() => User)
@UseGuards(TenantRequiredGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(@Context() context: GqlContext): Promise<User[]> {
    return this.userService.findAll(context.req.tenantName!);
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('id') id: string,
    @Context() context: GqlContext,
  ): Promise<User | null> {
    return this.userService.findById(context.req.tenantName!, id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('input') input: CreateUserInput,
    @Context() context: GqlContext,
  ): Promise<User> {
    return this.userService.create(context.req.tenantName!, input);
  }

  @Mutation(() => User)
  async deleteUser(
    @Args('id') id: string,
    @Context() context: GqlContext,
  ): Promise<User> {
    return this.userService.delete(context.req.tenantName!, id);
  }
}
