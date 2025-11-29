"use client"

import { Info } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { defaultEnterpriseUrlsByCategory } from "@/utils/constants"

export function EnterpriseUrlsTooltip() {
  const categories = Object.entries(defaultEnterpriseUrlsByCategory)
  const totalCount = categories.reduce((sum, [, urls]) => sum + urls.length, 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center h-4 w-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="View enterprise URLs"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-xs font-medium">Enterprise URLs ({totalCount})</p>
          <p className="text-2xs text-muted-foreground">
            URLs used when &quot;Enterprise URLs only&quot; is enabled
          </p>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2 space-y-3">
            {categories.map(([category, urls]) => (
              <div key={category}>
                <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-1">
                  {category}
                </p>
                <div className="space-y-0.5">
                  {urls.map((url) => (
                    <div
                      key={url}
                      className="text-xs px-1.5 py-0.5 rounded hover:bg-muted/50 font-mono"
                    >
                      {url}
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
