import { CreateUserSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
