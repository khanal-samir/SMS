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

/**
 * Lightweight subject-teacher record used in dropdowns (teacher-facing).
 * Shared across features: assignments, resources, etc.
 */
export const TeacherSubjectRecordSchema = z.object({
  id: z.string(),
  subject: z.object({
    id: z.string(),
    subjectCode: z.string(),
    subjectName: z.string(),
  }),
})
export type TeacherSubjectRecord = z.infer<typeof TeacherSubjectRecordSchema>

/**
 * Lightweight subject-teacher record with teacher info (admin-facing).
 * Shared across features: assignments, resources, etc.
 */
export const AllSubjectTeacherRecordSchema = z.object({
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
})
export type AllSubjectTeacherRecord = z.infer<typeof AllSubjectTeacherRecordSchema>
