import { z } from 'zod'

export const AssignmentStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'PAST_DUE'])
export type AssignmentStatus = z.infer<typeof AssignmentStatusEnum>

export const AssignmentResponseSchema = z.object({
  id: z.cuid(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: AssignmentStatusEnum,
  subjectTeacherId: z.string(),
  resourceId: z.string().nullable(),
  batchId: z.string(),
  subjectTeacher: z.object({
    id: z.string(),
    subject: z.object({
      id: z.string(),
      subjectCode: z.string(),
      subjectName: z.string(),
    }),
    teacher: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  batch: z.object({
    id: z.string(),
    batchYear: z.number(),
  }),
})
export type AssignmentResponse = z.infer<typeof AssignmentResponseSchema>

export const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid due date'),
  subjectTeacherId: z.cuid('Subject teacher is required'),
  batchId: z.cuid('Batch is required'),
})
export type CreateAssignmentDto = z.infer<typeof CreateAssignmentSchema>

export const UpdateAssignmentSchema = CreateAssignmentSchema.partial().omit({
  subjectTeacherId: true,
})
export type UpdateAssignmentDto = z.infer<typeof UpdateAssignmentSchema>

export const UpdateAssignmentStatusSchema = z.object({
  status: AssignmentStatusEnum,
})
export type UpdateAssignmentStatusDto = z.infer<typeof UpdateAssignmentStatusSchema>
