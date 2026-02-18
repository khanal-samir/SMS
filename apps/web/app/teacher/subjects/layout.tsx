import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Subjects — SMS Teacher',
  description: 'View and manage your assigned subjects and course materials.',
}

export default function TeacherSubjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
