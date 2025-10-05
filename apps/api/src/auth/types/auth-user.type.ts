import type { JwtPayload, AuthUser, AuthResponse, TokenPair } from '@repo/schemas'
export type { JwtPayload, AuthUser, AuthResponse, TokenPair }
export interface AuthenticatedRequest extends Request {
  user: AuthUser
}
