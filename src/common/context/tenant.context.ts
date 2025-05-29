import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ModuleException } from '@/common/exceptions/module.exception';
import { ErrorCode } from '@/common/enums/errors.enum';
import { TenantContextData } from '@/common/types/tenant.types';

@Injectable()
export class TenantContext {
  private static asyncLocalStorage = new AsyncLocalStorage<TenantContextData>();

  static run<T>(context: TenantContextData, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  static getTenantName(): string {
    const context = this.asyncLocalStorage.getStore();
    if (!context?.tenantName) {
      throw new ModuleException(ErrorCode.TENANT_CONTEXT_NOT_FOUND);
    }
    return context.tenantName;
  }

  static getCurrentTenant(): TenantContextData {
    const context = this.asyncLocalStorage.getStore();
    if (!context) {
      throw new ModuleException(ErrorCode.TENANT_CONTEXT_NOT_FOUND);
    }
    return context;
  }
}
