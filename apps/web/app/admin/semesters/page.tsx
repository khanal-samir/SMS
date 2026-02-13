'use client'

import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useSemesters } from '@/hooks/useSemester'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatSemesterNumber, formatShortDate } from '@/lib/formatters'

export default function AdminSemestersPage() {
  const router = useRouter()
  const { data: semesters, isLoading } = useSemesters()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Semester Management</h1>
            <p className="text-gray-600">View all semesters and their subjects</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : semesters && semesters.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Semester</TableHead>
                  <TableHead className="px-6">Created</TableHead>
                  <TableHead className="px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesters.map((semester) => (
                  <TableRow
                    key={semester.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/semesters/${semester.id}`)}
                  >
                    <TableCell className="px-6 font-semibold text-gray-900">
                      {formatSemesterNumber(semester.semesterNumber)} Semester
                    </TableCell>
                    <TableCell className="px-6 text-sm text-gray-600">
                      {formatShortDate(semester.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation()
                          router.push(`/admin/semesters/${semester.id}`)
                        }}
                      >
                        View Subjects
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
            <p className="text-gray-500">No semesters available.</p>
          </div>
        )}
      </div>
    </div>
  )
}
