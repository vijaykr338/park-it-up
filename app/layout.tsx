/* @ts-nocheck */
import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import GoogleAnalytics from '@/lib/GoogleAnalytics'
export const metadata: Metadata = {
  title: 'ParkItUp',
  description: 'Find parking spots near you',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      {/* Google Analytics */}
      <GoogleAnalytics />
      </head>
      <body>
        <Providers>
         
          {children}
        </Providers>
      </body>
    </html>
  )
}
