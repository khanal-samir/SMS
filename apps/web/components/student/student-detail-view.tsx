'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/ui/user-avatar'
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
    ACTIVE: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  const labels: Record<string, string> = {
    ACTIVE: 'In Progress',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-800'}`}
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
      {/* Student Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <UserAvatar
              name={student.name}
              image={student.image}
              size="lg"
              className="size-16 text-lg"
            />
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
              <p className="text-sm text-gray-600">{student.email}</p>
              <div className="flex items-center gap-3 pt-2">
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                  Student
                </span>
                {student.batch && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Batch {student.batch.batchYear}
                  </span>
                )}
                {student.batch?.currentSemester && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {formatSemesterNumber(student.batch.currentSemester.semesterNumber)} Semester
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Batch</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {student.batch ? student.batch.batchYear : 'Not Enrolled'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Semester</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {student.batch?.currentSemester
                ? `${formatSemesterNumber(student.batch.currentSemester.semesterNumber)}`
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Semesters</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold ">{completedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Batch Status</CardDescription>
          </CardHeader>
          <CardContent>
            {student.batch ? (
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                  student.batch.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {student.batch.isActive ? 'Active' : 'Inactive'}
              </span>
            ) : (
              <p className="text-2xl font-bold text-gray-400">N/A</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Semester Progress Log */}
      <Card>
        <CardHeader>
          <CardTitle>Semester Progress</CardTitle>
          <CardDescription>
            {student.semesters.length > 0
              ? `${completedCount} completed, ${activeCount} in progress${failedCount > 0 ? `, ${failedCount} failed` : ''}`
              : 'No semester records found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {student.semesters.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>This student has no semester records yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.semesters.map((semester) => (
                    <TableRow key={semester.id}>
                      <TableCell className="font-medium">
                        {formatSemesterNumber(semester.semesterNumber)} Semester
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
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
        </CardContent>
      </Card>
    </div>
  )
}

export { StudentDetailView }
