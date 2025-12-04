import { Module } from '@nestjs/common'
import { AppController } from './app.controller'

import { ConfigModule } from '@nestjs/config'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
