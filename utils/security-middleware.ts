import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimiter, infoRateLimiter, getClientIdentifier } from './rate-limiter'

// Security constants
const MAX_REQUEST_SIZE = 1024 * 1024 // 1MB max request size
const MAX_ITEMS_PER_TYPE = 10000 // Maximum items per type
const MAX_TOTAL_ITEMS = 15000 // Maximum total items across all types
const MAX_COLLECTION_COUNT = 100 // Maximum collections
const MAX_NESTING_DEPTH = 10 // Maximum nesting depth

export interface SecurityValidationResult {
  isValid: boolean
  error?: string
  rateLimitHeaders?: Record<string, string>
}

export async function validateRateLimit(
  request: NextRequest, 
  isGenerateEndpoint: boolean = false
): Promise<SecurityValidationResult> {
  const clientId = getClientIdentifier(request)
  const limiter = isGenerateEndpoint ? apiRateLimiter : infoRateLimiter
  const result = limiter.checkLimit(clientId)

  const headers = {
    'X-RateLimit-Limit': (isGenerateEndpoint ? 10 : 60).toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  }

  if (!result.allowed) {
    return {
      isValid: false,
      error: 'Rate limit exceeded. Please try again later.',
      rateLimitHeaders: headers
    }
  }

  return {
    isValid: true,
    rateLimitHeaders: headers
  }
}

export async function validateRequestSize(request: NextRequest): Promise<SecurityValidationResult> {
  try {
    const contentLength = request.headers.get('content-length')
    
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return {
        isValid: false,
        error: `Request size too large. Maximum size is ${MAX_REQUEST_SIZE / (1024 * 1024)}MB`
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid request format'
    }
  }
}

export function validateGenerationParams(body: unknown): SecurityValidationResult {
  if (!body || typeof body !== 'object') {
    return {
      isValid: false,
      error: 'Request body must be a valid JSON object'
    }
  }

  // Type assertion for accessing properties
  const requestBody = body as Record<string, unknown>

  // Validate item counts
  const itemCounts = {
    loginCount: (requestBody.loginCount as number) || 0,
    secureNoteCount: (requestBody.secureNoteCount as number) || 0,
    creditCardCount: (requestBody.creditCardCount as number) || 0,
    identityCount: (requestBody.identityCount as number) || 0
  }

  // Check individual limits
  for (const [field, count] of Object.entries(itemCounts)) {
    if (typeof count !== 'number' || count < 0) {
      return {
        isValid: false,
        error: `${field} must be a non-negative number`
      }
    }

    if (count > MAX_ITEMS_PER_TYPE) {
      return {
        isValid: false,
        error: `${field} cannot exceed ${MAX_ITEMS_PER_TYPE} items`
      }
    }
  }

  // Check total items limit
  const totalItems = Object.values(itemCounts).reduce((sum, count) => sum + count, 0)
  if (totalItems > MAX_TOTAL_ITEMS) {
    return {
      isValid: false,
      error: `Total items cannot exceed ${MAX_TOTAL_ITEMS}. Current total: ${totalItems}`
    }
  }

  if (totalItems === 0) {
    return {
      isValid: false,
      error: 'At least one item must be generated'
    }
  }

  // Validate collection parameters
  if (requestBody.collectionCount && (typeof requestBody.collectionCount !== 'number' || requestBody.collectionCount > MAX_COLLECTION_COUNT)) {
    return {
      isValid: false,
      error: `Collection count cannot exceed ${MAX_COLLECTION_COUNT}`
    }
  }

  if (requestBody.collectionNestingDepth && (typeof requestBody.collectionNestingDepth !== 'number' || requestBody.collectionNestingDepth > MAX_NESTING_DEPTH)) {
    return {
      isValid: false,
      error: `Collection nesting depth cannot exceed ${MAX_NESTING_DEPTH}`
    }
  }

  if (requestBody.totalCollectionCount && (typeof requestBody.totalCollectionCount !== 'number' || requestBody.totalCollectionCount > MAX_COLLECTION_COUNT)) {
    return {
      isValid: false,
      error: `Total collection count cannot exceed ${MAX_COLLECTION_COUNT}`
    }
  }

  // Validate Mr Blobby percentage
  if (requestBody.mrBlobbyPercentage !== undefined) {
    const pct = requestBody.mrBlobbyPercentage
    if (typeof pct !== 'number' || pct < 5 || pct > 100) {
      return {
        isValid: false,
        error: 'mrBlobbyPercentage must be a number between 5 and 100'
      }
    }
  }

  // Validate percentage fields
  const percentageFields = ['weakPasswordPercentage', 'passwordReusePercentage']
  for (const field of percentageFields) {
    if (requestBody[field] !== undefined) {
      const value = requestBody[field]
      if (typeof value !== 'number' || value < 0 || value > 100) {
        return {
          isValid: false,
          error: `${field} must be a number between 0 and 100`
        }
      }
    }
  }

  // Sanitize string fields to prevent XSS
  const stringFields = ['format', 'vaultType']
  for (const field of stringFields) {
    if (requestBody[field] && typeof requestBody[field] === 'string') {
      // Remove any HTML/script tags and limit length
      requestBody[field] = (requestBody[field] as string).replace(/<[^>]*>/g, '').substring(0, 50)
    }
  }

  return { isValid: true }
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Content-Security-Policy', "default-src 'self'")
  
  return response
}

export function createRateLimitResponse(error: string, headers: Record<string, string>): NextResponse {
  const response = NextResponse.json(
    { error },
    { status: 429 }
  )

  // Add rate limit headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return addSecurityHeaders(response)
}

export function createValidationErrorResponse(error: string): NextResponse {
  const response = NextResponse.json(
    { error },
    { status: 400 }
  )

  return addSecurityHeaders(response)
}