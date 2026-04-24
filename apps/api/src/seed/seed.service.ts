import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, Role, SemesterNumber } from '@prisma/client'
import { hash } from 'argon2'
import { ConfigService } from '@nestjs/config'

type SeedStudent = {
  name: string
  email: string
}

type SeedTeacher = {
  name: string
  email: string
  isEmailVerified: boolean
  isTeacherApproved: boolean
}

const DEFAULT_PASSWORD = '12345678'

function createStudents(startRoll: number, count: number): SeedStudent[] {
  return Array.from({ length: count }, (_, index) => {
    const rollNumber = startRoll + index
    const name = `student${rollNumber}`

    return {
      name,
      email: `${name}@pnc.com`,
    }
  })
}

const TEACHER_CONFIG: SeedTeacher[] = [
  {
    name: 'Ramesh Adhikari',
    email: 'ramesh.adhikari@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: true,
  },
  {
    name: 'Sushmita Karki',
    email: 'sushmita.karki@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: true,
  },
  {
    name: 'Bikash Shrestha',
    email: 'bikash.shrestha@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: true,
  },
  {
    name: 'Anjana Poudel',
    email: 'anjana.poudel@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: true,
  },
  {
    name: 'Dipendra Gautam',
    email: 'dipendra.gautam@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: true,
  },
  {
    name: 'Pratima Regmi',
    email: 'pratima.regmi@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: true,
  },
  {
    name: 'Niraj Bhandari',
    email: 'niraj.bhandari@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: false,
  },
  {
    name: 'Kabita Gurung',
    email: 'kabita.gurung@pnc.com',
    isEmailVerified: true,
    isTeacherApproved: false,
  },
]

// Canonical semester progression (index 0 = Semester I)
const SEMESTER_ORDER: SemesterNumber[] = [
  SemesterNumber.FIRST,
  SemesterNumber.SECOND,
  SemesterNumber.THIRD,
  SemesterNumber.FOURTH,
  SemesterNumber.FIFTH,
  SemesterNumber.SIXTH,
  SemesterNumber.SEVENTH,
  SemesterNumber.EIGHTH,
]

// ─── Batch + student + content configuration ───────────────────────────────

