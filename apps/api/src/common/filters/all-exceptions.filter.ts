import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { ZodError } from 'zod'
import { ApiError, ApiResponse } from '@repo/schemas'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const { statusCode, message, errors } = this.formatException(exception)

    const body: ApiResponse<null> = {
      statusCode,
      message,
      data: null,
      errors: errors ?? null,
    }

    response.status(statusCode).json(body)
  }

  private formatException(exception: unknown): {
    statusCode: number
    message: string
    errors?: ApiError[] | null
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus()
      const response = exception.getResponse() as Record<string, unknown>

      if (exception.cause instanceof ZodError) {
        const zodError = exception.cause
        return {
          statusCode,
          message: 'Validation failed',
          errors: zodError.issues.map((issue) => ({
            field: issue.path.join('.') || undefined,
            message: issue.message,
          })),
        }
      }

      if (typeof response === 'string') {
        return { statusCode, message: response }
      }

      if (typeof response === 'object' && response !== null) {
        const message =
          typeof response.message === 'string'
            ? response.message
            : exception.message || 'An unexpected error occurred'

        // Many validation pipes (including nestjs-zod) put details under `errors` or `issues`
        const rawIssues: unknown[] =
          Array.isArray(response.errors) && response.errors.length > 0
            ? response.errors
            : Array.isArray(response.issues) && response.issues.length > 0
              ? response.issues
              : []

        const errors =
          rawIssues.length > 0
            ? rawIssues.map((issue: any) => ({
                field: Array.isArray(issue.path) ? issue.path.join('.') || undefined : issue.path,
                message: typeof issue.message === 'string' ? issue.message : String(issue.message),
              }))
            : undefined

        return {
          statusCode,
          message,
          errors: errors ?? undefined,
        }
      }

      return {
        statusCode,
        message: exception.message || 'An unexpected error occurred',
      }
    }

    if (exception instanceof Error) {
      this.logger.error(exception.stack || exception.message)
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }
    }

    this.logger.error(`Unknown exception: ${JSON.stringify(exception)}`)
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    }
  }
}
