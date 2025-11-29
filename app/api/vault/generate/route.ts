import { NextRequest, NextResponse } from 'next/server'
import { generateBitwardenVault } from '@/generators/bitwarden-generator'
import { createLastPassItem } from '@/generators/lastpass-generator'
import { generateKeeperVault } from '@/generators/keeper-generator'
import { createEdgePasswordItem } from '@/generators/edge-generator'
import { createKeePassXItem } from '@/generators/keepassx-generator'
import { createKeePass2File, convertKeePass2ToXML } from '@/generators/keepass2-generator'
import { createPasswordDepotItems, convertPasswordDepotToCSV } from '@/generators/password-depot-generator'
import { formatLastPassToCsv, formatEdgeToCsv, formatKeePassXToCsv, formatKeeperToCsv } from '@/utils/data-formatters'
import { initializePasswordPool } from '@/utils/password-generators'
import { generateUniqueCollectionNames, generateHierarchicalCollections } from '@/utils/collection-generators'
import { 
  validateRateLimit, 
  validateRequestSize, 
  validateGenerationParams,
  addSecurityHeaders,
  createRateLimitResponse,
  createValidationErrorResponse 
} from '@/utils/security-middleware'
import { VaultGenerationOptions } from '@/types'

interface VaultGenerateRequest extends Partial<VaultGenerationOptions> {
  format: 'bitwarden' | 'lastpass' | 'keeper' | 'edge' | 'keepassx' | 'keepass2' | 'password-depot'
  language?: string
}

function validateRequest(body: VaultGenerateRequest): { isValid: boolean; error?: string } {
  const { format, vaultType } = body

  // Validate format
  const supportedFormats = ['bitwarden', 'lastpass', 'keeper', 'edge', 'keepassx', 'keepass2', 'password-depot']
  if (!supportedFormats.includes(format)) {
    return { isValid: false, error: `Unsupported format: ${format}` }
  }

  // Validate vault type constraints
  if (vaultType === 'org' && format !== 'bitwarden') {
    return { isValid: false, error: 'Organization vaults are only supported for Bitwarden format' }
  }

  // Validate collection constraints
  if (body.useCollections && (format !== 'bitwarden' || vaultType !== 'org')) {
    return { isValid: false, error: 'Collections are only supported for Bitwarden organization vaults' }
  }

  // Validate nesting constraints
  if ((body.useNestedCollections || body.useRandomDepthNesting) && 
      (format !== 'bitwarden' || vaultType !== 'org')) {
    return { isValid: false, error: 'Nested collections are only supported for Bitwarden organization vaults' }
  }

  // Validate item type constraints
  if (format !== 'bitwarden') {
    if (body.secureNoteCount && body.secureNoteCount > 0) {
      return { isValid: false, error: 'Secure notes are only supported for Bitwarden format' }
    }
    if (body.creditCardCount && body.creditCardCount > 0) {
      return { isValid: false, error: 'Credit cards are only supported for Bitwarden format' }
    }
    if (body.identityCount && body.identityCount > 0) {
      return { isValid: false, error: 'Identities are only supported for Bitwarden format' }
    }
  }

  return { isValid: true }
}

function buildGenerationOptions(body: VaultGenerateRequest): VaultGenerationOptions {
  const defaults: VaultGenerationOptions = {
    loginCount: 50,
    secureNoteCount: 0,
    creditCardCount: 0,
    identityCount: 0,
    vaultType: 'individual',
    vaultFormat: body.format,
    useRealUrls: false,
    useEnterpriseUrls: false,
    useCollections: false,
    collectionCount: 5,
    distributeItems: true,
    useNestedFolders: false,
    useNestedCollections: false,
    useRandomDepthNesting: false,
    topLevelCollectionCount: 5,
    collectionNestingDepth: 3,
    totalCollectionCount: 15,
    useWeakPasswords: false,
    weakPasswordPercentage: 20,
    reusePasswords: false,
    passwordReusePercentage: 10,
    language: 'en',
  }

  // Override with provided values, applying format constraints
  const options = { ...defaults, ...body }

  // Apply format constraints
  if (body.format !== 'bitwarden') {
    options.secureNoteCount = 0
    options.creditCardCount = 0
    options.identityCount = 0
    options.useCollections = false
    options.useNestedCollections = false
    options.useRandomDepthNesting = false
  }

  if (body.format !== 'bitwarden' || body.vaultType !== 'org') {
    options.useCollections = false
    options.useNestedCollections = false
    options.useRandomDepthNesting = false
  }

  return options
}

