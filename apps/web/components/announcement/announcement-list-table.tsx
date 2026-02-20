'use client'

import { useState } from 'react'
import { Loader2, Trash2, Pencil, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatShortDate } from '@/lib/formatters'
import { useDeleteAnnouncement } from '@/hooks/useAnnouncement'
import { EditAnnouncementDialog } from './edit-announcement-dialog'
import { ViewAnnouncementDialog } from './view-announcement-dialog'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import type { AnnouncementResponse } from '@repo/schemas'

interface AnnouncementListTableProps {
  announcements: AnnouncementResponse[] | null | undefined
  isLoading: boolean
  showReadCount?: boolean
  canEdit?: (announcement: AnnouncementResponse) => boolean
  canDelete?: (announcement: AnnouncementResponse) => boolean
  backHref: string
}

function AnnouncementListTable({
  announcements,
  isLoading,
  showReadCount = false,
  canEdit,
  canDelete,
  backHref,
}: AnnouncementListTableProps) {
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementResponse | null>(null)
  const [viewingAnnouncement, setViewingAnnouncement] = useState<AnnouncementResponse | null>(null)
  const { mutate: deleteAnnouncement, isPending: isDeleting } = useDeleteAnnouncement()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
    deleteAnnouncement(id, {
      onSettled: () => setDeletingId(null),
    })
  }

  if (isLoading) {
    return <LoadingState message="Loading Announcements" />
  }

  if (!announcements || announcements.length === 0) {
    return (
      <NotFoundState
        title="No Announcements Found"
        message="There are no announcements yet. Create one to get started."
        backButton={{ href: backHref, label: 'Back to Dashboard' }}
      />
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
              {showReadCount && <TableHead>Reads</TableHead>}
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => {
              const isEditable = canEdit ? canEdit(announcement) : false
              const isDeletable = canDelete ? canDelete(announcement) : false

              return (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <span className="text-sm font-semibold text-gray-900">
                      {announcement.title}
                    </span>
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                      {announcement.message}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {announcement.createdBy.name}
                    <span className="ml-1 text-xs text-gray-400">
                      ({announcement.createdBy.role})
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {announcement.batch ? `Batch ${announcement.batch.batchYear}` : 'Global'}
                  </TableCell>
                  <TableCell>
                    {announcement.isPublished ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                      >
                        Published
                      </Badge>
                    ) : announcement.scheduledAt ? (
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        Scheduled
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  {showReadCount && (
                    <TableCell className="text-sm text-gray-600">
                      {announcement.readCount ?? 0}
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-gray-600">
                    {formatShortDate(announcement.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingAnnouncement(announcement)}
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View
                      </Button>
                      {isEditable && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAnnouncement(announcement)}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      )}
                      {isDeletable && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
                          disabled={isDeleting && deletingId === announcement.id}
                        >
                          {isDeleting && deletingId === announcement.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {editingAnnouncement && (
        <EditAnnouncementDialog
          announcement={editingAnnouncement}
          open={!!editingAnnouncement}
          onOpenChange={(open) => {
            if (!open) setEditingAnnouncement(null)
          }}
        />
      )}

      {viewingAnnouncement && (
        <ViewAnnouncementDialog
          announcement={viewingAnnouncement}
          open={!!viewingAnnouncement}
          onOpenChange={(open) => {
            if (!open) setViewingAnnouncement(null)
          }}
          showReadCount={showReadCount}
        />
      )}
    </>
  )
}

export { AnnouncementListTable }
