"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface VaultPreviewProps {
  data: string
  onClear: () => void
}

export const VaultPreview: React.FC<VaultPreviewProps> = ({ data, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSensitive, setShowSensitive] = useState(false)

  if (!data) return null

  const previewData = showSensitive 
    ? data 
    : data.replace(/"password":\s*"[^"]*"/g, '&quot;password&quot;: &quot;●●●●●●●●&quot;')
          .replace(/"totp":\s*"[^"]*"/g, '&quot;totp&quot;: &quot;●●●●●●●●&quot;')

  const truncatedData = isExpanded ? previewData : previewData.slice(0, 1000) + "..."

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Generated Vault Data:</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSensitive(!showSensitive)}
          >
            {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSensitive ? "Hide" : "Show"} Passwords
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onClear}
          >
            Clear Data
          </Button>
        </div>
      </div>
      <pre className={`bg-gray-100 p-4 rounded overflow-auto ${isExpanded ? 'max-h-96' : 'max-h-48'}`}>
        {truncatedData}
      </pre>
      {!isExpanded && data.length > 1000 && (
        <p className="text-sm text-gray-500 mt-2">
          Showing first 1000 characters. Click &quot;Expand&quot; to see full data.
        </p>
      )}
    </div>
  )
}