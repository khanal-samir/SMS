'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBatch, useBatchStudents } from '@/hooks/useBatch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import { formatShortDate } from '@/lib/formatters'

export default function TeacherBatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const batchId = params.id as string

  const { data: batch, isLoading: isLoadingBatch } = useBatch(batchId)
  const { data: students, isLoading: isLoadingStudents } = useBatchStudents(batchId)

  if (isLoadingBatch) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500">Batch not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/teacher/batches')}>
          Back to Batches
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/teacher/batches')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Batches
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Batch {batch.batchYear}</h1>
            <p className="text-gray-600">View batch details and enrolled students</p>
          </div>
        </div>

        {/* Batch Info */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Batch Year</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{batch.batchYear}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Start Date</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatShortDate(batch.startDate)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{batch.totalStudents}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Status</CardDescription>
            </CardHeader>
            <CardContent>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                  batch.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {batch.isActive ? 'Active' : 'Inactive'}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Enrolled Students</CardTitle>
            <CardDescription>Students currently enrolled in this batch</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStudents ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : students && students.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                              <span className="text-xs font-semibold">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {student.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No students enrolled in this batch yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
