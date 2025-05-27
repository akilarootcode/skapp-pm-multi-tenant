import { DatabaseMode } from '@/enums/database-mode.enum';
import { Tenant } from '@/modules/tenant/tenant.entity';
import { MasterPrismaService } from '@/database/master-prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantInput } from '@/modules/tenant/dto/create-tenant-dto';
import { buildTenantDatabaseUrl } from '@/database/database.utils';
import { Client } from 'pg';
import { execa } from 'execa';

@Injectable()
export class TenantService {
  constructor(private readonly masterPrismaService: MasterPrismaService) {}

  async getTenantByName(name: string): Promise<Tenant> {
    const masterClient = this.masterPrismaService.getClient(DatabaseMode.READ);
    const tenant = await masterClient.tenant.findUnique({
      where: { name },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${name} not found`);
    }

    return tenant as Tenant;
  }

  async findTenantByName(name: string): Promise<Tenant | null> {
    const masterClient = this.masterPrismaService.getClient(DatabaseMode.READ);
    const tenant = await masterClient.tenant.findUnique({
      where: { name },
    });
    return tenant as Tenant | null;
  }

  async getAllTenants(): Promise<Tenant[]> {
    const masterClient = this.masterPrismaService.getClient(DatabaseMode.READ);
    return masterClient.tenant.findMany();
  }

  async createTenant(tenantData: CreateTenantInput): Promise<Tenant> {
    if (!tenantData.name) {
      throw new Error('Tenant name is required');
    }

    const existingTenant = await this.findTenantByName(tenantData.name);
    if (existingTenant) {
      throw new Error(`Tenant with name ${tenantData.name} already exists`);
    }

    const tenant = await this.createTenantRecord(tenantData);
    await this.createDatabase(tenant.name);
    await this.runTenantMigrations(tenant.name);

    return tenant;
  }

  private async createTenantRecord(
    tenantData: CreateTenantInput,
  ): Promise<Tenant> {
    const masterClient = this.masterPrismaService.getClient(DatabaseMode.WRITE);

    return masterClient.tenant.create({
      data: {
        name: tenantData.name,
      },
    }) as Promise<Tenant>;
  }

  private async createDatabase(tenantName: string): Promise<void> {
    const host = process.env.DATABASE_WRITE_HOST;
    const port = parseInt(process.env.DATABASE_PORT || '5432');
    const username = process.env.DATABASE_USERNAME;
    const password = process.env.DATABASE_PASSWORD;

    if (!host || !username || !password) {
      throw new Error('Database configuration missing for replica');
    }

    const client = new Client({
      host,
      port,
      user: username,
      password,
      database: 'postgres',
    });

    try {
      await client.connect();
      await client.query(`CREATE DATABASE "${tenantName}"`);
    } finally {
      await client.end();
    }
  }

  private async runTenantMigrations(tenantName: string): Promise<void> {
    const tenantWriteUrl = buildTenantDatabaseUrl(
      tenantName,
      DatabaseMode.WRITE,
    );

    await execa(
      'npx',
      [
        'prisma',
        'migrate',
        'deploy',
        '--schema=./prisma/schemas/tenant/schema.prisma',
      ],
      {
        env: { ...process.env, DATABASE_WRITE_URL: tenantWriteUrl },
      },
    );
  }
}
