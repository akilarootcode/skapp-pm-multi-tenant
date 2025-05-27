import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient as MasterPrismaClient } from '../../prisma/schemas/master/generated/master-client';
import { DatabaseMode } from '@/enums/database-mode.enum';

@Injectable()
export class MasterPrismaService implements OnModuleInit {
  private readonly logger = new Logger(MasterPrismaService.name);
  private writeClient: MasterPrismaClient;
  private readClient: MasterPrismaClient;

  async onModuleInit() {
    this.writeClient = new MasterPrismaClient({
      datasources: {
        db: {
          url: process.env.MASTER_DATABASE_WRITE_URL,
        },
      },
    });

    this.readClient = new MasterPrismaClient({
      datasources: {
        db: {
          url: process.env.MASTER_DATABASE_READ_URL,
        },
      },
    });

    await this.writeClient.$connect();
    await this.readClient.$connect();

    this.logger.log('Master database write and read replicas connected');
  }

  async onModuleDestroy() {
    await this.writeClient.$disconnect();
    await this.readClient.$disconnect();
  }

  getClient(mode: DatabaseMode = DatabaseMode.READ): MasterPrismaClient {
    return mode === DatabaseMode.WRITE ? this.writeClient : this.readClient;
  }

  get write(): MasterPrismaClient {
    return this.writeClient;
  }

  get read(): MasterPrismaClient {
    return this.readClient;
  }
}
