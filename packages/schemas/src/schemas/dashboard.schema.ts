import { z } from 'zod'
import { AssignmentStatusEnum } from './assignment.schema'
import { SemesterNumberEnum } from './enums'

// ─── Shared sub-schemas ────────────────────────────────────────────

const DashboardAssignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.string(),
  status: AssignmentStatusEnum,
  subjectTeacher: z.object({
    subject: z.object({
      subjectCode: z.string(),
      subjectName: z.string(),
    }),
    teacher: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  batch: z.object({
    id: z.string(),
    batchYear: z.number(),
  }),
})

const DashboardAnnouncementSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  isPublished: z.boolean(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
  }),
  batch: z
    .object({
      id: z.string(),
      batchYear: z.number(),
    })
    .nullable(),
  isRead: z.boolean(),
})

const PendingTeacherSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
})

// ─── Student Dashboard ─────────────────────────────────────────────

export const StudentDashboardResponseSchema = z.object({
  stats: z.object({
    totalSubjects: z.number(),
    totalAssignments: z.number(),
    pendingAssignments: z.number(),
    unreadAnnouncements: z.number(),
  }),
  currentSemester: SemesterNumberEnum.nullable(),
  batchYear: z.number().nullable(),
  upcomingAssignments: z.array(DashboardAssignmentSchema),
  recentAnnouncements: z.array(DashboardAnnouncementSchema),
})
export type StudentDashboardResponse = z.infer<typeof StudentDashboardResponseSchema>

// ─── Teacher Dashboard ─────────────────────────────────────────────

const TeacherSubjectSchema = z.object({
  id: z.string(),
  subjectCode: z.string(),
  subjectName: z.string(),
  semester: z.object({
    semesterNumber: SemesterNumberEnum,
  }),
  assignmentCount: z.number(),
})

export const TeacherDashboardResponseSchema = z.object({
  stats: z.object({
    totalSubjects: z.number(),
    totalAssignments: z.number(),
    publishedAssignments: z.number(),
    totalBatches: z.number(),
  }),
  subjects: z.array(TeacherSubjectSchema),
  recentAssignments: z.array(DashboardAssignmentSchema),
  recentAnnouncements: z.array(DashboardAnnouncementSchema),
})
export type TeacherDashboardResponse = z.infer<typeof TeacherDashboardResponseSchema>

// ─── Admin Dashboard ───────────────────────────────────────────────

export const AdminDashboardResponseSchema = z.object({
  stats: z.object({
    totalStudents: z.number(),
    totalTeachers: z.number(),
    totalBatches: z.number(),
    totalSubjects: z.number(),
    pendingApprovals: z.number(),
  }),
  pendingTeachers: z.array(PendingTeacherSchema),
  recentAssignments: z.array(DashboardAssignmentSchema),
  recentAnnouncements: z.array(DashboardAnnouncementSchema),
})
export type AdminDashboardResponse = z.infer<typeof AdminDashboardResponseSchema>
