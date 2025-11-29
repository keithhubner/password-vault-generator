"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <span className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-1" align="end">
        <div className="flex flex-col">
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors ${
              theme === "light" ? "bg-muted" : ""
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors ${
              theme === "dark" ? "bg-muted" : ""
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors ${
              theme === "system" ? "bg-muted" : ""
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            System
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
