import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new UnauthorizedException('User not found!')
    const isPasswordMatched = await this.userService.comparePassword(user.password, password)
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid Credentials!')
    return { id: user.id, role: user.role }
  }
}
