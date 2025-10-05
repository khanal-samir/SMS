import { z } from 'zod'

export const RoleEnum = z.enum(['ADMIN', 'TEACHER', 'STUDENT'])
export type Role = z.infer<typeof RoleEnum>

export const UserSchema = z.object({
  id: z.cuid(),
  email: z.email(),
  name: z.string().min(1),
  password: z.string(),
  refreshToken: z.string().nullable(),
  role: RoleEnum,
})
export type User = z.infer<typeof UserSchema>

export const PublicUserSchema = UserSchema.omit({
  password: true,
})
export type PublicUser = z.infer<typeof PublicUserSchema>

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: RoleEnum.optional().default('STUDENT'),
})
export type CreateUserDto = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginDto = z.infer<typeof LoginSchema>
