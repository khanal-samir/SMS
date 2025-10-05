import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService>(ConfigService)

  // Use Zod validation pipe globally for automatic validation
  app.useGlobalPipes(new ZodValidationPipe())

  app.setGlobalPrefix('v1')

  const port = configService.get<number>('BE_PORT') ?? 7000
  await app.listen(port)
  Logger.log(`Server is running on port ${port}`)
}

bootstrap().catch((error) => {
  Logger.error(error)
  process.exit(1)
})
