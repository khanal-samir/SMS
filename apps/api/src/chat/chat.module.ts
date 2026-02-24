import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import jwtConfig from '@src/auth/config/jwt.config'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { ChatGateway } from './chat.gateway'

@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider()), ConfigModule.forFeature(jwtConfig)],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
