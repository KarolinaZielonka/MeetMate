import { ApiError, createApiHandler, fetchSingleRecord, validateRequired } from "@/lib/api"

/**
 * Response type for reopen event
 */
interface ReopenEventResponse {
  id: string
  is_locked: boolean
  calculated_date: string | null
  [key: string]: unknown
}

/**
 * POST /api/events/[shareUrl]/reopen
 * Reopen a locked event (admin only)
 */
export const POST = createApiHandler<never, ReopenEventResponse>({
  // Validate params
  validate: async (_body, params) => {
    return validateRequired({ shareUrl: params.shareUrl }, ["shareUrl"])
  },

  // Main handler logic
  handler: async (_body, params, client) => {
    // Fetch the event
    const event = await fetchSingleRecord<{ id: string; is_locked: boolean }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id, is_locked"
    )

    // Check if event is not locked
    if (!event.is_locked) {
      throw new ApiError("Event is not locked", 400)
    }

    // Note: Session verification removed as getSession only works client-side (localStorage)
    // The share URL acts as the authentication mechanism - only those with the URL can access
    // In a future update, we should add an admin_token field to the events table for proper verification

    // Reopen the event (unlock and clear calculated date)
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

  // Use admin client to bypass RLS for UPDATE operations
  useAdminClient: true,

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to reopen event. Please try again.",
  },
})
