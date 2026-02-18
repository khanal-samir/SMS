import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Courses — SMS Student',
  description: 'View your enrolled courses, assignments, and academic resources.',
}

export default function StudentCoursesLayout({ children }: { children: React.ReactNode }) {
  return children
}
