import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '@src/user/dto/create-user.dto'
import { UserService } from '@src/user/user.service'
import { AuthUser, JwtPayload } from '@repo/schemas'
import refreshConfig from './config/refresh.config'
import type { ConfigType } from '@nestjs/config/dist/types/config.type'
import { MailService } from '@src/common/mail/mail.service'
import { Role } from '@prisma/client'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService, // default access token
    @Inject(refreshConfig.KEY) // DI injection for refresh token
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async registerAdmin(createUserDto: CreateUserDto) {
    return this.userService.create(
      {
        ...createUserDto,
        role: Role.ADMIN,
      },
      true,
      null,
    )
  }
  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(createUserDto.email)
    if (existingUser) throw new ConflictException('User with given email already exists!')

    if (createUserDto.role === Role.TEACHER) {
      this.logger.log(`Registering new teacher with email: ${createUserDto.email}`)
      const optCode = this.generateOTP()
      const [newTeacher] = await Promise.all([
        this.userService.create(createUserDto, false, optCode, false),
        this.mailService.sendVerificationEmail(createUserDto.email, createUserDto.name, optCode),
      ])
      return newTeacher
    }

    this.logger.log(`Registering new student with email: ${createUserDto.email}`)
    //student auto verify
    return this.userService.create(createUserDto, true, null)
  }

  async login(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId)
    const hashedRT = await this.userService.hashPasswordOrToken(refreshToken)
    const user = await this.userService.updateHashedRefreshToken(userId, hashedRT)
    this.logger.log(`User logged in with ID: ${userId}, email: ${user.email}`)
    return {
      id: userId,
      accessToken,
      refreshToken,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    }
  }

  //auth middleware or local strategy
  async validateLocalUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new UnauthorizedException('User not found!')

    // Check if user signed up with OAuth (Google)
    if (!user.password) {
      throw new UnauthorizedException(
        'This account was created using Google Sign-In. Please login with Google.',
      )
    }
    // Check if teacher has verified email
    if (user.role === Role.TEACHER && !user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email address before logging in. Check your inbox for the OTP code.',
      )
    }
    if (user.role === Role.TEACHER && !user.isTeacherApproved) {
      throw new UnauthorizedException(
        'Your account is pending approval from the admin. You will be notified once approved.',
      )
    }
    const isPasswordMatched = await this.userService.comparePasswordOrToken(password, user.password)
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid Credentials!')
    this.logger.log(`User authenticated with email: ${email}`)
    return { id: user.id, role: user.role }
  }

  //protected routes or jwt strategy
  async validateJwtUser(userId: string): Promise<AuthUser> {
    this.logger.log(`Validating JWT user with ID: ${userId}`)
    const user = await this.userService.findOne(userId)
    if (!user) throw new UnauthorizedException('User not found!')
    this.logger.log(`JWT user validated successfully with email: ${user.email}`)
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
    this.logger.log(`Refresh token validated for user with ID: ${userId}`)
    return { id: user.id, role: user.role }
  }

  // after expiry of access token
  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId)
    const hashedRT = await this.userService.hashPasswordOrToken(refreshToken)
    await this.userService.updateHashedRefreshToken(userId, hashedRT)
    this.logger.log(`Refresh token updated for user with ID: ${userId}`)
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
    if (user) {
      if (user.role !== 'STUDENT') {
        throw new UnauthorizedException('Only students can login with Google')
      }
      this.logger.log(`Existing user found for Google login: ${user.email}`)
      return user
    }

    this.logger.log(`Creating new user for Google OAuth: ${googleUser.email}`)
    return await this.userService.createOAuthUser(googleUser)
  }

  async getCurrentUser(userId: string) {
    const user = await this.userService.findOne(userId)
    if (!user) throw new UnauthorizedException('User not found!')
    this.logger.log(`Fetched current user with ID: ${userId}, email: ${user.email}`)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    }
  }

  async signOut(userId: string) {
    this.logger.log(`Signing out user with ID: ${userId}`)
    return await this.userService.updateHashedRefreshToken(userId, null)
  }

  async verifyEmail(otpCode: string) {
    const user = await this.userService.findByOTP(otpCode)
    if (!user) throw new NotFoundException('Invalid OTP code')

    if (user.isEmailVerified) throw new BadRequestException('Email already verified')

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP has expired. Please request a new OTP.')
    }

    return this.userService.verifyUserEmail(user.id)
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new NotFoundException('User not found')

    if (user.isEmailVerified) throw new BadRequestException('Email already verified')

    if (user.role !== Role.TEACHER)
      throw new BadRequestException('Only teachers require email verification')

    const otpCode = this.generateOTP()
    return Promise.all([
      this.userService.updateOTP(user.id, otpCode),
      this.mailService.sendVerificationEmail(user.email, user.name, otpCode),
    ])
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new NotFoundException('User not found')

    if (!user.password)
      throw new BadRequestException(
        'This account was created using Google Sign-In. Please login with Google.',
      )

    const otpCode = this.generateOTP()
    await Promise.all([
      this.userService.updatePasswordResetOtp(user.id, otpCode),
      this.mailService.sendPasswordResetEmail(user.email, user.name, otpCode),
    ]).catch(() => {
      throw new BadGatewayException('Something went wrong. Please try again')
    })
    return
  }

  async verifyPasswordResetOtp(email: string, otp: string) {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new NotFoundException('User not found')

    if (user.passwordResetOtp !== otp) throw new BadRequestException('Invalid OTP code')

    if (user.passwordResetOtpExpiry && new Date() > user.passwordResetOtpExpiry)
      throw new BadRequestException('OTP has expired. Please request a new OTP.')
    return
  }

  async resetPassword(email: string, otp: string, password: string) {
    await this.verifyPasswordResetOtp(email, otp)
    const user = await this.userService.findByEmail(email)
    if (!user) throw new NotFoundException('User not found')
    return await this.userService.resetPassword(user.id, password)
  }
}
