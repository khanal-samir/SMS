import { z } from 'zod'

const ScheduledAtSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid scheduled date') // convert to milliseconds and check if it's a valid date

const BatchIdSchema = z.string().cuid('Invalid batch ID')

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message must be 5000 characters or less'),
  scheduledAt: ScheduledAtSchema.optional(),
  batchId: BatchIdSchema.optional(),
})
export type CreateAnnouncementDto = z.infer<typeof CreateAnnouncementSchema>

export const UpdateAnnouncementSchema = CreateAnnouncementSchema.partial()
export type UpdateAnnouncementDto = z.infer<typeof UpdateAnnouncementSchema>

export const AnnouncementResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  isPublished: z.boolean(),
  scheduledAt: z.string().nullable(),
  publishedAt: z.string().nullable(),
  batchId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdById: z.string(),
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
  }),
  batch: z
    .object({
      id: z.string(),
      batchYear: z.number(),
    })
    .nullable(),
  isRead: z.boolean(),
  readCount: z.number().optional(),
})
export type AnnouncementResponse = z.infer<typeof AnnouncementResponseSchema>
