import { z } from 'zod'

export const AssignTeacherSubjectSchema = z.object({
  teacherId: z.cuid('Teacher id must be a valid CUID'),
  subjectId: z.cuid('Subject id must be a valid CUID'),
})
export type AssignTeacherSubjectDto = z.infer<typeof AssignTeacherSubjectSchema>
