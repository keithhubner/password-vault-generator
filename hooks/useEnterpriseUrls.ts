"use client"

import { useState, useEffect, useCallback } from "react"
import { defaultEnterpriseUrlsByCategory } from "../utils/constants"

const STORAGE_KEY = "enterprise-urls-config"
const STORAGE_VERSION = 1

export interface UrlEntry {
  url: string
  category: string
  enabled: boolean
  isCustom: boolean
}

interface EnterpriseUrlsConfig {
  customUrls: Array<{ url: string; category: string }>
  disabledDefaults: string[]
  version: number
}

interface UseEnterpriseUrlsReturn {
  urls: string[]
  urlsByCategory: Record<string, UrlEntry[]>
  totalCount: number
  enabledCount: number
  addUrl: (url: string, category?: string) => boolean
  removeUrl: (url: string) => void
  toggleUrl: (url: string, enabled: boolean) => void
  toggleAll: (enabled: boolean) => void
  importFromCsv: (file: File) => Promise<number>
  resetToDefaults: () => void
  isLoaded: boolean
}

function getDefaultConfig(): EnterpriseUrlsConfig {
  return {
    customUrls: [],
    disabledDefaults: [],
    version: STORAGE_VERSION,
  }
}

function loadConfig(): EnterpriseUrlsConfig {
  if (typeof window === "undefined") return getDefaultConfig()

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultConfig()

    const config = JSON.parse(stored) as EnterpriseUrlsConfig
    if (config.version !== STORAGE_VERSION) {
      return getDefaultConfig()
    }
    return config
  } catch {
    return getDefaultConfig()
  }
}

function saveConfig(config: EnterpriseUrlsConfig): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function validateUrl(url: string): string | null {
  const cleaned = url.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")

  if (!cleaned) return null

  // Basic domain validation
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/
  if (!domainRegex.test(cleaned)) return null

  return cleaned
}

export function useEnterpriseUrls(): UseEnterpriseUrlsReturn {
  const [config, setConfig] = useState<EnterpriseUrlsConfig>(getDefaultConfig)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setConfig(loadConfig())
    setIsLoaded(true)
  }, [])

  // Save to localStorage when config changes
  useEffect(() => {
    if (isLoaded) {
      saveConfig(config)
    }
  }, [config, isLoaded])

  // Build the categorized URL list with enabled/disabled state
  const urlsByCategory = useCallback((): Record<string, UrlEntry[]> => {
    const result: Record<string, UrlEntry[]> = {}

    // Add default URLs
    for (const [category, urls] of Object.entries(defaultEnterpriseUrlsByCategory)) {
      result[category] = urls.map((url) => ({
        url,
        category,
        enabled: !config.disabledDefaults.includes(url),
        isCustom: false,
      }))
    }

    // Add custom URLs
    for (const { url, category } of config.customUrls) {
      if (!result[category]) {
        result[category] = []
      }
      result[category].push({
        url,
        category,
        enabled: true,
        isCustom: true,
      })
    }

    return result
  }, [config])

  // Get flat list of enabled URLs for generation
  const urls = useCallback((): string[] => {
    const categories = urlsByCategory()
    return Object.values(categories)
      .flat()
      .filter((entry) => entry.enabled)
      .map((entry) => entry.url)
  }, [urlsByCategory])

  const categorizedUrls = urlsByCategory()
  const enabledUrls = urls()
  const allUrls = Object.values(categorizedUrls).flat()

  const addUrl = useCallback((url: string, category = "Custom"): boolean => {
    const validated = validateUrl(url)
    if (!validated) return false

    // Check for duplicates
    const allExisting = [
      ...Object.values(defaultEnterpriseUrlsByCategory).flat(),
      ...config.customUrls.map((c) => c.url),
    ]
    if (allExisting.includes(validated)) return false

    setConfig((prev) => ({
      ...prev,
      customUrls: [...prev.customUrls, { url: validated, category }],
    }))
    return true
  }, [config.customUrls])

  const removeUrl = useCallback((url: string): void => {
    setConfig((prev) => ({
      ...prev,
      customUrls: prev.customUrls.filter((c) => c.url !== url),
      // If it's a default URL being "removed", add to disabled list
      disabledDefaults: Object.values(defaultEnterpriseUrlsByCategory)
        .flat()
        .includes(url)
        ? [...prev.disabledDefaults, url]
        : prev.disabledDefaults,
    }))
  }, [])

  const toggleUrl = useCallback((url: string, enabled: boolean): void => {
    const isDefault = Object.values(defaultEnterpriseUrlsByCategory)
      .flat()
      .includes(url)

    if (isDefault) {
      setConfig((prev) => ({
        ...prev,
        disabledDefaults: enabled
          ? prev.disabledDefaults.filter((u) => u !== url)
          : [...prev.disabledDefaults, url],
      }))
    }
    // Custom URLs are always enabled when they exist
  }, [])

  const toggleAll = useCallback((enabled: boolean): void => {
    const allDefaultUrls = Object.values(defaultEnterpriseUrlsByCategory).flat()
    setConfig((prev) => ({
      ...prev,
      disabledDefaults: enabled ? [] : allDefaultUrls,
    }))
  }, [])

  const importFromCsv = useCallback(async (file: File): Promise<number> => {
    const text = await file.text()
    const lines = text.split(/[\r\n]+/).filter((line) => line.trim())

    let imported = 0
    const newUrls: Array<{ url: string; category: string }> = []

    for (const line of lines) {
      // Handle CSV with headers or just URLs
      const parts = line.split(",")
      const urlPart = parts[0]?.trim()
      const categoryPart = parts[1]?.trim() || "Imported"

      const validated = validateUrl(urlPart)
      if (!validated) continue

      // Check for duplicates
      const allExisting = [
        ...Object.values(defaultEnterpriseUrlsByCategory).flat(),
        ...config.customUrls.map((c) => c.url),
        ...newUrls.map((c) => c.url),
      ]
      if (allExisting.includes(validated)) continue

      newUrls.push({ url: validated, category: categoryPart })
      imported++
    }

    if (newUrls.length > 0) {
      setConfig((prev) => ({
        ...prev,
        customUrls: [...prev.customUrls, ...newUrls],
      }))
    }

    return imported
  }, [config.customUrls])

  const resetToDefaults = useCallback((): void => {
    setConfig(getDefaultConfig())
  }, [])

  return {
    urls: enabledUrls,
    urlsByCategory: categorizedUrls,
    totalCount: allUrls.length,
    enabledCount: enabledUrls.length,
    addUrl,
    removeUrl,
    toggleUrl,
    toggleAll,
    importFromCsv,
    resetToDefaults,
    isLoaded,
  }
}
