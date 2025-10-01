import { Body, Controller, Post, UseGuards, Request, Get, Res } from '@nestjs/common'
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthenticatedRequest) {
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
    console.log('Google User', req.user)
    const response = await this.authService.login(req.user.id)
    console.log('Response', response, res)

    // res.redirect(
    //   `http://localhost:3000/api/auth/google/callback?userId=${response.id}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`,
    // )
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
