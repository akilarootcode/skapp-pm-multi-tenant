import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '@/common/types/request.types';
import { ERROR_MESSAGES } from '@/common/enums/errors.enum';

@Injectable()
export class TenantRequiredGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    const request = gqlContext.req;

    if (!request.tenantName) {
      throw new UnauthorizedException(ERROR_MESSAGES.TENANT_HEADER_REQUIRED);
    }

    return true;
  }
}
