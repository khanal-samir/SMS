import { z } from 'zod'
import { SemesterNumberEnum, StudentSemesterStatusEnum } from './enums'
import { SubjectResponseSchema, SubjectTeacherResponseSchema } from './subject.schema'

export const SemesterResponseSchema = z.object({
  id: z.cuid(),
  semesterNumber: SemesterNumberEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type SemesterResponse = z.infer<typeof SemesterResponseSchema>

export const SemesterSubjectResponseSchema = SubjectResponseSchema.extend({
  subjectTeachers: z.array(SubjectTeacherResponseSchema),
})

export const SemesterDetailResponseSchema = SemesterResponseSchema.extend({
  subjects: z.array(SemesterSubjectResponseSchema),
})
export type SemesterDetailResponse = z.infer<typeof SemesterDetailResponseSchema>

export const StudentSemesterResponseSchema = z.object({
  id: z.cuid(),
  studentId: z.string(),
  semesterId: z.string(),
  enrolledAt: z.string(),
  status: StudentSemesterStatusEnum,
})
export type StudentSemesterResponse = z.infer<typeof StudentSemesterResponseSchema>
