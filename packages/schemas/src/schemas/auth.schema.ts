import { z } from 'zod'
import { RoleEnum, PublicUserSchema } from './user.schema'

//api
export const JwtPayloadSchema = z.object({
  sub: z.cuid(),
})
export type JwtPayload = z.infer<typeof JwtPayloadSchema>

//api
export const AuthUserSchema = z.object({
  id: z.cuid(),
  role: RoleEnum,
})
export type AuthUser = z.infer<typeof AuthUserSchema>

//api
export const AuthResponseSchema = z.object({
  id: z.cuid(),
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>

//web/api
export const AuthResponseWithUserSchema = AuthResponseSchema.extend({
  user: PublicUserSchema,
})
export type AuthResponseWithUser = z.infer<typeof AuthResponseWithUserSchema>

//api
export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
})
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>

//web/api
export const TokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type TokenPair = z.infer<typeof TokenPairSchema>
