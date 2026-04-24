import { ResourcesPage } from '@/components/resource/resources-page'

export default function TeacherResourcesPage() {
  return (
    <ResourcesPage
      variant="teacher"
      backHref="/teacher/dashboard"
      title="Resources"
      description="Upload and manage teaching resources for your subjects"
    />
  )
}
