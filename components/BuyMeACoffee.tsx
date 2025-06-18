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

  // No need for dynamic script loading - we'll use a direct link approach

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
      <a 
        href="https://www.buymeacoffee.com/keithhubner" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-80"
        style={{
          backgroundColor: '#FFDD00',
          color: '#000000',
          fontFamily: 'Poppins, sans-serif',
          border: '1px solid #000000',
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
      </a>
    </div>
  )
}