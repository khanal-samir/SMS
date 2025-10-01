import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

//local auth guard activates local strategy and passed the userinfo like auth middleware
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
