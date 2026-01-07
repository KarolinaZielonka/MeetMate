import { randomUUID } from "crypto"
import type { NextRequest } from "next/server"
import {
  ApiError,
  combineValidations,
  createApiHandler,
  fetchSingleRecord,
  validateRequired,
  validateString,
} from "@/lib/api"
import { applyRateLimit, getClientIp, passwordVerificationLimiter } from "@/lib/ratelimit"
import { verifyPassword } from "@/lib/utils/auth"

/**
 * Request body type for password verification
 */
interface VerifyPasswordBody {
  password: string
}

/**
 * Response type for password verification
 */
interface VerifyPasswordResponse {
  success: boolean
  accessToken: string
  eventId: string
}

/**
 * POST /api/events/[shareUrl]/verify
 * Verify event password and return access token
 */
export const POST = createApiHandler<VerifyPasswordBody, VerifyPasswordResponse>({
  // Parse request body
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      password: body.password,
    }
  },

  // Validate inputs
  validate: async (body, params, request) => {
    // Apply rate limiting (5 attempts per 15 minutes per IP)
    // Stricter limit to prevent brute force attacks
    const clientIp = getClientIp(request)
    const rateLimitResult = await applyRateLimit(passwordVerificationLimiter, clientIp)

    if (!rateLimitResult.success) {
      return {
        valid: false,
        error: rateLimitResult.error || "Too many password attempts. Please try again later.",
        status: 429,
      }
    }

    return combineValidations(
      validateRequired({ shareUrl: params.shareUrl, password: body.password }, [
        "shareUrl",
        "password",
      ]),
      validateString(body.password, "password", { minLength: 1 })
    )
  },

  // Main handler logic
  handler: async (body, params, client) => {
    // Fetch event with password hash
    const event = await fetchSingleRecord<{ id: string; password_hash: string | null }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id, password_hash"
    )

    // Check if event has password protection
    if (!event.password_hash) {
      throw new ApiError("Event is not password protected", 400)
    }

    // Verify password
    const isValid = await verifyPassword(body.password, event.password_hash)

    if (!isValid) {
      throw new ApiError("Incorrect password", 401)
    }

    // Generate access token
    const accessToken = randomUUID()

    // Return success with token
    return {
      success: true,
      accessToken,
      eventId: event.id,
    }
  },

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    validation: "Invalid password data",
    notFound: "Event not found",
    serverError: "Failed to verify password",
  },
})
