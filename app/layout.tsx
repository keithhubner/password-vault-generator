import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Password Vault Generator',
  description: 'Generate password vaults for various formats',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.svg" />
      <script defer data-domain="passwordvaultgenerator.com" src="https://plausible.jankylabs.co.uk/js/script.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}