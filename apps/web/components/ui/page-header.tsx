'use client'

import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {backButton && (
          <Button variant="outline" size="sm" onClick={() => router.push(backButton.href)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backButton.label}
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
