import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import { AuthUser, JwtPayload } from './types/auth-user.type'
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  //auth middleware
  async validateLocalUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new UnauthorizedException('User not found!')
    const isPasswordMatched = await this.userService.comparePassword(user.password, password)
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid Credentials!')
    return { id: user.id, role: user.role }
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email)
    if (user) throw new ConflictException('User with given email already exists!')
    return this.userService.create(createUserDto)
  }

  async login(userId: string) {
    const { accessToken } = await this.generateTokens(userId)
    // const hashedRT = await hash(refreshToken)
    // await this.userService.updateHashedRefreshToken(userId, hashedRT)
    return {
      id: userId,
      accessToken,
      // refreshToken,
    }
  }

  //protected routes
  async validateJwtUser(userId: string): Promise<AuthUser> {
    const user = await this.userService.findOne(userId)
    if (!user) throw new UnauthorizedException('User not found!')
    return { id: user.id, role: user.role }
  }

  async generateTokens(userId: string) {
    const payload: JwtPayload = { sub: userId }
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      // this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ])
    return {
      accessToken,
      // refreshToken,
    }
  }
}
