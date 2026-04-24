'use client'

import { BookOpen, ClipboardList, Megaphone, Clock, GraduationCap, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { StatsStrip } from '@/components/dashboard/stats-strip'
import { ContentSection } from '@/components/dashboard/content-section'
import { LoadingState } from '@/components/ui/loading-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useStudentDashboard } from '@/hooks/useDashboard'
import { formatShortDate, formatSemesterNumber, getDueDateInfo } from '@/lib/formatters'

export default function StudentDashboard() {
  const { data, isLoading } = useStudentDashboard()

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader
          title="Student Dashboard"
          roleBadge={{ text: 'Student', variant: 'info' }}
        />

        <StatsStrip
          stats={[
            {
              label: 'Current semester',
              value: data?.currentSemester
                ? `${formatSemesterNumber(data.currentSemester)} Semester`
                : 'Not enrolled',
              icon: GraduationCap,
              iconColor: 'text-info',
              iconBg: 'bg-info/10',
            },
            {
              label: 'Subjects',
              value: data?.stats.totalSubjects ?? 0,
              icon: BookOpen,
              iconColor: 'text-primary',
              iconBg: 'bg-primary/10',
            },
            {
              label: 'Pending assignments',
              value: data?.stats.pendingAssignments ?? 0,
              icon: ClipboardList,
              iconColor: 'text-warning-foreground',
              iconBg: 'bg-warning/15',
            },
            {
              label: 'Unread announcements',
              value: data?.stats.unreadAnnouncements ?? 0,
              icon: Bell,
              iconColor: 'text-accent-foreground',
              iconBg: 'bg-accent/10',
            },
          ]}
        />

        <ContentSection
          icon={Clock}
          title="Upcoming assignments"
          description="Assignments due soon"
          href="/student/assignments"
        >
          {data?.upcomingAssignments && data.upcomingAssignments.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <Table className="table-clean">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Due date</TableHead>
                    <TableHead className="text-right">Countdown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.upcomingAssignments.map((assignment) => {
                    const dueDateInfo = getDueDateInfo(assignment.dueDate)
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium text-foreground">
                          {assignment.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {assignment.subjectTeacher.subject.subjectName}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          {formatShortDate(assignment.dueDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`text-xs font-semibold tabular-nums ${dueDateInfo.color}`}
                          >
                            {dueDateInfo.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="card-elevated py-10 text-center">
              <p className="text-sm text-muted-foreground">No upcoming assignments</p>
            </div>
          )}
        </ContentSection>

        <ContentSection
          icon={Megaphone}
          title="Recent announcements"
          description="Latest updates"
          href="/student/announcements"
          className="mt-10"
        >
          {data?.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="card-elevated p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{announcement.title}</p>
                        {!announcement.isRead && (
                          <Badge variant="info" className="h-5 px-1.5 text-[10px]">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {announcement.message}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground tabular-nums">
                        {formatShortDate(announcement.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-elevated py-10 text-center">
              <p className="text-sm text-muted-foreground">No announcements yet</p>
            </div>
          )}
        </ContentSection>
      </div>
    </div>
  )
}
