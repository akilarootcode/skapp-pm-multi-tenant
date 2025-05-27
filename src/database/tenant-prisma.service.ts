import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as TenantPrismaClient } from '../../prisma/schemas/tenant/generated/tenant-client';
import { DatabaseMode } from '@/enums/database-mode.enum';
import { TenantClients } from '@/types/prisma.types';
import { buildTenantDatabaseUrl } from './database.utils';

@Injectable()
export class TenantPrismaService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.disconnectAll();
  }

  private readonly logger = new Logger(TenantPrismaService.name);
  private clients = new Map<string, TenantClients>();
  private currentTenant: string | null = null;

  getCurrentClient(mode: DatabaseMode): TenantPrismaClient {
    if (!this.currentTenant) {
      throw new Error('Current tenant is not set');
    }

    const client = this.clients.get(this.currentTenant);
    if (!client) {
      throw new Error(`No client found for tenant: ${this.currentTenant}`);
    }

    return mode === DatabaseMode.WRITE ? client.write : client.read;
  }

  private createTenantClients(tenantName: string): void {
    const writeUrl = buildTenantDatabaseUrl(tenantName, DatabaseMode.WRITE);
    const readUrl = buildTenantDatabaseUrl(tenantName, DatabaseMode.READ);

    const writeClient = new TenantPrismaClient({
      datasources: {
        db: {
          url: writeUrl,
        },
      },
    });

    const readClient = new TenantPrismaClient({
      datasources: {
        db: {
          url: readUrl,
        },
      },
    });

    this.clients.set(tenantName, {
      write: writeClient,
      read: readClient,
    });

    this.currentTenant = tenantName;

    this.logger.log(`Created Prisma clients for tenant: ${tenantName}`);
  }

  async connectTenant(tenantName: string): Promise<void> {
    if (!this.clients.has(tenantName)) {
      this.createTenantClients(tenantName);
    }

    const clients = this.clients.get(tenantName) as TenantClients;
    await Promise.all([clients.write.$connect(), clients.read.$connect()]);

    this.logger.log(`Connected to tenant databases: ${tenantName}`);
  }

  async disconnectTenant(tenantName: string): Promise<void> {
    const clients = this.clients.get(tenantName);
    if (clients) {
      await Promise.all([
        clients.write.$disconnect(),
        clients.read.$disconnect(),
      ]);
      this.clients.delete(tenantName);
      this.logger.log(`Disconnected from tenant databases: ${tenantName}`);
    }
  }

  async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.clients.entries()).map(
      async ([tenantName, clients]) => {
        await Promise.all([
          clients.write.$disconnect(),
          clients.read.$disconnect(),
        ]);
        this.logger.log(`Disconnected from tenant: ${tenantName}`);
      },
    );

    await Promise.all(disconnectPromises);
    this.clients.clear();
  }
}
