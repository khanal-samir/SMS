import { AnnouncementsPage } from '@/components/announcement/announcements-page'

export default function AdminAnnouncementsPage() {
  return (
    <AnnouncementsPage
      variant="admin"
      backHref="/admin/dashboard"
      title="Announcement Management"
      description="View and manage all announcements across the system"
    />
  )
}
