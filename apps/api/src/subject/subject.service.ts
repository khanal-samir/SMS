import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SubjectService {
  private readonly logger = new Logger(SubjectService.name)

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.log('Finding all subjects')
    return await this.prisma.subject.findMany({
      include: {
        semester: true,
      },
      orderBy: { subjectCode: 'asc' },
    })
  }

  async findBySemester(semesterId: string) {
    this.logger.log(`Finding subjects for semester id: ${semesterId}`)

    const semester = await this.prisma.semester.findUnique({
      where: { id: semesterId },
    })

    if (!semester) {
      throw new NotFoundException(`Semester with id ${semesterId} not found`)
    }

    return await this.prisma.subject.findMany({
      where: { semesterId },
      include: {
        semester: true,
      },
      orderBy: { subjectCode: 'asc' },
    })
  }

  async findOneById(id: string) {
    this.logger.log(`Finding subject by id: ${id}`)
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        semester: true,
        subjectTeachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!subject) {
      throw new NotFoundException(`Subject with id ${id} not found`)
    }

    return subject
  }

  async findByCode(subjectCode: string) {
    this.logger.log(`Finding subject by code: ${subjectCode}`)
    const subject = await this.prisma.subject.findUnique({
      where: { subjectCode },
      include: {
        semester: true,
      },
    })

    if (!subject) {
      throw new NotFoundException(`Subject with code ${subjectCode} not found`)
    }

    return subject
  }
}
