import type { Request } from 'express';

export interface RequestWithTenant extends Request {
  tenantName?: string;
}

export interface GqlContext {
  req: RequestWithTenant;
}
