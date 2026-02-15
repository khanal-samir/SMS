import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="mx-auto max-w-md text-center">
        {/* 404 Display */}
        <div className="relative mb-8 inline-block">
          <div className="text-[8rem] font-bold leading-none tracking-tight text-brand/10 sm:text-[10rem]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center"></div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved,
            deleted, or never existed.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please contact{' '}
          <a
            href="mailto:support@example.com"
            className="text-brand-accent hover:text-brand-accent/80 underline underline-offset-4 transition-colors"
          >
            support
          </a>
          .
        </p>
      </div>
    </div>
  )
}
