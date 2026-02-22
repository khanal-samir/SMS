import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { EMAIL_QUEUE, EmailJobName } from './mail.types'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)

  constructor(
    @InjectQueue(EMAIL_QUEUE)
    private readonly emailQueue: Queue,
  ) {}

  async sendVerificationEmail(email: string, name: string, otpCode: string) {
    await this.emailQueue.add(EmailJobName.VERIFICATION, { email, name, otpCode })
    this.logger.log(`Verification email job queued for ${email}`)
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    await this.emailQueue.add(EmailJobName.PASSWORD_RESET, { email, name, token })
    this.logger.log(`Password reset email job queued for ${email}`)
  }

  async sendTeacherApprovedEmail(email: string, name: string) {
    await this.emailQueue.add(EmailJobName.TEACHER_APPROVED, { email, name })
    this.logger.log(`Teacher approved email job queued for ${email}`)
  }
}
