'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBatch } from '@/hooks/useBatch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BatchInfoCards } from '@/components/batch/batch-info-cards'
import { BatchStudentsTable } from '@/components/batch/batch-students-table'
import { PageHeader } from '@/components/ui/page-header'
import { Loader2 } from 'lucide-react'

export default function TeacherBatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const batchId = params.id as string

  const { data: batch, isLoading: isLoadingBatch } = useBatch(batchId)

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