async function generateVault(options: VaultGenerationOptions) {
  // Initialize password pool for reuse functionality
  const totalCount = options.loginCount + options.secureNoteCount + options.creditCardCount + options.identityCount
  const passwordPool = initializePasswordPool(
    options.reusePasswords,
    totalCount,
    options.useWeakPasswords,
    options.weakPasswordPercentage,
    options.language
  )

  switch (options.vaultFormat) {
    case 'bitwarden':
      // Generate collections if needed
      const collections = options.useCollections && options.vaultType === 'org'
        ? (options.useNestedCollections
            ? generateHierarchicalCollections(
                options.topLevelCollectionCount,
                options.collectionNestingDepth,
                options.totalCollectionCount
              )
            : generateUniqueCollectionNames(options.collectionCount)
          ).map((name, index) => ({
            id: `collection-${index}`,
            organizationId: 'org-id',
            name,
            externalId: null
          }))
        : []

      return generateBitwardenVault(
        options.loginCount,
        options.secureNoteCount,
        options.creditCardCount,
        options.identityCount,
        options.vaultType,
        options.useRealUrls,
        options.useEnterpriseUrls,
        collections,
        options.distributeItems,
        options.useWeakPasswords,
        options.weakPasswordPercentage,
        options.reusePasswords,
        options.passwordReusePercentage,
        passwordPool,
        options.language,
        options.enterpriseUrls
      )

    case 'lastpass':
      const lastPassItems = createLastPassItem(
        options.loginCount,
        options.useRealUrls,
        options.useEnterpriseUrls,
        options.useWeakPasswords,
        options.weakPasswordPercentage,
        options.reusePasswords,
        options.passwordReusePercentage,
        passwordPool,
        options.enterpriseUrls
      )
      return formatLastPassToCsv(lastPassItems)

    case 'keeper':
      const keeperVault = generateKeeperVault(
        options.loginCount,
        options.useRealUrls,
        options.useEnterpriseUrls,
        false, // useNestedFolders - not supported in keeper
        false, // useRandomDepthNesting - not supported in keeper
        options.useWeakPasswords,
        options.weakPasswordPercentage,
        options.reusePasswords,
        options.passwordReusePercentage,
        passwordPool,
        options.enterpriseUrls
      )
      return formatKeeperToCsv(keeperVault)

    case 'edge':
      const edgeItems = createEdgePasswordItem(
        options.loginCount,
        options.useRealUrls,
        options.useEnterpriseUrls,
        options.useWeakPasswords,
        options.weakPasswordPercentage,
        options.reusePasswords,
        options.passwordReusePercentage,
        passwordPool,
        options.enterpriseUrls
      )
      return formatEdgeToCsv(edgeItems)

    case 'keepassx':
      const keepassxItems = createKeePassXItem(
        options.loginCount,
        options.useRealUrls,
        options.useEnterpriseUrls,
        options.useWeakPasswords,
        options.weakPasswordPercentage,
        options.reusePasswords,
        options.passwordReusePercentage,
        passwordPool,
        options.enterpriseUrls
      )
      return formatKeePassXToCsv(keepassxItems)

    case 'keepass2':
      const keepass2File = createKeePass2File(
        options.loginCount,
        options.useRealUrls,
        options.useEnterpriseUrls,
        options.useWeakPasswords,
        options.weakPasswordPercentage,
        options.reusePasswords,
        options.passwordReusePercentage,
        passwordPool,
        options.enterpriseUrls
      )
      return convertKeePass2ToXML(keepass2File)

    case 'password-depot':
      const passwordDepotItems = createPasswordDepotItems(
        options.loginCount,
        options.useRealUrls,
        options.useEnterpriseUrls,
        options.useWeakPasswords,
        options.weakPasswordPercentage,
        options.reusePasswords,
        options.passwordReusePercentage,
        passwordPool,
        options.enterpriseUrls
      )
      return convertPasswordDepotToCSV(passwordDepotItems)
    
    default:
      throw new Error(`Unsupported format: ${options.vaultFormat}`)
  }
}

