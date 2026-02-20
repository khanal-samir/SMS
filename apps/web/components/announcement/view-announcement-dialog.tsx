'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatShortDate } from '@/lib/formatters'
import type { AnnouncementResponse } from '@repo/schemas'

interface ViewAnnouncementDialogProps {
  announcement: AnnouncementResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  showReadCount?: boolean
}

function ViewAnnouncementDialog({
  announcement,
  open,
  onOpenChange,
  showReadCount = false,
}: ViewAnnouncementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {announcement.title}
            {announcement.isPublished ? (
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                Published
              </Badge>
            ) : announcement.scheduledAt ? (
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                Scheduled
              </Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="whitespace-pre-wrap text-sm text-gray-700">{announcement.message}</div>

          <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Author</span>
              <span className="font-medium text-gray-900">
                {announcement.createdBy.name} ({announcement.createdBy.role})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Batch</span>
              <span className="font-medium text-gray-900">
                {announcement.batch ? `Batch ${announcement.batch.batchYear}` : 'Global'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="font-medium text-gray-900">
                {formatShortDate(announcement.createdAt)}
              </span>
            </div>
            {announcement.publishedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Published</span>
                <span className="font-medium text-gray-900">
                  {formatShortDate(announcement.publishedAt)}
                </span>
              </div>
            )}
            {announcement.scheduledAt && !announcement.isPublished && (
              <div className="flex justify-between">
                <span className="text-gray-500">Scheduled For</span>
                <span className="font-medium text-gray-900">
                  {formatShortDate(announcement.scheduledAt)}
                </span>
              </div>
            )}
            {showReadCount && (
              <div className="flex justify-between">
                <span className="text-gray-500">Read by</span>
                <span className="font-medium text-gray-900">
                  {announcement.readCount ?? 0} user(s)
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ViewAnnouncementDialog }
