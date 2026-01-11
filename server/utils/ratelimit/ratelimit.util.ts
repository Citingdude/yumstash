import type { H3Event } from 'h3'

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitOptions {
  maxAttempts: number
  windowMs: number
  keyPrefix?: string
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.storage.entries()) {
      if (entry.resetAt < now) {
        this.storage.delete(key)
      }
    }
  }

  public check(key: string, options: RateLimitOptions): { allowed: boolean, retryAfter?: number } {
    const now = Date.now()
    const entry = this.storage.get(key)

    if (!entry || entry.resetAt < now) {
      // Create new entry or reset expired entry
      this.storage.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      })
      return { allowed: true }
    }

    if (entry.count >= options.maxAttempts) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      return { allowed: false, retryAfter }
    }

    // Increment count
    entry.count++
    return { allowed: true }
  }

  public reset(key: string): void {
    this.storage.delete(key)
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.storage.clear()
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  keyGenerator?: (event: H3Event) => string
  skipSuccessfulRequests?: boolean
}

/**
 * Rate limiting utility for API endpoints
 * @param event H3Event
 * @param config Rate limit configuration
 * @returns Rate limit check result
 */
export function checkRateLimit(
  event: H3Event,
  config: RateLimitConfig,
): { allowed: boolean, retryAfter?: number, key: string } {
  const key = config.keyGenerator
    ? config.keyGenerator(event)
    : getRequestIP(event) || 'unknown'

  const result = rateLimiter.check(key, {
    maxAttempts: config.maxAttempts,
    windowMs: config.windowMs,
  })

  return {
    ...result,
    key,
  }
}

/**
 * Reset rate limit for a specific key
 * @param key Rate limit key
 */
export function resetRateLimit(key: string): void {
  rateLimiter.reset(key)
}

/**
 * Throw rate limit error
 * @param retryAfter Seconds until the rate limit resets
 */
export function throwRateLimitError(retryAfter: number): never {
  throw createError({
    statusCode: 429,
    statusMessage: 'Too Many Requests',
    message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
    data: {
      retryAfter,
    },
  })
}
