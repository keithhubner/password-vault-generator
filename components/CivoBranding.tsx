"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

interface CivoBrandingProps {
  className?: string
}

export const CivoBranding: React.FC<CivoBrandingProps> = ({ className = "" }) => {
  const [hostedOn, setHostedOn] = useState<string | undefined>(undefined)
  const [imageError, setImageError] = useState(false)
  
  useEffect(() => {
    // First try client-side environment variable
    const clientEnvValue = process.env.NEXT_PUBLIC_HOSTED_ON
    
    if (clientEnvValue) {
      setHostedOn(clientEnvValue)
      console.log('CivoBranding - Using client env:', clientEnvValue)
      return
    }
    
    // If not available client-side, fetch from API
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setHostedOn(data.hostedOn)
        console.log('CivoBranding - Using API config:', data.hostedOn)
      })
      .catch(err => {
        console.error('CivoBranding - Failed to fetch config:', err)
        setHostedOn('')
      })
  }, [])
  
  // Don't render anything until we've checked the environment
  if (hostedOn === undefined) {
    return null
  }
  
  if (hostedOn !== "civo") {
    console.log('CivoBranding - Not showing banner, hostedOn is:', hostedOn)
    return null
  }
  
  console.log('CivoBranding - Showing Civo banner!')

  // Use the powered-by SVG when hosted on Civo, fallback to original logo
  const imageSrc = imageError ? "/img/civo-logo.svg" : "/img/civo-powered-by-fullcolour.svg"

  return (
    <div className={`flex items-center justify-center mb-6 ${className}`}>
      <Link 
        href="https://www.civo.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transition-all hover:opacity-80 duration-200"
        title="Hosted on Civo"
      >
        <Image
          src={imageSrc}
          alt="Hosted on Civo"
          width={120}
          height={40}
          className="h-10 w-auto"
          priority
          onError={() => setImageError(true)}
        />
      </Link>
    </div>
  )
}