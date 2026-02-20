import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Role } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto'

const ANNOUNCEMENT_SELECT = {
  id: true,
  title: true,
  message: true,
  isPublished: true,
  scheduledAt: true,
  publishedAt: true,
  batchId: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  createdBy: {
    select: { id: true, name: true, role: true },
  },
  batch: {
    select: { id: true, batchYear: true },
  },
  _count: {
    select: { announcementReads: true },
  },
} as const

type AnnouncementRow = Prisma.AnnouncementGetPayload<{
  select: typeof ANNOUNCEMENT_SELECT
}>

@Injectable()
export class AnnouncementService {
  private readonly logger = new Logger(AnnouncementService.name)

  constructor(private readonly prisma: PrismaService) {}

  private isAdmin(user: AuthUser) {
    return user.role === Role.ADMIN
  }

  private toResponse(row: AnnouncementRow, isRead: boolean, includeReadCount: boolean) {
    return {
      id: row.id,
      title: row.title,
      message: row.message,
      isPublished: row.isPublished,
      scheduledAt: row.scheduledAt?.toISOString() ?? null,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      batchId: row.batchId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      createdById: row.createdById,
      createdBy: row.createdBy,
      batch: row.batch,
      isRead,
      ...(includeReadCount ? { readCount: row._count.announcementReads } : {}),
    }
  }

  private async fetchRow(id: string): Promise<AnnouncementRow | null> {
    return this.prisma.announcement.findUnique({
      where: { id },
      select: ANNOUNCEMENT_SELECT,
    })
  }

  private async assertAccess(
    id: string,
    user: AuthUser,
    requireOwnership = false,
  ): Promise<AnnouncementRow> {
    const row = await this.fetchRow(id)
    if (!row) throw new NotFoundException(`Announcement with id ${id} not found`)

    if (requireOwnership && !this.isAdmin(user) && row.createdById !== user.id) {
      throw new ForbiddenException('You do not have permission to modify this announcement')
    }
    return row
  }

  async create(dto: CreateAnnouncementDto, user: AuthUser) {
    this.logger.log(`Creating announcement "${dto.title}" by user ${user.id}`)

    if (dto.batchId) {
      const batch = await this.prisma.batch.findUnique({ where: { id: dto.batchId } })
      if (!batch) throw new NotFoundException(`Batch with id ${dto.batchId} not found`)
    }

    const now = new Date()
    const scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null
    const publishImmediately = !scheduledAt || scheduledAt <= now

    const row = await this.prisma.announcement.create({
      data: {
        title: dto.title,
        message: dto.message,
        createdById: user.id,
        batchId: dto.batchId ?? null,
        scheduledAt: publishImmediately ? null : scheduledAt,
        isPublished: publishImmediately,
        publishedAt: publishImmediately ? now : null,
      },
      select: ANNOUNCEMENT_SELECT,
    })

    this.logger.log(
      `Announcement ${row.id} created — ${
        publishImmediately ? 'published immediately' : `scheduled for ${scheduledAt?.toISOString()}`
      }`,
    )

    return this.toResponse(row, false, true)
  }

