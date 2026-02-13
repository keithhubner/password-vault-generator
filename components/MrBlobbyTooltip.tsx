"use client"

import { Info } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

const corruptionCategories: Record<string, string[]> = {
  "CSV Corruption": [
    "Unescaped commas in fields",
    "Embedded newlines in values",
    "Unescaped quotes inside quoted fields",
    "Semicolons in Password Depot fields",
  ],
  "JSON Corruption": [
    "Oversized notes (12,000+ chars)",
    "Extremely long passwords (1,200+ chars)",
  ],
  "XML Corruption": [
    "Unescaped XML entities (<, >, &)",
    "CDATA-breaking sequences (]]>)",
  ],
  "Universal": [
    "Malformed/invalid URLs",
    "Unicode edge cases (null bytes, RTL, zero-width)",
    "Empty required fields",
    "Extremely long field values",
    "SQL injection / XSS payloads",
    "Exact duplicate entries",
  ],
}

export function MrBlobbyTooltip() {
  const categories = Object.entries(corruptionCategories)
  const totalCount = categories.reduce((sum, [, items]) => sum + items.length, 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center h-4 w-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="View Mr Blobby corruption types"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-xs font-medium">Bad Data Injection ({totalCount} types)</p>
          <p className="text-2xs text-muted-foreground">
            Problematic data injected to test import error handling
          </p>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2 space-y-3">
            {categories.map(([category, items]) => (
              <div key={category}>
                <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-1">
                  {category}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <div
                      key={item}
                      className="text-xs px-1.5 py-0.5 rounded hover:bg-muted/50"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
