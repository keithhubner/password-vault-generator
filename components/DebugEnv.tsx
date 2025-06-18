"use client"

import { useState, useEffect } from "react"

interface ConfigData {
  hostedOn: string
}

export const DebugEnv: React.FC = () => {
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run debug logging in development
    if (process.env.NODE_ENV !== 'production') {
      // Check client-side env vars
      console.log('Client-side NEXT_PUBLIC_HOSTED_ON:', process.env.NEXT_PUBLIC_HOSTED_ON)
      console.log('All NEXT_PUBLIC vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')))

      // Fetch server-side config
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          console.log('Server config:', data)
          setConfig(data)
        })
        .catch(err => {
          console.error('Config fetch error:', err)
          setError(err.message)
        })
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800 mb-2">Environment Debug Info</h3>
      <div className="text-sm text-yellow-700 space-y-1">
        <div>Client NEXT_PUBLIC_HOSTED_ON: {process.env.NEXT_PUBLIC_HOSTED_ON || 'undefined'}</div>
        <div>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</div>
        {config && (
          <div>Server hostedOn: {config.hostedOn || 'undefined'}</div>
        )}
        {error && (
          <div className="text-red-600">API Error: {error}</div>
        )}
      </div>
    </div>
  )
}