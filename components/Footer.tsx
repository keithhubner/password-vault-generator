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
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path 
                    d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.623a4.85 4.85 0 0 0-1.364-1.24c-.253-.16-.531-.286-.821-.378L15.85 2.4c-.144-.044-.297-.068-.452-.068-.155 0-.308.024-.452.068L13.663 2.508c-.29.092-.568.218-.821.378a4.85 4.85 0 0 0-1.364 1.24c-.378.46-.647 1.025-.766 1.623l-.132.666C10.435 7.18 10.4 8 10.4 8.8v4.8c0 2.651 2.149 4.8 4.8 4.8s4.8-2.149 4.8-4.8V8.8c0-.8-.035-1.62-.184-2.385z" 
                    fill="#ffffff"
                  />
                </svg>
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