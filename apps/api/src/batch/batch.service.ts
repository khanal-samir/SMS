import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from 'src/prisma/prisma.service'
import { SemesterService } from 'src/semester/semester.service'
import { CreateBatchDto, EnrollStudentDto } from './dto'
import { StudentEnrolledEvent, STUDENT_ENROLLED_EVENT } from './events'
import { Role, StudentSemesterStatus } from '@prisma/client'

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly semesterService: SemesterService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createBatchDto: CreateBatchDto) {
    this.logger.log(`Creating batch for year: ${createBatchDto.batchYear}`)

    // Check if batch already exists for this year
    const existingBatch = await this.prisma.batch.findUnique({
      where: { batchYear: createBatchDto.batchYear },
    })

    if (existingBatch) {
      throw new ConflictException(`Batch for year ${createBatchDto.batchYear} already exists`)
    }

    // Get the first semester
    const firstSemester = await this.semesterService.getFirstSemester()

    const batch = await this.prisma.batch.create({
      data: {
        batchYear: createBatchDto.batchYear,
        startDate: new Date(String(createBatchDto.startDate)),
        endDate: createBatchDto.endDate ? new Date(String(createBatchDto.endDate)) : null,
        totalStudents: 0,
        currentSemesterId: firstSemester.id,
        isActive: true,
      },
    })

    this.logger.log(
      `Created batch: ${batch.id} with initial semester: ${firstSemester.semesterNumber}`,
    )
    return batch
  }

  async findAll() {
    this.logger.log('Finding all batches')
    return await this.prisma.batch.findMany({
      orderBy: { batchYear: 'desc' },
    })
  }

  async findOne(id: string) {
    this.logger.log(`Finding batch by id: ${id}`)
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    })

    if (!batch) {
      throw new NotFoundException(`Batch with id ${id} not found`)
    }

    return batch
  }

  async enrollStudent(batchId: string, enrollStudentDto: EnrollStudentDto) {
    this.logger.log(`Enrolling student: ${enrollStudentDto.studentId} in batch: ${batchId}`)

    // Verify batch exists and is active
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId, isActive: true },
    })

    if (!batch) {
      throw new NotFoundException(`Batch with id ${batchId} not found or is not active`)
    }

    // Verify student exists and is a student role
    const student = await this.prisma.user.findUnique({
      where: { id: enrollStudentDto.studentId, role: Role.STUDENT },
    })

    if (!student) {
      throw new NotFoundException(
        `Student with id ${enrollStudentDto.studentId} not found or is not a student`,
      )
    }

    if (student.batchId) {
      throw new ConflictException(
        `Student ${enrollStudentDto.studentId} is already enrolled in a batch`,
      )
    }

    const updatedStudent = await this.prisma.$transaction(async (tx) => {
      const student = await tx.user.update({
        where: { id: enrollStudentDto.studentId },
        data: {
          batchId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          batchId: true,
        },
      })
      await tx.batch.update({
        where: { id: batchId },
        data: { totalStudents: { increment: 1 } },
      })

      return student
    })

    // Emit the student enrolled event
    this.eventEmitter.emit(
      STUDENT_ENROLLED_EVENT,
      new StudentEnrolledEvent(enrollStudentDto.studentId, batchId),
    )

    this.logger.log(
      `Successfully enrolled student: ${enrollStudentDto.studentId} in batch: ${batchId}`,
    )
    return updatedStudent
  }

  async advanceSemester(batchId: string) {
    this.logger.log(`Advancing semester for batch: ${batchId}`)
    return this.prisma.$transaction(async (tx) => {
      const batch = await tx.batch.findUnique({
        where: { id: batchId, isActive: true },
        include: {
          currentSemester: true,
        },
      })

      if (!batch) {
        throw new NotFoundException(`Batch with id ${batchId} not found or is not active`)
      }

      if (!batch.currentSemester) {
        throw new BadRequestException(`Batch ${batchId} has no current semester`)
      }

      // Return only enum
      const nextSemesterNumber = this.semesterService.getNextSemester(
        batch.currentSemester.semesterNumber,
      )

      if (!nextSemesterNumber) {
        throw new BadRequestException(`Batch ${batchId} is already in the final semester (EIGHTH)`)
      }
      const nextSemester = await tx.semester.findUnique({
        where: { semesterNumber: nextSemesterNumber },
        select: { id: true, semesterNumber: true },
      })

      if (!nextSemester) {
        throw new NotFoundException(`Semester ${nextSemesterNumber} not found`)
      }

      const [updatedBatch] = await Promise.all([
        // update batch current semester
        tx.batch.update({
          where: { id: batchId },
          data: {
            currentSemesterId: nextSemester.id,
          },
          select: {
            id: true,
            batchYear: true,
            currentSemesterId: true,
          },
        }),
        // update all active student semesters in this batch to completed
        tx.studentSemester.updateMany({
          where: {
            semesterId: batch.currentSemesterId!,
            status: StudentSemesterStatus.ACTIVE,
            student: {
              batchId: batchId,
            },
          },
          data: {
            status: StudentSemesterStatus.COMPLETED,
          },
        }),
      ])

      const students = await tx.user.findMany({
        where: { batchId },
        select: { id: true },
      })

      if (students.length > 0) {
        await tx.studentSemester.createMany({
          data: students.map((student) => ({
            studentId: student.id,
            semesterId: nextSemester.id,
            status: StudentSemesterStatus.ACTIVE,
          })),
          skipDuplicates: true,
        })
      }

      this.logger.log(
        `Advanced batch ${batchId} from ${batch.currentSemester.semesterNumber} to ${nextSemester.semesterNumber}`,
      )

      return updatedBatch
    })
  }

  async getStudentsInBatch(batchId: string) {
    this.logger.log(`Getting students in batch: ${batchId}`)

    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      select: { id: true },
    })

    if (!batch) {
      throw new NotFoundException(`Batch with id ${batchId} not found`)
    }

    return await this.prisma.user.findMany({
      where: {
        batchId,
        role: Role.STUDENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        batchId: true,
        role: true,
        image: true,
      },
    })
  }

  async getUnenrolledStudents() {
    this.logger.log('Getting unenrolled students')

    return await this.prisma.user.findMany({
      where: {
        role: Role.STUDENT,
        batchId: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: { name: 'asc' },
    })
  }
}
