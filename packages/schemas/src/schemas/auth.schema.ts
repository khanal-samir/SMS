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
