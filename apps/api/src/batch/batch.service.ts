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
import { CreateBatchDto, EnrollStudentDto, EnrollStudentsDto } from './dto'
import { StudentEnrolledEvent, STUDENT_ENROLLED_EVENT } from './events'
import { Role } from '@prisma/client'

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
        startDate: new Date(createBatchDto.startDate),
        endDate: createBatchDto.endDate ? new Date(createBatchDto.endDate) : null,
        totalStudents: 0,
        currentSemesterId: firstSemester.id,
        isActive: true,
      },
      include: {
        currentSemester: true,
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
      include: {
        currentSemester: true,
        _count: {
          select: { users: true },
        },
      },
      orderBy: { batchYear: 'desc' },
    })
  }

  async findOne(id: string) {
    this.logger.log(`Finding batch by id: ${id}`)
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        currentSemester: {
          include: {
            subjects: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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
      where: { id: batchId },
    })

    if (!batch) {
      throw new NotFoundException(`Batch with id ${batchId} not found`)
    }

    if (!batch.isActive) {
      throw new BadRequestException(`Batch ${batchId} is not active`)
    }

    // Verify student exists and is a student role
    const student = await this.prisma.user.findUnique({
      where: { id: enrollStudentDto.studentId },
    })

    if (!student) {
      throw new NotFoundException(`Student with id ${enrollStudentDto.studentId} not found`)
    }

    if (student.role !== Role.STUDENT) {
      throw new BadRequestException(`User ${enrollStudentDto.studentId} is not a student`)
    }

    if (student.batchId) {
      throw new ConflictException(
        `Student ${enrollStudentDto.studentId} is already enrolled in a batch`,
      )
    }

    // Update student's batchId
    const updatedStudent = await this.prisma.user.update({
      where: { id: enrollStudentDto.studentId },
      data: { batchId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        batchId: true,
      },
    })

    // Update batch totalStudents count
    await this.prisma.batch.update({
      where: { id: batchId },
      data: { totalStudents: { increment: 1 } },
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

  async enrollStudents(batchId: string, enrollStudentsDto: EnrollStudentsDto) {
    this.logger.log(
      `Enrolling ${enrollStudentsDto.studentIds.length} students in batch: ${batchId}`,
    )

    const results = {
      success: [] as string[],
      failed: [] as { studentId: string; error: string }[],
    }

    for (const studentId of enrollStudentsDto.studentIds) {
      try {
        await this.enrollStudent(batchId, { studentId })
        results.success.push(studentId)
      } catch (error) {
        results.failed.push({
          studentId,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return results
  }

  async advanceSemester(batchId: string) {
    this.logger.log(`Advancing semester for batch: ${batchId}`)

    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        currentSemester: true,
      },
    })

    if (!batch) {
      throw new NotFoundException(`Batch with id ${batchId} not found`)
    }

    if (!batch.isActive) {
      throw new BadRequestException(`Batch ${batchId} is not active`)
    }

    if (!batch.currentSemester) {
      throw new BadRequestException(`Batch ${batchId} has no current semester`)
    }

    const nextSemesterNumber = this.semesterService.getNextSemester(
      batch.currentSemester.semesterNumber,
    )

    if (!nextSemesterNumber) {
      throw new BadRequestException(`Batch ${batchId} is already in the final semester (EIGHTH)`)
    }

    // Get the next semester
    const nextSemester = await this.semesterService.findOneByNumber(nextSemesterNumber)

    // Update all active student semesters to COMPLETED
    await this.prisma.studentSemester.updateMany({
      where: {
        semesterId: batch.currentSemesterId!,
        status: 'ACTIVE',
        student: {
          batchId: batchId,
        },
      },
      data: {
        status: 'COMPLETED',
      },
    })

    // Update batch to next semester
    const updatedBatch = await this.prisma.batch.update({
      where: { id: batchId },
      data: {
        currentSemesterId: nextSemester.id,
      },
      include: {
        currentSemester: true,
      },
    })

    // Create new StudentSemester records for all students in the batch
    const students = await this.prisma.user.findMany({
      where: { batchId },
      select: { id: true },
    })

    for (const student of students) {
      await this.prisma.studentSemester.create({
        data: {
          studentId: student.id,
          semesterId: nextSemester.id,
          status: 'ACTIVE',
        },
      })
    }

    this.logger.log(
      `Advanced batch ${batchId} from ${batch.currentSemester.semesterNumber} to ${nextSemester.semesterNumber}`,
    )

    return updatedBatch
  }

  async getStudentsInBatch(batchId: string) {
    this.logger.log(`Getting students in batch: ${batchId}`)

    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
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
        studentSemesters: {
          include: {
            semester: true,
          },
          orderBy: {
            enrolledAt: 'desc',
          },
        },
      },
    })
  }
}
