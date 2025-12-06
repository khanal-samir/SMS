import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import cookieParser from 'cookie-parser'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)

  app.use(cookieParser())

  app.enableCors({
    origin: configService.get('PUBLIC_WEB_URL'),
    credentials: true,
  })

  // puts errors inside cause of the exception
  app.useGlobalPipes(new ZodValidationPipe())

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.setGlobalPrefix('v1')

  const port = configService.get<number>('BE_PORT') ?? 7000
  await app.listen(port)
  Logger.log(`Server is running on port ${port}`)
}

bootstrap().catch((error) => {
  Logger.error(error)
  process.exit(1)
})
