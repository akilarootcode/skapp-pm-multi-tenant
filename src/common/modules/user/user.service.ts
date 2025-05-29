import { Injectable } from '@nestjs/common';
import { TenantAwarePrismaService } from '@/common/modules/database/tenant-aware-prisma.service';
import { User } from '@/common/modules/user/user.entity';
import { CreateUserInput } from '@/common/modules/user/dto/create-user.dto';
import { ValidationUtils } from '@/common/utils/validation.utils';

@Injectable()
export class UserService {
  constructor(
    private readonly tenantAwarePrismaService: TenantAwarePrismaService,
  ) {}

  async findAll(): Promise<User[]> {
    const client = await this.tenantAwarePrismaService.getReadClient();
    return (await client.user.findMany({
      orderBy: { createdAt: 'desc' },
    })) as User[];
  }

  async create(data: CreateUserInput): Promise<User> {
    ValidationUtils.validateUserInput(data);
    const client = await this.tenantAwarePrismaService.getWriteClient();
    return (await client.user.create({ data })) as User;
  }

  async findById(id: string): Promise<User | null> {
    ValidationUtils.validateUserId(id);
    const client = await this.tenantAwarePrismaService.getReadClient();
    return (await client.user.findUnique({ where: { id } })) as User | null;
  }

  async delete(id: string): Promise<User> {
    ValidationUtils.validateUserId(id);
    const client = await this.tenantAwarePrismaService.getWriteClient();
    return (await client.user.delete({ where: { id } })) as User;
  }
}
