import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { MailModule } from '@src/common/mail/mail.module'
import { AdminService } from './admin.service'
import { UserService } from './user.service'

@Module({
  imports: [MailModule],
  controllers: [UserController],
  providers: [AdminService, UserService],
  exports: [AdminService, UserService],
})
export class UserModule {}
