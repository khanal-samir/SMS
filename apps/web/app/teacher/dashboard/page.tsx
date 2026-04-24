'use client'

import Link from 'next/link'
import { BookOpen, ClipboardList, Megaphone, Users } from 'lucide-react'
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
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader
          title="Teacher Dashboard"
          roleBadge={{ text: 'Teacher', variant: 'success' }}
        />

        <StatsStrip
          stats={[
            {
              label: 'My subjects',
              value: data?.stats.totalSubjects ?? 0,
              icon: BookOpen,
              iconColor: 'text-primary',
              iconBg: 'bg-primary/10',
            },
            {
              label: 'Total assignments',
              value: data?.stats.totalAssignments ?? 0,
              icon: ClipboardList,
              iconColor: 'text-warning-foreground',
              iconBg: 'bg-warning/15',
            },
            {
              label: 'Published',
              value: data?.stats.publishedAssignments ?? 0,
              icon: Megaphone,
              iconColor: 'text-success-foreground',
              iconBg: 'bg-success/15',
            },
            {
              label: 'Batches',
              value: data?.stats.totalBatches ?? 0,
              icon: Users,
              iconColor: 'text-info',
              iconBg: 'bg-info/10',
            },
          ]}
        />

        <ContentSection
          icon={BookOpen}
          title="My subjects"
          description="Subjects you teach"
          href="/teacher/subjects"
        >
          {data?.subjects && data.subjects.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <Table className="table-clean">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Code</TableHead>
                    <TableHead>Subject name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead className="text-right">Assignments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.subjects.map((subject) => (
                    <TableRow key={subject.id} className="cursor-pointer">
                      <TableCell>
                        <Link
                          href={`/teacher/subjects/${subject.id}`}
                          className="font-semibold text-foreground hover:underline"
                        >
                          {subject.subjectCode}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{subject.subjectName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-medium">
                          {formatSemesterNumber(subject.semester.semesterNumber)} Sem
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {subject.assignmentCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="card-elevated py-10 text-center">
              <p className="text-sm text-muted-foreground">No subjects assigned yet</p>
            </div>
          )}
        </ContentSection>

        <ContentSection
          icon={ClipboardList}
          title="Recent assignments"
          description="Your latest assignments"
          href="/teacher/assignments"
          className="mt-10"
        >
          {data?.recentAssignments && data.recentAssignments.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <Table className="table-clean">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Due</TableHead>
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
                        <TableCell className="font-medium text-foreground">
                          {assignment.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {assignment.subjectTeacher.subject.subjectName}
                        </TableCell>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {assignment.batch.batchYear}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="text-xs font-medium">
                            {status.label}
                          </Badge>
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
              <p className="text-sm text-muted-foreground">No assignments yet</p>
            </div>
          )}
        </ContentSection>

        <ContentSection
          icon={Megaphone}
          title="Recent announcements"
          description="Latest updates from the system"
          href="/teacher/announcements"
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
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{announcement.createdBy.name}</span>
                        <span className="tabular-nums">
                          {formatShortDate(announcement.createdAt)}
                        </span>
                      </div>
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
