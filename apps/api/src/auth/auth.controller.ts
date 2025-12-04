import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  ForbiddenException,
  Request,
} from '@nestjs/common'
import type { Response } from 'express'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard'
import { Public } from './decorators/public.decorator'
import type { AuthenticatedRequest } from './types/auth-user.type'
import type { AuthUser } from '@repo/schemas'
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth/refresh-auth.guard'
import { GoogleAuthGuard } from './guards/google/oauth/oauth.guard'
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard.ts/jwt-auth.guard'
import { RolesGuard } from './guards/roles/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { ConfigService } from '@nestjs/config'
import { CurrentUser } from './decorators/current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production'

    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '15m'
    const accessTokenMaxAge = this.parseTimeToMs(jwtExpiresIn)

    const refreshExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d'
    const refreshTokenMaxAge = this.parseTimeToMs(refreshExpiresIn)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/',
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
    })
  }

  private parseTimeToMs(time: string): number {
    const unit = time.slice(-1)
    const value = parseInt(time.slice(0, -1))

    switch (unit) {
      case 'm':
        return value * 60 * 1000

      case 'd':
        return value * 24 * 60 * 60 * 1000

      default:
        return 15 * 60 * 1000
    }
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' })
    res.clearCookie('refreshToken', { path: '/' })
  }

  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log('registerUser', createUserDto)
    const user = await this.authService.registerUser(createUserDto)
    return {
      message: 'Student registered successfully',
      data: user,
    }
  }

  @Public()
  @Post('teacher/register')
  async registerTeacher(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.registerUser({
      ...createUserDto,
      role: 'TEACHER',
    } as CreateUserDto)
    return {
      message: 'Teacher registered successfully',
      data: user,
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) res: Response) {
    if (user.role !== 'STUDENT') throw new ForbiddenException('Only Students can login here')
    const result = await this.authService.login(user.id)
    this.setAuthCookies(res, result.accessToken, result.refreshToken)
    return {
      message: 'Login successful',
      data: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        provider: result.provider,
      },
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('teacher/login')
  async loginTeacher(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) res: Response) {
    if (user.role !== 'TEACHER') throw new ForbiddenException('Only teachers can login here')
    const result = await this.authService.login(user.id)
    this.setAuthCookies(res, result.accessToken, result.refreshToken)
    return {
      message: 'Login successful',
      data: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        provider: result.provider,
      },
    }
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.refreshToken(user.id)
    this.setAuthCookies(res, result.accessToken, result.refreshToken)
    return {
      message: 'Token refreshed',
      data: { id: result.id },
    }
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login') //consent page
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req: AuthenticatedRequest, @Res() res: Response) {
    const frontendUrl = this.configService.get('PUBLIC_WEB_URL')
    try {
      const response = await this.authService.login(req.user.id)
      // Set cookies before redirect
      this.setAuthCookies(res, response.accessToken, response.refreshToken)
      const callbackUrl = `${frontendUrl}/auth/google/callback?userId=${response.id}&email=${encodeURIComponent(response.email)}&name=${encodeURIComponent(response.name)}&role=${response.role}&provider=${response.provider}`
      res.redirect(callbackUrl)
    } catch {
      res.redirect(`${frontendUrl}/auth/google/callback?error=Authentication failed`)
    }
  }

  @Get('me')
  async getCurrentUser(@CurrentUser('id') userId: string) {
    const user = await this.authService.getCurrentUser(userId)
    return {
      message: 'Current user fetched',
      data: user,
    }
  }

  @Roles('ADMIN', 'STUDENT', 'TEACHER')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async signOut(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.authService.signOut(userId)
    this.clearAuthCookies(res)
    return {
      message: 'Logged out successfully',
      data: null,
    }
  }
}
