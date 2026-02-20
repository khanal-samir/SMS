import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const GetChatMessagesQuerySchema = z.object({
  cursor: z.string().cuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

export class GetChatMessagesQueryDto extends createZodDto(GetChatMessagesQuerySchema) {}
