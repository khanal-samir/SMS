import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const SendMessageSchema = z.object({
  chatGroupId: z.cuid('Chat group id must be a valid CUID'),
  content: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be 2000 characters or less'),
})

export class SendMessageDto extends createZodDto(SendMessageSchema) {}
