import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

//catch and show frontend error instead of backend json
@Catch(UnauthorizedException, ForbiddenException)
export class GoogleAuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const frontendUrl = this.configService.get<string>('PUBLIC_WEB_URL')

    const message = exception.message || 'Authentication failed'

    response.redirect(`${frontendUrl}/auth/google/callback?error=${encodeURIComponent(message)}`)
  }
}
