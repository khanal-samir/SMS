import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, Role, SemesterNumber } from '@prisma/client'
import { hash } from 'argon2'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development'
    if (!isDevelopment) {
      this.logger.warn('Skipping seed: not in development environment')
      return
    }

    await this.prisma.$transaction(
      async (prisma) => {
        await this.seedSemesters(prisma)
        await this.seedSubjects(prisma)
        await this.seedUsersAndBatches(prisma)
      },
      { timeout: 360000 },
    )
  }

  private async seedSemesters(prisma: Prisma.TransactionClient) {
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
      await prisma.semester.upsert({
        where: { semesterNumber },
        update: {},
        create: { semesterNumber },
      })
    }

    this.logger.log(`Seeded ${semesters.length} semesters successfully`)
  }

  private async seedSubjects(prisma: Prisma.TransactionClient) {
    this.logger.log('Seeding subjects...')

    const semesters = await prisma.semester.findMany({
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

        await prisma.subject.upsert({
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

  private async seedUsersAndBatches(prisma: Prisma.TransactionClient) {
    this.logger.log('Seeding batches and users...')

    const firstSemester = await prisma.semester.findUnique({
      where: { semesterNumber: SemesterNumber.FIRST },
      select: { id: true },
    })

    if (!firstSemester) {
      this.logger.warn('Skipping user/batch seeding: FIRST semester not found')
      return
    }

    const defaultPassword = await hash('12345678')

    const batches = [
      {
        batchYear: 2024,
        startDate: new Date('2024-01-15T00:00:00.000Z'),
        endDate: new Date('2027-12-31T00:00:00.000Z'),
      },
      {
        batchYear: 2025,
        startDate: new Date('2025-01-15T00:00:00.000Z'),
        endDate: new Date('2028-12-31T00:00:00.000Z'),
      },
    ]

    const batchRecords = await Promise.all(
      batches.map((batch) =>
        prisma.batch.upsert({
          where: { batchYear: batch.batchYear },
          update: {
            startDate: batch.startDate,
            endDate: batch.endDate,
            currentSemesterId: firstSemester.id,
            isActive: true,
          },
          create: {
            batchYear: batch.batchYear,
            startDate: batch.startDate,
            endDate: batch.endDate,
            totalStudents: 0,
            currentSemesterId: firstSemester.id,
            isActive: true,
          },
        }),
      ),
    )

    const batchByYear = new Map(batchRecords.map((batch) => [batch.batchYear, batch.id]))

    const users = [
      {
        name: 'Samir Admin',
        email: 'samir@gmail.com',
        role: Role.ADMIN,
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      {
        name: 'Aarav Teacher',
        email: 'teacher1@gmail.com',
        role: Role.TEACHER,
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      {
        name: 'Mina Teacher',
        email: 'teacher2@gmail.com',
        role: Role.TEACHER,
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      {
        name: 'Ishaan Teacher',
        email: 'teacher3@gmail.com',
        role: Role.TEACHER,
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      {
        name: 'Student One',
        email: 'student1@gmail.com',
        role: Role.STUDENT,
        isEmailVerified: true,
        isTeacherApproved: false,
        batchYear: 2024,
      },
      {
        name: 'Student Two',
        email: 'student2@gmail.com',
        role: Role.STUDENT,
        isEmailVerified: true,
        isTeacherApproved: false,
        batchYear: 2024,
      },
      {
        name: 'Student Three',
        email: 'student3@gmail.com',
        role: Role.STUDENT,
        isEmailVerified: true,
        isTeacherApproved: false,
        batchYear: 2024,
      },
      {
        name: 'Student Four',
        email: 'student4@gmail.com',
        role: Role.STUDENT,
        isEmailVerified: true,
        isTeacherApproved: false,
        batchYear: 2025,
      },
      {
        name: 'Student Five',
        email: 'student5@gmail.com',
        role: Role.STUDENT,
        isEmailVerified: true,
        isTeacherApproved: false,
        batchYear: 2025,
      },
      {
        name: 'Student Six',
        email: 'student6@gmail.com',
        role: Role.STUDENT,
        isEmailVerified: true,
        isTeacherApproved: false,
        batchYear: 2025,
      },
    ]

    await Promise.all(
      users.map((user) =>
        prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isTeacherApproved: user.isTeacherApproved,
            password: defaultPassword,
            provider: 'LOCAL',
            batchId: user.batchYear ? batchByYear.get(user.batchYear) : null,
          },
          create: {
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isTeacherApproved: user.isTeacherApproved,
            password: defaultPassword,
            provider: 'LOCAL',
            batchId: user.batchYear ? batchByYear.get(user.batchYear) : null,
          },
          select: { id: true },
        }),
      ),
    )

    //only the one we created
    const students = await prisma.user.findMany({
      where: {
        email: { in: users.filter((user) => user.role === Role.STUDENT).map((u) => u.email) },
      },
      select: { id: true, batchId: true },
    })

    if (students.length > 0) {
      await prisma.studentSemester.createMany({
        data: students
          .filter((student) => student.batchId)
          .map((student) => ({
            studentId: student.id,
            semesterId: firstSemester.id,
            status: 'ACTIVE',
          })),
        skipDuplicates: true,
      })
    }

    await Promise.all(
      batchRecords.map((batch) =>
        prisma.batch.update({
          where: { id: batch.id },
          data: {
            totalStudents: students.filter((student) => student.batchId === batch.id).length,
          },
        }),
      ),
    )

    this.logger.log('Seeded batches and users successfully')
  }
}
