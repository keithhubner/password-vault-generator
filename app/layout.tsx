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
            src="https://metrics.passwordvaultgenerator.com/js/pa-uFRSGhFW3VizYjRBsM-4_.js"
            strategy="beforeInteractive"
          />
          {/* The endpoint baked into the script points at the Plausible instance's
              BASE_URL, not at the host the script was served from, so it must be
              overridden here to match the CSP connect-src. */}
          <Script
            id="plausible-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init({endpoint:"https://metrics.passwordvaultgenerator.com/api/event"})`,
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
