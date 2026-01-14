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
  session_token: string
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
 * Requires session_token for authorization
 */
export const POST = createApiHandler<AvailabilityBody, AvailabilityResponse>({
  // Parse request body
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      participant_id: body.participant_id,
      session_token: body.session_token,
      dates: body.dates || [],
    }
  },

  validate: async (body, _params, request) => {
    const clientIp = getClientIp(request)
    const rateLimitResult = await applyRateLimit(availabilitySubmissionLimiter, clientIp)

    if (!rateLimitResult.success) {
      return {
        valid: false,
        error: rateLimitResult.error || "Too many requests. Please try again later.",
        status: 429,
      }
    }

    const requiredValidation = validateRequired({ participant_id: body.participant_id }, [
      "participant_id",
    ])

    if (!requiredValidation.valid) {
      return requiredValidation
    }

    if (typeof body.participant_id !== "string") {
      return {
        valid: false,
        error: "participant_id must be a string",
        status: 400,
      }
    }

    if (!body.session_token || typeof body.session_token !== "string") {
      return {
        valid: false,
        error: "session_token is required for this operation",
        status: 401,
      }
    }

    if (!Array.isArray(body.dates) || body.dates.length === 0) {
      return {
        valid: false,
        error: "dates array is required and cannot be empty",
        status: 400,
      }
    }

    const validStatuses: AvailabilityStatus[] = ["available", "maybe", "unavailable"]

    for (const dateEntry of body.dates) {
      const dateValidation = validateDateFormat(dateEntry.date, "date")
      if (!dateValidation.valid) {
        return {
          valid: false,
          error: `Invalid date format: ${dateEntry.date}. Expected YYYY-MM-DD`,
          status: 400,
        }
      }

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

  handler: async (body, _params, client) => {
    const participant = await fetchSingleRecord<{
      id: string
      event_id: string
      session_token: string
    }>(client, "participants", "id", body.participant_id, "id, event_id, session_token")

    if (participant.session_token !== body.session_token) {
      throw new ApiError("Unauthorized: Invalid session token", 403)
    }

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

    const { error: updateError } = await client
      .from("participants")
      .update({ has_submitted: true })
      .eq("id", body.participant_id)

    if (updateError) {
      console.error("Participant update error:", updateError)
    }

    return { success: true }
  },

  successStatus: 200,

  errorMessages: {
    validation: "Invalid availability data",
    notFound: "Participant not found",
    serverError: "Failed to save availability",
  },
})
