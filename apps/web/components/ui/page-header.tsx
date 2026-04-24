import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  backButton?: {
    href: string
    label: string
  }
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ backButton, title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {backButton && (
            <Link
              href={backButton.href}
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backButton.label}
            </Link>
          )}
          <h1 className="font-display text-[2rem] font-bold leading-tight tracking-tight text-foreground md:text-[2.5rem]">
            {title}
          </h1>
          {description && <p className="mt-1.5 text-[15px] text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-start gap-3 pt-1">{actions}</div>}
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-border via-border to-transparent" />
    </header>
  )
}
