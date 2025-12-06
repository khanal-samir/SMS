import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponse } from '@repo/schemas'

type HandlerPayload<T> = T & { message?: string; data?: T | null }

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp()
    const response = httpContext.getResponse()

    return next.handle().pipe(
      map((payload: HandlerPayload<T>) => {
        const statusCode = response.statusCode ?? 200
        const message = typeof payload?.message === 'string' ? payload.message : 'Success'
        const data =
          payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload

        return {
          statusCode,
          message,
          data: (data as T | null) ?? null,
        }
      }),
    )
  }
}
