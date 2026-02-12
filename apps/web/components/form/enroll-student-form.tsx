'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useEnrollStudent, useUnenrolledStudents } from '@/hooks/useBatch'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EnrollStudentFormProps {
  batchId: string
  onSuccess?: () => void
}

export function EnrollStudentForm({ batchId, onSuccess }: EnrollStudentFormProps) {
  const { data: students, isLoading: isLoadingStudents } = useUnenrolledStudents()
  const { mutate: enrollStudent, isPending } = useEnrollStudent(batchId)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStudents = students?.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEnroll = () => {
    if (!selectedStudentId) return
    enrollStudent(
      { studentId: selectedStudentId },
      {
        onSuccess: () => {
          setSelectedStudentId('')
          setSearchQuery('')
          onSuccess?.()
        },
      },
    )
  }

  if (isLoadingStudents) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!students || students.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No unenrolled students available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="student-search">Search Students</Label>
        <Input
          id="student-search"
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isPending}
          className="mt-1"
        />
      </div>

      <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-2">
        {filteredStudents && filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => setSelectedStudentId(student.id)}
              disabled={isPending}
              className={`w-full rounded-md border p-3 text-left transition-colors ${
                selectedStudentId === student.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-gray-900">{student.name}</p>
              <p className="text-sm text-gray-500">{student.email}</p>
            </button>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-gray-500">No students match your search.</p>
        )}
      </div>

      <Button onClick={handleEnroll} className="w-full" disabled={isPending || !selectedStudentId}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enrolling...
          </>
        ) : (
          'Enroll Student'
        )}
      </Button>
    </div>
  )
}
