'use client'

import { useState } from 'react'
import {
  Users,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Megaphone,
  ShieldAlert,
  Loader2,
  UserPlus,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { StatsStrip } from '@/components/dashboard/stats-strip'
import { ContentSection } from '@/components/dashboard/content-section'
import { LoadingState } from '@/components/ui/loading-state'
import { UserAvatar } from '@/components/ui/user-avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
          title="Admin Dashboard"
          roleBadge={{ text: 'Admin', variant: 'destructive' }}
        />

        <StatsStrip
          stats={[
            {
              label: 'Students',
              value: data?.stats.totalStudents ?? 0,
              icon: Users,
              iconColor: 'text-info',
              iconBg: 'bg-info/10',
            },
            {
              label: 'Teachers',
              value: data?.stats.totalTeachers ?? 0,
              icon: GraduationCap,
              iconColor: 'text-primary',
              iconBg: 'bg-primary/10',
            },
            {
              label: 'Batches',
              value: data?.stats.totalBatches ?? 0,
              icon: BarChart3,
              iconColor: 'text-success-foreground',
              iconBg: 'bg-success/15',
            },
            {
              label: 'Subjects',
              value: data?.stats.totalSubjects ?? 0,
              icon: BookOpen,
              iconColor: 'text-warning-foreground',
              iconBg: 'bg-warning/15',
            },
            {
              label: 'Pending approvals',
              value: data?.stats.pendingApprovals ?? 0,
              icon: ShieldAlert,
              iconColor: 'text-destructive',
              iconBg: 'bg-destructive/10',
            },
          ]}
        />

        <ContentSection
          icon={UserPlus}
          title="Pending approvals"
          description="Teachers awaiting approval"
          badge={
            data?.pendingTeachers && data.pendingTeachers.length > 0
              ? { value: data.pendingTeachers.length, variant: 'destructive' }
              : undefined
          }
        >
          {data?.pendingTeachers && data.pendingTeachers.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <Table className="table-clean">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Teacher</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pendingTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar name={teacher.name} />
                          <span className="font-medium text-foreground">{teacher.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {formatShortDate(teacher.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            setApprovingId(teacher.id)
                            approveTeacher(teacher.id, {
                              onSettled: () => setApprovingId(null),
                            })
                          }}
                          disabled={approvingId === teacher.id}
                        >
                          {approvingId === teacher.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            'Approve'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="card-elevated py-10 text-center">
              <p className="text-sm text-muted-foreground">No pending approvals</p>
            </div>
          )}
        </ContentSection>

        <ContentSection
          icon={ClipboardList}
          title="Recent assignments"
          description="Across all batches"
          href="/admin/assignments"
          className="mt-10"
        >
          {data?.recentAssignments && data.recentAssignments.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <Table className="table-clean">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
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
                        <TableCell className="text-muted-foreground">
                          {assignment.subjectTeacher.teacher.name}
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
          description="System-wide announcements"
          href="/admin/announcements"
          className="mt-10"
        >
          {data?.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="card-elevated p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{announcement.title}</p>
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
