'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useBatch, useAdvanceSemester } from '@/hooks/useBatch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EnrollStudentForm } from '@/components/form/enroll-student-form'
import { BatchInfoCards } from '@/components/batch/batch-info-cards'
import { BatchStudentsTable } from '@/components/batch/batch-students-table'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { Loader2, UserPlus, ChevronRight } from 'lucide-react'

export default function AdminBatchDetailPage() {
  const params = useParams()
  const batchId = params.id as string

  const { data: batch, isLoading: isLoadingBatch } = useBatch(batchId)
  const { mutate: advanceSemester, isPending: isAdvancing } = useAdvanceSemester()

  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const [showAdvanceConfirm, setShowAdvanceConfirm] = useState(false)

  const handleAdvanceSemester = () => {
    advanceSemester(batchId, {
      onSuccess: () => setShowAdvanceConfirm(false),
      onError: () => setShowAdvanceConfirm(false),
    })
  }

  if (isLoadingBatch) {
    return <LoadingState />
  }

  if (!batch) {
    return (
      <NotFoundState
        title="Batch Not Found"
        message="The batch you're looking for could not be found."
        backButton={{ href: '/admin/batches', label: 'Back to Batches' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/batches', label: 'All Batches' }}
          title={`Batch ${batch.batchYear}`}
          description="Manage batch details and enrolled students"
          actions={
            batch.isActive && (
              <>
                <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Enroll Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enroll Student in Batch {batch.batchYear}</DialogTitle>
                      <DialogDescription>
                        Select a student to enroll in this batch. Only unenrolled students are
                        shown.
                      </DialogDescription>
                    </DialogHeader>
                    <EnrollStudentForm
                      batchId={batchId}
                      onSuccess={() => setIsEnrollDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={showAdvanceConfirm} onOpenChange={setShowAdvanceConfirm}>
                  <DialogTrigger asChild>
                    <Button>
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Advance Semester
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advance Semester</DialogTitle>
                      <DialogDescription>
                        This will move all students in Batch {batch.batchYear} to the next semester.
                        Current semester student records will be marked as completed. This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowAdvanceConfirm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAdvanceSemester} disabled={isAdvancing}>
                        {isAdvancing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Advancing...
                          </>
                        ) : (
                          'Confirm Advance'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )
          }
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
