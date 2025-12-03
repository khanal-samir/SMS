import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { ZodError } from 'zod'
import { ApiError, ApiResponse } from '@repo/schemas'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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
    if (exception instanceof ZodError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: exception.issues.map((issue) => ({
          field: issue.path.join('.') || undefined,
          message: issue.message,
        })),
      }
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus()
      const response = exception.getResponse()

      if (typeof response === 'string') {
        return { statusCode, message: response }
      }

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response &&
        typeof response.message === 'string'
      ) {
        return {
          statusCode,
          message: response.message,
        }
      }

      return {
        statusCode,
        message: exception.message || 'An unexpected error occurred',
      }
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message || 'An unexpected error occurred',
      }
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
    }
  }
}

