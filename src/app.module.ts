import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TenantMiddleware } from '@/common/middleware/tenant.middleware';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { RequestWithTenant } from '@/common/types/request.types';
import { DatabaseModule } from '@/common/modules/database/database.module';
import { TenantModule } from '@/common/modules/tenant/tenant.module';
import { UserModule } from '@/common/modules/user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      introspection: true,
      playground: true,
      context: ({ req }: { req: RequestWithTenant }) => ({
        req,
        tenantName: req.tenantName,
      }),
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code,
        timestamp: new Date().toISOString(),
        path: error.path,
      }),
    }),
    DatabaseModule,
    TenantModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: 'graphql', method: RequestMethod.ALL });
  }
}
