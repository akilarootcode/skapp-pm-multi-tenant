import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

export interface SuccessResponse<T> {
  data: T;
  success: true;
  timestamp: Date;
  operation?: string;
}

@Injectable()
export class SafeResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    let operationName: string | undefined;

    try {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo<GraphQLResolveInfo>();
      operationName = this.extractFieldName(info);
    } catch {
      operationName = undefined;
    }

    return next.handle().pipe(
      map((data: T) => ({
        data,
        success: true as const,
        timestamp: new Date(),
        operation: operationName,
      })),
    );
  }

  private extractFieldName(info: unknown): string | undefined {
    if (this.isGraphQLResolveInfo(info)) {
      return info.fieldName;
    }
    return undefined;
  }

  private isGraphQLResolveInfo(obj: unknown): obj is GraphQLResolveInfo {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'fieldName' in obj &&
      typeof (obj as { fieldName: unknown }).fieldName === 'string'
    );
  }
}

@Injectable()
export class SimpleResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const operationName = this.getOperationName(context);

    return next.handle().pipe(
      map((data: T) => ({
        data,
        success: true as const,
        timestamp: new Date(),
        operation: operationName,
      })),
    );
  }

  private getOperationName(context: ExecutionContext): string | undefined {
    try {
      const handler = context.getHandler();
      const handlerName = handler?.name;

      if (handlerName && handlerName !== 'anonymous') {
        return handlerName;
      }

      const className = context.getClass()?.name;
      const methodName = context.getHandler()?.name;

      if (className && methodName) {
        return `${className}.${methodName}`;
      }

      return undefined;
    } catch {
      return undefined;
    }
  }
}
