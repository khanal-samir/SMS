import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MailService } from './mail.service'
import mailConfig from './mail.config'

@Module({
  // dont make env global and do DI also env is availble only when this module is imported
  imports: [ConfigModule.forFeature(mailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
