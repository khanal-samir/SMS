import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import cookieParser from 'cookie-parser'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
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

  //Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SMS API Documentation')
    .setDescription('Backend API documentation')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  const port = configService.get<number>('BE_PORT') ?? 7000
  await app.listen(port)

  Logger.log(`Server is running on port ${port}`)
  Logger.log(`Swagger docs available at http://localhost:${port}/docs`)
}

bootstrap().catch((error) => {
  Logger.error(error)
  process.exit(1)
})
