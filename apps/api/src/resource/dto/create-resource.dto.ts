import { CreateResourceSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class CreateResourceDto extends createZodDto(CreateResourceSchema) {}
