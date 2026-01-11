import type { NextRequest } from "next/server"
import {
  ApiError,
  combineValidations,
  createApiHandler,
  validateRequired,
  validateString,
} from "@/lib/api"
import { applyRateLimit, eventCreationLimiter, getClientIp } from "@/lib/ratelimit"
import { hashPassword } from "@/lib/utils/auth"
import { formatDateForAPI, parseDate, validateDateRange } from "@/lib/utils/dates"
import { verifyTurnstileToken } from "@/lib/utils/turnstile"
import { generateShareUrl } from "@/lib/utils/urlGenerator"

/**
 * Request body type for event creation
 */
interface CreateEventBody {
  name: string
  start_date: string
  end_date: string
  creator_name: string
  password?: string
  captcha_token?: string
  excluded_dates?: string[]
}

/**
 * Response type for event creation
 */
interface CreateEventResponse {
  id: string
  share_url: string
  name: string
  start_date: string
  end_date: string
  creator_name: string | null
  is_locked: boolean
  excluded_dates: string[]
  participant: {
    participant_id: string
    session_token: string
  } | null
}

/**
 * POST /api/events
 * Create a new event
 */
export const POST = createApiHandler<CreateEventBody, CreateEventResponse>({
  // Parse request body
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      name: body.name,
      start_date: body.start_date,
      end_date: body.end_date,
      creator_name: body.creator_name,
      password: body.password,
      captcha_token: body.captcha_token,
      excluded_dates: body.excluded_dates,
    }
  },

  // Validate inputs
  validate: async (body, _params, request) => {
    // Verify CAPTCHA token if configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (!body.captcha_token) {
        return {
          valid: false,
          error: "CAPTCHA verification is required",
          status: 400,
        }
      }

      const captchaValid = await verifyTurnstileToken(body.captcha_token)
      if (!captchaValid) {
        return {
          valid: false,
          error: "CAPTCHA verification failed. Please try again.",
          status: 400,
        }
      }
    }

    // Apply rate limiting (5 events per hour per IP)
    const clientIp = getClientIp(request)
    const rateLimitResult = await applyRateLimit(eventCreationLimiter, clientIp)

    if (!rateLimitResult.success) {
      return {
        valid: false,
        error: rateLimitResult.error || "Too many requests. Please try again later.",
        status: 429,
      }
    }

    // Validate required fields
    const requiredValidation = validateRequired(
      {
        name: body.name,
        start_date: body.start_date,
        end_date: body.end_date,
        creator_name: body.creator_name,
      },
      ["name", "start_date", "end_date", "creator_name"]
    )

    // Validate string lengths
    const nameValidation = validateString(body.name, "name", { minLength: 1, maxLength: 255 })

    const creatorNameValidation = validateString(body.creator_name, "creator_name", {
      minLength: 1,
      maxLength: 100,
    })

    // Combine validations
    const combinedValidation = combineValidations(
      requiredValidation,
      nameValidation,
      creatorNameValidation
    )

    if (!combinedValidation.valid) {
      return combinedValidation
    }

    // Validate date range
    let parsedStartDate: Date
    let parsedEndDate: Date

    try {
      parsedStartDate = parseDate(body.start_date)
      parsedEndDate = parseDate(body.end_date)
    } catch (_error) {
      return {
        valid: false,
        error: "Invalid date format. Please use ISO date strings (YYYY-MM-DD)",
        status: 400,
      }
    }

    const dateValidation = validateDateRange(parsedStartDate, parsedEndDate)
    if (!dateValidation.valid) {
      return {
        valid: false,
        error: dateValidation.error || "Invalid date range",
        status: 400,
      }
    }

    // Validate excluded_dates if provided
    if (body.excluded_dates && body.excluded_dates.length > 0) {
      // Check that it's an array
      if (!Array.isArray(body.excluded_dates)) {
        return {
          valid: false,
          error: "excluded_dates must be an array",
          status: 400,
        }
      }

      // Validate each excluded date
      for (const dateStr of body.excluded_dates) {
        if (typeof dateStr !== "string") {
          return {
            valid: false,
            error: "Each excluded date must be a string in YYYY-MM-DD format",
            status: 400,
          }
        }

        let excludedDate: Date
        try {
          excludedDate = parseDate(dateStr)
        } catch (_error) {
          return {
            valid: false,
            error: `Invalid excluded date format: ${dateStr}. Use YYYY-MM-DD format.`,
            status: 400,
          }
        }

        // Check that excluded date is within the event date range
        if (excludedDate < parsedStartDate || excludedDate > parsedEndDate) {
          return {
            valid: false,
            error: `Excluded date ${dateStr} is outside the event date range`,
            status: 400,
          }
        }
      }
    }

    return { valid: true }
  },

  // Main handler logic
  handler: async (body, _params, client) => {
    // Parse dates
    const parsedStartDate = parseDate(body.start_date)
    const parsedEndDate = parseDate(body.end_date)

    // Hash password if provided (do this once before retry loop)
    let passwordHash: string | null = null
    if (body.password && typeof body.password === "string" && body.password.length > 0) {
      try {
        passwordHash = await hashPassword(body.password)
      } catch (error) {
        console.error("Error hashing password:", error)
        throw new ApiError("Failed to process password", 500)
      }
    }

    // Format dates for database (YYYY-MM-DD)
    const formattedStartDate = formatDateForAPI(parsedStartDate)
    const formattedEndDate = formatDateForAPI(parsedEndDate)

    // Insert event into database with retry on URL collision
    // Max retries = 5 (collision probability is <1% so this is very safe)
    let event: {
      id: string
      share_url: string
      name: string
      start_date: string
      end_date: string
      creator_name: string | null
      is_locked: boolean
      excluded_dates: string[] | null
    } | null = null
    let eventError: { code?: string; message?: string } | null = null
    const maxRetries = 5

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const shareUrl = generateShareUrl()

      const result = await client
        .from("events")
        .insert({
          name: body.name.trim(),
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          share_url: shareUrl,
          password_hash: passwordHash,
          creator_name: body.creator_name?.trim() || null,
          is_locked: false,
          calculated_date: null,
          excluded_dates: body.excluded_dates || [],
        })
        .select("id, share_url, name, start_date, end_date, creator_name, is_locked, excluded_dates")
        .single()

      event = result.data
      eventError = result.error

      // Check if error is a unique constraint violation on share_url
      if (eventError?.code === "23505" && eventError?.message?.includes("share_url")) {
        // URL collision - retry with new URL
        console.log(`Share URL collision on attempt ${attempt + 1}, retrying...`)
        continue
      }

      // Success or non-collision error - break out of retry loop
      break
    }

    if (eventError || !event) {
      console.error("Database error creating event:", eventError)
      throw new ApiError("Failed to create event. Please try again.", 500)
    }

    // Automatically create a participant record for the creator if they provided a name
    let participantData: { participant_id: string; session_token: string } | null = null
    if (body.creator_name && body.creator_name.trim().length > 0) {
      const sessionToken = crypto.randomUUID()

      const { data: participant, error: participantError } = await client
        .from("participants")
        .insert({
          event_id: event.id,
          name: body.creator_name.trim(),
          session_token: sessionToken,
          has_submitted: false,
        })
        .select("id, session_token")
        .single()

      if (!participantError && participant) {
        participantData = {
          participant_id: participant.id,
          session_token: participant.session_token,
        }
      }
    }

    // Return success response
    return {
      id: event.id,
      share_url: event.share_url,
      name: event.name,
      start_date: event.start_date,
      end_date: event.end_date,
      creator_name: event.creator_name,
      is_locked: event.is_locked,
      excluded_dates: event.excluded_dates || [],
      participant: participantData,
    }
  },

  // Success status
  successStatus: 201,

  // Custom error messages
  errorMessages: {
    validation: "Invalid event data",
    serverError: "Failed to create event. Please try again.",
  },
})
