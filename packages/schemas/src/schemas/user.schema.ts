import { z } from 'zod'
import { BatchResponseSchema } from './batch.schema'
import { SemesterNumberEnum, StudentSemesterStatusEnum } from './semester.schema'

export const RoleEnum = z.enum(['ADMIN', 'TEACHER', 'STUDENT'])
export type Role = z.infer<typeof RoleEnum>

export const ProviderEnum = z.enum(['LOCAL', 'GOOGLE'])
export type Provider = z.infer<typeof ProviderEnum>

//public user schema - simplified response
export const UserSchema = z.object({
  id: z.cuid(),
  email: z.email(),
  name: z.string().min(1),
  image: z.url().optional().nullable(),
  role: RoleEnum,
})
export type User = z.infer<typeof UserSchema>

// student detail response - includes batch and semester history

export const StudentDetailResponseSchema = z.object({
  id: z.cuid(),
  email: z.email(),
  name: z.string().min(1),
  image: z.url().optional().nullable(),
  role: RoleEnum,
  batch: z
    .object({
      id: z.cuid(),
      batchYear: z.number().int(),
      isActive: z.boolean(),
      currentSemester: z
        .object({
          id: z.cuid(),
          semesterNumber: SemesterNumberEnum,
        })
        .nullable(),
    })
    .nullable(),
  semesters: z.array(
    z.object({
      id: z.cuid(),
      semesterId: z.string(),
      semesterNumber: SemesterNumberEnum,
      enrolledAt: z.string(),
      status: StudentSemesterStatusEnum,
    }),
  ),
})
export type StudentDetailResponse = z.infer<typeof StudentDetailResponseSchema>

//dto
export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  image: z.url().optional().nullable(),
  role: RoleEnum.optional(),
})
export type CreateUserDto = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

//dto
export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginDto = z.infer<typeof LoginSchema>
