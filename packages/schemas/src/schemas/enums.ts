import { z } from 'zod'

export const RoleEnum = z.enum(['ADMIN', 'TEACHER', 'STUDENT'])
export type Role = z.infer<typeof RoleEnum>

export const ProviderEnum = z.enum(['LOCAL', 'GOOGLE'])
export type Provider = z.infer<typeof ProviderEnum>

export const SemesterNumberEnum = z.enum([
  'FIRST',
  'SECOND',
  'THIRD',
  'FOURTH',
  'FIFTH',
  'SIXTH',
  'SEVENTH',
  'EIGHTH',
])
export type SemesterNumber = z.infer<typeof SemesterNumberEnum>

export const StudentSemesterStatusEnum = z.enum(['ACTIVE', 'COMPLETED', 'FAILED'])
export type StudentSemesterStatus = z.infer<typeof StudentSemesterStatusEnum>
