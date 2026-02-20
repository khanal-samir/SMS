import { CreateAnnouncementSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class CreateAnnouncementDto extends createZodDto(CreateAnnouncementSchema) {}
