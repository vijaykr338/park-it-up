import type { Metadata } from 'next'
import './globals.css'
import CustomThemeProvider from '@/components/CustomThemeProvider'
export const metadata: Metadata = {
  title: 'ParkItUp'
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CustomThemeProvider>{children}</CustomThemeProvider>
        </body>
    </html>
  )
}
