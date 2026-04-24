import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatItem {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

interface StatsStripProps {
  stats: StatItem[]
}

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <div className="mb-10 grid grid-cols-2 gap-4 md:grid-flow-col md:auto-cols-fr md:grid-cols-none">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={cn(
              'flex items-center gap-4 rounded-xl bg-card px-5 py-4',
              'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
              index < stats.length - 1 && 'md:border-r md:border-border/60 md:rounded-none md:shadow-none md:bg-transparent md:px-0 md:pr-5',
              index >= 2 && 'border-t border-border/60 md:border-t-0 md:pt-0 md:pb-0',
              index % 2 === 0 && index < stats.length - 1 && 'border-r border-border/60 md:border-r md:rounded-none',
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                stat.iconBg ?? 'bg-primary/10',
              )}
            >
              <Icon className={cn('h-5 w-5', stat.iconColor ?? 'text-primary')} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">
                {stat.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
