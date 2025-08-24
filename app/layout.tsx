
import type { Metadata } from 'next'
import './globals.css'
import ThemeProviderClient from './ThemeProviderClient'
import DemoProvider from './DemoProvider'

export const metadata: Metadata = {
  title: 'ParkItUp'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderClient>
          <DemoProvider>
            <div className="min-h-screen w-full p-0 m-0 bg-gradient-to-b from-[#071939] to-[#05233a]">
              {children}
            </div>
          </DemoProvider>
        </ThemeProviderClient>
      </body>
    </html>
  )
}
