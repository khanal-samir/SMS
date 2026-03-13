import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

interface StatItem {
  label: string
  value: React.ReactNode
  size?: 'default' | 'small'
  icon?: LucideIcon
}

interface StatCardsProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4 | 5
}

const gridCols = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5',
}

export function StatCards({ stats, columns = 2 }: StatCardsProps) {
  return (
    <div className={`mb-8 grid gap-4 ${gridCols[columns]}`}>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.label}</CardDescription>
              {Icon && <Icon className="size-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              {stat.size === 'small' ? (
                <p className="text-sm font-semibold text-foreground tabular-nums break-all">
                  {stat.value}
                </p>
              ) : (
                <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
