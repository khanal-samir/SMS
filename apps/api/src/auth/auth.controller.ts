import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard'
import { Public } from './decorators/public.decorator'
import type { AuthenticatedRequest } from './types/auth-user.type'
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth/refresh-auth.guard'
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard.ts/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() req: AuthenticatedRequest) {
    return {
      message: `Now you can access this protected API. this is your user ID: ${req.user.id}`,
    }
  }
}
