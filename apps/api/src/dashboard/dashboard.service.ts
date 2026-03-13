import { Injectable, Logger } from '@nestjs/common'
import { Role, AssignmentStatus } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name)

  constructor(private readonly prisma: PrismaService) {}

  // ─── Student ───────────────────────────────────────────────────────

  async getStudentDashboard(user: AuthUser) {
    this.logger.log(`Building student dashboard for ${user.id}`)

    const student = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        batchId: true,
        batch: {
          select: {
            batchYear: true,
            currentSemester: { select: { id: true, semesterNumber: true } },
          },
        },
      },
    })

    if (!student?.batchId || !student.batch) {
      return {
        stats: {
          totalSubjects: 0,
          totalAssignments: 0,
          pendingAssignments: 0,
          unreadAnnouncements: 0,
        },
        currentSemester: null,
        batchYear: null,
        upcomingAssignments: [],
        recentAnnouncements: [],
      }
    }

    const semesterId = student.batch.currentSemester?.id ?? null

    const [subjectCount, assignments, readIds, announcements] = await Promise.all([
      // Total subjects in current semester
      semesterId ? this.prisma.subject.count({ where: { semesterId } }) : Promise.resolve(0),

      // All visible assignments for the student's batch
      this.prisma.assignment.findMany({
        where: {
          batchId: student.batchId,
          status: { in: [AssignmentStatus.PUBLISHED, AssignmentStatus.PAST_DUE] },
        },
        include: {
          subjectTeacher: {
            select: {
              subject: { select: { subjectCode: true, subjectName: true } },
              teacher: { select: { id: true, name: true } },
            },
          },
          batch: { select: { id: true, batchYear: true } },
        },
        orderBy: { dueDate: 'asc' },
      }),

      // Announcement read IDs for this user
      this.prisma.announcementRead
        .findMany({
          where: { userId: user.id },
          select: { announcementId: true },
        })
        .then((rows) => new Set(rows.map((r) => r.announcementId))),

      // Published announcements scoped to the student's batch or global
      this.prisma.announcement.findMany({
        where: {
          isPublished: true,
          OR: [{ batchId: null }, { batchId: student.batchId }],
        },
        select: {
          id: true,
          title: true,
          message: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          createdBy: { select: { id: true, name: true, role: true } },
          batch: { select: { id: true, batchYear: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const now = new Date()
    const upcomingAssignments = assignments
      .filter((a) => a.status === AssignmentStatus.PUBLISHED && new Date(a.dueDate) >= now)
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate.toISOString(),
        status: a.status,
        subjectTeacher: a.subjectTeacher,
        batch: a.batch,
      }))

    const pendingAssignments = assignments.filter(
      (a) => a.status === AssignmentStatus.PUBLISHED && new Date(a.dueDate) >= now,
    ).length

    const unreadAnnouncements = await this.prisma.announcement.count({
      where: {
        isPublished: true,
        OR: [{ batchId: null }, { batchId: student.batchId }],
        NOT: { announcementReads: { some: { userId: user.id } } },
      },
    })

    return {
      stats: {
        totalSubjects: subjectCount,
        totalAssignments: assignments.length,
        pendingAssignments,
        unreadAnnouncements,
      },
      currentSemester: student.batch.currentSemester?.semesterNumber ?? null,
      batchYear: student.batch.batchYear,
      upcomingAssignments,
      recentAnnouncements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        isPublished: a.isPublished,
        publishedAt: a.publishedAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
        createdBy: a.createdBy,
        batch: a.batch,
        isRead: readIds.has(a.id),
      })),
    }
  }

  // ─── Teacher ───────────────────────────────────────────────────────

  async getTeacherDashboard(user: AuthUser) {
    this.logger.log(`Building teacher dashboard for ${user.id}`)

    const [subjectTeachers, assignments, readIds, announcements] = await Promise.all([
      // Subjects the teacher is assigned to
      this.prisma.subjectTeacher.findMany({
        where: { teacherId: user.id, isActive: true },
        select: {
          id: true,
          subject: {
            select: {
              id: true,
              subjectCode: true,
              subjectName: true,
              semester: { select: { semesterNumber: true } },
            },
          },
          _count: { select: { assignments: true } },
        },
      }),

      // All assignments by this teacher
      this.prisma.assignment.findMany({
        where: { subjectTeacher: { teacherId: user.id } },
        include: {
          subjectTeacher: {
            select: {
              subject: { select: { subjectCode: true, subjectName: true } },
              teacher: { select: { id: true, name: true } },
            },
          },
          batch: { select: { id: true, batchYear: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Announcement read IDs
      this.prisma.announcementRead
        .findMany({
          where: { userId: user.id },
          select: { announcementId: true },
        })
        .then((rows) => new Set(rows.map((r) => r.announcementId))),

      // Published announcements + teacher's own
      this.prisma.announcement.findMany({
        where: { OR: [{ isPublished: true }, { createdById: user.id }] },
        select: {
          id: true,
          title: true,
          message: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          createdBy: { select: { id: true, name: true, role: true } },
          batch: { select: { id: true, batchYear: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    // Distinct batches the teacher is connected to through assignments
    const batchIds = new Set(assignments.map((a) => a.batchId))

    const subjects = subjectTeachers.map((st) => ({
      id: st.subject.id,
      subjectCode: st.subject.subjectCode,
      subjectName: st.subject.subjectName,
      semester: { semesterNumber: st.subject.semester.semesterNumber },
      assignmentCount: st._count.assignments,
    }))

    const publishedCount = assignments.filter((a) => a.status === AssignmentStatus.PUBLISHED).length

    return {
      stats: {
        totalSubjects: subjectTeachers.length,
        totalAssignments: assignments.length,
        publishedAssignments: publishedCount,
        totalBatches: batchIds.size,
      },
      subjects,
      recentAssignments: assignments.slice(0, 5).map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate.toISOString(),
        status: a.status,
        subjectTeacher: a.subjectTeacher,
        batch: a.batch,
      })),
      recentAnnouncements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        isPublished: a.isPublished,
        publishedAt: a.publishedAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
        createdBy: a.createdBy,
        batch: a.batch,
        isRead: readIds.has(a.id),
      })),
    }
  }

  // ─── Admin ─────────────────────────────────────────────────────────

  async getAdminDashboard() {
    this.logger.log('Building admin dashboard')

    const [
      totalStudents,
      totalTeachers,
      totalBatches,
      totalSubjects,
      pendingTeachers,
      recentAssignments,
      recentAnnouncements,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: Role.STUDENT } }),
      this.prisma.user.count({ where: { role: Role.TEACHER, isTeacherApproved: true } }),
      this.prisma.batch.count(),
      this.prisma.subject.count(),

      // Pending teacher approvals
      this.prisma.user.findMany({
        where: { role: Role.TEACHER, isTeacherApproved: false },
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),

      // Recent assignments (all)
      this.prisma.assignment.findMany({
        include: {
          subjectTeacher: {
            select: {
              subject: { select: { subjectCode: true, subjectName: true } },
              teacher: { select: { id: true, name: true } },
            },
          },
          batch: { select: { id: true, batchYear: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent announcements (all)
      this.prisma.announcement.findMany({
        select: {
          id: true,
          title: true,
          message: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          createdBy: { select: { id: true, name: true, role: true } },
          batch: { select: { id: true, batchYear: true } },
          _count: { select: { announcementReads: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalBatches,
        totalSubjects,
        pendingApprovals: pendingTeachers.length,
      },
      pendingTeachers: pendingTeachers.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        createdAt: t.createdAt.toISOString(),
      })),
      recentAssignments: recentAssignments.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate.toISOString(),
        status: a.status,
        subjectTeacher: a.subjectTeacher,
        batch: a.batch,
      })),
      recentAnnouncements: recentAnnouncements.map((a) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        isPublished: a.isPublished,
        publishedAt: a.publishedAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
        createdBy: a.createdBy,
        batch: a.batch,
        isRead: false, // admin dashboard doesn't track personal read state
      })),
    }
  }
}
