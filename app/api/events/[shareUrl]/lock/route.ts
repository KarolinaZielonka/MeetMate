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
  admin_token: string
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
 * Requires admin_token for authorization
 */
export const POST = createApiHandler<LockEventBody, LockEventResponse>({
  // Parse request body
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      chosen_date: body.chosen_date,
      admin_token: body.admin_token,
    }
  },

  validate: async (body, params) => {
    const requiredValidation = validateRequired(
      { shareUrl: params.shareUrl, chosen_date: body.chosen_date },
      ["shareUrl", "chosen_date"]
    )

    if (!requiredValidation.valid) {
      return requiredValidation
    }

    if (!body.admin_token || typeof body.admin_token !== "string") {
      return {
        valid: false,
        error: "admin_token is required for this operation",
        status: 401,
      }
    }

    const dateValidation = validateDateFormat(body.chosen_date, "chosen_date")

    return combineValidations(requiredValidation, dateValidation)
  },

  handler: async (body, params, client) => {
    const event = await fetchSingleRecord<{ id: string; is_locked: boolean; admin_token: string }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id, is_locked, admin_token"
    )

    if (event.admin_token !== body.admin_token) {
      throw new ApiError("Unauthorized: Invalid admin token", 403)
    }

    if (event.is_locked) {
      throw new ApiError("Event is already locked", 400)
    }

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

  useAdminClient: true,

  successStatus: 200,

  errorMessages: {
    validation: "Invalid request data",
    notFound: "Event not found",
    serverError: "Failed to lock event. Please try again.",
  },
})
