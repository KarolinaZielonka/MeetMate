import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Initialize Redis client
// For development without Upstash, we'll use a simple in-memory store
// For production, use Upstash Redis with environment variables
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

/**
 * Rate limiter for event creation
 * Limit: 5 events per hour per IP
 */
export const eventCreationLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "@ratelimit/event-creation",
    })
  : null

/**
 * Rate limiter for participant joins
 * Limit: 10 joins per hour per IP
 */
export const participantJoinLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "@ratelimit/participant-join",
    })
  : null

/**
 * Rate limiter for availability submissions
 * Limit: 20 submissions per hour per IP
 */
export const availabilitySubmissionLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 h"),
      analytics: true,
      prefix: "@ratelimit/availability-submission",
    })
  : null

/**
 * Rate limiter for password verification attempts
 * Limit: 5 attempts per 15 minutes per IP
 * Stricter to prevent brute force attacks
 */
export const passwordVerificationLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "@ratelimit/password-verify",
    })
  : null

/**
 * Helper function to get client IP from request headers
 * Works with Vercel, Cloudflare, and other reverse proxies
 */
export function getClientIp(request: Request): string {
  const headers = request.headers

  // Try common headers in order of preference
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = headers.get("x-real-ip")
  if (realIp) {
    return realIp.trim()
  }

  const cfConnectingIp = headers.get("cf-connecting-ip") // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }

  // Fallback to a default value for development
  return "127.0.0.1"
}

/**
 * Apply rate limiting to a request
 * Returns { success: true } if allowed, { success: false, error: string } if blocked
 */
export async function applyRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; error?: string }> {
  // If no Redis configured (development), skip rate limiting
  if (!limiter) {
    console.warn("⚠️  Rate limiting disabled: UPSTASH_REDIS_REST_URL not configured")
    return { success: true }
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    if (!success) {
      const resetDate = new Date(reset)
      return {
        success: false,
        error: `Rate limit exceeded. Try again at ${resetDate.toISOString()}`,
      }
    }

    // Log rate limit status for monitoring
    console.log(`Rate limit: ${remaining}/${limit} remaining for ${identifier}`)

    return { success: true }
  } catch (error) {
    // On error, fail open (allow the request) to avoid blocking users due to Redis issues
    console.error("Rate limiting error:", error)
    return { success: true }
  }
}
