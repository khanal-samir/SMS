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
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!students || students.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No students enrolled in this batch yet.</p>
      </div>
    )
  }

  return (
    <div className="card-elevated overflow-hidden">
      <Table className="table-clean">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
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
                      className="font-medium text-foreground hover:underline"
                    >
                      {student.name}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{student.name}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { BatchStudentsTable }
