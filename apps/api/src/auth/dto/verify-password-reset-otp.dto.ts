import { VerifyPasswordResetOtpSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class VerifyPasswordResetOtpDto extends createZodDto(VerifyPasswordResetOtpSchema) {}
