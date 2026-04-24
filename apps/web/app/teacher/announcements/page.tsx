import { AnnouncementsPage } from '@/components/announcement/announcements-page'

export default function TeacherAnnouncementsPage() {
  return (
    <AnnouncementsPage
      variant="teacher"
      backHref="/teacher/dashboard"
      title="Announcements"
      description="Manage your announcements and view others"
    />
  )
}
