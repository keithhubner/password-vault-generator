"use client"

import { GenerationProgress } from "../types"

interface ProgressIndicatorProps {
  progress: GenerationProgress
  isVisible: boolean
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null

  const percentage = Math.round((progress.current / progress.total) * 100)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Generating Vault</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{progress.status}</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {progress.current} of {progress.total} items processed
        </p>
      </div>
    </div>
  )
}