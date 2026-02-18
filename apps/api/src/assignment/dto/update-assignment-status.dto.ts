import { UpdateAssignmentStatusSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class UpdateAssignmentStatusDto extends createZodDto(UpdateAssignmentStatusSchema) {}
