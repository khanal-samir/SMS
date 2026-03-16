import { UpdateResourceSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class UpdateResourceDto extends createZodDto(UpdateResourceSchema) {}
