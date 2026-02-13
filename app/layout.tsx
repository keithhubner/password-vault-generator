import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/ThemeProvider'
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Script
            async
            src="https://plausible.jankylabs.co.uk/js/pa-uFRSGhFW3VizYjRBsM-4_.js"
            strategy="afterInteractive"
          />
          <Script
            id="plausible-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
