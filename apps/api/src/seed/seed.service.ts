import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SemesterNumber } from '@prisma/client'

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name)

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSemesters()
    await this.seedSubjects()
  }

  private async seedSemesters() {
    this.logger.log('Seeding semesters...')

    const semesters: SemesterNumber[] = [
      SemesterNumber.FIRST,
      SemesterNumber.SECOND,
      SemesterNumber.THIRD,
      SemesterNumber.FOURTH,
      SemesterNumber.FIFTH,
      SemesterNumber.SIXTH,
      SemesterNumber.SEVENTH,
      SemesterNumber.EIGHTH,
    ]

    for (const semesterNumber of semesters) {
      await this.prisma.semester.upsert({
        where: { semesterNumber },
        update: {},
        create: { semesterNumber },
      })
    }

    this.logger.log(`Seeded ${semesters.length} semesters successfully`)
  }

  private async seedSubjects() {
    this.logger.log('Seeding subjects...')

    const semesters = await this.prisma.semester.findMany({
      orderBy: { semesterNumber: 'asc' },
    })

    const semesterIndexMap: Record<SemesterNumber, number> = {
      [SemesterNumber.FIRST]: 1,
      [SemesterNumber.SECOND]: 2,
      [SemesterNumber.THIRD]: 3,
      [SemesterNumber.FOURTH]: 4,
      [SemesterNumber.FIFTH]: 5,
      [SemesterNumber.SIXTH]: 6,
      [SemesterNumber.SEVENTH]: 7,
      [SemesterNumber.EIGHTH]: 8,
    }

    let totalSubjects = 0

    for (const semester of semesters) {
      const semesterIndex = semesterIndexMap[semester.semesterNumber]

      // Create 2 filler subjects per semester
      for (let subjectIndex = 1; subjectIndex <= 2; subjectIndex++) {
        const subjectCode = `SUB-${semesterIndex}-${subjectIndex}`
        const subjectName = `Subject ${semesterIndex}-${subjectIndex}`

        await this.prisma.subject.upsert({
          where: { subjectCode },
          update: {},
          create: {
            subjectCode,
            subjectName,
            semesterId: semester.id,
          },
        })
        totalSubjects++
      }
    }

    this.logger.log(`Seeded ${totalSubjects} subjects successfully`)
  }
}
