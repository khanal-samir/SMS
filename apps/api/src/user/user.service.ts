import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash, verify } from 'argon2'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createUserDto: CreateUserDto,
    isEmailVerified = false,
    otpCode: string | null = null,
    isTeacherApproved: boolean = true,
  ) {
    const { password, ...user } = createUserDto
    const hashedPassword = await this.hashPasswordOrToken(password)
    const otpExpiry = otpCode ? new Date(Date.now() + 2 * 60 * 60 * 1000) : null
    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        provider: 'LOCAL',
        isEmailVerified,
        otpCode,
        otpExpiry,
        isTeacherApproved,
        ...user,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        isEmailVerified: true,
      },
    })
  }

  async createOAuthUser(createUserDto: CreateUserDto) {
    this.logger.log(`Creating OAuth user`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = createUserDto
    return await this.prisma.user.create({
      data: {
        password: null,
        provider: 'GOOGLE',
        isEmailVerified: true, //oauth always verified
        otpCode: null,
        otpExpiry: null,
        ...user,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        isEmailVerified: true,
      },
    })
  }

  async findByEmail(email: string) {
    this.logger.log(`Finding user by email ${email}`)

    if (!email) {
      this.logger.warn('findByEmail called without a valid email')
      throw new BadRequestException('Email is required')
    }

    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findOne(userId: string) {
    this.logger.log(`Finding user by id ${userId}`)
    return await this.prisma.user.findUnique({
      where: { id: userId },
    })
  }

  async updateHashedRefreshToken(userId: string, hashedRT: string | null) {
    this.logger.log(`Updating hashed refresh token for user id`)
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRT },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        isEmailVerified: true,
      },
    })
  }

  async hashPasswordOrToken(password: string) {
    this.logger.log(`Hashing password or token`)
    return await hash(password)
  }

  async comparePasswordOrToken(plainPassword: string, hashedPassword: string) {
    this.logger.log(`Comparing password/tokens`)
    return await verify(hashedPassword, plainPassword)
  }

  async findByOTP(otpCode: string) {
    this.logger.log(`Finding user by OTP code`)
    return await this.prisma.user.findFirst({
      where: { otpCode },
    })
  }

  async verifyUserEmail(userId: string) {
    this.logger.log(`Verifying user email for user id: ${userId}`)
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        isEmailVerified: true,
      },
    })
  }

  async updateOTP(userId: string, otpCode: string) {
    this.logger.log(`Updating OTP code for user id: ${userId}`)
    const otpExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000)

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        otpCode,
        otpExpiry,
      },
    })
  }

  async updatePasswordResetOtp(userId: string, otpCode: string) {
    this.logger.log(`Updating password reset OTP code for user id: ${userId}`)
    const passwordResetOtpExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000)

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetOtp: otpCode,
        passwordResetOtpExpiry,
      },
    })
  }

  async resetPassword(userId: string, newPassword: string) {
    this.logger.log(`Resetting password for user id: ${userId}`)
    const hashedPassword = await this.hashPasswordOrToken(newPassword)

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordResetOtp: null,
        passwordResetOtpExpiry: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        isEmailVerified: true,
      },
    })
  }
}
