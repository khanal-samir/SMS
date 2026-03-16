import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { StorageService } from 'src/common/storage/storage.service'
import { CreateResourceDto, UpdateResourceDto } from './dto'
import { ResourceType, Role, Prisma } from '@prisma/client'
import { ResourceTypeEnum, type AuthUser } from '@repo/schemas'

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  private readonly RESOURCE_INCLUDE = {
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
  } as const

  private isAdmin(user: AuthUser) {
    return user.role === Role.ADMIN
  }

  private async findOneWithAccess(client: Prisma.TransactionClient, id: string, user: AuthUser) {
    const resource = await client.resource.findUnique({
      where: { id },
      include: this.RESOURCE_INCLUDE,
    })

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`)
    }

    if (this.isAdmin(user)) return resource

    if (user.role === Role.STUDENT) {
      // Students can only see published resources for subjects in their batch's current semester
      if (!resource.isPublished) {
        throw new ForbiddenException('You do not have access to this resource')
      }

      const student = await client.user.findUnique({
        where: { id: user.id },
        select: {
          batchId: true,
          batch: {
            select: { currentSemesterId: true },
          },
        },
      })

      if (!student?.batch?.currentSemesterId) {
        throw new ForbiddenException('You do not have access to this resource')
      }

      // Check if the resource's subject belongs to the student's current semester
      const subjectTeacher = await client.subjectTeacher.findUnique({
        where: { id: resource.subjectTeacherId },
        select: {
          subject: {
            select: { semesterId: true },
          },
        },
      })

      if (subjectTeacher?.subject.semesterId !== student.batch.currentSemesterId) {
        throw new ForbiddenException('You do not have access to this resource')
      }

      return resource
    }

    // Teacher: can only access their own resources
    if (resource.subjectTeacher.teacher.id !== user.id) {
      throw new ForbiddenException('You do not have access to this resource')
    }

    return resource
  }

  async create(createResourceDto: CreateResourceDto, user: AuthUser) {
    this.logger.log(`Creating resource: ${createResourceDto.title} by user: ${user.id}`)

    // Verify subject-teacher access
    const subjectTeacher = this.isAdmin(user)
      ? await this.prisma.subjectTeacher.findUnique({
          where: { id: createResourceDto.subjectTeacherId },
        })
      : await this.prisma.subjectTeacher.findUnique({
          where: {
            id: createResourceDto.subjectTeacherId,
            teacherId: user.id,
            isActive: true,
          },
        })

    if (!subjectTeacher) {
      throw this.isAdmin(user)
        ? new NotFoundException(
            `SubjectTeacher with id ${createResourceDto.subjectTeacherId} not found`,
          )
        : new ForbiddenException(
            'You are not assigned to this subject or the assignment is inactive',
          )
    }

    const isFileResource =
      createResourceDto.resourceType === ResourceTypeEnum.enum.DOCUMENT ||
      createResourceDto.resourceType === ResourceTypeEnum.enum.IMAGE

    // For file resources, validate that file details are provided
    if (isFileResource) {
      if (
        !createResourceDto.fileName ||
        !createResourceDto.fileSize ||
        !createResourceDto.mimeType
      ) {
        throw new BadRequestException(
          'fileName, fileSize, and mimeType are required for file resources',
        )
      }
    }

    // For link resources, validate that externalLink is provided
    if (createResourceDto.resourceType === ResourceTypeEnum.enum.LINK) {
      if (!createResourceDto.externalLink) {
        throw new BadRequestException('externalLink is required for LINK resources')
      }
    }

    // Create the resource record
    const resource = await this.prisma.resource.create({
      data: {
        title: createResourceDto.title,
        description: createResourceDto.description ?? null,
        resourceType: createResourceDto.resourceType as ResourceType,
        subjectTeacherId: createResourceDto.subjectTeacherId,
        fileName: createResourceDto.fileName ?? null,
        fileSize: createResourceDto.fileSize ?? null,
        mimeType: createResourceDto.mimeType ?? null,
        externalLink: createResourceDto.externalLink ?? null,
        // LINK resources are immediately "uploaded" (no file to upload)
        isUploaded: createResourceDto.resourceType === ResourceTypeEnum.enum.LINK,
      },
      include: this.RESOURCE_INCLUDE,
    })

    // Generate presigned upload URL for file resources
    let uploadUrl: string | null = null
    if (isFileResource && createResourceDto.fileName && createResourceDto.mimeType) {
      const objectKey = this.storage.getObjectKey(
        createResourceDto.subjectTeacherId as string,
        resource.id as string,
        createResourceDto.fileName as string,
      )

      // Store the S3 object key on the resource
      await this.prisma.resource.update({
        where: { id: resource.id },
        data: { fileUrl: objectKey },
      })

      resource.fileUrl = objectKey

      uploadUrl = await this.storage.generatePresignedUploadUrl(
        objectKey,
        createResourceDto.mimeType as string,
      )
    }

    this.logger.log(`Created resource: ${resource.id}`)
    return { resource, uploadUrl }
  }

  /**
   * Confirm that a file has been successfully uploaded to S3.
   */
  async confirmUpload(id: string, user: AuthUser) {
    this.logger.log(`Confirming upload for resource: ${id} by user: ${user.id}`)

    return this.prisma.$transaction(async (tx) => {
      const resource = await this.findOneWithAccess(tx, id, user)

      if (resource.resourceType === ResourceTypeEnum.enum.LINK) {
        throw new BadRequestException('Cannot confirm upload for a LINK resource')
      }

      if (resource.isUploaded) {
        throw new BadRequestException('Resource is already marked as uploaded')
      }

      if (!resource.fileUrl) {
        throw new BadRequestException('Resource has no file URL to confirm')
      }

      const updated = await tx.resource.update({
        where: { id },
        data: { isUploaded: true },
        include: this.RESOURCE_INCLUDE,
      })

      this.logger.log(`Confirmed upload for resource: ${id}`)
      return updated
    })
  }

  async findAll(user: AuthUser) {
    this.logger.log(`Finding all resources for user: ${user.id} (role: ${user.role})`)

    if (this.isAdmin(user)) {
      return this.prisma.resource.findMany({
        where: { isUploaded: true },
        include: this.RESOURCE_INCLUDE,
        orderBy: { createdAt: 'desc' },
      })
    }

    if (user.role === Role.STUDENT) {
      const student = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          batchId: true,
          batch: {
            select: { currentSemesterId: true },
          },
        },
      })

      if (!student?.batch?.currentSemesterId) return []

      return this.prisma.resource.findMany({
        where: {
          isPublished: true,
          isUploaded: true,
          subjectTeacher: {
            subject: {
              semesterId: student.batch.currentSemesterId,
            },
            isActive: true,
          },
        },
        include: this.RESOURCE_INCLUDE,
        orderBy: { createdAt: 'desc' },
      })
    }

    // Teacher: see their own resources (including unpublished)
    return this.prisma.resource.findMany({
      where: {
        subjectTeacher: { teacherId: user.id },
        isUploaded: true,
      },
      include: this.RESOURCE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string, user: AuthUser) {
    this.logger.log(`Finding resource: ${id} for user: ${user.id}`)
    return this.findOneWithAccess(this.prisma, id, user)
  }

  async getDownloadUrl(id: string, user: AuthUser) {
    this.logger.log(`Getting download URL for resource: ${id} by user: ${user.id}`)

    const resource = await this.findOneWithAccess(this.prisma, id, user)

    if (resource.resourceType === 'LINK') {
      return { downloadUrl: resource.externalLink }
    }

    if (!resource.fileUrl) {
      throw new BadRequestException('Resource has no file to download')
    }

    if (!resource.isUploaded) {
      throw new BadRequestException('Resource file has not been uploaded yet')
    }

    const downloadUrl = await this.storage.generatePresignedDownloadUrl(resource.fileUrl as string)
    return { downloadUrl }
  }

  async update(id: string, updateResourceDto: UpdateResourceDto, user: AuthUser) {
    this.logger.log(`Updating resource: ${id} by user: ${user.id}`)

    return this.prisma.$transaction(async (tx) => {
      await this.findOneWithAccess(tx, id, user)

      const resource = await tx.resource.update({
        where: { id },
        data: {
          ...(updateResourceDto.title && { title: updateResourceDto.title }),
          ...(updateResourceDto.description !== undefined && {
            description: updateResourceDto.description,
          }),
          ...(updateResourceDto.isPublished !== undefined && {
            isPublished: updateResourceDto.isPublished,
            publishedAt: updateResourceDto.isPublished ? new Date() : null,
          }),
        },
        include: this.RESOURCE_INCLUDE,
      })

      this.logger.log(`Updated resource: ${resource.id}`)
      return resource
    })
  }

  async remove(id: string, user: AuthUser) {
    this.logger.log(`Deleting resource: ${id} by user: ${user.id}`)

    return this.prisma.$transaction(async (tx) => {
      const resource = await this.findOneWithAccess(tx, id, user)

      // Delete from S3 if there's a file
      if (resource.fileUrl && resource.isUploaded) {
        await this.storage.deleteObject(resource.fileUrl as string)
      }

      await tx.resource.delete({ where: { id } })
      this.logger.log(`Deleted resource: ${id}`)
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

  /**
   * Get all subject-teacher records (for admin form dropdowns).
   */
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
