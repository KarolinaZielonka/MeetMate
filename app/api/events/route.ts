import type { NextRequest } from "next/server"
import {
  ApiError,
  combineValidations,
  createApiHandler,
  validateRequired,
  validateString,
} from "@/lib/api"
import { hashPassword } from "@/lib/utils/auth"
import { formatDateForAPI, parseDate, validateDateRange } from "@/lib/utils/dates"
import { generateShareUrl } from "@/lib/utils/urlGenerator"

/**
 * Request body type for event creation
 */
interface CreateEventBody {
  name: string
  start_date: string
  end_date: string
  creator_name?: string
  password?: string
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
    }
  },

  // Validate inputs
  validate: async (body, _params) => {
    // Validate required fields
    const requiredValidation = validateRequired(
      { name: body.name, start_date: body.start_date, end_date: body.end_date },
      ["name", "start_date", "end_date"]
    )

    // Validate string lengths
    const nameValidation = validateString(body.name, "name", { minLength: 1, maxLength: 255 })

    const creatorNameValidation = body.creator_name
      ? validateString(body.creator_name, "creator_name", { minLength: 1, maxLength: 100 })
      : { valid: true }

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
        })
        .select("id, share_url, name, start_date, end_date, creator_name, is_locked")
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
