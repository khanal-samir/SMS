import { AssignTeacherSubjectSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class AssignTeacherSubjectDto extends createZodDto(AssignTeacherSubjectSchema) {}
