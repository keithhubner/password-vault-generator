"use client"

import { useState, useCallback, useRef } from "react"
import { faker } from "@faker-js/faker"
import { getFakerForLocale } from "../utils/locale-faker"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { 
  VaultFormat, 
  VaultType, 
  VaultGenerationOptions, 
  GenerationProgress, 
  GenerationError 
} from "../types"
import { initializePasswordPool } from "../utils/password-generators"
import { generateUniqueCollectionNames, generateHierarchicalCollections, ensureParentPaths } from "../utils/collection-generators"
import { 
  formatLastPassToCsv, 
  formatEdgeToCsv, 
  formatKeePassXToCsv, 
  formatKeeperToCsv,
  createDownloadBlob,
  downloadFile,
  securelyEraseData
} from "../utils/data-formatters"
import { generateBitwardenVault } from "../generators/bitwarden-generator"
import { createLastPassItem } from "../generators/lastpass-generator"
import { createEdgePasswordItem } from "../generators/edge-generator"
import { createKeePassXItem } from "../generators/keepassx-generator"
import { createKeePass2File, convertKeePass2ToXML } from "../generators/keepass2-generator"
import { generateKeeperVault } from "../generators/keeper-generator"
import { createPasswordDepotItems, convertPasswordDepotToCSV } from "../generators/password-depot-generator"
import { ErrorBoundary } from "./ErrorBoundary"
import { ProgressIndicator } from "./ProgressIndicator"
import { VaultConfigForm } from "./VaultConfigForm"
import { PasswordOptionsPanel } from "./PasswordOptionsPanel"
import { CollectionSettings } from "./CollectionSettings"
import { ExportButtons } from "./ExportButtons"
import { VaultPreview } from "./VaultPreview"
import { DebugEnv } from "./DebugEnv"
import { Footer } from "./Footer"

