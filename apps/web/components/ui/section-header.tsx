import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  description?: string
  href?: string
  hrefLabel?: string
  badge?: {
    value: number | string
    variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' | 'destructive'
  }
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  href,
  hrefLabel = 'View all',
  badge,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
          {title}
          {badge && (
            <Badge variant={badge.variant ?? 'destructive'} className="ml-1 text-xs">
              {badge.value}
            </Badge>
          )}
        </h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {hrefLabel} <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  )
}
