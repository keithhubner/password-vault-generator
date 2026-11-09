"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

// lucide-react 1.x dropped brand icons, so the GitHub icon (paths copied from
// lucide-react 0.456) is inlined.
const Github = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [hostedOnCivo, setHostedOnCivo] = useState<boolean>(false)
  const [showBuyMeCoffee, setShowBuyMeCoffee] = useState<boolean>(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Check Civo hosting
    const civoEnvValue = process.env.NEXT_PUBLIC_HOSTED_ON
    if (civoEnvValue === "civo") {
      setHostedOnCivo(true)
    } else {
      // Check API if not available client-side
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          setHostedOnCivo(data.hostedOn === "civo")
        })
        .catch(() => {
          setHostedOnCivo(false)
        })
    }

    // Check Buy Me a Coffee setting
    const coffeeEnvValue = process.env.NEXT_PUBLIC_SHOW_BUY_ME_COFFEE
    if (coffeeEnvValue !== undefined) {
      setShowBuyMeCoffee(coffeeEnvValue !== 'false')
    } else {
      // Check API if not available client-side
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          setShowBuyMeCoffee(data.showBuyMeCoffee !== 'false' && data.showBuyMeCoffee !== false)
        })
        .catch(() => {
          setShowBuyMeCoffee(true)
        })
    }
  }, [])

  const civoImageSrc = imageError ? "/img/civo-logo.svg" : "/img/civo-powered-by-fullcolour.svg"

  return (
    <footer className={`mt-8 py-6 border-t border-border ${className}`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Links section */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
            <Link
              href="https://github.com/keithhubner/password-vault-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
              <ExternalLink size={10} />
            </Link>

            <Link
              href="https://blog.keithhubner.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Blog</span>
              <ExternalLink size={10} />
            </Link>

            <Link
              href="/docs"
              className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Docs</span>
            </Link>
          </div>

          {/* Logos and support section */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            {hostedOnCivo && (
              <Link
                href="https://www.civo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                title="Hosted on Civo"
              >
                <Image
                  src={civoImageSrc}
                  alt="Hosted on Civo"
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-70"
                  onError={() => setImageError(true)}
                />
              </Link>
            )}

            {showBuyMeCoffee && (
              <Link
                href="https://www.buymeacoffee.com/keithhubner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border hover:bg-muted transition-colors"
              >
                Buy me a coffee
              </Link>
            )}
          </div>

          {/* Copyright */}
          <div className="text-2xs text-muted-foreground text-center">
            <p>&copy; {new Date().getFullYear()} Keith Hubner</p>
            <p>Made with ❤️ hosted in 🇬🇧</p>
            <Link href="/changelog" className="text-2xs text-muted-foreground hover:text-foreground transition-colors">
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
