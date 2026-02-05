import { z } from 'zod'

export const CreateBatchSchema = z.object({
  batchYear: z.number().int().min(2000, 'Batch year must be 2000 or later'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid start date'),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid end date')
    .optional(),
})
export type CreateBatchDto = z.infer<typeof CreateBatchSchema>

export const EnrollStudentSchema = z.object({
  studentId: z.cuid('Student id must be a valid CUID'),
})
export type EnrollStudentDto = z.infer<typeof EnrollStudentSchema>
