import type { NextRequest } from "next/server"
import {
  ApiError,
  createApiHandler,
  fetchSingleRecord,
  validateDateFormat,
  validateRequired,
} from "@/lib/api"
import { applyRateLimit, availabilitySubmissionLimiter, getClientIp } from "@/lib/ratelimit"
import type { AvailabilityStatus } from "@/types"

/**
 * Date entry in availability submission
 */
interface DateEntry {
  date: string
  status: AvailabilityStatus
}

/**
 * Body type for availability submission
 */
interface AvailabilityBody {
  participant_id: string
  dates: DateEntry[]
}

/**
 * Response type for availability submission
 */
interface AvailabilityResponse {
  success: boolean
}

/**
 * POST /api/availability
 * Submit or update participant availability
 */
export const POST = createApiHandler<AvailabilityBody, AvailabilityResponse>({
  // Parse request body
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      participant_id: body.participant_id,
      dates: body.dates || [],
    }
  },

  // Validate inputs
  validate: async (body, _params, request) => {
    // Apply rate limiting (20 submissions per hour per IP)
    const clientIp = getClientIp(request)
    const rateLimitResult = await applyRateLimit(availabilitySubmissionLimiter, clientIp)

    if (!rateLimitResult.success) {
      return {
        valid: false,
        error: rateLimitResult.error || "Too many requests. Please try again later.",
        status: 429,
      }
    }

    // Validate required fields
    const requiredValidation = validateRequired({ participant_id: body.participant_id }, [
      "participant_id",
    ])

    if (!requiredValidation.valid) {
      return requiredValidation
    }

    // Validate participant_id is a string
    if (typeof body.participant_id !== "string") {
      return {
        valid: false,
        error: "participant_id must be a string",
        status: 400,
      }
    }

    // Validate dates array
    if (!Array.isArray(body.dates) || body.dates.length === 0) {
      return {
        valid: false,
        error: "dates array is required and cannot be empty",
        status: 400,
      }
    }

    // Validate each date entry
    const validStatuses: AvailabilityStatus[] = ["available", "maybe", "unavailable"]

    for (const dateEntry of body.dates) {
      // Validate date format
      const dateValidation = validateDateFormat(dateEntry.date, "date")
      if (!dateValidation.valid) {
        return {
          valid: false,
          error: `Invalid date format: ${dateEntry.date}. Expected YYYY-MM-DD`,
          status: 400,
        }
      }

      // Validate status
      if (!validStatuses.includes(dateEntry.status)) {
        return {
          valid: false,
          error: `Invalid status: ${dateEntry.status}. Must be available, maybe, or unavailable`,
          status: 400,
        }
      }
    }

    return { valid: true }
  },

  // Main handler logic
  handler: async (body, _params, client) => {
    // Verify participant exists
    await fetchSingleRecord<{ id: string; event_id: string }>(
      client,
      "participants",
      "id",
      body.participant_id,
      "id, event_id"
    )

    // Upsert availability records (insert or update on conflict)
    const availabilityRecords = body.dates.map((dateEntry) => ({
      participant_id: body.participant_id,
      date: dateEntry.date,
      status: dateEntry.status,
    }))

    const { error: upsertError } = await client.from("availability").upsert(availabilityRecords, {
      onConflict: "participant_id,date",
    })

    if (upsertError) {
      console.error("Availability upsert error:", upsertError)
      throw new ApiError("Failed to save availability", 500)
    }

    // Update participant has_submitted status
    const { error: updateError } = await client
      .from("participants")
      .update({ has_submitted: true })
      .eq("id", body.participant_id)

    if (updateError) {
      console.error("Participant update error:", updateError)
      // Non-critical error, availability is already saved
    }

    return { success: true }
  },

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    validation: "Invalid availability data",
    notFound: "Participant not found",
    serverError: "Failed to save availability",
  },
})
