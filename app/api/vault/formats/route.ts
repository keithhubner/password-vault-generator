import { NextRequest, NextResponse } from 'next/server'
import { 
  validateRateLimit, 
  addSecurityHeaders,
  createRateLimitResponse,
  createValidationErrorResponse 
} from '@/utils/security-middleware'

interface FormatInfo {
  name: string
  description: string
  supportedVaultTypes: string[]
  supportedItemTypes: string[]
  organizationalFeatures: string[]
  outputFormat: string
}

const formatDetails: Record<string, FormatInfo> = {
  bitwarden: {
    name: 'Bitwarden',
    description: 'Bitwarden password manager export format',
    supportedVaultTypes: ['individual', 'org'],
    supportedItemTypes: ['login', 'secureNote', 'creditCard', 'identity'],
    organizationalFeatures: ['folders (individual)', 'collections (org)', 'nested collections (org only)'],
    outputFormat: 'JSON'
  },
  lastpass: {
    name: 'LastPass',
    description: 'LastPass password manager CSV export format',
    supportedVaultTypes: ['individual'],
    supportedItemTypes: ['login'],
    organizationalFeatures: [],
    outputFormat: 'CSV'
  },
  keeper: {
    name: 'Keeper',
    description: 'Keeper Security password manager export format',
    supportedVaultTypes: ['individual'],
    supportedItemTypes: ['login'],
    organizationalFeatures: ['folders'],
    outputFormat: 'CSV'
  },
  edge: {
    name: 'Microsoft Edge',
    description: 'Microsoft Edge browser password export format',
    supportedVaultTypes: ['individual'],
    supportedItemTypes: ['login'],
    organizationalFeatures: [],
    outputFormat: 'CSV'
  },
  keepassx: {
    name: 'KeePassX',
    description: 'KeePassX password manager export format',
    supportedVaultTypes: ['individual'],
    supportedItemTypes: ['login'],
    organizationalFeatures: [],
    outputFormat: 'CSV'
  },
  keepass2: {
    name: 'KeePass2',
    description: 'KeePass2 password manager export format',
    supportedVaultTypes: ['individual'],
    supportedItemTypes: ['login'],
    organizationalFeatures: ['predefined groups'],
    outputFormat: 'XML'
  },
  'password-depot': {
    name: 'Password Depot',
    description: 'Password Depot password manager export format',
    supportedVaultTypes: ['individual'],
    supportedItemTypes: ['login'],
    organizationalFeatures: [],
    outputFormat: 'CSV'
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
      message: 'Supported password vault formats',
      formats: formatDetails,
      usage: {
        endpoint: '/api/vault/generate',
        method: 'POST',
        rateLimit: '10 requests per minute',
        maxItemsPerType: 10000,
        maxTotalItems: 15000,
        example: {
          format: 'bitwarden',
          vaultType: 'individual',
          loginCount: 50,
          useRealUrls: true,
          useWeakPasswords: false
        }
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
    console.error('Error in formats endpoint:', error)
    return createValidationErrorResponse('Internal server error')
  }
}