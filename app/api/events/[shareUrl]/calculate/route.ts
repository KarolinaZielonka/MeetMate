import { createApiHandler, fetchSingleRecord, validateRequired } from "@/lib/api"
import { calculateOptimalDates } from "@/lib/utils/dateCalculation"
import type { DateScore } from "@/types"

/**
 * GET /api/events/[shareUrl]/calculate
 * Calculate optimal dates for an event based on participant availability
 */
export const GET = createApiHandler<never, DateScore[]>({
  // Validate params
  validate: async (_body, params) => {
    return validateRequired({ shareUrl: params.shareUrl }, ["shareUrl"])
  },

  // Main handler logic
  handler: async (_body, params, client) => {
    // Fetch the event to verify it exists
    const event = await fetchSingleRecord<{ id: string; is_locked: boolean }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id, is_locked"
    )

    // Calculate optimal dates
    const dateScores = await calculateOptimalDates(event.id)

    return dateScores
  },

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to calculate optimal dates. Please try again.",
  },
})
