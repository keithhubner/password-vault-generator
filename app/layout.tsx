import type { Metadata } from 'next'
import Script from 'next/script'
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
      <body>
        <Script
          defer
          data-domain="passwordvaultgenerator.com"
          src="https://plausible.jankylabs.co.uk/js/script.js"
        />
        {children}
      </body>
    </html>
  )
}
