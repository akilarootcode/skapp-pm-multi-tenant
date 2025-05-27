import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '@/database/tenant-prisma.service';
import { User } from '@/modules/user/user.entity';
import { DatabaseMode } from '@/enums/database-mode.enum';
import { CreateUserInput } from '@/modules/user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly tenantPrismaService: TenantPrismaService) {}

  async findAll(): Promise<User[]> {
    const client = this.tenantPrismaService.getCurrentClient(DatabaseMode.READ);

    return client.user.findMany() as Promise<User[]>;
  }

  async create(data: CreateUserInput): Promise<User> {
    const client = this.tenantPrismaService.getCurrentClient(
      DatabaseMode.WRITE,
    );

    return client.user.create({
      data,
    }) as Promise<User>;
  }
}
