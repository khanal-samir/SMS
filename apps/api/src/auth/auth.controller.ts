import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  ForbiddenException,
  Query,
  HttpCode,
  UseFilters,
} from '@nestjs/common'
import type { Response } from 'express'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { CreateUserDto } from '@src/user/dto/create-user.dto'
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard'
import { Public } from './decorators/public.decorator'
import type { AuthUser, User } from '@repo/schemas'
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth/refresh-auth.guard'
import { GoogleAuthGuard } from './guards/google/oauth/oauth.guard'
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard.ts/jwt-auth.guard'
import { RolesGuard } from './guards/roles/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { ConfigService } from '@nestjs/config'
import { CurrentUser } from './decorators/current-user.decorator'
import { Role } from '@prisma/client'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { VerifyPasswordResetOtpDto } from './dto/verify-password-reset-otp.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { GoogleAuthExceptionFilter } from './filters/google-auth.filter'

@ApiTags('Authentication')
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

  @ApiOperation({
    summary: 'Register a new student',
    description: 'Creates a new student account. If email is in admin list, creates admin instead.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Student registered successfully',
    schema: {
      example: {
        message: 'Student registered successfully',
        data: {
          id: 'uuid',
          name: 'John Doe',
          email: 'student@example.com',
          role: 'STUDENT',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  @Public()
  @Post('student/register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    if (this.configService.get('ADMIN_EMAILS').includes(createUserDto.email)) {
      const user = await this.authService.registerAdmin(createUserDto)
      return {
        message: 'Admin registered successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }
    }
    const user = await this.authService.registerUser({
      ...createUserDto,
      role: Role.STUDENT,
    } as CreateUserDto)
    return {
      message: 'Student registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  @ApiOperation({
    summary: 'Register a new teacher',
    description: 'Creates a new teacher account. If email is in admin list, creates admin instead.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Teacher registered successfully',
    schema: {
      example: {
        message: 'Teacher registered successfully',
        data: {
          id: 'uuid',
          name: 'Jane Smith',
          email: 'teacher@example.com',
          role: 'TEACHER',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  @Public()
  @Post('teacher/register')
  async registerTeacher(@Body() createUserDto: CreateUserDto) {
    if (this.configService.get('ADMIN_EMAILS').includes(createUserDto.email)) {
      const user = await this.authService.registerAdmin(createUserDto)
      return {
        message: 'Admin registered successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }
    }
    const user = await this.authService.registerUser({
      ...createUserDto,
      role: Role.TEACHER,
    } as CreateUserDto)
    return {
      message: 'Teacher registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  @ApiOperation({
    summary: 'Student login',
    description:
      'Authenticates a student user with email and password. Sets httpOnly cookies for tokens.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'student@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - Cookies set',
    schema: {
      example: {
        message: 'Student login successful',
        data: {
          id: 'uuid',
          name: 'John Doe',
          email: 'student@example.com',
          role: 'STUDENT',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only students can login here' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('student/login')
  async login(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) res: Response) {
    if (user.role !== 'STUDENT') throw new ForbiddenException('Only Students can login here')
    const result = await this.authService.login(user.id)
    this.setAuthCookies(res, result.accessToken, result.refreshToken)
    return {
      message: 'Student login successful',
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    }
  }

  @ApiOperation({
    summary: 'Teacher login',
    description:
      'Authenticates a teacher user with email and password. Sets httpOnly cookies for tokens.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'teacher@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - Cookies set',
    schema: {
      example: {
        message: 'Teacher login successful',
        data: {
          id: 'uuid',
          name: 'Jane Smith',
          email: 'teacher@example.com',
          role: 'TEACHER',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only teachers can login here' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('teacher/login')
  async loginTeacher(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) res: Response) {
    if (user.role !== Role.TEACHER) throw new ForbiddenException('Only teachers can login here')
    const result = await this.authService.login(user.id)
    this.setAuthCookies(res, result.accessToken, result.refreshToken)
    return {
      message: 'Teacher login successful',
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    }
  }

  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Uses refresh token from cookie to generate new access and refresh tokens.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully - New cookies set',
    schema: {
      example: {
        message: 'Token refreshed',
        data: { id: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired refresh token' })
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

  @ApiOperation({
    summary: 'Initiate Google OAuth login',
    description: 'Redirects to Google consent page for OAuth authentication.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth consent page',
  })
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login') //consent page
  googleLogin() {}

  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handles Google OAuth callback, creates/authenticates user, sets cookies, and redirects to frontend.',
  })
  @ApiQuery({ name: 'code', required: false, description: 'OAuth authorization code from Google' })
  @ApiQuery({ name: 'state', required: false, description: 'OAuth state parameter' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to frontend with user data or error',
  })
  @Public()
  @UseGuards(GoogleAuthGuard)
  @UseFilters(GoogleAuthExceptionFilter)
  @Get('google/callback')
  async googleCallback(@CurrentUser() user: User, @Res() res: Response) {
    const frontendUrl = this.configService.get('PUBLIC_WEB_URL')
    try {
      const response = await this.authService.login(user.id)
      // Set cookies before redirect
      this.setAuthCookies(res, response.accessToken, response.refreshToken)
      const callbackUrl = `${frontendUrl}/auth/google/callback?userId=${response.id}&name=${encodeURIComponent(response.name)}&email=${encodeURIComponent(response.email)}&role=${response.role}`
      res.redirect(callbackUrl)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      res.redirect(`${frontendUrl}/auth/google/callback?error=${encodeURIComponent(errorMessage)}`)
    }
  }

  @ApiOperation({
    summary: 'Get current user',
    description: "Fetches the authenticated user's profile information.",
  })
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: 'Current user fetched successfully',
    schema: {
      example: {
        message: 'Current user fetched',
        data: {
          id: 'uuid',
          name: 'John Doe',
          email: 'user@example.com',
          role: 'STUDENT',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - No valid token provided' })
  @Get('me')
  async getCurrentUser(@CurrentUser('id') userId: string) {
    const user = await this.authService.getCurrentUser(userId)
    return {
      message: 'Current user fetched',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  @ApiOperation({
    summary: 'Logout user',
    description: 'Logs out the authenticated user and clears authentication cookies.',
  })
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      example: {
        message: 'Logged out successfully',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - No valid token provided' })
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

  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verifies user email address using OTP code sent to email.',
  })
  @ApiQuery({
    name: 'otp',
    required: true,
    description: 'One-time password code sent to email',
    example: '123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: {
      example: {
        message: 'Email verified successfully',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid or expired OTP' })
  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('otp') otpCode: string) {
    await this.authService.verifyEmail(otpCode)
    return {
      message: 'Email verified successfully',
      data: null,
    }
  }

  @ApiOperation({
    summary: 'Resend verification email',
    description: 'Sends a new verification email with OTP code to the user.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
    schema: {
      example: {
        message: 'Verification email sent successfully',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Not found - User not found' })
  @HttpCode(200)
  @Public()
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    await this.authService.resendVerificationEmail(email)
    return {
      message: 'Verification email sent successfully',
      data: null,
    }
  }

  @ApiOperation({
    summary: 'Request password reset',
    description: "Sends a password reset OTP code to the user's email address.",
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
    schema: {
      example: {
        message: 'Password reset email sent successfully',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Not found - User not found' })
  @HttpCode(200)
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email)
    return {
      message: 'Password reset email sent successfully',
      data: null,
    }
  }

  @ApiOperation({
    summary: 'Verify password reset OTP',
    description: 'Verifies the password reset OTP code before allowing password reset.',
  })
  @ApiBody({ type: VerifyPasswordResetOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      example: {
        message: 'Password reset email sent successfully',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid or expired OTP' })
  @HttpCode(200)
  @Public()
  @Post('verify-reset-otp')
  async verifyResetOtp(@Body() dto: VerifyPasswordResetOtpDto) {
    await this.authService.verifyPasswordResetOtp(dto.email, dto.otp)
    return {
      message: 'Password reset email sent successfully',
      data: null,
    }
  }

  @ApiOperation({
    summary: 'Reset password',
    description: 'Resets user password using verified OTP code and new password.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      example: {
        message: 'Password reset successfully',
        data: null,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid or expired OTP' })
  @HttpCode(200)
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.email, dto.otp, dto.password)
    return {
      message: 'Password reset successfully',
      data: null,
    }
  }
}
