import { EnrollStudentSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class EnrollStudentDto extends createZodDto(EnrollStudentSchema) {}
