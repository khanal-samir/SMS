import { UpdateAnnouncementSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class UpdateAnnouncementDto extends createZodDto(UpdateAnnouncementSchema) {}
