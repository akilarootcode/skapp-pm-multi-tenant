import { Injectable, Logger } from '@nestjs/common';
import { DatabaseMode } from '@/common/enums/database-mode.enum';
import { ModuleException } from '@/common/exceptions/module.exception';
import { ErrorCode } from '@/common/enums/errors.enum';
import { buildTenantDatabaseUrl } from '@/common/utils/database.utils';
import {
  PrismaClient,
  PrismaClient as TenantPrismaClient,
} from 'prisma/tenant/client';

@Injectable()
export class TenantPrismaService {
  private readonly logger = new Logger(TenantPrismaService.name);
  private readonly tenantWriteClients = new Map<string, TenantPrismaClient>();
  private readonly tenantReadClients = new Map<string, TenantPrismaClient>();

  async readTenantClient(tenantName: string): Promise<TenantPrismaClient> {
    if (!tenantName?.trim()) {
      throw new ModuleException(ErrorCode.TENANT_NAME_REQUIRED);
    }

    const normalizedTenant = tenantName.toLowerCase().trim();

    if (!this.tenantReadClients.has(normalizedTenant)) {
      await this.createTenantReadConnection(normalizedTenant);
    }

    const readClient = this.tenantReadClients.get(
      normalizedTenant,
    ) as TenantPrismaClient;
    if (!readClient) {
      throw new ModuleException(ErrorCode.TENANT_CLIENT_FAILED, {
        tenantName: normalizedTenant,
      });
    }
    return readClient;
  }

  async writeTenantClient(tenantName: string): Promise<TenantPrismaClient> {
    if (!tenantName?.trim()) {
      throw new ModuleException(ErrorCode.TENANT_NAME_REQUIRED);
    }

    const normalizedTenant = tenantName.toLowerCase().trim();

    if (!this.tenantWriteClients.has(normalizedTenant)) {
      await this.createTenantWriteConnection(normalizedTenant);
    }

    const writeClient = this.tenantWriteClients.get(
      normalizedTenant,
    ) as TenantPrismaClient;
    if (!writeClient) {
      throw new ModuleException(ErrorCode.TENANT_CLIENT_FAILED, {
        tenantName: normalizedTenant,
      });
    }
    return writeClient;
  }

  private async createTenantWriteConnection(
    tenantName: string,
  ): Promise<TenantPrismaClient> {
    const writeUrl = buildTenantDatabaseUrl(tenantName, DatabaseMode.WRITE);
    const writeClient = new PrismaClient({
      datasources: {
        db: {
          url: writeUrl,
        },
      },
    });

    await writeClient.$connect();
    this.tenantWriteClients.set(tenantName, writeClient);
    this.logger.log(`Connected to tenant write database: ${tenantName}`);
    return writeClient;
  }

  private async createTenantReadConnection(
    tenantName: string,
  ): Promise<TenantPrismaClient> {
    const readUrl = buildTenantDatabaseUrl(tenantName, DatabaseMode.READ);
    const readClient = new PrismaClient({
      datasources: {
        db: {
          url: readUrl,
        },
      },
    });

    await readClient.$connect();
    this.tenantReadClients.set(tenantName, readClient);
    this.logger.log(`Connected to tenant read database: ${tenantName}`);
    return readClient;
  }
}
