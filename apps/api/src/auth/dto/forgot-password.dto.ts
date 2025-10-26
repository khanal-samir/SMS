import { ForgotPasswordSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
