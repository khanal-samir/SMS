'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useLogout } from '@/hooks/useAuth'

interface DashboardPageHeaderProps {
  title: string
  roleBadge: {
    text: string
    className: string
  }
}

export function DashboardPageHeader({ title, roleBadge }: DashboardPageHeaderProps) {
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`rounded px-2 py-1 text-sm ${roleBadge.className}`}>{roleBadge.text}</span>
        <Button onClick={() => logout()} disabled={isPending} variant="outline">
          {isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </header>
  )
}
