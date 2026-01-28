import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/components/providers/query-provider'
import { Analytics } from '@vercel/analytics/next'

// System font stack for better performance and offline support
const fontClassName = 'font-sans'

export const metadata: Metadata = {
  title: 'GRAIN - Premium Dijital QR Menü',
  description: 'Restoranınız için modern, 4K video destekli dijital QR menü sistemi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={fontClassName}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
