import { UpdateAssignmentSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class UpdateAssignmentDto extends createZodDto(UpdateAssignmentSchema) {}
