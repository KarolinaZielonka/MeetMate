import type { AvailabilityStatus, Participant } from "@/types"

export interface ParticipantWithAvailability extends Participant {
  availability: Map<string, AvailabilityStatus>
}

export interface DateAggregation {
  date: string
  available: number
  maybe: number
  unavailable: number
  total: number
  participants: Array<{
    id: string
    name: string
    status: AvailabilityStatus
  }>
}

export type ViewMode = "heatmap" | "individual"
