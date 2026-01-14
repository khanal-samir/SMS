import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SemesterNumber } from '@prisma/client'

@Injectable()
export class SemesterService {
  private readonly logger = new Logger(SemesterService.name)

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.log('Finding all semesters')
    return await this.prisma.semester.findMany({
      orderBy: { semesterNumber: 'asc' },
      include: {
        subjects: true,
      },
    })
  }

  async findOneByNumber(semesterNumber: SemesterNumber) {
    this.logger.log(`Finding semester by number: ${semesterNumber}`)
    const semester = await this.prisma.semester.findUnique({
      where: { semesterNumber },
      include: {
        subjects: true,
      },
    })

    if (!semester) {
      throw new NotFoundException(`Semester ${semesterNumber} not found`)
    }

    return semester
  }

  async findOneById(id: string) {
    this.logger.log(`Finding semester by id: ${id}`)
    const semester = await this.prisma.semester.findUnique({
      where: { id },
      include: {
        subjects: true,
      },
    })

    if (!semester) {
      throw new NotFoundException(`Semester with id ${id} not found`)
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
