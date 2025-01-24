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
      <script defer data-domain="passwordvaultgenerator.com" src="https://b48b6e32-7e2a-479e-8a8e-fc6e83efb423.k8s.civo.com/js/script.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}