"use client"

import { useState, useRef } from "react"
import { Settings, Plus, Trash2, Upload, RotateCcw, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { UrlEntry } from "@/hooks/useEnterpriseUrls"

interface EnterpriseUrlsModalProps {
  urlsByCategory: Record<string, UrlEntry[]>
  enabledCount: number
  totalCount: number
  onAddUrl: (url: string, category?: string) => boolean
  onRemoveUrl: (url: string) => void
  onToggleUrl: (url: string, enabled: boolean) => void
  onToggleAll: (enabled: boolean) => void
  onImportCsv: (file: File) => Promise<number>
  onReset: () => void
}

export function EnterpriseUrlsModal({
  urlsByCategory,
  enabledCount,
  totalCount,
  onAddUrl,
  onRemoveUrl,
  onToggleUrl,
  onToggleAll,
  onImportCsv,
  onReset,
}: EnterpriseUrlsModalProps) {
  const [open, setOpen] = useState(false)
  const [newUrl, setNewUrl] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddUrl = () => {
    setError(null)
    if (!newUrl.trim()) {
      setError("Please enter a URL")
      return
    }
    const success = onAddUrl(newUrl, newCategory || "Custom")
    if (success) {
      setNewUrl("")
      setNewCategory("")
    } else {
      setError("Invalid URL or already exists")
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportStatus("Importing...")
    try {
      const count = await onImportCsv(file)
      setImportStatus(`Imported ${count} URL${count !== 1 ? "s" : ""}`)
      setTimeout(() => setImportStatus(null), 3000)
    } catch {
      setImportStatus("Import failed")
      setTimeout(() => setImportStatus(null), 3000)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const categories = Object.entries(urlsByCategory)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center h-4 w-4 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Manage enterprise URLs"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">Manage Enterprise URLs</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {enabledCount} of {totalCount} URLs enabled
          </DialogDescription>
        </DialogHeader>

        {/* Add URL Section */}
        <div className="space-y-2 pb-3 border-b border-border">
          <Label className="text-xs font-medium">Add Custom URL</Label>
          <div className="flex gap-2">
            <Input
              placeholder="example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            />
            <Input
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-28"
            />
            <Button size="sm" onClick={handleAddUrl}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          {error && <p className="text-2xs text-destructive">{error}</p>}
        </div>

        {/* Import/Reset Actions */}
        <div className="flex items-center gap-2 py-2 border-b border-border">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs"
          >
            <Upload className="h-3 w-3 mr-1.5" />
            Import CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            Reset to Defaults
          </Button>
          {importStatus && (
            <span className="text-2xs text-muted-foreground ml-auto">
              {importStatus}
            </span>
          )}
        </div>

        {/* Select All Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={enabledCount === totalCount}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
            />
            <label
              htmlFor="select-all"
              className="text-xs font-medium cursor-pointer"
            >
              {enabledCount === totalCount ? "Deselect All" : "Select All"}
            </label>
          </div>
          <span className="text-2xs text-muted-foreground">
            {enabledCount} / {totalCount} selected
          </span>
        </div>

        {/* URL List */}
        <div className="-mx-6">
          <ScrollArea className="h-[40vh] px-6">
            <div className="space-y-4 pb-2">
            {categories.map(([category, urls]) => (
              <div key={category}>
                <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {category} ({urls.filter((u) => u.enabled).length}/{urls.length})
                </p>
                <div className="space-y-1">
                  {urls.map((entry) => (
                    <div
                      key={entry.url}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50 group"
                    >
                      <Checkbox
                        id={`url-${entry.url}`}
                        checked={entry.enabled}
                        onCheckedChange={(checked) =>
                          onToggleUrl(entry.url, checked === true)
                        }
                        disabled={entry.isCustom}
                      />
                      <label
                        htmlFor={`url-${entry.url}`}
                        className="flex-1 text-xs font-mono cursor-pointer"
                      >
                        {entry.url}
                      </label>
                      {entry.isCustom && (
                        <span className="text-2xs text-primary px-1.5 py-0.5 rounded bg-primary/10">
                          custom
                        </span>
                      )}
                      {entry.isCustom && (
                        <button
                          type="button"
                          onClick={() => onRemoveUrl(entry.url)}
                          className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded hover:bg-destructive/20 text-destructive transition-opacity"
                          aria-label={`Remove ${entry.url}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
