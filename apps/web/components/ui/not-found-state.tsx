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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-gray-100 p-4">
          <FileX className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
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
