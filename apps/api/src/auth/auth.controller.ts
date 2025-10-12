import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Res,
  ForbiddenException,
} from '@nestjs/common'
import type { Response } from 'express'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard'
import { Public } from './decorators/public.decorator'
import type { AuthenticatedRequest } from './types/auth-user.type'
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth/refresh-auth.guard'
import { GoogleAuthGuard } from './guards/google/oauth/oauth.guard'
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard.ts/jwt-auth.guard'
import { RolesGuard } from './guards/roles/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @Public()
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto)
  }

  @Public()
  @Post('teacher/register')
  registerTeacher(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser({
      ...createUserDto,
      role: 'TEACHER',
    } as CreateUserDto)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user.id)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('teacher/login')
  loginTeacher(@Request() req: AuthenticatedRequest) {
    if (req.user.role !== 'TEACHER') throw new ForbiddenException('Only teachers can login here')
    return this.authService.login(req.user.id)
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: AuthenticatedRequest) {
    return this.authService.refreshToken(req.user.id)
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
      const callbackUrl = `${frontendUrl}/auth/google/callback?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&userId=${response.id}&email=${encodeURIComponent(response.email)}&name=${encodeURIComponent(response.name)}&role=${response.role}&provider=${response.provider}`
      res.redirect(callbackUrl)
    } catch {
      res.redirect(`${frontendUrl}/auth/google/callback?error=Authentication failed`)
    }
  }

  @Get('me')
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return this.authService.getCurrentUser(req.user.id)
  }

  //bottom up approach first route then jwt guard then roles guard
  @Roles('ADMIN', 'STUDENT', 'TEACHER')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  signOut(@Request() req: AuthenticatedRequest) {
    return this.authService.signOut(req.user.id)
  }
}
