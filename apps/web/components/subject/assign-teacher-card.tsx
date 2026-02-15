'use client'

import { useState, useMemo } from 'react'
import { Loader2, Users } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UserAvatar } from '@/components/ui/user-avatar'
import type { User } from '@repo/schemas'

interface AssignTeacherCardProps {
  availableTeachers: User[]
  isLoading: boolean
  onAssign: (teacher: User) => void
  isAssigning: boolean
}

function AssignTeacherCard({
  availableTeachers,
  isLoading,
  onAssign,
  isAssigning,
}: AssignTeacherCardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounceValue(searchQuery, 300)

  const filteredTeachers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) return availableTeachers
    return availableTeachers.filter((teacher) =>
      [teacher.name, teacher.email].some((value) => value.toLowerCase().includes(query)),
    )
  }, [availableTeachers, debouncedSearch])

  const handleAssign = (teacher: User) => {
    onAssign(teacher)
    setSearchQuery('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Teachers</CardTitle>
        <CardDescription>Select an approved teacher to assign.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            placeholder="Search teachers by name or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pr-4"
          />
        </div>
        <div className="mt-4 max-h-80 space-y-3 overflow-auto rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar name={teacher.name} size="lg" />
                  <div>
                    <p className="font-semibold text-gray-900">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                </div>
                <Button size="sm" disabled={isAssigning} onClick={() => handleAssign(teacher)}>
                  Assign
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-2 rounded-full bg-gray-100 p-3">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">No teachers found</p>
              <p className="text-xs text-gray-500">
                {debouncedSearch.trim()
                  ? 'Try adjusting your search'
                  : 'All approved teachers are already assigned'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { AssignTeacherCard }
