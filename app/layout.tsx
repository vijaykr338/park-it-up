import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'ParkItUp',
  description: 'Find and reserve parking spots easily',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* ...other head tags... */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
