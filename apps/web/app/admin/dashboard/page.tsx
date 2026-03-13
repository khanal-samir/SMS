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
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { StatCards } from '@/components/ui/stat-cards'
import { SectionHeader } from '@/components/ui/section-header'
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

        {/* Pending teacher approvals — full-width table */}
        <section>
          <SectionHeader
            icon={UserPlus}
            title="Pending approvals"
            description="Teachers awaiting approval"
            badge={
              data?.pendingTeachers && data.pendingTeachers.length > 0
                ? { value: data.pendingTeachers.length, variant: 'destructive' }
                : undefined
            }
          />
          {data?.pendingTeachers && data.pendingTeachers.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">Teacher</TableHead>
                    <TableHead className="px-4">Email</TableHead>
                    <TableHead className="px-4">Registered</TableHead>
                    <TableHead className="px-4 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pendingTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={teacher.name} />
                          <span className="font-medium text-foreground">{teacher.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 text-muted-foreground">{teacher.email}</TableCell>
                      <TableCell className="px-4 text-muted-foreground tabular-nums">
                        {formatShortDate(teacher.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 text-right">
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
            <div className="rounded-lg border py-8 text-center">
              <p className="text-sm text-muted-foreground">No pending approvals</p>
            </div>
          )}
        </section>

        {/* Recent assignments — full-width table */}
        <section className="mt-8">
          <SectionHeader
            icon={ClipboardList}
            title="Recent assignments"
            description="Across all batches"
            href="/admin/assignments"
          />
          {data?.recentAssignments && data.recentAssignments.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">Title</TableHead>
                    <TableHead className="px-4">Subject</TableHead>
                    <TableHead className="px-4">Teacher</TableHead>
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
                        <TableCell className="px-4 text-muted-foreground">
                          {assignment.subjectTeacher.teacher.name}
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
            description="System-wide announcements"
            href="/admin/announcements"
          />
          {data?.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border p-3">
                  <p className="truncate font-medium text-foreground">{announcement.title}</p>
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
