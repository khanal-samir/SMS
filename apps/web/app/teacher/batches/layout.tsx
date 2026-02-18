import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Batches — SMS Teacher',
  description: 'Browse student batches, view enrolled students, and track batch progress.',
}

export default function TeacherBatchesLayout({ children }: { children: React.ReactNode }) {
  return children
}
