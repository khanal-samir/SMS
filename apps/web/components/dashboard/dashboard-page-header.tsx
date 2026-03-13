'use client'

import { useAuthStore } from '@/store/auth.store'
import { Badge } from '@/components/ui/badge'

interface DashboardPageHeaderProps {
  title: string
  roleBadge: {
    text: string
    variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' | 'destructive'
  }
}

export function DashboardPageHeader({ title, roleBadge }: DashboardPageHeaderProps) {
  const { user } = useAuthStore()

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground text-wrap-balance">{title}</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={roleBadge.variant ?? 'secondary'} className="text-xs">
          {roleBadge.text}
        </Badge>
      </div>
    </header>
  )
}
