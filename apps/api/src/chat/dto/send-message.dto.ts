import { SendChatMessageSchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class SendMessageDto extends createZodDto(SendChatMessageSchema) {}
