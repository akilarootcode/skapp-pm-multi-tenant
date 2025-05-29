import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@/common/modules/database/tenant-prisma.service';
import { User } from '@/common/modules/user/user.entity';
import { CreateUserInput } from '@/common/modules/user/dto/create-user.dto';
import { ValidationUtils } from '@/common/utils/validation.utils';

@Injectable()
export class UserService {
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  async findAll(tenantName: string): Promise<User[]> {
    const client = await this.tenantPrismaService.readTenantClient(tenantName);
    return (await client.user.findMany({
      orderBy: { createdAt: 'desc' },
    })) as User[];
  }

  async create(tenantName: string, data: CreateUserInput): Promise<User> {
    ValidationUtils.validateUserInput(data);
    const client = await this.tenantPrismaService.writeTenantClient(tenantName);
    return (await client.user.create({ data })) as User;
  }

  async findById(tenantName: string, id: string): Promise<User | null> {
    ValidationUtils.validateUserId(id);
    const client = await this.tenantPrismaService.readTenantClient(tenantName);
    return (await client.user.findUnique({ where: { id } })) as User | null;
  }

  async delete(tenantName: string, id: string): Promise<User> {
    ValidationUtils.validateUserId(id);
    const client = await this.tenantPrismaService.writeTenantClient(tenantName);
    return (await client.user.delete({ where: { id } })) as User;
  }
}
