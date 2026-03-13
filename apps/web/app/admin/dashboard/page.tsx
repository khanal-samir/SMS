'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Megaphone,
  ShieldAlert,
  ArrowRight,
  Loader2,
  UserPlus,
  BarChart3,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { StatCards } from '@/components/ui/stat-cards'
import { LoadingState } from '@/components/ui/loading-state'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useAdminDashboard } from '@/hooks/useDashboard'
import { useApproveTeacher } from '@/hooks/useTeacherApproval'
import { formatShortDate, getDueDateInfo } from '@/lib/formatters'

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard()
  const { mutate: approveTeacher } = useApproveTeacher()
  const [approvingId, setApprovingId] = useState<string | null>(null)

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Admin Dashboard"
          roleBadge={{ text: 'Admin', variant: 'destructive' }}
        />

        {/* Stat cards row */}
        <StatCards
          columns={5}
          stats={[
            {
              label: 'Students',
              value: data?.stats.totalStudents ?? 0,
              icon: Users,
            },
            {
              label: 'Teachers',
              value: data?.stats.totalTeachers ?? 0,
              icon: GraduationCap,
            },
            {
              label: 'Batches',
              value: data?.stats.totalBatches ?? 0,
              icon: BarChart3,
            },
            {
              label: 'Subjects',
              value: data?.stats.totalSubjects ?? 0,
              icon: BookOpen,
            },
            {
              label: 'Pending approvals',
              value: data?.stats.pendingApprovals ?? 0,
              icon: ShieldAlert,
            },
          ]}
        />

        {/* Bento grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Pending teacher approvals — 2 cols */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="size-4 text-muted-foreground" />
                Pending approvals
                {data?.pendingTeachers && data.pendingTeachers.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {data.pendingTeachers.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Teachers awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.pendingTeachers && data.pendingTeachers.length > 0 ? (
                <div className="space-y-3">
                  {data.pendingTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar name={teacher.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{teacher.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setApprovingId(teacher.id)
                          approveTeacher(teacher.id, {
                            onSettled: () => setApprovingId(null),
                          })
                        }}
                        disabled={approvingId === teacher.id}
                        className="ml-3 shrink-0"
                      >
                        {approvingId === teacher.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          'Approve'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No pending approvals
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
                <CardDescription>Across all batches</CardDescription>
              </div>
              <Link
                href="/admin/assignments"
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
                            {assignment.subjectTeacher.subject.subjectName} &middot;{' '}
                            {assignment.subjectTeacher.teacher.name} &middot; Batch{' '}
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
              <CardDescription>System-wide announcements</CardDescription>
            </div>
            <Link
              href="/admin/announcements"
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
                    <p className="truncate font-medium text-foreground">{announcement.title}</p>
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
              label: 'Users',
              href: '/admin/users',
              icon: Users,
              description: 'Manage all users',
            },
            {
              label: 'Batches',
              href: '/admin/batches',
              icon: GraduationCap,
              description: 'Manage student batches',
            },
            {
              label: 'Semesters',
              href: '/admin/semesters',
              icon: BookOpen,
              description: 'Manage semesters & subjects',
            },
            {
              label: 'Chat',
              href: '/admin/chat',
              icon: MessageSquare,
              description: 'View batch chats',
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
