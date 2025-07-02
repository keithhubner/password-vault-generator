interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) { // 10 requests per minute by default
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      const resetTime = now + this.windowMs
      this.requests.set(identifier, { count: 1, resetTime })
      return { allowed: true, remaining: this.maxRequests - 1, resetTime }
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime }
    }

    // Increment count
    entry.count++
    this.requests.set(identifier, entry)
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Create different rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter(10, 60000) // 10 requests per minute for generate endpoint
export const infoRateLimiter = new RateLimiter(60, 60000) // 60 requests per minute for info endpoints

export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers (for reverse proxies)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('x-remote-addr')
  
  if (forwardedFor) {
    // Take the first IP from the comma-separated list
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  if (remoteAddr) {
    return remoteAddr
  }
  
  // Fallback - this won't work well in production behind a proxy
  return 'unknown'
}