const BATCH_CONFIG = [
  {
    batchYear: 2082,
    startDate: new Date('2026-01-15T00:00:00.000Z'),
    endDate: new Date('2029-12-31T00:00:00.000Z'),
    isActive: true,
    currentSemesterNumber: SemesterNumber.FIRST,
    students: createStudents(20820, 10),
    assignments: [
      {
        subjectCode: 'CSC109',
        title: 'Lab Report: Hardware Components Survey',
        description:
          'Survey and document 10 hardware components with their full specifications, manufacturers, and real-world use cases.',
        dueDaysFromNow: 14,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC110',
        title: 'C Programming: Factorial & Fibonacci Series',
        description:
          'Write C programs to compute and print the factorial of a given number and the Fibonacci series up to N terms using loops and recursion.',
        dueDaysFromNow: 21,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC111',
        title: 'Digital Logic: Boolean Algebra Simplification',
        description:
          'Simplify five Boolean expressions using algebraic laws and verify each result using a Karnaugh map.',
        dueDaysFromNow: 28,
        status: 'DRAFT' as const,
      },
    ],
    announcements: [
      {
        title: 'Semester I Orientation Schedule - 2082/10/05 BS',
        message:
          'Batch 2082 students of Semester I should report to the main auditorium on 2082/10/05 BS at 10:00 AM for orientation, ID verification, and class briefing.',
      },
      {
        title: 'Semester I Internal Exam Begins - 2083/01/12 BS',
        message:
          'The first internal examination for Semester I starts from 2083/01/12 BS. Students should check the department notice board for the detailed routine.',
      },
      {
        title: 'Library Registration Window - Until 2082/11/15 BS',
        message:
          'Semester I students must complete library registration by 2082/11/15 BS using their college ID card and admission slip.',
      },
    ],
  },
  {
    batchYear: 2081,
    startDate: new Date('2025-01-15T00:00:00.000Z'),
    endDate: new Date('2028-12-31T00:00:00.000Z'),
    isActive: true,
    currentSemesterNumber: SemesterNumber.THIRD,
    students: createStudents(20810, 10),
    assignments: [
      {
        subjectCode: 'CSC206',
        title: 'DSA: Implement AVL Tree with Rotations',
        description:
          'Implement a self-balancing AVL tree in C supporting insert, delete, and all four rotation cases (LL, RR, LR, RL). Include test cases demonstrating balance maintenance.',
        dueDaysFromNow: -7,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC207',
        title: 'Numerical Methods: Newton–Raphson Root Finding',
        description:
          'Apply the Newton–Raphson iteration method to find roots of three given polynomial equations. Document each step, the convergence rate, and error analysis.',
        dueDaysFromNow: 7,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC209',
        title: 'Computer Graphics: Scanline Fill Algorithm',
        description:
          'Implement the scanline polygon fill algorithm and demonstrate it on at least two non-convex polygons. Show the active edge list at each scan line.',
        dueDaysFromNow: 18,
        status: 'DRAFT' as const,
      },
    ],
    announcements: [
      {
        title: 'Semester III Mid-Term Routine - 2082/12/18 BS',
        message:
          'Mid-term examinations for Semester III begin on 2082/12/18 BS. Students should complete all lab submissions before the exam week starts.',
      },
      {
        title: 'Guest Lecture on ML Practice - 2082/12/10 BS',
        message:
          'Semester III students are invited to a machine learning guest lecture on 2082/12/10 BS at 11:00 AM in Seminar Hall B. Attendance will count toward internal participation.',
      },
      {
        title: 'Project Group Registration Deadline - 2082/12/22 BS',
        message:
          'Semester III students must register their project groups through the portal by 2082/12/22 BS. Each group should have 4 to 5 members.',
      },
    ],
  },
  {
    batchYear: 2080,
    startDate: new Date('2024-01-15T00:00:00.000Z'),
    endDate: new Date('2027-12-31T00:00:00.000Z'),
    isActive: true,
    currentSemesterNumber: SemesterNumber.FIFTH,
    students: createStudents(2080, 10),
    assignments: [
      {
        subjectCode: 'CSC314',
        title: 'DAA: Travelling Salesman – Dynamic Programming',
        description:
          'Solve the Travelling Salesman Problem for a 6-city instance using dynamic programming (Held-Karp algorithm). Provide time and space complexity analysis.',
        dueDaysFromNow: -10,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC318',
        title: 'Web Technology: Build a REST API with Node.js',
        description:
          'Create a RESTful API for a task management system using Node.js and Express. Implement CRUD endpoints with proper HTTP status codes and input validation.',
        dueDaysFromNow: 10,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC315',
        title: 'System Analysis: Use Case Diagram for Library System',
        description:
          'Draw a complete use case diagram for a library management system covering all actors (librarian, member, admin) and their interactions with the system.',
        dueDaysFromNow: -5,
        status: 'PAST_DUE' as const,
      },
    ],
    announcements: [
      {
        title: 'Semester IV Results Published - 2082/11/28 BS',
        message:
          'Semester IV examination results are available in the portal from 2082/11/28 BS. Re-totaling requests must be submitted within 7 working days.',
      },
      {
        title: 'Industrial Visit Registration - 2082/12/25 BS',
        message:
          'Semester V students can register for the industrial visit through the portal until 2082/12/25 BS. Seats will be confirmed on a first-come basis.',
      },
      {
        title: 'Semester V Elective Selection Open - 2082/12/14 BS',
        message:
          'Elective subject selection for Semester V is open from 2082/12/14 BS. Students must finalize their choices before the closing notice from the department.',
      },
    ],
  },
  {
    batchYear: 2079,
    startDate: new Date('2023-01-15T00:00:00.000Z'),
    endDate: new Date('2026-12-31T00:00:00.000Z'),
    isActive: true,
    currentSemesterNumber: SemesterNumber.SEVENTH,
    students: createStudents(20790, 10),
    assignments: [
      {
        subjectCode: 'CSC409',
        title: 'Advanced Java: Microservices with Spring Boot',
        description:
          'Build two independent microservices that communicate via REST using Spring Boot. Document the API contracts and demonstrate inter-service communication.',
        dueDaysFromNow: -14,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC410',
        title: 'Data Warehousing: Star Schema Design',
        description:
          'Design a star schema for a retail sales data warehouse including at least four dimension tables (Product, Customer, Date, Store) and one central fact table.',
        dueDaysFromNow: 7,
        status: 'PUBLISHED' as const,
      },
      {
        subjectCode: 'CSC412',
        title: 'Project Work: Final System Design Document',
        description:
          'Submit the complete system design document for your final year project. Must include architecture diagrams, ER diagrams, module-level breakdown, and technology stack justification.',
        dueDaysFromNow: 21,
        status: 'DRAFT' as const,
      },
    ],
    announcements: [
      {
        title: 'Final Year Project Defense Window - 2083/01/20 BS',
        message:
          'Semester VII project defense preparation starts from 2083/01/20 BS. Groups must submit their final draft report to the department before the defense slot is assigned.',
      },
      {
        title: 'Campus Placement Drive Notice - 2083/01/08 BS',
        message:
          'Eligible Semester VII students should submit updated CVs to the placement cell by 2083/01/08 BS for the upcoming campus recruitment drive.',
      },
      {
        title: 'Semester VII Internal Evaluation Guideline - 2082/12/30 BS',
        message:
          'The internal evaluation guideline for Semester VII has been published on 2082/12/30 BS. Students need minimum 80% attendance to remain exam eligible.',
      },
    ],
  },
] as const

