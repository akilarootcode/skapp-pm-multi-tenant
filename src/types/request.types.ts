import type { Request } from 'express';
import { TenantData } from '@/types/tenant.types';

export interface RequestWithTenant extends Request {
  tenant?: TenantData;
}

export interface GqlContext {
  req: RequestWithTenant;
}
