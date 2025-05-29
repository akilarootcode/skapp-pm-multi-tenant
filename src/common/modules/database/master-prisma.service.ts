import { Injectable, Logger } from '@nestjs/common';
import { ModuleException } from '@/common/exceptions/module.exception';
import { ErrorCode } from '@/common/enums/errors.enum';
import { PrismaClient as MasterPrismaClient } from 'prisma/master/client';
import { buildMasterDatabaseUrl } from '@/common/utils/database.utils';
import { DatabaseMode } from '@/common/enums/database-mode.enum';

@Injectable()
export class MasterPrismaService {
  private readonly logger = new Logger(MasterPrismaService.name);
  private masterWriteClient: MasterPrismaClient;
  private masterReadClient: MasterPrismaClient;

  async readMasterClient(): Promise<MasterPrismaClient> {
    if (!this.masterReadClient) {
      await this.createMasterReadConnection().catch((error) => {
        this.logger.error('Failed to connect to master read client', error);
        throw new ModuleException(ErrorCode.MASTER_CLIENT_NOT_INITIALIZED);
      });
    }
    return this.masterReadClient;
  }

  async writeMasterClient(): Promise<MasterPrismaClient> {
    if (!this.masterWriteClient) {
      await this.createMasterWriteConnection().catch((error) => {
        this.logger.error('Failed to connect to master write client', error);
        throw new ModuleException(ErrorCode.MASTER_CLIENT_NOT_INITIALIZED);
      });
    }

    return this.masterWriteClient;
  }

  private async createMasterReadConnection() {
    if (!this.masterReadClient) {
      this.masterReadClient = new MasterPrismaClient({
        datasources: {
          db: {
            url: buildMasterDatabaseUrl(DatabaseMode.READ),
          },
        },
      });
      await this.masterReadClient.$connect();
      this.logger.log('Connected to master read database: master');
    }
  }

  private async createMasterWriteConnection() {
    if (!this.masterWriteClient) {
      this.masterWriteClient = new MasterPrismaClient({
        datasources: {
          db: {
            url: buildMasterDatabaseUrl(DatabaseMode.WRITE),
          },
        },
      });
      await this.masterWriteClient.$connect();
      this.logger.log('Connected to master write database: master');
    }
  }
}
