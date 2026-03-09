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
              <Badge variant="success">Published</Badge>
            ) : announcement.scheduledAt ? (
              <Badge variant="info">Scheduled</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {announcement.message}
          </div>

          <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Author</span>
              <span className="font-medium text-foreground">
                {announcement.createdBy.name} ({announcement.createdBy.role})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch</span>
              <span className="font-medium text-foreground">
                {announcement.batch ? `Batch ${announcement.batch.batchYear}` : 'Global'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium text-foreground">
                {formatShortDate(announcement.createdAt)}
              </span>
            </div>
            {announcement.publishedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Published</span>
                <span className="font-medium text-foreground">
                  {formatShortDate(announcement.publishedAt)}
                </span>
              </div>
            )}
            {announcement.scheduledAt && !announcement.isPublished && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled For</span>
                <span className="font-medium text-foreground">
                  {formatShortDate(announcement.scheduledAt)}
                </span>
              </div>
            )}
            {showReadCount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Read by</span>
                <span className="font-medium text-foreground">
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
