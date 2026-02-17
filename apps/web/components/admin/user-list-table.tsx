'use client'
import { Fragment, useState } from 'react'
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
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { AllUsersResponse } from '@repo/schemas'
import { useDeleteUser } from '@/hooks/useUser'
import type { UserTabType } from '@/types/user-tabs'

interface UserListTableProps {
  users: AllUsersResponse[] | null | undefined
  isLoading: boolean
  emptyMessage?: string
  activeTab: UserTabType
}

interface BatchGroup {
  id: string | null
  name: string
  year: number | null
  isActive: boolean | null
  students: AllUsersResponse[]
}

function groupStudentsByBatch(students: AllUsersResponse[]): BatchGroup[] {
  const batchMap = new Map<string | null, BatchGroup>()

  for (const student of students) {
    const batchId = student.batch?.id ?? null
    const batchKey = batchId ?? 'unenrolled'

    if (!batchMap.has(batchKey)) {
      batchMap.set(batchKey, {
        id: batchId,
        name: student.batch?.batchYear ? `Batch ${student.batch.batchYear}` : 'Unenrolled',
        year: student.batch?.batchYear ?? null,
        isActive: student.batch?.isActive ?? null,
        students: [],
      })
    }

    batchMap.get(batchKey)!.students.push(student)
  }

  const groups = Array.from(batchMap.values())

  return groups.sort((a, b) => {
    if (a.id === null) return 1
    if (b.id === null) return -1
    return (b.year ?? 0) - (a.year ?? 0)
  })
}

function DeleteButton({ userId, onDelete }: { userId: string; onDelete: (id: string) => void }) {
  const [isPending, setIsPending] = useState(false)

  const handleDelete = () => {
    setIsPending(true)
    onDelete(userId)
    setIsPending(false)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Delete"
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function StudentTable({
  students,
  onDelete,
}: {
  students: AllUsersResponse[]
  onDelete: (id: string) => void
}) {
  const batchGroups = groupStudentsByBatch(students)

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batchGroups.map((group) => (
            <Fragment key={group.id ?? 'unenrolled'}>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableCell colSpan={3} className="py-2 font-semibold">
                  <div className="flex items-center gap-2">
                    <span>{group.name}</span>
                    <span className="ml-2 font-normal text-muted-foreground">
                      {group.students.length}
                    </span>
                    {group.isActive !== null && (
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          group.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {group.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              {group.students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={student.name} image={student.image} size="sm" />
                      <Link
                        href={`/admin/users/students/${student.id}`}
                        className="text-sm font-semibold text-brand-accent hover:underline"
                      >
                        {student.name ?? '-'}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{student.email}</TableCell>

                  <TableCell>
                    <DeleteButton userId={student.id} onDelete={onDelete} />
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TeacherTable({
  teachers,
  onDelete,
}: {
  teachers: AllUsersResponse[]
  onDelete: (id: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[180px]">Approval Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar name={teacher.name} image={teacher.image} size="sm" />
                  <span className="text-sm font-semibold text-gray-900">{teacher.name ?? '-'}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{teacher.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    teacher.isTeacherApproved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {teacher.isTeacherApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </TableCell>
              <TableCell>
                <DeleteButton userId={teacher.id} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AdminTable({ admins }: { admins: AllUsersResponse[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar name={admin.name} image={admin.image} size="sm" />
                  <span className="text-sm font-semibold text-gray-900">{admin.name ?? '-'}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{admin.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function UserListTable({
  users,
  isLoading,
  emptyMessage = 'No users found.',
  activeTab,
}: UserListTableProps) {
  const deleteMutation = useDeleteUser()

  const handleDelete = async (userId: string) => {
    return await deleteMutation.mutateAsync(userId)
  }

  if (isLoading) {
    return <LoadingState message="Loading users..." />
  }

  if (!users || users.length === 0) {
    return <NotFoundState title="No Users" message={emptyMessage} />
  }

  if (activeTab === 'students') {
    if (users.length === 0) {
      return <NotFoundState title="No Students" message={emptyMessage} />
    }
    return <StudentTable students={users} onDelete={handleDelete} />
  }

  if (activeTab === 'teachers') {
    if (users.length === 0) {
      return <NotFoundState title="No Teachers" message={emptyMessage} />
    }
    return <TeacherTable teachers={users} onDelete={handleDelete} />
  }

  if (activeTab === 'admins') {
    if (users.length === 0) {
      return <NotFoundState title="No Admins" message={emptyMessage} />
    }
    return <AdminTable admins={users} />
  }

  return <NotFoundState title="No Users" message={emptyMessage} />
}

export { UserListTable }
