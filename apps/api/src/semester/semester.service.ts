import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SemesterNumber } from '@prisma/client'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { AccessScopeService } from '@src/common/access-scope/access-scope.service'

@Injectable()
export class SemesterService {
  private readonly logger = new Logger(SemesterService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly accessScopeService: AccessScopeService,
  ) {}

  async findAll(user?: AuthUser) {
    this.logger.log('Finding all semesters')

    if (user?.role === Role.TEACHER) {
      return await this.prisma.semester.findMany({
        where: {
          subjects: {
            some: {
              subjectTeachers: {
                some: {
                  teacherId: user.id,
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: { semesterNumber: 'asc' },
      })
    }

    if (user?.role === Role.STUDENT) {
      const currentSemesterId = await this.accessScopeService.getStudentCurrentSemesterId(user.id)
      return await this.prisma.semester.findMany({
        where: { id: currentSemesterId },
      })
    }

    return await this.prisma.semester.findMany({
      orderBy: { semesterNumber: 'asc' },
    })
  }

  async findOneByNumber(semesterNumber: SemesterNumber, user?: AuthUser) {
    this.logger.log(`Finding semester by number: ${semesterNumber}`)
    const semester = await this.prisma.semester.findUnique({
      where: { semesterNumber },
    })

    if (!semester) {
      throw new NotFoundException(`Semester ${semesterNumber} not found`)
    }

    const canAccessSemester = await this.accessScopeService.canAccessSemester(semester.id, user)
    if (!canAccessSemester) {
      throw new ForbiddenException('You are not allowed to access this semester')
    }

    return semester
  }

  async findOneById(id: string, user?: AuthUser) {
    this.logger.log(`Finding semester by id: ${id}`)
    const semester = await this.prisma.semester.findUnique({
      where: { id },
    })

    if (!semester) {
      throw new NotFoundException(`Semester with id ${id} not found`)
    }

    const canAccessSemester = await this.accessScopeService.canAccessSemester(id, user)
    if (!canAccessSemester) {
      throw new ForbiddenException('You are not allowed to access this semester')
    }

    return semester
  }

  async getFirstSemester() {
    this.logger.log('Getting first semester')
    return await this.findOneByNumber(SemesterNumber.FIRST)
  }

  getNextSemester(currentSemesterNumber: SemesterNumber): SemesterNumber | null {
    const semesterOrder: SemesterNumber[] = [
      SemesterNumber.FIRST,
      SemesterNumber.SECOND,
      SemesterNumber.THIRD,
      SemesterNumber.FOURTH,
      SemesterNumber.FIFTH,
      SemesterNumber.SIXTH,
      SemesterNumber.SEVENTH,
      SemesterNumber.EIGHTH,
    ]

    const currentIndex = semesterOrder.indexOf(currentSemesterNumber)
    if (currentIndex === -1 || currentIndex === semesterOrder.length - 1) {
      return null
    }

    return semesterOrder[currentIndex + 1] ?? null
  }
}
