import { CreateAssignmentSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class CreateAssignmentDto extends createZodDto(CreateAssignmentSchema) {}
