import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { CONSTANTS } from '@/constants';
import { RequestWithTenant } from '@/types/request.types';
import { TenantService } from '@/modules/tenant/tenant.service';
import { TenantPrismaService } from '@/database/tenant-prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantPrismaService: TenantPrismaService,
  ) {}

  async use(req: RequestWithTenant, _res: Response, next: NextFunction) {
    const tenantHeader = req.headers[CONSTANTS.TENANT.HEADER_NAME];
    const tenantId = Array.isArray(tenantHeader)
      ? tenantHeader[0]
      : tenantHeader;

    if (!tenantId) {
      return next();
    }

    await this.tenantPrismaService.connectTenant(tenantId);
    req.tenant = await this.tenantService.getTenantByName(tenantId);

    next();
  }
}
