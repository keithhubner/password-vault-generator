"use client"

import { GenerationProgress } from "../types"

interface ProgressIndicatorProps {
  progress: GenerationProgress
  isVisible: boolean
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null

  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-md p-4 max-w-xs w-full mx-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3">Generating Vault</h3>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{progress.status}</span>
            <span className="font-mono">{percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-mono">{progress.current.toLocaleString()}</span> of{" "}
          <span className="font-mono">{progress.total.toLocaleString()}</span> items
        </p>
      </div>
    </div>
  )
}
