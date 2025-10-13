import { UpdateUserSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
