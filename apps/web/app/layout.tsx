import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import Script from 'next/script'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: ' Student Management System',
  description:
    'A modern platform for managing students, teachers, courses, and academic operations.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script src="//unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <body className={`${geist.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
