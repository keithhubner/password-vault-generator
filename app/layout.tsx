import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Password Vault Generator',
  description: 'Generate random test passwords for your applications',
  
  icons: {
    icon: './favicon.svg',
    shortcut: './favicon.svg',
    apple: './favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
