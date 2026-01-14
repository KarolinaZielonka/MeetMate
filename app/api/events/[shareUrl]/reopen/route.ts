import type { NextRequest } from "next/server"
import { ApiError, createApiHandler, fetchSingleRecord, validateRequired } from "@/lib/api"

interface ReopenEventBody {
  admin_token: string
}

interface ReopenEventResponse {
  id: string
  is_locked: boolean
  calculated_date: string | null
  [key: string]: unknown
}

/**
 * POST /api/events/[shareUrl]/reopen
 * Reopen a locked event (admin only)
 * Requires admin_token for authorization
 */
export const POST = createApiHandler<ReopenEventBody, ReopenEventResponse>({
  parseBody: async (request: NextRequest) => {
    const body = await request.json()
    return {
      admin_token: body.admin_token,
    }
  },

  validate: async (body, params) => {
    const paramsValidation = validateRequired({ shareUrl: params.shareUrl }, ["shareUrl"])
    if (!paramsValidation.valid) {
      return paramsValidation
    }

    if (!body.admin_token || typeof body.admin_token !== "string") {
      return {
        valid: false,
        error: "admin_token is required for this operation",
        status: 401,
      }
    }

    return { valid: true }
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

    if (!event.is_locked) {
      throw new ApiError("Event is not locked", 400)
    }

    const { data: updatedEvent, error: updateError } = await client
      .from("events")
      .update({
        is_locked: false,
        calculated_date: null,
      })
      .eq("id", event.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error reopening event:", updateError)
      throw new ApiError("Failed to reopen event. Please try again.", 500)
    }

    return updatedEvent as ReopenEventResponse
  },

  useAdminClient: true,

  successStatus: 200,

  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to reopen event. Please try again.",
  },
})
