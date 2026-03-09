'use client'

import { useRouter } from 'next/navigation'
import { FileX, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotFoundStateProps {
  title?: string
  message?: string
  backButton?: {
    href: string
    label: string
  }
}

export function NotFoundState({
  title = 'Not Found',
  message = 'The requested resource could not be found.',
  backButton,
}: NotFoundStateProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <FileX className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        {backButton && (
          <Button
            variant="outline"
            onClick={() => router.push(backButton.href)}
            className="mt-2 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {backButton.label}
          </Button>
        )}
      </div>
    </div>
  )
}
