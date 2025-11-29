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
      case "password-depot":
        return "CSV"
      case "keepass2":
        return "XML"
      default:
        return "JSON"
    }
  }

  return (
    <div className="flex gap-2">
      {vaultFormat === "keeper" ? (
        <>
          <Button
            variant="secondary"
            onClick={() => onDownload("json")}
            disabled={disabled}
            className="flex-1"
          >
            <Download className="h-3.5 w-3.5" />
            Download JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => onDownload("csv")}
            disabled={disabled}
            className="flex-1"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          onClick={() => onDownload()}
          disabled={disabled}
          className="w-full"
        >
          <Download className="h-3.5 w-3.5" />
          Download {getFileExtension()}
        </Button>
      )}
    </div>
  )
}
