"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { VaultFormat } from "../types"

interface ExportButtonsProps {
  vaultFormat: VaultFormat
  onDownload: (format?: string) => void
  disabled?: boolean
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  vaultFormat,
  onDownload,
  disabled = false,
}) => {
  const getFileExtension = () => {
    switch (vaultFormat) {
      case "lastpass":
      case "edge":
      case "keepassx":
        return "CSV"
      case "keepass2":
        return "XML"
      default:
        return "JSON"
    }
  }

  return (
    <div className="space-x-4">
      {vaultFormat === "keeper" ? (
        <>
          <Button onClick={() => onDownload("json")} disabled={disabled}>
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
          <Button onClick={() => onDownload("csv")} disabled={disabled}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </>
      ) : (
        <Button onClick={() => onDownload()} disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          Download {getFileExtension()}
        </Button>
      )}
    </div>
  )
}