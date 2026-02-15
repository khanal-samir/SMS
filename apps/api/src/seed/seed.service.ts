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
        await this.seedSubjectTeachers(prisma)
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

    const subjectsData: Array<{
      subjectCode: string
      subjectName: string
      semesterNumber: SemesterNumber
    }> = [
      // Semester I
      {
        subjectCode: 'CSC109',
        subjectName: 'Introduction to Information Technology',
        semesterNumber: SemesterNumber.FIRST,
      },
      { subjectCode: 'CSC110', subjectName: 'C Programming', semesterNumber: SemesterNumber.FIRST },
      { subjectCode: 'CSC111', subjectName: 'Digital Logic', semesterNumber: SemesterNumber.FIRST },
      { subjectCode: 'MTH112', subjectName: 'Mathematics I', semesterNumber: SemesterNumber.FIRST },
      { subjectCode: 'PHY113', subjectName: 'Physics', semesterNumber: SemesterNumber.FIRST },
      // Semester II
      {
        subjectCode: 'CSC160',
        subjectName: 'Discrete Structure',
        semesterNumber: SemesterNumber.SECOND,
      },
      {
        subjectCode: 'CSC161',
        subjectName: 'Object-Oriented Programming',
        semesterNumber: SemesterNumber.SECOND,
      },
      {
        subjectCode: 'CSC162',
        subjectName: 'Microprocessor',
        semesterNumber: SemesterNumber.SECOND,
      },
      {
        subjectCode: 'MTH163',
        subjectName: 'Mathematics II',
        semesterNumber: SemesterNumber.SECOND,
      },
      { subjectCode: 'STA164', subjectName: 'Statistics I', semesterNumber: SemesterNumber.SECOND },
      // Semester III
      {
        subjectCode: 'CSC206',
        subjectName: 'Data Structure and Algorithm',
        semesterNumber: SemesterNumber.THIRD,
      },
      {
        subjectCode: 'CSC207',
        subjectName: 'Numerical Method',
        semesterNumber: SemesterNumber.THIRD,
      },
      {
        subjectCode: 'CSC208',
        subjectName: 'Computer Architecture',
        semesterNumber: SemesterNumber.THIRD,
      },
      {
        subjectCode: 'CSC209',
        subjectName: 'Computer Graphics',
        semesterNumber: SemesterNumber.THIRD,
      },
      { subjectCode: 'STA210', subjectName: 'Statistics II', semesterNumber: SemesterNumber.THIRD },
      // Semester IV
      {
        subjectCode: 'CSC257',
        subjectName: 'Theory of Computation',
        semesterNumber: SemesterNumber.FOURTH,
      },
      {
        subjectCode: 'CSC258',
        subjectName: 'Computer Networks',
        semesterNumber: SemesterNumber.FOURTH,
      },
      {
        subjectCode: 'CSC259',
        subjectName: 'Operating Systems',
        semesterNumber: SemesterNumber.FOURTH,
      },
      {
        subjectCode: 'CSC260',
        subjectName: 'Database Management System',
        semesterNumber: SemesterNumber.FOURTH,
      },
      {
        subjectCode: 'CSC261',
        subjectName: 'Artificial Intelligence',
        semesterNumber: SemesterNumber.FOURTH,
      },
      // Semester V
      {
        subjectCode: 'CSC314',
        subjectName: 'Design and Analysis of Algorithms',
        semesterNumber: SemesterNumber.FIFTH,
      },
      {
        subjectCode: 'CSC315',
        subjectName: 'System Analysis and Design',
        semesterNumber: SemesterNumber.FIFTH,
      },
      { subjectCode: 'CSC316', subjectName: 'Cryptography', semesterNumber: SemesterNumber.FIFTH },
      {
        subjectCode: 'CSC317',
        subjectName: 'Simulation and Modeling',
        semesterNumber: SemesterNumber.FIFTH,
      },
      {
        subjectCode: 'CSC318',
        subjectName: 'Web Technology',
        semesterNumber: SemesterNumber.FIFTH,
      },
      // Semester VI
      {
        subjectCode: 'CSC364',
        subjectName: 'Software Engineering',
        semesterNumber: SemesterNumber.SIXTH,
      },
      {
        subjectCode: 'CSC365',
        subjectName: 'Compiler Design and Construction',
        semesterNumber: SemesterNumber.SIXTH,
      },
      { subjectCode: 'CSC366', subjectName: 'E-Governance', semesterNumber: SemesterNumber.SIXTH },
      {
        subjectCode: 'CSC367',
        subjectName: 'NET Centric Computing',
        semesterNumber: SemesterNumber.SIXTH,
      },
      {
        subjectCode: 'CSC368',
        subjectName: 'Technical Writing',
        semesterNumber: SemesterNumber.SIXTH,
      },
      // Semester VII
      {
        subjectCode: 'CSC409',
        subjectName: 'Advanced Java Programming',
        semesterNumber: SemesterNumber.SEVENTH,
      },
      {
        subjectCode: 'CSC410',
        subjectName: 'Data Warehousing and Data Mining',
        semesterNumber: SemesterNumber.SEVENTH,
      },
      {
        subjectCode: 'CSC411',
        subjectName: 'Principles of Management',
        semesterNumber: SemesterNumber.SEVENTH,
      },
      {
        subjectCode: 'CSC412',
        subjectName: 'Project Work',
        semesterNumber: SemesterNumber.SEVENTH,
      },
      // Semester VIII
      {
        subjectCode: 'CSC461',
        subjectName: 'Advanced Database',
        semesterNumber: SemesterNumber.EIGHTH,
      },
      { subjectCode: 'CSC462', subjectName: 'Internship', semesterNumber: SemesterNumber.EIGHTH },
    ]

    for (const subject of subjectsData) {
      const semester = semesters.find((s) => s.semesterNumber === subject.semesterNumber)
      if (!semester) continue

      await prisma.subject.upsert({
        where: { subjectCode: subject.subjectCode },
        update: {},
        create: {
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          semesterId: semester.id,
        },
      })
    }

    this.logger.log(`Seeded ${subjectsData.length} subjects successfully`)
  }

  private async seedUsersAndBatches(prisma: Prisma.TransactionClient) {
    this.logger.log('Seeding batches and users...')

    const firstSemester = await prisma.semester.findUnique({
      where: { semesterNumber: SemesterNumber.FIRST },
      select: { id: true },
    })

    const eighthSemester = await prisma.semester.findUnique({
      where: { semesterNumber: SemesterNumber.EIGHTH },
      select: { id: true },
    })

    if (!firstSemester || !eighthSemester) {
      this.logger.warn('Skipping user/batch seeding: required semesters not found')
      return
    }

    const defaultPassword = await hash('12345678')

    // 4 batches: 2023 (inactive), 2024-2026 (active)
    const batches = [
      {
        batchYear: 2023,
        startDate: new Date('2023-01-15T00:00:00.000Z'),
        endDate: new Date('2026-12-31T00:00:00.000Z'),
        isActive: false,
        semesterId: eighthSemester.id,
      },
      {
        batchYear: 2024,
        startDate: new Date('2024-01-15T00:00:00.000Z'),
        endDate: new Date('2027-12-31T00:00:00.000Z'),
        isActive: true,
        semesterId: firstSemester.id,
      },
      {
        batchYear: 2025,
        startDate: new Date('2025-01-15T00:00:00.000Z'),
        endDate: new Date('2028-12-31T00:00:00.000Z'),
        isActive: true,
        semesterId: firstSemester.id,
      },
      {
        batchYear: 2026,
        startDate: new Date('2026-01-15T00:00:00.000Z'),
        endDate: new Date('2029-12-31T00:00:00.000Z'),
        isActive: true,
        semesterId: firstSemester.id,
      },
    ]

    const batchRecords = await Promise.all(
      batches.map((batch) =>
        prisma.batch.upsert({
          where: { batchYear: batch.batchYear },
          update: {
            startDate: batch.startDate,
            endDate: batch.endDate,
            currentSemesterId: batch.semesterId,
            isActive: batch.isActive,
          },
          create: {
            batchYear: batch.batchYear,
            startDate: batch.startDate,
            endDate: batch.endDate,
            totalStudents: 0,
            currentSemesterId: batch.semesterId,
            isActive: batch.isActive,
          },
        }),
      ),
    )

    const batchByYear = new Map(batchRecords.map((batch) => [batch.batchYear, batch]))

    // 1 Admin
    const adminUser = {
      name: 'Admin',
      email: 'admin@sms.com',
      role: Role.ADMIN,
      isEmailVerified: true,
      isTeacherApproved: true,
    }

    const teachers = [
      {
        name: 'Teacher One',
        email: 'teacher1@sms.com',
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      {
        name: 'Teacher Two',
        email: 'teacher2@sms.com',
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      // Approved, assigned to subjects
      {
        name: 'Teacher Three',
        email: 'teacher3@sms.com',
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      {
        name: 'Teacher Four',
        email: 'teacher4@sms.com',
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      {
        name: 'Teacher Five',
        email: 'teacher5@sms.com',
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      {
        name: 'Teacher Six',
        email: 'teacher6@sms.com',
        isEmailVerified: true,
        isTeacherApproved: true,
      },
      {
        name: 'Teacher Seven',
        email: 'teacher7@sms.com',
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      {
        name: 'Teacher Eight',
        email: 'teacher8@sms.com',
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      {
        name: 'Teacher Nine',
        email: 'teacher9@sms.com',
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      {
        name: 'Teacher Ten',
        email: 'teacher10@sms.com',
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      {
        name: 'Teacher Eleven',
        email: 'teacher11@sms.com',
        isEmailVerified: true,
        isTeacherApproved: false,
      },
      {
        name: 'Teacher Twelve',
        email: 'teacher12@sms.com',
        isEmailVerified: true,
        isTeacherApproved: false,
      },
    ]

    // 40 Students: 10 per batch
    const studentNames = [
      'Aarav',
      'Aanya',
      'Arjun',
      'Ananya',
      'Aditya',
      'Aadhira',
      'Arnav',
      'Avni',
      'Ayush',
      'Aria',
    ]

    const students: Array<{ name: string; email: string; batchYear: number }> = []
    for (let i = 0; i < 10; i++) {
      for (const year of [2023, 2024, 2025, 2026]) {
        students.push({
          name: `${studentNames[i % studentNames.length]} ${year}`,
          email: `student${i + 1}_${year}@sms.com`,
          batchYear: year,
        })
      }
    }

    const allUsers: Array<{
      name: string
      email: string
      role: Role
      isEmailVerified: boolean
      isTeacherApproved: boolean
      batchYear?: number
    }> = [
      adminUser,
      ...teachers.map((t) => ({ ...t, role: Role.TEACHER })),
      ...students.map((s) => ({
        ...s,
        role: Role.STUDENT,
        isEmailVerified: true,
        isTeacherApproved: false,
      })),
    ]

    for (const user of allUsers) {
      const userBatchYear = 'batchYear' in user ? user.batchYear : undefined
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isTeacherApproved: user.isTeacherApproved,
          password: defaultPassword,
          provider: 'LOCAL',
          batchId: userBatchYear ? (batchByYear.get(userBatchYear)?.id ?? null) : null,
        },
        create: {
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isTeacherApproved: user.isTeacherApproved,
          password: defaultPassword,
          provider: 'LOCAL',
          batchId: userBatchYear ? (batchByYear.get(userBatchYear)?.id ?? null) : null,
        },
        select: { id: true },
      })
    }

    // Create student semesters for active batches
    const studentRecords = await prisma.user.findMany({
      where: {
        email: { in: students.map((s) => s.email) },
      },
      select: { id: true, batchId: true },
    })

    for (const batch of batchRecords) {
      const batchStudents = studentRecords.filter((s) => s.batchId === batch.id)

      if (batch.isActive && batch.currentSemesterId) {
        await prisma.studentSemester.createMany({
          data: batchStudents.map((student) => ({
            studentId: student.id,
            semesterId: batch.currentSemesterId!,
            status: 'ACTIVE' as const,
          })),
          skipDuplicates: true,
        })
      }

      await prisma.batch.update({
        where: { id: batch.id },
        data: { totalStudents: batchStudents.length },
      })
    }

    this.logger.log('Seeded batches and users successfully')
  }

  private async seedSubjectTeachers(prisma: Prisma.TransactionClient) {
    this.logger.log('Seeding subject teachers...')

    // Only approved teachers can be assigned to subjects
    const approvedTeacherEmails = [
      'teacher1@sms.com',
      'teacher2@sms.com',
      'teacher3@sms.com',
      'teacher4@sms.com',
    ]

    const teachers = await prisma.user.findMany({
      where: { email: { in: approvedTeacherEmails } },
      select: { id: true, email: true },
    })

    const subjects = await prisma.subject.findMany({
      select: { id: true, subjectCode: true },
    })

    // Assign 1-2 teachers to each subject (distribute teachers evenly)
    const subjectTeacherData: Array<{ subjectId: string; teacherId: string }> = []

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i]
      // Assign 1-2 teachers based on subject index
      const teacherCount = i % 3 === 0 ? 2 : 1 // Every 3rd subject gets 2 teachers

      for (let j = 0; j < teacherCount; j++) {
        const teacherIndex = (i + j) % teachers.length
        subjectTeacherData.push({
          subjectId: subject.id,
          teacherId: teachers[teacherIndex].id,
        })
      }
    }

    await prisma.subjectTeacher.createMany({
      data: subjectTeacherData,
      skipDuplicates: true,
    })

    this.logger.log(`Seeded ${subjectTeacherData.length} subject-teacher assignments`)
  }
}
