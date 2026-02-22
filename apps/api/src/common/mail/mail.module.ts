import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { ConfigModule } from '@nestjs/config'
import { MailService } from './mail.service'
import { EmailProcessor } from './mail.processor'
import mailConfig from './mail.config'
import { EMAIL_QUEUE } from './mail.types'

@Module({
  imports: [ConfigModule.forFeature(mailConfig), BullModule.registerQueue({ name: EMAIL_QUEUE })],
  providers: [MailService, EmailProcessor],
  exports: [MailService],
})
export class MailModule {}
