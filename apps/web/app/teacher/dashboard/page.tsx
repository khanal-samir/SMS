'use client'

import Link from 'next/link'
import {
  BookOpen,
  ClipboardList,
  Megaphone,
  Users,
  ArrowRight,
  Calendar,
  FolderOpen,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { StatCards } from '@/components/ui/stat-cards'
import { LoadingState } from '@/components/ui/loading-state'
import { useTeacherDashboard } from '@/hooks/useDashboard'
import { formatShortDate, formatSemesterNumber, getDueDateInfo } from '@/lib/formatters'

export default function TeacherDashboard() {
  const { data, isLoading } = useTeacherDashboard()

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
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

        {/* Bento grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* My subjects — 2 cols */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-4 text-muted-foreground" />
                  My subjects
                </CardTitle>
                <CardDescription>Subjects you teach</CardDescription>
              </div>
              <Link
                href="/teacher/subjects"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {data?.subjects && data.subjects.length > 0 ? (
                <div className="space-y-3">
                  {data.subjects.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/teacher/subjects/${subject.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">
                            {subject.subjectName}
                          </p>
                          <p className="text-sm text-muted-foreground">{subject.subjectCode}</p>
                        </div>
                        <div className="ml-3 flex flex-col items-end gap-1">
                          <Badge variant="outline" className="text-xs">
                            {formatSemesterNumber(subject.semester.semesterNumber)} Sem
                          </Badge>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {subject.assignmentCount} assignment
                            {subject.assignmentCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No subjects assigned yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent assignments — 3 cols */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-muted-foreground" />
                  Recent assignments
                </CardTitle>
                <CardDescription>Your latest assignments</CardDescription>
              </div>
              <Link
                href="/teacher/assignments"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {data?.recentAssignments && data.recentAssignments.length > 0 ? (
                <div className="space-y-3">
                  {data.recentAssignments.map((assignment) => {
                    const dueDateInfo = getDueDateInfo(assignment.dueDate)
                    const statusMap: Record<
                      string,
                      {
                        label: string
                        variant:
                          | 'default'
                          | 'secondary'
                          | 'outline'
                          | 'success'
                          | 'warning'
                          | 'info'
                          | 'destructive'
                      }
                    > = {
                      DRAFT: { label: 'Draft', variant: 'secondary' },
                      PUBLISHED: { label: 'Published', variant: 'success' },
                      PAST_DUE: { label: 'Past due', variant: 'destructive' },
                    }
                    const status = statusMap[assignment.status] ?? {
                      label: assignment.status,
                      variant: 'outline' as const,
                    }
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.subjectTeacher.subject.subjectName} &middot; Batch{' '}
                            {assignment.batch.batchYear}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-1">
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                          <span className={`text-xs font-medium tabular-nums ${dueDateInfo.color}`}>
                            {dueDateInfo.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No assignments yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent announcements (full width) */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="size-4 text-muted-foreground" />
                Recent announcements
              </CardTitle>
              <CardDescription>Latest updates from the system</CardDescription>
            </div>
            <Link
              href="/teacher/announcements"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data?.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="rounded-lg border bg-card p-3">
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
                      <span className="tabular-nums">
                        {formatShortDate(announcement.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No announcements yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Subjects',
              href: '/teacher/subjects',
              icon: BookOpen,
              description: 'Manage your subjects',
            },
            {
              label: 'Assignments',
              href: '/teacher/assignments',
              icon: ClipboardList,
              description: 'Create & manage assignments',
            },
            {
              label: 'Schedule',
              href: '/teacher/schedule',
              icon: Calendar,
              description: 'View your schedule',
            },
            {
              label: 'Resources',
              href: '/teacher/resources',
              icon: FolderOpen,
              description: 'Teaching resources',
            },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex items-center gap-3 pt-6">
                  <link.icon className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{link.label}</p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
