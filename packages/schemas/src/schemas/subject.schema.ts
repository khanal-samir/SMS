import { z } from 'zod'

export const SubjectResponseSchema = z.object({
  id: z.cuid(),
  subjectCode: z.string(),
  subjectName: z.string(),
  semesterId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type SubjectResponse = z.infer<typeof SubjectResponseSchema>

export const SubjectTeacherResponseSchema = z.object({
  id: z.cuid(),
  subjectId: z.string(),
  teacherId: z.string(),
  assignedAt: z.string(),
  isActive: z.boolean(),
  teacher: z.object({
    id: z.cuid(),
    name: z.string(),
    email: z.string(),
    role: z.literal('TEACHER'),
  }),
})
export type SubjectTeacherResponse = z.infer<typeof SubjectTeacherResponseSchema>
