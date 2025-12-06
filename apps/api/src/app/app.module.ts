import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { envSchema } from 'src/config/env.config'

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = envSchema.safeParse(config)
        if (!parsed.success) {
          throw new Error('Invalid environment variables')
        }
        return parsed.data
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
