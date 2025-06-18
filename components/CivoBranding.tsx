"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface CivoBrandingProps {
  className?: string
}

export const CivoBranding: React.FC<CivoBrandingProps> = ({ className = "" }) => {
  // Check if hosted on Civo
  const hostedOn = process.env.NEXT_PUBLIC_HOSTED_ON
  const [imageError, setImageError] = useState(false)
  
  if (hostedOn !== "civo") {
    return null
  }

  // Use SVG by default, fallback to JPG if SVG fails
  const imageSrc = imageError ? "/img/civo-logo.jpg" : "/img/civo-logo.svg"

  return (
    <div className={`flex items-center justify-center mb-6 ${className}`}>
      <Link 
        href="https://www.civo.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transition-all hover:scale-105 duration-200"
        title="Visit Civo - Cloud Native Service Provider"
      >
        <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md">
          <span className="text-sm font-medium text-gray-700">Proudly hosted on</span>
          <Image
            src={imageSrc}
            alt="Civo - Cloud Native Service Provider"
            width={80}
            height={24}
            className="h-6 w-auto"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      </Link>
    </div>
  )
}