  async findAll(user: AuthUser) {
    this.logger.log(`Fetching announcements for user ${user.id} (role: ${user.role})`)

    const isAdminOrTeacher = user.role === Role.ADMIN || user.role === Role.TEACHER

    const readRecords = await this.prisma.announcementRead.findMany({
      where: { userId: user.id },
      select: { announcementId: true },
    })
    const readArr = readRecords.map((r) => r.announcementId)
    if (this.isAdmin(user)) {
      const rows = await this.prisma.announcement.findMany({
        select: ANNOUNCEMENT_SELECT,
        orderBy: { createdAt: 'desc' },
      })
      return rows.map((r) => this.toResponse(r, readArr.includes(r.id), true))
    }

    if (user.role === Role.TEACHER) {
      const rows = await this.prisma.announcement.findMany({
        where: { OR: [{ isPublished: true }, { createdById: user.id }] },
        select: ANNOUNCEMENT_SELECT,
        orderBy: { createdAt: 'desc' },
      })
      return rows.map((r) => this.toResponse(r, readArr.includes(r.id), isAdminOrTeacher))
    }

    // Student — published only, scoped to global (batchId = null) or their batch
    const student = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { batchId: true },
    })

    const rows = await this.prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [{ batchId: null }, ...(student?.batchId ? [{ batchId: student.batchId }] : [])],
      },
      select: ANNOUNCEMENT_SELECT,
      orderBy: { createdAt: 'desc' },
    })

    return rows.map((r) => this.toResponse(r, readArr.includes(r.id), false))
  }

  async findOne(id: string, user: AuthUser) {
    this.logger.log(`Fetching announcement ${id} for user ${user.id}`)

    const row = await this.assertAccess(id, user)

    // Students cannot see unpublished announcements
    if (user.role === Role.STUDENT && !row.isPublished) {
      throw new NotFoundException(`Announcement with id ${id} not found`)
    }

    // Teachers can only see their own unpublished ones
    if (user.role === Role.TEACHER && !row.isPublished && row.createdById !== user.id) {
      throw new NotFoundException(`Announcement with id ${id} not found`)
    }

    if (user.role === Role.STUDENT) {
      const student = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { batchId: true },
      })

      const hasAccess = row.batchId === null || row.batchId === student?.batchId
      if (!hasAccess) {
        throw new NotFoundException(`Announcement with id ${id} not found`)
      }
    }

    const readRecord = await this.prisma.announcementRead.findUnique({
      where: { announcementId_userId: { announcementId: id, userId: user.id } },
    })

    const includeReadCount = user.role === Role.ADMIN || user.role === Role.TEACHER
    return this.toResponse(row, !!readRecord, includeReadCount)
  }

  async update(id: string, dto: UpdateAnnouncementDto, user: AuthUser) {
    this.logger.log(`Updating announcement ${id} by user ${user.id}`)

    await this.assertAccess(id, user, true)

    if (dto.batchId) {
      const batch = await this.prisma.batch.findUnique({ where: { id: dto.batchId } })
      if (!batch) throw new NotFoundException(`Batch with id ${dto.batchId} not found`)
    }

    const now = new Date()
    let scheduleFields: {
      scheduledAt?: Date | null
      isPublished?: boolean
      publishedAt?: Date | null
    } = {}

    if (dto.scheduledAt !== undefined) {
      if (dto.scheduledAt === null) {
        scheduleFields = { scheduledAt: null, isPublished: true, publishedAt: now }
      } else {
        const scheduledAt = new Date(dto.scheduledAt)
        if (Number.isNaN(scheduledAt.getTime())) {
          throw new BadRequestException('scheduledAt must be a valid date')
        }
        if (scheduledAt <= now) {
          scheduleFields = { scheduledAt: null, isPublished: true, publishedAt: now }
        } else {
          scheduleFields = { scheduledAt, isPublished: false, publishedAt: null }
        }
      }
    }

    const updated = await this.prisma.announcement.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.message !== undefined && { message: dto.message }),
        ...(dto.batchId !== undefined && { batchId: dto.batchId }),
        ...scheduleFields,
      },
      select: ANNOUNCEMENT_SELECT,
    })

    this.logger.log(`Updated announcement ${updated.id}`)

    const readRecord = await this.prisma.announcementRead.findUnique({
      where: { announcementId_userId: { announcementId: id, userId: user.id } },
    })
    return this.toResponse(updated, !!readRecord, true)
  }

  async remove(id: string, user: AuthUser) {
    this.logger.log(`Deleting announcement ${id} by user ${user.id}`)

    await this.assertAccess(id, user, true)
    await this.prisma.announcement.delete({ where: { id } })

    this.logger.log(`Deleted announcement ${id}`)
    return { id }
  }

  async markAsRead(id: string, user: AuthUser) {
    this.logger.log(`Marking announcement ${id} as read by user ${user.id}`)

    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      select: { id: true, isPublished: true, batchId: true },
    })
    if (!announcement) throw new NotFoundException(`Announcement with id ${id} not found`)
    if (!announcement.isPublished) {
      throw new ForbiddenException('Cannot mark an unpublished announcement as read')
    }

    if (user.role === Role.STUDENT) {
      const student = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { batchId: true },
      })

      const hasAccess = announcement.batchId === null || announcement.batchId === student?.batchId
      if (!hasAccess) {
        throw new NotFoundException(`Announcement with id ${id} not found`)
      }
    }

    await this.prisma.announcementRead.upsert({
      where: { announcementId_userId: { announcementId: id, userId: user.id } },
      update: {},
      create: { announcementId: id, userId: user.id },
    })

    return { announcementId: id, userId: user.id, read: true }
  }

  @Cron(CronExpression.EVERY_MINUTE) // harek minute ma cron job chalxa ra scheduled announcements haru publish garxa
  async handleScheduledAnnouncements() {
    const now = new Date() // hal ko date

    const due = await this.prisma.announcement.findMany({
      where: { isPublished: false, scheduledAt: { lte: now } }, // jun date scheduledAt ma ho tyo hal ko date vanda sanno xa ra isPublished false xa
      select: { id: true },
    })

    if (due.length === 0) return

    const ids = due.map((a) => a.id)

    await this.prisma.announcement.updateMany({
      where: { id: { in: ids } },
      data: { isPublished: true, publishedAt: now },
    })

    this.logger.log(`Cron: published ${due.length} scheduled announcement(s) — [${ids.join(', ')}]`)
  }
}
