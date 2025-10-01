import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import { AuthUser, JwtPayload } from './types/auth-user.type'
import refreshConfig from './config/refresh.config'
import type { ConfigType } from '@nestjs/config/dist/types/config.type'
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, // default access token
    @Inject(refreshConfig.KEY) // DI injection for refresh token
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email)
    if (user) throw new ConflictException('User with given email already exists!')
    return this.userService.create(createUserDto)
  }

  async login(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId)
    const hashedRT = await this.userService.hashPasswordOrToken(refreshToken)
    await this.userService.updateHashedRefreshToken(userId, hashedRT)
    return {
      id: userId,
      accessToken,
      refreshToken,
    }
  }

  //auth middleware or local strategy
  async validateLocalUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new UnauthorizedException('User not found!')
    const isPasswordMatched = await this.userService.comparePasswordOrToken(password, user.password)
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid Credentials!')
    return { id: user.id, role: user.role }
  }

  //protected routes or jwt strategy
  async validateJwtUser(userId: string): Promise<AuthUser> {
    this.logger.log(`Validating JWT user with ID: ${userId}`)
    const user = await this.userService.findOne(userId)
    if (!user) throw new UnauthorizedException('User not found!')
    return { id: user.id, role: user.role }
  }

  //refresh token strategy
  async validateRefreshToken(userId: string, refreshToken: string): Promise<AuthUser> {
    const user = await this.userService.findOne(userId)
    if (!user || !user.refreshToken) throw new UnauthorizedException('User not found!')
    const isRTMatched = await this.userService.comparePasswordOrToken(
      refreshToken,
      user.refreshToken,
    )
    if (!isRTMatched) throw new UnauthorizedException('Invalid Refresh Token!')
    return { id: user.id, role: user.role }
  }

  // after expiry of access token
  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId)
    const hashedRT = await this.userService.hashPasswordOrToken(refreshToken)
    await this.userService.updateHashedRefreshToken(userId, hashedRT)
    return {
      id: userId,
      accessToken,
      refreshToken,
    }
  }
  // generate access and refresh tokens
  async generateTokens(userId: string) {
    const payload: JwtPayload = { sub: userId }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }
  // Google OAuth validation
  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email)
    if (user) return user
    return await this.userService.create(googleUser)
  }
  async signOut(userId: string) {
    return await this.userService.updateHashedRefreshToken(userId, null)
  }
}
