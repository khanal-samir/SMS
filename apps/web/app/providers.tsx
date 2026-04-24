'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useError } from '@/hooks/useError'
import { useErrorStore } from '@/store/error.store'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@repo/schemas'
import { AuthInitializer } from '@/components/auth-initializer'

const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((module) => module.ReactQueryDevtools),
  { ssr: false },
)

function ErrorProvider({ children }: { children: React.ReactNode }) {
  useError()
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const { setError } = useErrorStore()

  const [queryClient] = useState(
    //prevents unnecessary rendering
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000,
            gcTime: 15 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
          },
          mutations: {
            retry: 1,
            onError: (error: Error) => {
              if ('isAxiosError' in error && error.isAxiosError) {
                setError(error as AxiosError<ApiResponse<unknown>>)
              }
            },
          },
        },
      }),
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <ErrorProvider>
          <AuthInitializer />
          {children}
          <Toaster position="top-right" richColors closeButton />
          {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
        </ErrorProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
