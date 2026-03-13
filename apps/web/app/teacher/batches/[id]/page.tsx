'use client'

import { useParams } from 'next/navigation'
import { Users } from 'lucide-react'
import { useBatch } from '@/hooks/useBatch'
import { BatchInfoCards } from '@/components/batch/batch-info-cards'
import { SectionHeader } from '@/components/ui/section-header'
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/teacher/batches', label: 'All Batches' }}
          title={`Batch ${batch.batchYear}`}
          description="View batch details and enrolled students"
        />

        <BatchInfoCards batch={batch} />

        <section className="mt-8">
          <SectionHeader
            icon={Users}
            title="Enrolled students"
            description="Students currently enrolled in this batch"
          />
          <BatchStudentsTable
            students={batch.users}
            isLoading={false}
            studentLinkBasePath={`/teacher/batches/${batchId}/students`}
          />
        </section>
      </div>
    </div>
  )
}
