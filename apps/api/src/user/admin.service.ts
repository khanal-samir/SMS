import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'
import { MailService } from '@src/common/mail/mail.service'
import { Role } from '@prisma/client'

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async approveTeacher(userId: string) {
    this.logger.log(`Approving teacher for user id: ${userId}`)
    const teacher = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTeacherApproved: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    })

    await this.mailService.sendTeacherApprovedEmail(teacher.email, teacher.name)
    this.logger.log(`Approval email sent to teacher ${teacher.email}`)
    return teacher
  }

  async getPendingTeachers() {
    this.logger.log(`Getting pending teachers`)
    return await this.prisma.user.findMany({
      where: {
        role: 'TEACHER',
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
      orderBy: {
        email: 'asc',
      },
    })
  }

  async getApprovedTeachers() {
    this.logger.log('Getting approved teachers')
    return await this.prisma.user.findMany({
      where: {
        role: 'TEACHER',
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  async getAllUsers() {
    this.logger.log('Getting all users')
    return await this.prisma.user.findMany({
      where: {
        isEmailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  async assignTeacherToSubject(teacherId: string, subjectId: string) {
    this.logger.log(`Assigning teacher ${teacherId} to subject ${subjectId}`)

    const [teacher, subject] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: teacherId },
        select: { id: true, role: true, isTeacherApproved: true },
      }),
      this.prisma.subject.findUnique({
        where: { id: subjectId },
        select: { id: true },
      }),
    ])

    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${teacherId} not found`)
    }

    if (teacher.role !== Role.TEACHER) {
      throw new BadRequestException(`User ${teacherId} is not a teacher`)
    }

    if (!teacher.isTeacherApproved) {
      throw new BadRequestException(`Teacher ${teacherId} is not approved`)
    }

    if (!subject) {
      throw new NotFoundException(`Subject with id ${subjectId} not found`)
    }

    const existingAssignment = await this.prisma.subjectTeacher.findUnique({
      where: {
        subjectId_teacherId: {
          subjectId,
          teacherId,
        },
      },
    })

    if (existingAssignment?.isActive) {
      throw new ConflictException(
        `Teacher ${teacherId} is already assigned to subject ${subjectId}`,
      )
    }

    if (existingAssignment && !existingAssignment.isActive) {
      return await this.prisma.subjectTeacher.update({
        where: { id: existingAssignment.id },
        data: { isActive: true },
      })
    }

    return await this.prisma.subjectTeacher.create({
      data: {
        teacherId,
        subjectId,
        isActive: true,
      },
    })
  }

  async unassignTeacherFromSubject(teacherId: string, subjectId: string) {
    this.logger.log(`Unassigning teacher ${teacherId} from subject ${subjectId}`)

    const assignment = await this.prisma.subjectTeacher.findUnique({
      where: {
        subjectId_teacherId: {
          subjectId,
          teacherId,
        },
      },
    })

    if (!assignment) {
      throw new NotFoundException(
        `Assignment not found for teacher ${teacherId} and subject ${subjectId}`,
      )
    }

    if (!assignment.isActive) {
      throw new BadRequestException('Assignment is already inactive')
    }

    return await this.prisma.subjectTeacher.update({
      where: { id: assignment.id },
      data: { isActive: false },
    })
  }
}
