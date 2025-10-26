import { z } from 'zod'
import { RoleEnum, UserSchema } from './user.schema'

//strategy
export const JwtPayloadSchema = z.object({
  sub: z.cuid(),
})
export type JwtPayload = z.infer<typeof JwtPayloadSchema>

//strategy
export const AuthUserSchema = z.object({
  id: z.cuid(),
  role: RoleEnum,
})
export type AuthUser = z.infer<typeof AuthUserSchema>

// refresh token response
export const RefreshResponseSchema = z.object({
  id: z.cuid(),
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>

export const AuthResponseSchema = UserSchema.omit({
  password: true,
  refreshToken: true,
  otpCode: true,
  otpExpiry: true,
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>
