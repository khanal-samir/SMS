import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { AuthUser } from '@repo/schemas'

//  * - @CurrentUser()        -> returns the full AuthUser
//  * - @CurrentUser('id')    -> returns the user id
//  * - @CurrentUser('role')  -> returns the user role

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>()
    const user = request.user

    if (!user) {
      return undefined
    }

    if (data) {
      return user[data]
    }

    return user
  },
)
