import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {backButton && (
          <Button variant="outline" size="sm" asChild>
            <Link href={backButton.href}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backButton.label}
            </Link>
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground text-wrap-balance">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
