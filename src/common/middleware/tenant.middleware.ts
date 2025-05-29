import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RequestWithTenant } from '@/common/types/request.types';
import { TENANT_CONSTANTS } from '@/common/constants/tenant.constants';
import { ValidationUtils } from '@/common/utils/validation.utils';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: RequestWithTenant, _res: Response, next: NextFunction) {
    const tenantId = req.headers[TENANT_CONSTANTS.HEADER_NAME] as string;

    if (!tenantId?.trim()) {
      return next();
    }

    req.tenantName = ValidationUtils.validateAndNormalizeTenantName(tenantId);
    next();
  }
}
