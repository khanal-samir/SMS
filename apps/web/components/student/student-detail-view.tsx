'use client'

import { GraduationCap, Calendar, CheckCircle2, Activity } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { StatsStrip } from '@/components/dashboard/stats-strip'
import { ContentSection } from '@/components/dashboard/content-section'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatSemesterNumber, formatShortDate } from '@/lib/formatters'
import { StudentSemesterStatusEnum, type StudentDetailResponse } from '@repo/schemas'

interface StudentDetailViewProps {
  student: StudentDetailResponse
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-info/15 text-info-foreground',
    COMPLETED: 'bg-success/15 text-success-foreground',
    FAILED: 'bg-destructive/10 text-destructive',
  }

  const labels: Record<string, string> = {
    ACTIVE: 'In Progress',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-muted text-muted-foreground'}`}
    >
      {labels[status] ?? status}
    </span>
  )
}

function StudentDetailView({ student }: StudentDetailViewProps) {
  const completedCount = student.semesters.filter(
    (s) => s.status === StudentSemesterStatusEnum.enum.COMPLETED,
  ).length
  const activeCount = student.semesters.filter(
    (s) => s.status === StudentSemesterStatusEnum.enum.ACTIVE,
  ).length
  const failedCount = student.semesters.filter(
    (s) => s.status === StudentSemesterStatusEnum.enum.FAILED,
  ).length

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="flex items-start gap-5">
        <UserAvatar
          name={student.name}
          image={student.image}
          size="lg"
          className="size-16 text-lg"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-foreground">{student.name}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{student.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
              Student
            </span>
            {student.batch && (
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Batch {student.batch.batchYear}
              </span>
            )}
            {student.batch?.currentSemester && (
              <span className="inline-flex items-center rounded-full bg-info/15 px-2.5 py-0.5 text-xs font-medium text-info-foreground">
                {formatSemesterNumber(student.batch.currentSemester.semesterNumber)} Semester
              </span>
            )}
            {student.batch && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  student.batch.isActive
                    ? 'bg-success/15 text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {student.batch.isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <StatsStrip
        stats={[
          {
            label: 'Batch',
            value: student.batch ? student.batch.batchYear : 'N/A',
            icon: GraduationCap,
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
          },
          {
            label: 'Current semester',
            value: student.batch?.currentSemester
              ? formatSemesterNumber(student.batch.currentSemester.semesterNumber)
              : 'N/A',
            icon: Calendar,
            iconColor: 'text-info',
            iconBg: 'bg-info/10',
          },
          {
            label: 'Completed',
            value: completedCount,
            icon: CheckCircle2,
            iconColor: 'text-success-foreground',
            iconBg: 'bg-success/15',
          },
          {
            label: 'In progress',
            value: activeCount,
            icon: Activity,
            iconColor: 'text-warning-foreground',
            iconBg: 'bg-warning/15',
          },
        ]}
      />

      {/* Semester progress table */}
      <ContentSection
        icon={GraduationCap}
        title="Semester progress"
        description={
          student.semesters.length > 0
            ? `${completedCount} completed, ${activeCount} in progress${failedCount > 0 ? `, ${failedCount} failed` : ''}`
            : 'No semester records found'
        }
        className="mt-10"
      >
        {student.semesters.length === 0 ? (
          <div className="card-elevated py-10 text-center">
            <p className="text-muted-foreground">This student has no semester records yet.</p>
          </div>
        ) : (
          <div className="card-elevated overflow-hidden">
            <Table className="table-clean">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Semester</TableHead>
                  <TableHead>Enrolled date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.semesters.map((semester) => (
                  <TableRow key={semester.id}>
                    <TableCell className="font-medium text-foreground">
                      {formatSemesterNumber(semester.semesterNumber)} Semester
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatShortDate(semester.enrolledAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={semester.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ContentSection>
    </div>
  )
}

export { StudentDetailView }