function getContentType(format: string): string {
  switch (format) {
    case 'bitwarden':
      return 'application/json'
    case 'keepass2':
      return 'application/xml'
    default:
      return 'text/csv'
  }
}

function getFileName(format: string): string {
  switch (format) {
    case 'bitwarden':
      return 'vault_export.json'
    case 'lastpass':
      return 'lastpass_export.csv'
    case 'keeper':
      return 'keeper_export.csv'
    case 'edge':
      return 'edge_export.csv'
    case 'keepassx':
      return 'keepassx_export.csv'
    case 'keepass2':
      return 'keepass2_export.xml'
    case 'password-depot':
      return 'password_depot_export.csv'
    default:
      return 'vault_export.txt'
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting check
    const rateLimitResult = await validateRateLimit(request, true)
    if (!rateLimitResult.isValid) {
      return createRateLimitResponse(rateLimitResult.error!, rateLimitResult.rateLimitHeaders!)
    }

    // 2. Request size validation
    const sizeValidation = await validateRequestSize(request)
    if (!sizeValidation.isValid) {
      return createValidationErrorResponse(sizeValidation.error!)
    }

    // 3. Parse and validate request body
    let body: VaultGenerateRequest
    try {
      body = await request.json()
    } catch (error) {
      return createValidationErrorResponse('Invalid JSON in request body')
    }

    // 4. Security parameter validation
    const paramValidation = validateGenerationParams(body)
    if (!paramValidation.isValid) {
      return createValidationErrorResponse(paramValidation.error!)
    }

    // 5. Business logic validation
    const businessValidation = validateRequest(body)
    if (!businessValidation.isValid) {
      return createValidationErrorResponse(businessValidation.error!)
    }

    // 6. Build generation options
    const options = buildGenerationOptions(body)

    // 7. Generate vault (with memory protection)
    let vault: string | object
    try {
      vault = await generateVault(options)
    } catch (error) {
      console.error('Vault generation error:', error)
      return createValidationErrorResponse('Failed to generate vault. Please try with smaller parameters.')
    }

    // 8. Determine response format
    const contentType = getContentType(body.format)
    const fileName = getFileName(body.format)

    // 9. Create response with security headers
    const response = new NextResponse(
      typeof vault === 'string' ? vault : JSON.stringify(vault, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )

    // Add rate limit headers
    if (rateLimitResult.rateLimitHeaders) {
      Object.entries(rateLimitResult.rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    }

    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Unexpected error in vault generation:', error)
    return createValidationErrorResponse('Internal server error')
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting for info endpoints
    const rateLimitResult = await validateRateLimit(request, false)
    if (!rateLimitResult.isValid) {
      return createRateLimitResponse(rateLimitResult.error!, rateLimitResult.rateLimitHeaders!)
    }

    const response = NextResponse.json({
      message: 'Password Vault Generator API',
      supportedFormats: [
        'bitwarden',
        'lastpass', 
        'keeper',
        'edge',
        'keepassx',
        'keepass2',
        'password-depot'
      ],
      endpoint: '/api/vault/generate',
      method: 'POST',
      rateLimit: {
        generateEndpoint: '10 requests per minute',
        infoEndpoints: '60 requests per minute'
      }
    })

    // Add rate limit headers
    if (rateLimitResult.rateLimitHeaders) {
      Object.entries(rateLimitResult.rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    }

    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Error in GET endpoint:', error)
    return createValidationErrorResponse('Internal server error')
  }
}