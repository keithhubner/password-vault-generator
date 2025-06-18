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

  // No need for manual script loading - using Next.js Script component instead

  const civoImageSrc = imageError ? "/img/civo-logo.svg" : "/img/civo-powered-by-fullcolour.svg"

  return (
    <footer className={`mt-12 py-8 border-t border-gray-200 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="flex flex-col items-center space-y-6">
          
          {/* Links section */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            {/* GitHub link */}
            <Link
              href="https://github.com/keithhubner/password-vault-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github size={16} />
              <span>View on GitHub</span>
              <ExternalLink size={12} />
            </Link>

            {/* Blog link */}
            <Link
              href="https://blog.keithhubner.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Keith&apos;s Blog</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Logos and support section */}
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* Civo branding */}
            {hostedOnCivo && (
              <Link 
                href="https://www.civo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all hover:opacity-80 duration-200"
                title="Hosted on Civo"
              >
                <Image
                  src={civoImageSrc}
                  alt="Hosted on Civo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  onError={() => setImageError(true)}
                />
              </Link>
            )}

            {/* Buy Me a Coffee */}
            {showBuyMeCoffee && (
              <Link
                href="https://www.buymeacoffee.com/keithhubner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: '#FFDD00',
                  color: '#000000',
                  fontFamily: 'Poppins, sans-serif',
                  textDecoration: 'none'
                }}
              >
                Buy me a coffee
              </Link>
            )}
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 text-center">
            <p>© {new Date().getFullYear()} Keith Hubner. Password Vault Generator.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}