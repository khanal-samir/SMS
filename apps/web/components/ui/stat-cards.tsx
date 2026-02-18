import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

interface StatItem {
  label: string
  value: React.ReactNode
  size?: 'default' | 'small'
}

interface StatCardsProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
}
const gridCols = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}
export function StatCards({ stats, columns = 2 }: StatCardsProps) {
  return (
    <div className={`mb-8 grid gap-4  ${gridCols[columns]}`}>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardDescription>{stat.label}</CardDescription>
          </CardHeader>
          <CardContent>
            {stat.size === 'small' ? (
              <p className="text-sm font-semibold text-gray-900 break-all">{stat.value}</p>
            ) : (
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
