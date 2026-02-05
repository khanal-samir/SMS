import { CreateBatchSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class CreateBatchDto extends createZodDto(CreateBatchSchema) {}
