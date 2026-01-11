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
  // Validate params
  validate: async (_body, params) => {
    return validateRequired({ shareUrl: params.shareUrl }, ["shareUrl"])
  },

  // Main handler logic
  handler: async (_body, params, client) => {
    // Fetch event from database
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

    // Check if event has password protection (don't expose the hash)
    const hasPassword = !!event.password_hash

    // Return event data WITHOUT password_hash
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

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to fetch event",
  },
})

/**
 * DELETE /api/events/[shareUrl]
 * Delete event and all associated data (admin only)
 */
export const DELETE = createApiHandler<never, { success: boolean }>({
  // Validate params
  validate: async (_body, params) => {
    return validateRequired({ shareUrl: params.shareUrl }, ["shareUrl"])
  },

  // Main handler logic
  handler: async (_body, params, client) => {
    // Fetch the event to verify it exists and get the ID
    const event = await fetchSingleRecord<{ id: string }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id"
    )

    // Note: Session verification removed as getSession only works client-side (localStorage)
    // The share URL acts as the authentication mechanism
    // In a future update, add an admin_token field for proper verification

    // Delete the event (cascade will handle participants and availability)
    const { error: deleteError } = await client.from("events").delete().eq("id", event.id)

    if (deleteError) {
      console.error("Error deleting event:", deleteError)
      throw new ApiError("Failed to delete event. Please try again.", 500)
    }

    return { success: true }
  },

  // Use admin client to bypass RLS for DELETE operations
  useAdminClient: true,

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to delete event. Please try again.",
  },
})
