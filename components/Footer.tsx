"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink } from "lucide-react"

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
            <Link href="/changelog" className="text-2xs text-muted-foreground hover:text-foreground transition-colors">
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
