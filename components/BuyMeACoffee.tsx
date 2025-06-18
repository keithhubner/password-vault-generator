"use client"

import { useState, useEffect } from "react"

interface BuyMeACoffeeProps {
  className?: string
}

export const BuyMeACoffee: React.FC<BuyMeACoffeeProps> = ({ className = "" }) => {
  const [showButton, setShowButton] = useState<boolean | undefined>(undefined)
  
  useEffect(() => {
    // Check if Buy Me a Coffee should be shown
    const clientEnvValue = process.env.NEXT_PUBLIC_SHOW_BUY_ME_COFFEE
    
    if (clientEnvValue !== undefined) {
      setShowButton(clientEnvValue !== 'false')
      if (process.env.NODE_ENV === 'development') {
        console.log('BuyMeACoffee - Using client env:', clientEnvValue)
      }
      return
    }
    
    // If not available client-side, fetch from API
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setShowButton(data.showBuyMeCoffee !== 'false' && data.showBuyMeCoffee !== false)
        if (process.env.NODE_ENV === 'development') {
          console.log('BuyMeACoffee - Using API config:', data.showBuyMeCoffee)
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error('BuyMeACoffee - Failed to fetch config:', err)
        }
        setShowButton(true)
      })
  }, [])

  useEffect(() => {
    if (!showButton) return
    // Load the Buy Me a Coffee script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'
    script.setAttribute('data-name', 'bmc-button')
    script.setAttribute('data-slug', 'keithhubner')
    script.setAttribute('data-color', '#FFDD00')
    script.setAttribute('data-emoji', '')
    script.setAttribute('data-font', 'Poppins')
    script.setAttribute('data-text', 'Buy me a coffee')
    script.setAttribute('data-outline-color', '#000000')
    script.setAttribute('data-font-color', '#000000')
    script.setAttribute('data-coffee-color', '#ffffff')
    
    document.body.appendChild(script)
    
    // Cleanup function to remove script when component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [showButton])

  // Don't render anything until we've checked the environment
  if (showButton === undefined) {
    return null
  }

  if (!showButton) {
    if (process.env.NODE_ENV === 'development') {
      console.log('BuyMeACoffee - Not showing button, showButton is:', showButton)
    }
    return null
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('BuyMeACoffee - Showing Buy Me a Coffee button!')
  }

  return (
    <div className={`flex items-center justify-center mt-8 ${className}`}>
      <div id="bmc-button-container">
        {/* The Buy Me a Coffee button will be rendered here by the script */}
      </div>
    </div>
  )
}