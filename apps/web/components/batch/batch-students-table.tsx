import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserAvatar } from '@/components/ui/user-avatar'
import type { User } from '@repo/schemas'

interface BatchStudentsTableProps {
  students: User[] | null | undefined
  isLoading: boolean
  studentLinkBasePath?: string
}

function BatchStudentsTable({ students, isLoading, studentLinkBasePath }: BatchStudentsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!students || students.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No students enrolled in this batch yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar name={student.name} image={student.image} />
                  {studentLinkBasePath ? (
                    <Link
                      href={`${studentLinkBasePath}/${student.id}`}
                      className="text-sm font-medium text-brand-accent hover:underline"
                    >
                      {student.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { BatchStudentsTable }
