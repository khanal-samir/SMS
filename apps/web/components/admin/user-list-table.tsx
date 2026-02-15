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
import type { User } from '@repo/schemas'

interface UserListTableProps {
  users: User[] | null | undefined
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { UserListTable }
