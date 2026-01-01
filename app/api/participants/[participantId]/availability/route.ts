import {
  combineValidations,
  createApiHandler,
  fetchSingleRecord,
  validateRequired,
  validateUUID,
} from "@/lib/api"
import type { AvailabilityStatus } from "@/types"

/**
 * Availability map response type
 */
type AvailabilityMapResponse = Record<string, AvailabilityStatus>

/**
 * GET /api/participants/[participantId]/availability
 * Fetch availability for a specific participant
 */
export const GET = createApiHandler<never, AvailabilityMapResponse>({
  // Validate params
  validate: async (_body, params) => {
    return combineValidations(
      validateRequired({ participantId: params.participantId }, ["participantId"]),
      validateUUID(params.participantId, "participantId")
    )
  },

  // Main handler logic
  handler: async (_body, params, client) => {
    // Verify participant exists
    await fetchSingleRecord<{ id: string }>(
      client,
      "participants",
      "id",
      params.participantId,
      "id"
    )

    // Fetch availability records
    const { data: availabilityRecords, error: availabilityError } = await client
      .from("availability")
      .select("date, status")
      .eq("participant_id", params.participantId)

    if (availabilityError) {
      console.error("Availability fetch error:", availabilityError)
      throw new Error("Failed to fetch availability")
    }

    // Convert array to map: { "2024-01-15": "available", ... }
    const availabilityMap: Record<string, AvailabilityStatus> = {}
    for (const record of availabilityRecords || []) {
      availabilityMap[record.date] = record.status as AvailabilityStatus
    }

    return availabilityMap
  },

  // Success status
  successStatus: 200,

  // Custom error messages
  errorMessages: {
    validation: "Invalid participant ID",
    notFound: "Participant not found",
    serverError: "Failed to fetch availability",
  },
})
