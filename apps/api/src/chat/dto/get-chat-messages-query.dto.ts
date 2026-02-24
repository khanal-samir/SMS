import { GetChatMessagesQuerySchema } from '@repo/schemas'
import { createZodDto } from 'nestjs-zod'

export class GetChatMessagesQueryDto extends createZodDto(GetChatMessagesQuerySchema) {}
