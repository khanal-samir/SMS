'use client'

import { useState } from 'react'
import { useBatches } from '@/hooks/useBatch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateBatchForm } from '@/components/form/create-batch-form'
import { BatchListTable } from '@/components/batch/batch-list-table'
import { PageHeader } from '@/components/ui/page-header'
import { Plus } from 'lucide-react'

export default function AdminBatchesPage() {
  const { data: batches, isLoading } = useBatches()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="Batch Management"
          description="Create and manage student batches"
          actions={
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Batch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Batch</DialogTitle>
                  <DialogDescription>
                    Add a new student batch. The batch will start at the first semester.
                  </DialogDescription>
                </DialogHeader>
                <CreateBatchForm onSuccess={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />

        <BatchListTable
          batches={batches}
          isLoading={isLoading}
          basePath="/admin/batches"
          emptyMessage="No batches created yet."
          emptySubMessage='Click "Create Batch" to add your first batch.'
        />
      </div>
    </div>
  )
}
