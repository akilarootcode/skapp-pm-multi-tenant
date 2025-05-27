import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TenantModule } from '@/modules/tenant/tenant.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RequestWithTenant } from '@/types/request.types';
import { HealthModule } from '@/modules/health/health.module';
import { UserModule } from '@/modules/user/user.module';
import { TenantMiddleware } from '@/common/middleware/tenant.middleware';

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
        tenant: req.tenant,
      }),
    }),
    HealthModule,
    DatabaseModule,
    TenantModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
