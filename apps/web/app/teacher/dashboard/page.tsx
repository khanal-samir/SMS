'use client'

import Link from 'next/link'
import { BookOpen, ClipboardList, Megaphone, Users } from 'lucide-react'
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
import { useTeacherDashboard } from '@/hooks/useDashboard'
import { formatShortDate, formatSemesterNumber, getDueDateInfo } from '@/lib/formatters'

export default function TeacherDashboard() {
  const { data, isLoading } = useTeacherDashboard()

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  const statusMap: Record<
    string,
    {
      label: string
      variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' | 'destructive'
    }
  > = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    PUBLISHED: { label: 'Published', variant: 'success' },
    PAST_DUE: { label: 'Past due', variant: 'destructive' },
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Teacher Dashboard"
          roleBadge={{ text: 'Teacher', variant: 'success' }}
        />

        {/* Stat cards row */}
        <StatCards
          columns={4}
          stats={[
            {
              label: 'My subjects',
              value: data?.stats.totalSubjects ?? 0,
              icon: BookOpen,
            },
            {
              label: 'Total assignments',
              value: data?.stats.totalAssignments ?? 0,
              icon: ClipboardList,
            },
            {
              label: 'Published',
              value: data?.stats.publishedAssignments ?? 0,
              icon: Megaphone,
            },
            {
              label: 'Batches',
              value: data?.stats.totalBatches ?? 0,
              icon: Users,
            },
          ]}
        />

        {/* My subjects — full-width table */}
        <section>
          <SectionHeader
            icon={BookOpen}
            title="My subjects"
            description="Subjects you teach"
            href="/teacher/subjects"
          />
          {data?.subjects && data.subjects.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">Code</TableHead>
                    <TableHead className="px-4">Subject name</TableHead>
                    <TableHead className="px-4">Semester</TableHead>
                    <TableHead className="px-4 text-right">Assignments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.subjects.map((subject) => (
                    <TableRow
                      key={subject.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="px-4">
                        <Link
                          href={`/teacher/subjects/${subject.id}`}
                          className="font-semibold text-foreground hover:underline"
                        >
                          {subject.subjectCode}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 text-muted-foreground">
                        {subject.subjectName}
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge variant="outline" className="text-xs">
                          {formatSemesterNumber(subject.semester.semesterNumber)} Sem
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 text-right tabular-nums text-muted-foreground">
                        {subject.assignmentCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-lg border py-8 text-center">
              <p className="text-sm text-muted-foreground">No subjects assigned yet</p>
            </div>
          )}
        </section>

        {/* Recent assignments — full-width table */}
        <section className="mt-8">
          <SectionHeader
            icon={ClipboardList}
            title="Recent assignments"
            description="Your latest assignments"
            href="/teacher/assignments"
          />
          {data?.recentAssignments && data.recentAssignments.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">Title</TableHead>
                    <TableHead className="px-4">Subject</TableHead>
                    <TableHead className="px-4">Batch</TableHead>
                    <TableHead className="px-4">Status</TableHead>
                    <TableHead className="px-4 text-right">Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentAssignments.map((assignment) => {
                    const dueDateInfo = getDueDateInfo(assignment.dueDate)
                    const status = statusMap[assignment.status] ?? {
                      label: assignment.status,
                      variant: 'outline' as const,
                    }
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="px-4 font-medium text-foreground">
                          {assignment.title}
                        </TableCell>
                        <TableCell className="px-4 text-muted-foreground">
                          {assignment.subjectTeacher.subject.subjectName}
                        </TableCell>
                        <TableCell className="px-4 text-muted-foreground tabular-nums">
                          {assignment.batch.batchYear}
                        </TableCell>
                        <TableCell className="px-4">
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
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
              <p className="text-sm text-muted-foreground">No assignments yet</p>
            </div>
          )}
        </section>

        {/* Recent announcements — full width grid */}
        <section className="mt-8">
          <SectionHeader
            icon={Megaphone}
            title="Recent announcements"
            description="Latest updates from the system"
            href="/teacher/announcements"
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
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{announcement.createdBy.name}</span>
                    <span className="tabular-nums">{formatShortDate(announcement.createdAt)}</span>
                  </div>
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
