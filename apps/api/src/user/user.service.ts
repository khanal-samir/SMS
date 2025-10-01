import { Injectable, Logger } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash, verify } from 'argon2'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto
    const hashedPassword = await this.hashPasswordOrToken(password)
    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user,
      },
    })
  }

  async findByEmail(email: string) {
    this.logger.log(`Finding user by email`)
    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findOne(userId: string) {
    this.logger.log(`Finding user by id`)
    return await this.prisma.user.findUnique({
      where: { id: userId },
    })
  }

  async updateHashedRefreshToken(userId: string, hashedRT: string | null) {
    this.logger.log(`Updating hashed refresh token for user id`)
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRT },
    })
  }

  async hashPasswordOrToken(password: string) {
    this.logger.log(`Hashing password/token`)
    return await hash(password)
  }

  async comparePasswordOrToken(plainPassword: string, hashedPassword: string) {
    this.logger.log(`Comparing password/tokens`)
    return await verify(hashedPassword, plainPassword)
  }
}
