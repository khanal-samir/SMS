import { z } from 'zod'
import { RoleEnum } from './enums'

const ChatMessageSenderSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
  image: z.url().optional().nullable(),
  role: RoleEnum,
})

export const ChatMessageSchema = z.object({
  id: z.cuid(),
  content: z.string(),
  chatGroupId: z.cuid(),
  createdAt: z.string(),
  sender: ChatMessageSenderSchema,
})
export type ChatMessage = z.infer<typeof ChatMessageSchema>

export const ChatGroupSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  batch: z.object({
    id: z.cuid(),
    batchYear: z.number().int(),
  }),
})
export type ChatGroup = z.infer<typeof ChatGroupSchema>

export const SendChatMessageSchema = z.object({
  chatGroupId: z.cuid('Chat group id must be a valid CUID'),
  content: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be 2000 characters or less'),
})
export type SendChatMessageDto = z.infer<typeof SendChatMessageSchema>

export const GetChatMessagesQuerySchema = z.object({
  cursor: z.cuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})
export type GetChatMessagesQueryDto = z.infer<typeof GetChatMessagesQuerySchema>

export const ChatMessagePageSchema = z.object({
  messages: z.array(ChatMessageSchema),
  nextCursor: z.string().nullable().optional(),
})
export type ChatMessagePage = z.infer<typeof ChatMessagePageSchema>
