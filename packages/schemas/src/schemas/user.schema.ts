import { z } from 'zod'

export const RoleEnum = z.enum(['ADMIN', 'TEACHER', 'STUDENT'])
export type Role = z.infer<typeof RoleEnum>

export const ProviderEnum = z.enum(['LOCAL', 'GOOGLE'])
export type Provider = z.infer<typeof ProviderEnum>

//public user schema
export const UserSchema = z.object({
  id: z.cuid(),
  email: z.email(),
  name: z.string().min(1),
  role: RoleEnum,
  provider: ProviderEnum,
  isEmailVerified: z.boolean(),
})
export type User = z.infer<typeof UserSchema>

//dto
export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
