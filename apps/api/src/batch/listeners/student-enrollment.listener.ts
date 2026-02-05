import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from 'src/prisma/prisma.service'
import { StudentEnrolledEvent, STUDENT_ENROLLED_EVENT } from '../events/student-enrolled.event'
import { StudentSemesterStatus } from '@prisma/client'

@Injectable()
export class StudentEnrollmentListener {
  private readonly logger = new Logger(StudentEnrollmentListener.name)

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent(STUDENT_ENROLLED_EVENT)
  async handleStudentEnrolled(event: StudentEnrolledEvent) {
    this.logger.log(
      `Handling student enrolled event for student: ${event.studentId}, batch: ${event.batchId}`,
    )

    try {
      // Fetch the batch to get the current semester
      const batch = await this.prisma.batch.findUnique({
        where: { id: event.batchId },
        select: { currentSemesterId: true },
      })

      if (!batch?.currentSemesterId) {
        this.logger.error(`Batch ${event.batchId} not found or has no current semester`)
        return
      }

      // Check if StudentSemester already exists
      const existingStudentSemester = await this.prisma.studentSemester.findUnique({
        where: {
          studentId_semesterId: {
            // composite unique query check schema for unique relation
            studentId: event.studentId,
            semesterId: batch.currentSemesterId,
          },
        },
      })

      if (existingStudentSemester) {
        this.logger.warn(
          `StudentSemester already exists for student: ${event.studentId}, semester: ${batch.currentSemesterId}`,
        )
        return
      }

      // Create StudentSemester with ACTIVE status
      const studentSemester = await this.prisma.studentSemester.create({
        data: {
          studentId: event.studentId,
          semesterId: batch.currentSemesterId,
          status: StudentSemesterStatus.ACTIVE,
        },
      })

      this.logger.log(
        `Created StudentSemester: ${studentSemester.id} for student: ${event.studentId} with status ACTIVE`,
      )
    } catch (error) {
      this.logger.error(`Failed to create StudentSemester for student: ${event.studentId}`, error)
      throw error
    }
  }
}
