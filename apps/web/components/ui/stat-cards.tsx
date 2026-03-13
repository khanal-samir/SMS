import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatItem {
  label: string
  value: React.ReactNode
  size?: 'default' | 'small'
  icon?: LucideIcon
}

interface StatCardsProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4 | 5
  variant?: 'cards' | 'strip'
}

const gridCols = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5',
}

function StatCardsVariant({ stats, columns = 2 }: StatCardsProps) {
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

function StatStripVariant({ stats }: StatCardsProps) {
  return (
    <div className="mb-8 grid grid-cols-2 overflow-hidden rounded-lg border md:grid-cols-none md:grid-flow-col md:auto-cols-fr">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={cn(
              'px-5 py-4',
              // Vertical dividers on desktop (right border except last)
              index < stats.length - 1 && 'md:border-r',
              // On mobile 2-col grid: right border on odd-indexed left column items
              index % 2 === 0 && index < stats.length - 1 && 'border-r md:border-r',
              // On mobile: top border for items in second row onwards
              index >= 2 && 'border-t md:border-t-0',
            )}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {Icon && <Icon className="size-3.5" />}
              <span>{stat.label}</span>
            </div>
            <p
              className={cn(
                'mt-1 font-semibold text-foreground tabular-nums',
                stat.size === 'small' ? 'text-sm break-all' : 'text-lg',
              )}
            >
              {stat.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export function StatCards(props: StatCardsProps) {
  if (props.variant === 'strip') {
    return <StatStripVariant {...props} />
  }
  return <StatCardsVariant {...props} />
}
