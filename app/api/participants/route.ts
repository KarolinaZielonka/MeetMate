import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import {
  ApiError,
  combineValidations,
  createApiHandler,
  fetchSingleRecord,
  validateRequired,
  validateString,
  validateUUID,
} from "@/lib/api"
import { applyRateLimit, getClientIp, participantJoinLimiter } from "@/lib/ratelimit"

/**
 * Request body type for participant creation
 */
interface CreateParticipantBody {
  event_id: string
  name: string
}

/**
 * Response type for participant creation
 */
interface CreateParticipantResponse {
  id: string
  session_token: string
}

/**
 * POST /api/participants
 * Create a new participant for an event
 */
export const POST = createApiHandler<CreateParticipantBody, CreateParticipantResponse>({
  // Parse request body
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      event_id: body.event_id,
      name: body.name,
    }
  },

  // Validate inputs
  validate: async (body, _params, request) => {
    // Apply rate limiting (10 joins per hour per IP)
    const clientIp = getClientIp(request)
    const rateLimitResult = await applyRateLimit(participantJoinLimiter, clientIp)

    if (!rateLimitResult.success) {
      return {
        valid: false,
        error: rateLimitResult.error || "Too many requests. Please try again later.",
        status: 429,
      }
    }

    return combineValidations(
      validateRequired({ event_id: body.event_id, name: body.name }, ["event_id", "name"]),
      validateUUID(body.event_id, "event_id"),
      validateString(body.name, "name", { minLength: 1, maxLength: 100 })
    )
  },

  // Main handler logic
  handler: async (body, _params, client) => {
    // Verify event exists and is not locked
    const event = await fetchSingleRecord<{ id: string; is_locked: boolean }>(
      client,
      "events",
      "id",
      body.event_id,
      "id, is_locked"
    )

    // Check if event is locked
    if (event.is_locked) {
      throw new ApiError("This event is locked and no longer accepting participants", 403)
    }

    // Generate unique session token (UUID v4)
    const sessionToken = uuidv4()

    // Insert participant
    const { data: participant, error: insertError } = await client
      .from("participants")
      .insert({
        event_id: body.event_id,
        name: body.name.trim(),
        session_token: sessionToken,
        has_submitted: false,
      })
      .select("id, session_token")
      .single()

    if (insertError) {
      console.error("Error inserting participant:", insertError)
      throw new ApiError("Failed to create participant", 500)
    }

    return {
      id: participant.id,
      session_token: participant.session_token,
    }
  },

  // Success status
  successStatus: 201,

  // Custom error messages
  errorMessages: {
    validation: "Invalid participant data",
    notFound: "Event not found",
    serverError: "Failed to create participant",
  },
})
