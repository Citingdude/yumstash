import { checkRateLimit, throwRateLimitError } from '~~/server/utils/ratelimit/ratelimit.util'

const RATE_LIMIT_CONFIG = {
  '/api/auth/login': {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  '/api/auth/register': {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  '/api/auth/reset-password': {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  '/api/auth/forgot-password': {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const

type RateLimitedRoute = keyof typeof RATE_LIMIT_CONFIG

export default defineEventHandler((event) => {
  const path = event.path

  // Only apply to auth endpoints
  if (!path.startsWith('/api/auth/')) {
    return
  }

  // Skip GET requests (like /api/auth/validate)
  if (event.method === 'GET') {
    return
  }

  const config = RATE_LIMIT_CONFIG[path as RateLimitedRoute]

  // Skip if no config defined for this endpoint
  if (!config) {
    return
  }

  const ip = getRequestIP(event)
  const key = `${path}:${ip}`

  const rateLimit = checkRateLimit(event, {
    maxAttempts: config.maxAttempts,
    windowMs: config.windowMs,
    keyGenerator: () => key,
  })

  if (!rateLimit.allowed) {
    throwRateLimitError(rateLimit.retryAfter!)
  }
})
