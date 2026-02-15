'use client'

import { useParams } from 'next/navigation'
import { useBatch } from '@/hooks/useBatch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BatchInfoCards } from '@/components/batch/batch-info-cards'
import { BatchStudentsTable } from '@/components/batch/batch-students-table'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'

export default function TeacherBatchDetailPage() {
  const params = useParams()
  const batchId = params.id as string

  const { data: batch, isLoading: isLoadingBatch } = useBatch(batchId)

  if (isLoadingBatch) {
    return <LoadingState />
  }

  if (!batch) {
    return (
      <NotFoundState
        title="Batch Not Found"
        message="The batch you're looking for could not be found."
        backButton={{ href: '/teacher/batches', label: 'Back to Batches' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/teacher/batches', label: 'All Batches' }}
          title={`Batch ${batch.batchYear}`}
          description="View batch details and enrolled students"
        />

        <BatchInfoCards batch={batch} />

        <Card>
          <CardHeader>
            <CardTitle>Enrolled Students</CardTitle>
            <CardDescription>Students currently enrolled in this batch</CardDescription>
          </CardHeader>
          <CardContent>
            <BatchStudentsTable students={batch.users} isLoading={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
