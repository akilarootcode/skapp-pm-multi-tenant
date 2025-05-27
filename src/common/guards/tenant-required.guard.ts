import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@/types/request.types';

@Injectable()
export class TenantRequiredGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    const request = gqlContext.req;

    if (!request.tenant) {
      throw new Error(
        'Tenant not found. The x-tenant-id header is required for this operation.',
      );
    }

    return true;
  }
}
