import type { NextRequest } from "next/server"
import { ApiError, createApiHandler, fetchSingleRecord, validateRequired } from "@/lib/api"

/**
 * Event response type
 */
interface EventResponse {
  id: string
  name: string
  start_date: string
  end_date: string
  share_url: string
  creator_name: string | null
  is_locked: boolean
  calculated_date: string | null
  created_at: string
  has_password: boolean
  excluded_dates: string[]
}

/**
 * GET /api/events/[shareUrl]
 * Fetch event details by share URL
 */
export const GET = createApiHandler<never, EventResponse>({
  validate: async (_body, params) => {
    return validateRequired({ shareUrl: params.shareUrl }, ["shareUrl"])
  },

  handler: async (_body, params, client) => {
    const event = await fetchSingleRecord<{
      id: string
      name: string
      start_date: string
      end_date: string
      share_url: string
      creator_name: string | null
      is_locked: boolean
      calculated_date: string | null
      created_at: string
      password_hash: string | null
      excluded_dates: string[] | null
    }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id, name, start_date, end_date, share_url, creator_name, is_locked, calculated_date, created_at, password_hash, excluded_dates"
    )

    const hasPassword = !!event.password_hash

    return {
      id: event.id,
      name: event.name,
      start_date: event.start_date,
      end_date: event.end_date,
      share_url: event.share_url,
      creator_name: event.creator_name,
      is_locked: event.is_locked,
      calculated_date: event.calculated_date,
      created_at: event.created_at,
      has_password: hasPassword,
      excluded_dates: event.excluded_dates || [],
    }
  },

  successStatus: 200,

  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to fetch event",
  },
})

/**
 * Request body for DELETE event
 */
interface DeleteEventBody {
  admin_token: string
}

/**
 * DELETE /api/events/[shareUrl]
 * Delete event and all associated data (admin only)
 * Requires admin_token for authorization
 */
export const DELETE = createApiHandler<DeleteEventBody, { success: boolean }>({
  // Parse request body
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
    const event = await fetchSingleRecord<{ id: string; admin_token: string }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id, admin_token"
    )

    if (event.admin_token !== body.admin_token) {
      throw new ApiError("Unauthorized: Invalid admin token", 403)
    }

    const { error: deleteError } = await client.from("events").delete().eq("id", event.id)

    if (deleteError) {
      console.error("Error deleting event:", deleteError)
      throw new ApiError("Failed to delete event. Please try again.", 500)
    }

    return { success: true }
  },

  useAdminClient: true,

  successStatus: 200,

  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to delete event. Please try again.",
  },
})
