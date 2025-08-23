
import type { Metadata } from 'next'
import Providers from "@/app/providers"
import './globals.css'
// import Navbar from '@/components/ui/Navbar';
// import Footer from '@/components/ui/Footer';

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
        {/* <Navbar/> */}
        <Providers>
        {children} 
        </Providers>
        
        {/* <Footer/> */}
      </body>
    </html>
  )
}