export default function PasswordVaultGeneratorImproved() {
  // State management
  const [loginCount, setLoginCount] = useState(10)
  const [secureNoteCount, setSecureNoteCount] = useState(10)
  const [creditCardCount, setCreditCardCount] = useState(10)
  const [identityCount, setIdentityCount] = useState(10)
  const [vaultType, setVaultType] = useState<VaultType>("individual")
  const [vaultFormat, setVaultFormat] = useState<VaultFormat>("bitwarden")
  const [language, setLanguage] = useState("en")

  // Debug language changes
  const handleLanguageChange = (newLanguage: string) => {
    console.log(`Language changed from ${language} to ${newLanguage}`)
    setLanguage(newLanguage)
  }

  // Get current language state (this ensures we have the latest value)
  const getCurrentLanguage = useCallback(() => {
    return language
  }, [language])
  const [useRealUrls, setUseRealUrls] = useState(false)
  const [useEnterpriseUrls, setUseEnterpriseUrls] = useState(false)
  const [useCollections, setUseCollections] = useState(false)
  const [collectionCount, setCollectionCount] = useState(10)
  const [distributeItems, setDistributeItems] = useState(false)
  const [useNestedFolders, setUseNestedFolders] = useState(false)
  const [useRandomDepthNesting, setUseRandomDepthNesting] = useState(false)
  const [generatedData, setGeneratedData] = useState("")
  const [useNestedCollections, setUseNestedCollections] = useState(false)
  const [topLevelCollectionCount, setTopLevelCollectionCount] = useState(5)
  const [collectionNestingDepth, setCollectionNestingDepth] = useState(2)
  const [totalCollectionCount, setTotalCollectionCount] = useState(20)
  const [useWeakPasswords, setUseWeakPasswords] = useState(false)
  const [weakPasswordPercentage, setWeakPasswordPercentage] = useState(20)
  const [reusePasswords, setReusePasswords] = useState(false)
  const [passwordReusePercentage, setPasswordReusePercentage] = useState(30)
  
  // Progress and error states
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState<GenerationProgress>({ current: 0, total: 0, status: "" })
  const [error, setError] = useState<GenerationError | null>(null)
  
  // Refs for cleanup
  const generatedDataRef = useRef<string>("")

  // Form validation
  const validateInputs = useCallback((): string | null => {
    if (loginCount < 0 || loginCount > 10000) return "Login count must be between 0 and 10,000"
    if (secureNoteCount < 0 || secureNoteCount > 10000) return "Secure note count must be between 0 and 10,000"
    if (creditCardCount < 0 || creditCardCount > 10000) return "Credit card count must be between 0 and 10,000"
    if (identityCount < 0 || identityCount > 10000) return "Identity count must be between 0 and 10,000"
    
    const totalItems = loginCount + secureNoteCount + creditCardCount + identityCount
    if (totalItems === 0) return "Please specify at least one item to generate"
    if (totalItems > 10000) return "Total items cannot exceed 10,000"
    
    return null
  }, [loginCount, secureNoteCount, creditCardCount, identityCount])

  // Progress simulator for large generations
  const simulateProgress = useCallback((totalItems: number, onProgress: (current: number, status: string) => void) => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.floor(totalItems / 50) || 1
      if (current >= totalItems) {
        current = totalItems
        clearInterval(interval)
      }
      onProgress(current, current === totalItems ? "Finalizing..." : "Generating items...")
    }, 100)
    return interval
  }, [])

  const generateVault = useCallback(async () => {
    const validationError = validateInputs()
    if (validationError) {
      setError({ message: validationError })
      return
    }

    setIsGenerating(true)
    setError(null)
    
    const totalItems = vaultFormat === "keepass2" 
      ? loginCount 
      : loginCount + secureNoteCount + creditCardCount + identityCount
    
    setProgress({ current: 0, total: totalItems, status: "Initializing..." })

    try {
      // Clear any existing data securely
      if (generatedDataRef.current) {
        securelyEraseData(generatedDataRef.current)
      }

      const currentLang = language
      console.log(`Generating vault with language: ${currentLang} (state: ${language})`)
      const passwordPool = initializePasswordPool(
        reusePasswords,
        loginCount,
        useWeakPasswords,
        weakPasswordPercentage,
        currentLang
      )

      let progressInterval: NodeJS.Timeout | null = null

      // Start progress simulation for large datasets
      if (totalItems > 100) {
        progressInterval = simulateProgress(totalItems, (current, status) => {
          setProgress({ current, total: totalItems, status })
        })
      }

      // Generate vault data based on format
      let vaultData: unknown
      let formattedData: string

      switch (vaultFormat) {
        case "bitwarden":
          if (vaultType === "individual") {
            vaultData = generateBitwardenVault(
              loginCount, secureNoteCount, creditCardCount, identityCount,
              vaultType, useRealUrls, useEnterpriseUrls, [], false,
              useWeakPasswords, weakPasswordPercentage,
              reusePasswords, passwordReusePercentage, passwordPool, currentLang
            )
          } else {
            const localeFaker = getFakerForLocale(currentLang)
            const orgId = localeFaker.string.uuid()
            let collections: { id: string; organizationId: string; name: string; externalId: null }[] = []
            
            if (useCollections) {
              if (useNestedCollections) {
                let collectionNames = generateHierarchicalCollections(
                  topLevelCollectionCount,
                  collectionNestingDepth,
                  totalCollectionCount
                )
                collectionNames = ensureParentPaths(collectionNames)
                collectionNames.sort((a, b) => a.split("/").length - b.split("/").length)
                
                collections = collectionNames.map((name) => ({
                  id: localeFaker.string.uuid(),
                  organizationId: orgId,
                  name: name,
                  externalId: null,
                }))
              } else {
                const collectionNames = generateUniqueCollectionNames(collectionCount)
                collections = collectionNames.map((name) => ({
                  id: localeFaker.string.uuid(),
                  organizationId: orgId,
                  name: name,
                  externalId: null,
                }))
              }
            }

            vaultData = generateBitwardenVault(
              loginCount, secureNoteCount, creditCardCount, identityCount,
              vaultType, useRealUrls, useEnterpriseUrls, collections, distributeItems,
              useWeakPasswords, weakPasswordPercentage,
              reusePasswords, passwordReusePercentage, passwordPool, currentLang
            )
          }
          formattedData = JSON.stringify(vaultData, null, 2)
          break

        case "lastpass":
          vaultData = createLastPassItem(
            loginCount, useRealUrls, useEnterpriseUrls,
            useWeakPasswords, weakPasswordPercentage,
            reusePasswords, passwordReusePercentage, passwordPool
          )
          formattedData = JSON.stringify(vaultData, null, 2)
          break

        case "edge":
          vaultData = createEdgePasswordItem(
            loginCount, useRealUrls, useEnterpriseUrls,
            useWeakPasswords, weakPasswordPercentage,
            reusePasswords, passwordReusePercentage, passwordPool
          )
          formattedData = JSON.stringify(vaultData, null, 2)
          break

        case "keepassx":
          vaultData = createKeePassXItem(
            loginCount, useRealUrls, useEnterpriseUrls,
            useWeakPasswords, weakPasswordPercentage,
            reusePasswords, passwordReusePercentage, passwordPool
          )
          formattedData = JSON.stringify(vaultData, null, 2)
          break

        case "keepass2":
          const keepassFile = createKeePass2File(
            loginCount, useRealUrls, useEnterpriseUrls,
            useWeakPasswords, weakPasswordPercentage,
            reusePasswords, passwordReusePercentage, passwordPool
          )
          formattedData = convertKeePass2ToXML(keepassFile)
          break

        case "keeper":
          vaultData = generateKeeperVault(
            loginCount, useRealUrls, useEnterpriseUrls, useNestedFolders, useRandomDepthNesting,
            useWeakPasswords, weakPasswordPercentage,
            reusePasswords, passwordReusePercentage, passwordPool
          )
          formattedData = JSON.stringify(vaultData, null, 2)
          break

        case "password-depot":
          vaultData = createPasswordDepotItems(
            loginCount,
            useRealUrls,
            useEnterpriseUrls,
            useWeakPasswords,
            weakPasswordPercentage,
            reusePasswords,
            passwordReusePercentage,
            passwordPool
          )
          formattedData = JSON.stringify(vaultData, null, 2)
          break

        default:
          throw new Error(`Unsupported vault format: ${vaultFormat}`)
      }

      if (progressInterval) {
        clearInterval(progressInterval)
      }

      setProgress({ current: totalItems, total: totalItems, status: "Complete!" })
      generatedDataRef.current = formattedData
      setGeneratedData(formattedData)

    } catch (err) {
      console.error("Vault generation error:", err)
      setError({
        message: err instanceof Error ? err.message : "Unknown error occurred",
        stack: err instanceof Error ? err.stack : undefined
      })
    } finally {
      setIsGenerating(false)
      // Clear progress after a short delay
      setTimeout(() => setProgress({ current: 0, total: 0, status: "" }), 1000)
    }
  }, [
    loginCount, secureNoteCount, creditCardCount, identityCount,
    vaultType, vaultFormat, useRealUrls, useEnterpriseUrls, useCollections, collectionCount,
    distributeItems, useNestedFolders, useRandomDepthNesting,
    useNestedCollections, topLevelCollectionCount, collectionNestingDepth,
    totalCollectionCount, useWeakPasswords, weakPasswordPercentage,
    reusePasswords, passwordReusePercentage, language, simulateProgress, validateInputs
  ])

  const downloadData = useCallback((format = "json") => {
    if (!generatedData) return

    let content: string
    let filename: string
    let type: string

    try {
      switch (vaultFormat) {
        case "bitwarden":
          content = generatedData
          filename = `${vaultType}_${vaultFormat}_vault.json`
          type = "application/json"
          break
        case "lastpass":
          content = formatLastPassToCsv(JSON.parse(generatedData))
          filename = "lastpass_vault_export.csv"
          type = "text/csv"
          break
        case "edge":
          content = formatEdgeToCsv(JSON.parse(generatedData))
          filename = "edge_passwords_export.csv"
          type = "text/csv"
          break
        case "keepassx":
          content = formatKeePassXToCsv(JSON.parse(generatedData))
          filename = "keepassx_export.csv"
          type = "text/csv"
          break
        case "keeper":
          if (format === "json") {
            content = generatedData
            filename = "keeper_vault_export.json"
            type = "application/json"
          } else {
            content = formatKeeperToCsv(JSON.parse(generatedData))
            filename = "keeper_vault_export.csv"
            type = "text/csv"
          }
          break
        case "keepass2":
          content = generatedData
          filename = "keepass2_export.xml"
          type = "application/xml"
          break
        case "password-depot":
          content = convertPasswordDepotToCSV(JSON.parse(generatedData))
          filename = "password_depot_export.csv"
          type = "text/csv"
          break
        default:
          throw new Error(`Unsupported vault format: ${vaultFormat}`)
      }

      const blob = createDownloadBlob(content, type)
      downloadFile(blob, filename)
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Download failed"
      })
    }
  }, [generatedData, vaultFormat, vaultType])

  const clearGeneratedData = useCallback(() => {
    if (generatedDataRef.current) {
      securelyEraseData(generatedDataRef.current)
      generatedDataRef.current = ""
    }
    setGeneratedData("")
    setError(null)
  }, [])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const handleVaultFormatChange = useCallback((newFormat: VaultFormat) => {
    // Clear existing data when format changes
    clearGeneratedData()
    setVaultFormat(newFormat)
  }, [clearGeneratedData])

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <DebugEnv />
        <div className="flex items-center mb-4">
          <Lock className="h-8 w-8 mr-2" aria-hidden="true" />
          <h1 className="text-2xl font-bold">Password Vault Generator</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-600">{error.message}</p>
            <button
              onClick={resetError}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-6">
          <VaultConfigForm
            vaultFormat={vaultFormat}
            onVaultFormatChange={handleVaultFormatChange}
            vaultType={vaultType}
            onVaultTypeChange={setVaultType}
            language={language}
            onLanguageChange={handleLanguageChange}
            loginCount={loginCount}
            onLoginCountChange={setLoginCount}
            secureNoteCount={secureNoteCount}
            onSecureNoteCountChange={setSecureNoteCount}
            creditCardCount={creditCardCount}
            onCreditCardCountChange={setCreditCardCount}
            identityCount={identityCount}
            onIdentityCountChange={setIdentityCount}
          />

          <PasswordOptionsPanel
            useWeakPasswords={useWeakPasswords}
            onUseWeakPasswordsChange={setUseWeakPasswords}
            weakPasswordPercentage={weakPasswordPercentage}
            onWeakPasswordPercentageChange={setWeakPasswordPercentage}
            reusePasswords={reusePasswords}
            onReusePasswordsChange={setReusePasswords}
            passwordReusePercentage={passwordReusePercentage}
            onPasswordReusePercentageChange={setPasswordReusePercentage}
            useRealUrls={useRealUrls}
            onUseRealUrlsChange={setUseRealUrls}
            useEnterpriseUrls={useEnterpriseUrls}
            onUseEnterpriseUrlsChange={setUseEnterpriseUrls}
          />

          <CollectionSettings
            vaultFormat={vaultFormat}
            vaultType={vaultType}
            useCollections={useCollections}
            onUseCollectionsChange={setUseCollections}
            useNestedCollections={useNestedCollections}
            onUseNestedCollectionsChange={setUseNestedCollections}
            collectionCount={collectionCount}
            onCollectionCountChange={setCollectionCount}
            topLevelCollectionCount={topLevelCollectionCount}
            onTopLevelCollectionCountChange={setTopLevelCollectionCount}
            collectionNestingDepth={collectionNestingDepth}
            onCollectionNestingDepthChange={setCollectionNestingDepth}
            totalCollectionCount={totalCollectionCount}
            onTotalCollectionCountChange={setTotalCollectionCount}
            distributeItems={distributeItems}
            onDistributeItemsChange={setDistributeItems}
            useNestedFolders={useNestedFolders}
            onUseNestedFoldersChange={setUseNestedFolders}
            useRandomDepthNesting={useRandomDepthNesting}
            onUseRandomDepthNestingChange={setUseRandomDepthNesting}
          />

          <Button onClick={generateVault} disabled={isGenerating} className="w-full">
            {isGenerating ? "Generating..." : "Generate Vault"}
          </Button>
        </div>

        <VaultPreview data={generatedData} onClear={clearGeneratedData} />

        {generatedData && (
          <div className="mt-4">
            <ExportButtons
              vaultFormat={vaultFormat}
              onDownload={downloadData}
              disabled={isGenerating}
            />
          </div>
        )}

        <ProgressIndicator progress={progress} isVisible={isGenerating} />
      </div>
      
      <Footer />
    </ErrorBoundary>
  )
}