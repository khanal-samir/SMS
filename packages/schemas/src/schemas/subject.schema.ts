import { z } from 'zod'
import { RoleEnum } from './enums'
import type { User } from './user.schema'

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
  teacher: z.lazy(() =>
    // work at runtime, avoid circular dependency
    z.custom<User>().refine(
      (data) => {
        return data.role === RoleEnum.enum.TEACHER
      },
      {
        message: 'User must have the role of TEACHER',
      },
    ),
  ),
})
export type SubjectTeacherResponse = z.infer<typeof SubjectTeacherResponseSchema>
