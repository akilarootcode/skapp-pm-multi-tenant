import { Injectable, Logger } from '@nestjs/common';
import { ENV_KEYS } from '@/common/constants/environment.constants';
import { ModuleException } from '@/common/exceptions/module.exception';
import { ErrorCode } from '@/common/enums/errors.enum';
import { PrismaClient as MasterPrismaClient } from 'prisma/master/client';

@Injectable()
export class MasterPrismaService {
  private readonly logger = new Logger(MasterPrismaService.name);
  private masterWriteClient: MasterPrismaClient;
  private masterReadClient: MasterPrismaClient;

  private async createMasterReadConnection() {
    if (!this.masterReadClient) {
      this.masterReadClient = new MasterPrismaClient({
        datasources: {
          db: {
            url: process.env[ENV_KEYS.MASTER_DATABASE_READ_URL],
          },
        },
      });
      await this.masterReadClient.$connect();
      this.logger.log('Master database read replica connected');
    }
  }

  private async createMasterWriteConnection() {
    if (!this.masterWriteClient) {
      this.masterWriteClient = new MasterPrismaClient({
        datasources: {
          db: {
            url: process.env[ENV_KEYS.MASTER_DATABASE_WRITE_URL],
          },
        },
      });
      await this.masterWriteClient.$connect();
      this.logger.log('Master database write replica connected');
    }
  }

  readMasterClient(): MasterPrismaClient {
    if (!this.masterReadClient) {
      this.createMasterReadConnection().catch((error) => {
        this.logger.error('Failed to connect to master read client', error);
        throw new ModuleException(ErrorCode.MASTER_CLIENT_NOT_INITIALIZED);
      });
    }
    return this.masterReadClient;
  }

  writeMasterClient(): MasterPrismaClient {
    if (!this.masterWriteClient) {
      this.createMasterWriteConnection().catch((error) => {
        this.logger.error('Failed to connect to master write client', error);
        throw new ModuleException(ErrorCode.MASTER_CLIENT_NOT_INITIALIZED);
      });
    }

    return this.masterWriteClient;
  }
}
