import { ResetPasswordSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
