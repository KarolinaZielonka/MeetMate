import { createApiHandler, fetchSingleRecord, validateRequired } from "@/lib/api"

/**
 * Participant response type
 */
interface ParticipantResponse {
  id: string
  name: string
  has_submitted: boolean
  created_at: string
}

/**
 * GET /api/events/[shareUrl]/participants
 * Fetch all participants for an event
 */
export const GET = createApiHandler<never, ParticipantResponse[]>({
  // Validate params
  validate: async (_body, params) => {
    return validateRequired({ shareUrl: params.shareUrl }, ["shareUrl"])
  },

  // Main handler logic
  handler: async (_body, params, client) => {
    // First, get the event ID from share URL
    const event = await fetchSingleRecord<{ id: string }>(
      client,
      "events",
      "share_url",
      params.shareUrl,
      "id"
    )

    // Fetch all participants for this event
    const { data: participants, error: participantsError } = await client
      .from("participants")
      .select("id, name, has_submitted, created_at")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true })

    if (participantsError) {
      console.error("Error fetching participants:", participantsError)
      throw new Error("Failed to fetch participants")
    }

    return participants || []
  },

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    notFound: "Event not found",
    serverError: "Failed to fetch participants",
  },
})
