import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import Script from 'next/script'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PNC CSIT | Student Management System',
  description:
    'PNC CSIT College — A modern platform for managing students, teachers, courses, and academic operations.',
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
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
