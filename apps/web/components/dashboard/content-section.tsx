import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'

interface ContentSectionProps {
  icon?: LucideIcon
  title: string
  description?: string
  href?: string
  hrefLabel?: string
  badge?: {
    value: number | string
    variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' | 'destructive'
  }
  children: React.ReactNode
  className?: string
}

export function ContentSection({
  icon: Icon,
  title,
  description,
  href,
  hrefLabel = 'View all',
  badge,
  children,
  className,
}: ContentSectionProps) {
  return (
    <section className={className}>
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {badge && (
              <Badge
                variant={badge.variant ?? 'destructive'}
                className="h-5 px-2 text-[11px] font-medium"
              >
                {badge.value}
              </Badge>
            )}
          </div>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {hrefLabel} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {description && (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </section>
  )
}
