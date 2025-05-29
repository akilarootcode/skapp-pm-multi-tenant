import { Injectable } from '@nestjs/common';
import { MasterPrismaService } from '@/common/modules/database/master-prisma.service';
import { TenantNotFoundException } from '@/common/exceptions/module.exception';
import { Tenant } from '@/common/modules/tenant/tenant.entity';

@Injectable()
export class TenantService {
  constructor(private readonly masterPrismaService: MasterPrismaService) {}

  async getTenantByName(name: string): Promise<Tenant> {
    if (!name?.trim()) {
      throw new TenantNotFoundException();
    }

    const normalizedName = name.toLowerCase().trim();
    const masterClient = await this.masterPrismaService.readMasterClient();

    const tenant = await masterClient.tenant.findUnique({
      where: { name: normalizedName },
    });

    if (!tenant) {
      throw new TenantNotFoundException({ tenantName: normalizedName });
    }

    return tenant;
  }

  async getAllTenants(): Promise<Tenant[]> {
    const masterClient = await this.masterPrismaService.readMasterClient();
    return (await masterClient.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    })) as Tenant[];
  }
}
