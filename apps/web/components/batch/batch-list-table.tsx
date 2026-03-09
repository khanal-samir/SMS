'use client'

import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatShortDate } from '@/lib/formatters'
import type { BatchResponse } from '@repo/schemas'

interface BatchListTableProps {
  batches: BatchResponse[] | null | undefined
  isLoading: boolean
  basePath: string
  actionLabel?: string
  emptyMessage?: string
  emptySubMessage?: string
}

function BatchListTable({
  batches,
  isLoading,
  basePath,
  actionLabel = 'View Details',
  emptyMessage = 'No batches created yet.',
  emptySubMessage,
}: BatchListTableProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!batches || batches.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-16 text-center shadow-sm">
        <p className="text-muted-foreground">{emptyMessage}</p>
        {emptySubMessage && <p className="mt-1 text-sm text-muted-foreground">{emptySubMessage}</p>}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Year</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Total Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow
              key={batch.id}
              className="cursor-pointer"
              onClick={() => router.push(`${basePath}/${batch.id}`)}
            >
              <TableCell>
                <span className="text-sm font-semibold text-foreground">{batch.batchYear}</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatShortDate(batch.startDate)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {batch.endDate ? formatShortDate(batch.endDate) : '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{batch.totalStudents}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    batch.isActive
                      ? 'bg-success/15 text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {batch.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`${basePath}/${batch.id}`)
                  }}
                >
                  {actionLabel}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { BatchListTable }
