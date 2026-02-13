import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { AccessScopeService } from '@src/common/access-scope/access-scope.service'

@Injectable()
export class SubjectService {
  private readonly logger = new Logger(SubjectService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly accessScopeService: AccessScopeService,
  ) {}

  async findAll(user?: AuthUser) {
    this.logger.log('Finding all subjects')

    if (user?.role === Role.TEACHER) {
      return await this.prisma.subject.findMany({
        where: {
          subjectTeachers: {
            some: {
              teacherId: user.id,
              isActive: true,
            },
          },
        },

        orderBy: { subjectCode: 'asc' },
      })
    }

    if (user?.role === Role.STUDENT) {
      const currentSemesterId = await this.accessScopeService.getStudentCurrentSemesterId(user.id)
      return await this.prisma.subject.findMany({
        where: { semesterId: currentSemesterId },
        orderBy: { subjectCode: 'asc' },
      })
    }

    return await this.prisma.subject.findMany({
      orderBy: { subjectCode: 'asc' },
    })
  }

  async findBySemester(semesterId: string, user?: AuthUser) {
    this.logger.log(`Finding subjects for semester id: ${semesterId}`)

    const canAccessSemester = await this.accessScopeService.canAccessSemester(semesterId, user)
    if (!canAccessSemester) {
      throw new NotFoundException(`Semester with id ${semesterId} not found or access denied`)
    }
    return await this.prisma.subject.findMany({
      where: this.buildSubjectWhereClause(semesterId, user),
      orderBy: { subjectCode: 'asc' },
    })
  }

  async findOneById(id: string, user?: AuthUser) {
    this.logger.log(`Finding subject by id: ${id}`)
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    })

    if (!subject) {
      throw new NotFoundException(`Subject with id ${id} not found`)
    }

    const canAccessSemester = await this.accessScopeService.canAccessSemester(
      subject.semesterId,
      user,
    )
    if (!canAccessSemester) {
      throw new NotFoundException(
        `Semester with id ${subject.semesterId} not found or access denied`,
      )
    }

    return subject
  }

  async findByCode(subjectCode: string) {
    this.logger.log(`Finding subject by code: ${subjectCode}`)
    const subject = await this.prisma.subject.findUnique({
      where: { subjectCode },
    })

    if (!subject) {
      throw new NotFoundException(`Subject with code ${subjectCode} not found`)
    }

    return subject
  }
  async findAllAssignedTeachers(subjectId: string, user?: AuthUser) {
    this.logger.log(`Finding all assigned teachers for subject id: ${subjectId}`)
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
      select: { semesterId: true },
    })
    if (!subject) {
      throw new NotFoundException(`Subject with id ${subjectId} not found`)
    }
    const canAccessSubject = await this.accessScopeService.canAccessSubject(
      subject.semesterId,
      subjectId,
      user,
    )
    if (!canAccessSubject) {
      throw new NotFoundException(`Subject with id ${subjectId} not found or access denied`)
    }
    return await this.prisma.subjectTeacher.findMany({
      where: { subjectId, isActive: true },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
      orderBy: { teacher: { name: 'asc' } },
    })
  }

  private buildSubjectWhereClause(semesterId: string, user?: AuthUser) {
    if (user?.role === Role.TEACHER) {
      return {
        semesterId,
        subjectTeachers: {
          some: {
            teacherId: user.id,
            isActive: true,
          },
        },
      }
    }

    if (user?.role === Role.STUDENT) {
      return {
        semesterId,
      }
    }

    return { semesterId }
  }
}
