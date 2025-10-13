import type { JwtPayload, AuthUser } from '@repo/schemas'
export type { JwtPayload, AuthUser }
export interface AuthenticatedRequest extends Request {
  user: AuthUser
}
