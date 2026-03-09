'use client'

import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSemesters } from '@/hooks/useSemester'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="Semester Management"
          description="View all semesters and their subjects"
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : semesters && semesters.length > 0 ? (
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
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
                    <TableCell className="px-6 font-semibold text-foreground">
                      {formatSemesterNumber(semester.semesterNumber)} Semester
                    </TableCell>
                    <TableCell className="px-6 text-sm text-muted-foreground">
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
          <div className="rounded-lg border bg-card py-16 text-center shadow-sm">
            <p className="text-muted-foreground">No semesters available.</p>
          </div>
        )}
      </div>
    </div>
  )
}