const GLOBAL_ANNOUNCEMENTS = [
  {
    title: 'Welcome to the New Academic Session 2082/83 BS',
    message:
      'The college administration welcomes all students and faculty to the academic session 2082/83 BS. Regular attendance from the first teaching day is mandatory.',
  },
  {
    title: 'Important: Fee Payment Deadline - 2082/12/29 BS',
    message:
      'All students are reminded that tuition and examination fees must be cleared by 2082/12/29 BS. Late payments will be charged according to campus rules.',
  },
]

// ─── Seed service ────────────────────────────────────────────────────────────

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
        await this.seedAssignmentsAndAnnouncements(prisma)
      },
      { timeout: 360000 },
    )
  }

  // ── Step 1: Upsert all 8 semester records ──────────────────────────────────

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

  // ── Step 2: Upsert all 36 subjects across 8 semesters ─────────────────────

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

  // ── Step 3: Batches, users, and full semester history ──────────────────────

  private async seedUsersAndBatches(prisma: Prisma.TransactionClient) {
    this.logger.log('Seeding batches and users...')

    // Build a semesterNumber → id lookup map
    const allSemesters = await prisma.semester.findMany({
      select: { id: true, semesterNumber: true },
    })
    const semesterMap = new Map(allSemesters.map((s) => [s.semesterNumber, s.id]))

    const defaultPassword = await hash(DEFAULT_PASSWORD)

    // ── Batches ──────────────────────────────────────────────────────────────

    const batchRecords = await Promise.all(
      BATCH_CONFIG.map(({ batchYear, startDate, endDate, isActive, currentSemesterNumber }) => {
        const currentSemesterId = semesterMap.get(currentSemesterNumber)!
        return prisma.batch.upsert({
          where: { batchYear },
          update: { startDate, endDate, currentSemesterId, isActive },
          create: {
            batchYear,
            startDate,
            endDate,
            totalStudents: 0,
            currentSemesterId,
            isActive,
          },
        })
      }),
    )

    // One chat group per batch
    await Promise.all(
      batchRecords.map((batch) =>
        prisma.chatGroup.upsert({
          where: { batchId: batch.id },
          update: { name: `Batch ${batch.batchYear} Chat` },
          create: { batchId: batch.id, name: `Batch ${batch.batchYear} Chat` },
        }),
      ),
    )

    const batchByYear = new Map(batchRecords.map((b) => [b.batchYear, b]))

    // ── Admin ────────────────────────────────────────────────────────────────

    await prisma.user.upsert({
      where: { email: 'admin@pnc.com' },
      update: {
        name: 'PNC Admin',
        role: Role.ADMIN,
        isEmailVerified: true,
        isTeacherApproved: true,
        password: defaultPassword,
        provider: 'LOCAL',
      },
      create: {
        name: 'Admin',
        email: 'admin@pnc.com',
        role: Role.ADMIN,
        isEmailVerified: true,
        isTeacherApproved: true,
        password: defaultPassword,
        provider: 'LOCAL',
      },
      select: { id: true },
    })

    // ── Teachers ─────────────────────────────────────────────────────────────

    for (const teacher of TEACHER_CONFIG) {
      await prisma.user.upsert({
        where: { email: teacher.email },
        update: {
          name: teacher.name,
          role: Role.TEACHER,
          isEmailVerified: teacher.isEmailVerified,
          isTeacherApproved: teacher.isTeacherApproved,
          password: defaultPassword,
          provider: 'LOCAL',
          batchId: null,
        },
        create: {
          name: teacher.name,
          email: teacher.email,
          role: Role.TEACHER,
          isEmailVerified: teacher.isEmailVerified,
          isTeacherApproved: teacher.isTeacherApproved,
          password: defaultPassword,
          provider: 'LOCAL',
        },
        select: { id: true },
      })
    }

    // ── Students ─────────────────────────────────────────────────────────────

    for (const batchCfg of BATCH_CONFIG) {
      const batch = batchByYear.get(batchCfg.batchYear)!
      for (const student of batchCfg.students) {
        await prisma.user.upsert({
          where: { email: student.email },
          update: {
            name: student.name,
            role: Role.STUDENT,
            isEmailVerified: true,
            isTeacherApproved: false,
            password: defaultPassword,
            provider: 'LOCAL',
            batchId: batch.id,
          },
          create: {
            name: student.name,
            email: student.email,
            role: Role.STUDENT,
            isEmailVerified: true,
            isTeacherApproved: false,
            password: defaultPassword,
            provider: 'LOCAL',
            batchId: batch.id,
          },
          select: { id: true },
        })
      }
    }

    // ── Semester history ──────────────────────────────────────────────────────
    //
    // Rule: a student currently in semester N has:
    //   • COMPLETED records for semesters 1 … N-1
    //   • ACTIVE   record  for semester N
    //
    // Enrollment dates are staggered 6 months apart starting from batch start.

    const allStudentEmails = BATCH_CONFIG.flatMap((b) => b.students.map((s) => s.email))
    const studentRecords = await prisma.user.findMany({
      where: { email: { in: allStudentEmails } },
      select: { id: true, batchId: true },
    })

    // Clear previous semester logs for these students before rebuilding
    await prisma.studentSemester.deleteMany({
      where: { studentId: { in: studentRecords.map((s) => s.id) } },
    })

    for (const batchCfg of BATCH_CONFIG) {
      const batch = batchByYear.get(batchCfg.batchYear)!
      const batchStudents = studentRecords.filter((s) => s.batchId === batch.id)
      const currentSemIdx = SEMESTER_ORDER.indexOf(batchCfg.currentSemesterNumber)

      const semesterLogData: Prisma.StudentSemesterCreateManyInput[] = []

      for (let i = 0; i <= currentSemIdx; i++) {
        const semNumber = SEMESTER_ORDER[i]
        if (!semNumber) continue
        const semId = semesterMap.get(semNumber)
        if (!semId) continue

        const isCurrentSem = i === currentSemIdx

        // Stagger enrollment date: batch start + (i × 6 months)
        const enrolledAt = new Date(batchCfg.startDate)
        enrolledAt.setMonth(enrolledAt.getMonth() + i * 6)

        for (const student of batchStudents) {
          semesterLogData.push({
            studentId: student.id,
            semesterId: semId,
            enrolledAt,
            status: isCurrentSem ? 'ACTIVE' : 'COMPLETED',
          })
        }
      }

      await prisma.studentSemester.createMany({ data: semesterLogData, skipDuplicates: true })

      await prisma.batch.update({
        where: { id: batch.id },
        data: { totalStudents: batchStudents.length },
      })
    }

    this.logger.log('Seeded batches and users successfully')
  }

  // ── Step 4: Assign approved teachers to all subjects ──────────────────────

  private async seedSubjectTeachers(prisma: Prisma.TransactionClient) {
    this.logger.log('Seeding subject teachers...')

    const approvedTeacherEmails = TEACHER_CONFIG.filter((teacher) => teacher.isTeacherApproved).map(
      (teacher) => teacher.email,
    )

    const teachers = await prisma.user.findMany({
      where: { email: { in: approvedTeacherEmails } },
      select: { id: true, email: true },
    })

    const subjects = await prisma.subject.findMany({
      select: { id: true, subjectCode: true },
    })

    // Every 3rd subject gets 2 teachers; the rest get 1 (round-robin across teachers)
    const subjectTeacherData: Array<{ subjectId: string; teacherId: string }> = []

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i]
      if (!subject) continue
      const teacherCount = i % 3 === 0 ? 2 : 1

      for (let j = 0; j < teacherCount; j++) {
        const teacher = teachers[(i + j) % teachers.length]
        if (!teacher) continue
        subjectTeacherData.push({ subjectId: subject.id, teacherId: teacher.id })
      }
    }

    await prisma.subjectTeacher.createMany({
      data: subjectTeacherData,
      skipDuplicates: true,
    })

    this.logger.log(`Seeded ${subjectTeacherData.length} subject-teacher assignments`)
  }

  // ── Step 5: Assignments and announcements per batch ───────────────────────

  private async seedAssignmentsAndAnnouncements(prisma: Prisma.TransactionClient) {
    this.logger.log('Seeding assignments and announcements...')

    const admin = await prisma.user.findUnique({
      where: { email: 'admin@pnc.com' },
      select: { id: true },
    })

    if (!admin) {
      this.logger.warn('Skipping assignments/announcements: admin user not found')
      return
    }

    const batchRecords = await prisma.batch.findMany({
      where: { batchYear: { in: BATCH_CONFIG.map((b) => b.batchYear) } },
      select: { id: true, batchYear: true },
    })

    const batchByYear = new Map(batchRecords.map((b) => [b.batchYear, b]))
    const batchIds = batchRecords.map((b) => b.id)

    // Clear previous assignments and announcements before rebuilding
    await prisma.assignment.deleteMany({ where: { batchId: { in: batchIds } } })
    await prisma.announcement.deleteMany({
      where: { OR: [{ batchId: { in: batchIds } }, { batchId: null }] },
    })

    const today = new Date()

    // ── Assignments ───────────────────────────────────────────────────────────

    for (const batchCfg of BATCH_CONFIG) {
      const batch = batchByYear.get(batchCfg.batchYear)
      if (!batch) continue

      for (const asgn of batchCfg.assignments) {
        // Find any active subjectTeacher link for this subject
        const subjectTeacher = await prisma.subjectTeacher.findFirst({
          where: { subject: { subjectCode: asgn.subjectCode }, isActive: true },
          select: { id: true },
        })

        if (!subjectTeacher) {
          this.logger.warn(
            `No subjectTeacher found for ${asgn.subjectCode} — skipping assignment "${asgn.title}"`,
          )
          continue
        }

        const dueDate = new Date(today)
        dueDate.setDate(dueDate.getDate() + asgn.dueDaysFromNow)

        await prisma.assignment.create({
          data: {
            title: asgn.title,
            description: asgn.description,
            dueDate,
            status: asgn.status,
            subjectTeacherId: subjectTeacher.id,
            batchId: batch.id,
          },
        })
      }
    }

    // ── Batch-specific announcements ──────────────────────────────────────────

    for (const batchCfg of BATCH_CONFIG) {
      const batch = batchByYear.get(batchCfg.batchYear)
      if (!batch) continue

      for (const ann of batchCfg.announcements) {
        await prisma.announcement.create({
          data: {
            title: ann.title,
            message: ann.message,
            createdById: admin.id,
            isPublished: true,
            publishedAt: new Date(),
            batchId: batch.id,
          },
        })
      }
    }

    // ── Global announcements (visible to all) ─────────────────────────────────

    for (const ann of GLOBAL_ANNOUNCEMENTS) {
      await prisma.announcement.create({
        data: {
          title: ann.title,
          message: ann.message,
          createdById: admin.id,
          isPublished: true,
          publishedAt: new Date(),
          batchId: null,
        },
      })
    }

    this.logger.log('Seeded assignments and announcements successfully')
  }
}
