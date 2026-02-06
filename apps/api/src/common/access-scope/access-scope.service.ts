import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'

@Injectable()
export class AccessScopeService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentCurrentSemesterId(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId, role: Role.STUDENT },
      select: {
        batch: {
          select: {
            currentSemesterId: true,
          },
        },
      },
    })

    const currentSemesterId = student?.batch?.currentSemesterId ?? null
    if (!currentSemesterId) {
      throw new BadRequestException('Student has no current semester assigned')
    }

    return currentSemesterId
  }

  async canAccessSemester(semesterId: string, user?: AuthUser): Promise<boolean> {
    if (!user || user.role === Role.ADMIN) {
      return true
    }

    if (user.role === Role.STUDENT) {
      const currentSemesterId = await this.getStudentCurrentSemesterId(user.id)
      return currentSemesterId === semesterId
    }

    if (user.role === Role.TEACHER) {
      const assignmentCount = await this.prisma.subjectTeacher.count({
        where: {
          teacherId: user.id,
          isActive: true,
          subject: {
            semesterId,
          },
        },
      })

      return assignmentCount > 0
    }

    return false
  }

  async canAccessSubject(semesterId: string, subjectId: string, user?: AuthUser): Promise<boolean> {
    if (!user || user.role === Role.ADMIN) {
      return true
    }

    if (user.role === Role.STUDENT) {
      const currentSemesterId = await this.getStudentCurrentSemesterId(user.id)
      return currentSemesterId === semesterId
    }

    if (user.role === Role.TEACHER) {
      const assignment = await this.prisma.subjectTeacher.findUnique({
        where: {
          subjectId_teacherId: {
            subjectId,
            teacherId: user.id,
          },
        },
      })

      return Boolean(assignment?.isActive)
    }

    return false
  }
}
