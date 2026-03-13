'use client'

import { BookOpen, ClipboardList, Megaphone, Clock, GraduationCap, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { StatCards } from '@/components/ui/stat-cards'
import { SectionHeader } from '@/components/ui/section-header'
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Student Dashboard"
          roleBadge={{ text: 'Student', variant: 'info' }}
        />

        {/* Stat cards row */}
        <StatCards
          columns={4}
          stats={[
            {
              label: 'Current semester',
              value: data?.currentSemester
                ? `${formatSemesterNumber(data.currentSemester)} Semester`
                : 'Not enrolled',
              icon: GraduationCap,
              size: 'small',
            },
            {
              label: 'Subjects',
              value: data?.stats.totalSubjects ?? 0,
              icon: BookOpen,
            },
            {
              label: 'Pending assignments',
              value: data?.stats.pendingAssignments ?? 0,
              icon: ClipboardList,
            },
            {
              label: 'Unread announcements',
              value: data?.stats.unreadAnnouncements ?? 0,
              icon: Bell,
            },
          ]}
        />

        {/* Upcoming assignments — full-width table */}
        <section>
          <SectionHeader
            icon={Clock}
            title="Upcoming assignments"
            description="Assignments due soon"
            href="/student/assignments"
          />
          {data?.upcomingAssignments && data.upcomingAssignments.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">Title</TableHead>
                    <TableHead className="px-4">Subject</TableHead>
                    <TableHead className="px-4 text-right">Due date</TableHead>
                    <TableHead className="px-4 text-right">Countdown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.upcomingAssignments.map((assignment) => {
                    const dueDateInfo = getDueDateInfo(assignment.dueDate)
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="px-4 font-medium text-foreground">
                          {assignment.title}
                        </TableCell>
                        <TableCell className="px-4 text-muted-foreground">
                          {assignment.subjectTeacher.subject.subjectName}
                        </TableCell>
                        <TableCell className="px-4 text-right text-muted-foreground tabular-nums">
                          {formatShortDate(assignment.dueDate)}
                        </TableCell>
                        <TableCell className="px-4 text-right">
                          <span className={`text-xs font-medium tabular-nums ${dueDateInfo.color}`}>
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
            <div className="rounded-lg border py-8 text-center">
              <p className="text-sm text-muted-foreground">No upcoming assignments</p>
            </div>
          )}
        </section>

        {/* Recent announcements — full width grid */}
        <section className="mt-8">
          <SectionHeader
            icon={Megaphone}
            title="Recent announcements"
            description="Latest updates"
            href="/student/announcements"
          />
          {data?.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">{announcement.title}</p>
                    {!announcement.isRead && (
                      <Badge variant="info" className="text-[10px] px-1.5 py-0">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {announcement.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    {formatShortDate(announcement.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border py-8 text-center">
              <p className="text-sm text-muted-foreground">No announcements yet</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
