import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Details — SMS Student',
  description: 'View your student profile, academic progress, and personal information.',
}

export default function StudentMyDetailsLayout({ children }: { children: React.ReactNode }) {
  return children
}
