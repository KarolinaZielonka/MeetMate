import type { NextRequest } from "next/server"
import {
  ApiError,
  combineValidations,
  createApiHandler,
  fetchSingleRecord,
  validateDateFormat,
  validateRequired,
} from "@/lib/api"

/**
 * Body type for lock event request
 */
interface LockEventBody {
  chosen_date: string
}

/**
 * Response type for lock event
 */
interface LockEventResponse {
  id: string
  name: string
  is_locked: boolean
  calculated_date: string
  [key: string]: unknown
}

/**
 * POST /api/events/[shareUrl]/lock
 * Lock event with chosen date
 */
export const POST = createApiHandler<LockEventBody, LockEventResponse>({
  // Parse request body
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      chosen_date: body.chosen_date,
    }
  },

  // Validate inputs
  validate: async (body, params) => {
    // Validate required fields
    const requiredValidation = validateRequired(
      { shareUrl: params.shareUrl, chosen_date: body.chosen_date },
      ["shareUrl", "chosen_date"]
    )

    // Validate date format
    const dateValidation = validateDateFormat(body.chosen_date, "chosen_date")

    return combineValidations(requiredValidation, dateValidation)
  },

  // Main handler logic
  handler: async (body, params, client) => {
    // Fetch the event
    const event = await fetchSingleRecord<{ id: string; is_locked: boolean }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id, is_locked"
    )

    // Check if event is already locked
    if (event.is_locked) {
      throw new ApiError("Event is already locked", 400)
    }

    // Lock the event and set the calculated date
    const { data: updatedEvent, error: updateError } = await client
      .from("events")
      .update({
        is_locked: true,
        calculated_date: body.chosen_date,
      })
      .eq("id", event.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error locking event:", updateError)
      throw new ApiError("Failed to lock event. Please try again.", 500)
    }

    return updatedEvent as LockEventResponse
  },

  // Use admin client to bypass RLS for UPDATE operations
  useAdminClient: true,

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    validation: "Invalid request data",
    notFound: "Event not found",
    serverError: "Failed to lock event. Please try again.",
  },
})
