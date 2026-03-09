'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { formatShortDate } from '@/lib/formatters'
import { useMarkAnnouncementAsRead } from '@/hooks/useAnnouncement'
import { ViewAnnouncementDialog } from './view-announcement-dialog'
import { Eye, CheckCircle2, Circle } from 'lucide-react'
import type { AnnouncementResponse } from '@repo/schemas'

interface StudentAnnouncementListProps {
  announcements: AnnouncementResponse[] | null | undefined
  isLoading: boolean
}

function StudentAnnouncementList({ announcements, isLoading }: StudentAnnouncementListProps) {
  const [viewingAnnouncement, setViewingAnnouncement] = useState<AnnouncementResponse | null>(null)
  const { mutate: markAsRead } = useMarkAnnouncementAsRead()

  const handleView = (announcement: AnnouncementResponse) => {
    setViewingAnnouncement(announcement)
    if (!announcement.isRead) {
      markAsRead(announcement.id)
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading Announcements" />
  }

  if (!announcements || announcements.length === 0) {
    return (
      <NotFoundState
        title="No Announcements"
        message="There are no announcements at this time. Check back later."
        backButton={{ href: '/student/dashboard', label: 'Back to Dashboard' }}
      />
    )
  }

  const unreadCount = announcements.filter((a) => !a.isRead).length

  return (
    <>
      {unreadCount > 0 && (
        <div className="mb-4 rounded-lg border border-info/30 bg-info/10 p-3 text-sm text-info-foreground">
          You have <span className="font-semibold">{unreadCount}</span> unread announcement
          {unreadCount > 1 ? 's' : ''}.
        </div>
      )}

      <div className="space-y-3">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className={`transition-colors ${
              announcement.isRead ? 'border bg-card' : 'border-info/30 bg-info/5'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {announcement.isRead ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-blue-500" />
                  )}
                  <CardTitle className="text-base font-semibold text-foreground">
                    {announcement.title}
                  </CardTitle>
                  {!announcement.isRead && <Badge variant="info">New</Badge>}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleView(announcement)}>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  View
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{announcement.message}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span>By {announcement.createdBy.name}</span>
                <span>·</span>
                <span>{formatShortDate(announcement.createdAt)}</span>
                {announcement.batch && (
                  <>
                    <span>·</span>
                    <span>Batch {announcement.batch.batchYear}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewingAnnouncement && (
        <ViewAnnouncementDialog
          announcement={viewingAnnouncement}
          open={!!viewingAnnouncement}
          onOpenChange={(open) => {
            if (!open) setViewingAnnouncement(null)
          }}
        />
      )}
    </>
  )
}

export { StudentAnnouncementList }
