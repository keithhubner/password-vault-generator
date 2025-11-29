"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Copy, X } from "lucide-react"

interface VaultPreviewProps {
  data: string
  onClear: () => void
}

export const VaultPreview: React.FC<VaultPreviewProps> = ({ data, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSensitive, setShowSensitive] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!data) return null

  const previewData = showSensitive
    ? data
    : data.replace(/"password":\s*"[^"]*"/g, '"password": "************"')
          .replace(/"totp":\s*"[^"]*"/g, '"totp": "************"')

  const truncatedData = isExpanded ? previewData : previewData.slice(0, 2000) + (previewData.length > 2000 ? "..." : "")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(showSensitive ? data : previewData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Failed to copy")
    }
  }

  // Add line numbers to the preview
  const lines = truncatedData.split('\n')
  const lineNumberWidth = String(lines.length).length

  return (
    <div className="mt-3 rounded-md border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-card border-b border-border">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Output Preview
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowSensitive(!showSensitive)}
            title={showSensitive ? "Hide passwords" : "Show passwords"}
          >
            {showSensitive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onClear}
            title="Clear data"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Copied indicator */}
      {copied && (
        <div className="px-3 py-1.5 bg-primary/10 text-primary text-xs">
          Copied to clipboard
        </div>
      )}

      {/* Code preview */}
      <div className={`bg-background overflow-auto ${isExpanded ? 'max-h-[400px]' : 'max-h-[200px]'}`}>
        <pre className="p-3 text-xs font-mono leading-relaxed">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="text-muted-foreground/50 select-none mr-4 text-right" style={{ minWidth: `${lineNumberWidth + 1}ch` }}>
                {index + 1}
              </span>
              <span className="text-foreground">{line}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Footer */}
      {data.length > 2000 && (
        <div className="flex items-center justify-between px-3 py-2 bg-card border-t border-border">
          <span className="text-2xs text-muted-foreground">
            {isExpanded ? `Showing all ${lines.length} lines` : `Showing first 2000 characters`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      )}
    </div>
  )
}
