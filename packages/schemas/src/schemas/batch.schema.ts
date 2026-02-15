import { z } from 'zod'
import { UserSchema } from './user.schema'
import { SemesterNumberEnum } from './semester.schema'

//create batch and findall batch array response
export const BatchResponseSchema = z.object({
  id: z.cuid(),
  batchYear: z.number().int(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  totalStudents: z.number().int(),
  currentSemesterId: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type BatchResponse = z.infer<typeof BatchResponseSchema>

// find one batch response
export const BatchDetailResponseSchema = BatchResponseSchema.extend({
  users: z.array(UserSchema),
  currentSemester: z
    .object({
      semesterNumber: SemesterNumberEnum,
    })
    .nullable(),
})
export type BatchDetailResponse = z.infer<typeof BatchDetailResponseSchema>

export const BatchAdvanceSemesterResponseSchema = z.object({
  id: z.cuid(),
  batchYear: z.number().int(),
  currentSemesterId: z.cuid(),
})
export type BatchAdvanceSemesterResponse = z.infer<typeof BatchAdvanceSemesterResponseSchema>

// enroll student and get all enrolled students response
export const BatchEnrolledStudentResponseSchema = UserSchema.extend({
  batchId: z.cuid(),
})
export type BatchEnrolledStudentResponse = z.infer<typeof BatchEnrolledStudentResponseSchema>

// this will be array of students not enrolled in any batch
export const UnenrolledStudentResponseSchema = UserSchema.omit({ role: true })
export type UnenrolledStudentResponse = z.infer<typeof UnenrolledStudentResponseSchema>

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
