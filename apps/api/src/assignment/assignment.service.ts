import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAssignmentDto, UpdateAssignmentDto, UpdateAssignmentStatusDto } from './dto'
import { AssignmentStatus, Role, Prisma } from '@prisma/client'
import { AuthUser } from '@repo/schemas'

@Injectable()
export class AssignmentService {
  private readonly logger = new Logger(AssignmentService.name)

  constructor(private readonly prisma: PrismaService) {}
  private ASSIGNMENT_INCLUDE = {
    subjectTeacher: {
      select: {
        id: true,
        subject: {
          select: {
            id: true,
            subjectCode: true,
            subjectName: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    batch: {
      select: {
        id: true,
        batchYear: true,
      },
    },
  } as const
  private isAdmin(user: AuthUser) {
    return user.role === Role.ADMIN
  }

  private async findOneWithAccess(client: Prisma.TransactionClient, id: string, user: AuthUser) {
    const assignment = await client.assignment.findUnique({
      where: { id },
      include: this.ASSIGNMENT_INCLUDE,
    })

    if (!assignment) {
      throw new NotFoundException(`Assignment with id ${id} not found`)
    }

    if (this.isAdmin(user)) return assignment

    if (user.role === Role.STUDENT) {
      const student = await client.user.findUnique({
        where: { id: user.id },
        select: { batchId: true },
      })
      if (assignment.batchId !== student?.batchId) {
        throw new ForbiddenException('You do not have access to this assignment')
      }
      return assignment
    }

    // Teacher
    if (assignment.subjectTeacher.teacher.id !== user.id) {
      throw new ForbiddenException('You do not have access to this assignment')
    }
    return assignment
  }

  async create(createAssignmentDto: CreateAssignmentDto, user: AuthUser) {
    this.logger.log(`Creating assignment: ${createAssignmentDto.title} by user: ${user.id}`)

    const [subjectTeacher, batch] = await Promise.all([
      this.isAdmin(user)
        ? this.prisma.subjectTeacher.findUnique({
            where: { id: createAssignmentDto.subjectTeacherId },
          })
        : this.prisma.subjectTeacher.findUnique({
            where: {
              id: createAssignmentDto.subjectTeacherId,
              teacherId: user.id,
              isActive: true,
            },
          }),
      this.prisma.batch.findUnique({
        where: { id: createAssignmentDto.batchId },
      }),
    ])

    if (!subjectTeacher) {
      throw this.isAdmin(user)
        ? new NotFoundException(
            `SubjectTeacher with id ${createAssignmentDto.subjectTeacherId} not found`,
          )
        : new ForbiddenException(
            'You are not assigned to this subject or the assignment is inactive',
          )
    }

    if (!batch) {
      throw new NotFoundException(`Batch with id ${createAssignmentDto.batchId} not found`)
    }

    const assignment = await this.prisma.assignment.create({
      data: {
        title: createAssignmentDto.title,
        description: createAssignmentDto.description ?? null,
        dueDate: new Date(createAssignmentDto.dueDate),
        subjectTeacherId: createAssignmentDto.subjectTeacherId,
        batchId: createAssignmentDto.batchId,
        status: AssignmentStatus.DRAFT,
      },
      include: this.ASSIGNMENT_INCLUDE,
    })

    this.logger.log(`Created assignment: ${assignment.id}`)
    return assignment
  }

  async findAll(user: AuthUser) {
    this.logger.log(`Finding all assignments for user: ${user.id} (role: ${user.role})`)

    if (this.isAdmin(user)) {
      return this.prisma.assignment.findMany({
        include: this.ASSIGNMENT_INCLUDE,
        orderBy: { createdAt: 'desc' },
      })
    }

    if (user.role === Role.STUDENT) {
      const student = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { batchId: true },
      })

      if (!student?.batchId) return []

      return this.prisma.assignment.findMany({
        where: {
          batchId: student.batchId,
          status: { in: [AssignmentStatus.PUBLISHED, AssignmentStatus.PAST_DUE] },
        },
        include: this.ASSIGNMENT_INCLUDE,
        orderBy: { createdAt: 'desc' },
      })
    }

    return this.prisma.assignment.findMany({
      where: { subjectTeacher: { teacherId: user.id } },
      include: this.ASSIGNMENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findBySubjectTeacher(subjectTeacherId: string, user: AuthUser) {
    this.logger.log(
      `Finding assignments for subject-teacher: ${subjectTeacherId} by user: ${user.id}`,
    )

    if (!this.isAdmin(user)) {
      const subjectTeacher = await this.prisma.subjectTeacher.findUnique({
        where: { id: subjectTeacherId, teacherId: user.id },
      })
      if (!subjectTeacher) {
        throw new ForbiddenException('You are not assigned to this subject')
      }
    }

    return this.prisma.assignment.findMany({
      where: { subjectTeacherId },
      include: this.ASSIGNMENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string, user: AuthUser) {
    this.logger.log(`Finding assignment: ${id} for user: ${user.id}`)
    return this.findOneWithAccess(this.prisma, id, user)
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto, user: AuthUser) {
    this.logger.log(`Updating assignment: ${id} by user: ${user.id}`)

    return this.prisma.$transaction(async (tx) => {
      //check access
      await this.findOneWithAccess(tx, id, user)

      if (updateAssignmentDto.batchId) {
        const batch = await tx.batch.findUnique({
          where: { id: updateAssignmentDto.batchId },
        })
        if (!batch) {
          throw new NotFoundException(`Batch with id ${updateAssignmentDto.batchId} not found`)
        }
      }

      const assignment = await tx.assignment.update({
        where: { id },
        data: {
          ...(updateAssignmentDto.title && { title: updateAssignmentDto.title }),
          ...(updateAssignmentDto.description !== undefined && {
            description: updateAssignmentDto.description,
          }),
          ...(updateAssignmentDto.dueDate && {
            dueDate: new Date(updateAssignmentDto.dueDate),
          }),
          ...(updateAssignmentDto.batchId && { batchId: updateAssignmentDto.batchId }),
        },
        include: this.ASSIGNMENT_INCLUDE,
      })

      this.logger.log(`Updated assignment: ${assignment.id}`)
      return assignment
    })
  }

  async updateStatus(id: string, updateStatusDto: UpdateAssignmentStatusDto, user: AuthUser) {
    this.logger.log(
      `Updating assignment status: ${id} to ${updateStatusDto.status} by user: ${user.id}`,
    )

    return this.prisma.$transaction(async (tx) => {
      await this.findOneWithAccess(tx, id, user)

      const assignment = await tx.assignment.update({
        where: { id },
        data: {
          status: updateStatusDto.status,
        },
        include: this.ASSIGNMENT_INCLUDE,
      })

      this.logger.log(`Updated assignment ${id} status to ${updateStatusDto.status}`)
      return assignment
    })
  }

  async remove(id: string, user: AuthUser) {
    this.logger.log(`Deleting assignment: ${id} by user: ${user.id}`)

    return this.prisma.$transaction(async (tx) => {
      await this.findOneWithAccess(tx, id, user)
      await tx.assignment.delete({ where: { id } })
      this.logger.log(`Deleted assignment: ${id}`)
      return { id }
    })
  }

  async getTeacherSubjects(teacherId: string) {
    this.logger.log(`Getting subject-teacher records for teacher: ${teacherId}`)

    return this.prisma.subjectTeacher.findMany({
      where: { teacherId, isActive: true },
      select: {
        id: true,
        subject: {
          select: {
            id: true,
            subjectCode: true,
            subjectName: true,
          },
        },
      },
      orderBy: { subject: { subjectName: 'asc' } },
    })
  }

  async getAllSubjectTeachers() {
    this.logger.log('Getting all subject-teacher records (admin)')

    return this.prisma.subjectTeacher.findMany({
      where: { isActive: true },
      select: {
        id: true,
        subject: {
          select: {
            id: true,
            subjectCode: true,
            subjectName: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { subject: { subjectName: 'asc' } },
    })
  }
}
