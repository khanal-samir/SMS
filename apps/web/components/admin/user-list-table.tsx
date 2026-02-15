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
import { AllUsersResponse, RoleEnum } from '@repo/schemas'

interface UserListTableProps {
  users: AllUsersResponse[] | null | undefined
  isLoading: boolean
  emptyMessage?: string
}

function UserListTable({ users, isLoading, emptyMessage = 'No users found.' }: UserListTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading users..." />
  }

  if (!users || users.length === 0) {
    return <NotFoundState title="No Users" message={emptyMessage} />
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {users.some((user) => user.role === RoleEnum.enum.TEACHER) && (
              <TableHead>Approval Status</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.name} image={user.image} size="default" />
                  <span className="text-sm font-semibold text-gray-900">{user.name ?? '-'}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
              {user.role === RoleEnum.enum.TEACHER && (
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.isTeacherApproved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.isTeacherApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { UserListTable }
