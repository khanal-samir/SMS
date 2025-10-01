import { Role } from '@prisma/client'

export interface JwtPayload {
  sub: string
}

export interface AuthUser {
  id: string
  role: Role
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser
}
