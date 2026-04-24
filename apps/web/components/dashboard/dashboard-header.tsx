'use client'

import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth.store'

interface DashboardHeaderProps {
  title: string
  roleBadge: {
    text: string
    variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' | 'destructive'
  }
}

export function DashboardHeader({ title, roleBadge }: DashboardHeaderProps) {
  const { user } = useAuthStore()

  return (
    <header className="mb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[2.5rem] font-bold leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Badge
          variant={roleBadge.variant ?? 'secondary'}
          className="mt-2 h-7 px-3 text-xs font-medium tracking-wide"
        >
          {roleBadge.text}
        </Badge>
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-border via-border to-transparent" />
    </header>
  )
}
