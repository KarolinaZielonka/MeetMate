import { supabase } from "@/lib/supabase/client"
import type { DateScore } from "@/types"

/**
 * Calculate optimal meeting dates based on participant availability
 *
 * Scoring system:
 * - Available = 1.0
 * - Maybe = 0.5
 * - Unavailable = 0.0
 *
 * @param eventId - The event UUID
 * @returns Array of DateScore objects sorted by score (highest first)
 */
export async function calculateOptimalDates(eventId: string): Promise<DateScore[]> {
  // We need to get participants for this event first
  const { data: participants, error: participantsError } = await supabase
    .from("participants")
    .select("id")
    .eq("event_id", eventId)

  if (participantsError) {
    console.error("Error fetching participants:", participantsError)
    throw new Error("Failed to fetch participants")
  }

  if (!participants || participants.length === 0) {
    return []
  }

  const participantIds = participants.map((p) => p.id)

  // Now fetch availability for all participants
  const { data: availability, error: availError } = await supabase
    .from("availability")
    .select("date, status, participant_id")
    .in("participant_id", participantIds)
    .order("date", { ascending: true })

  if (availError) {
    console.error("Error fetching availability:", availError)
    throw new Error("Failed to fetch availability data")
  }

  if (!availability || availability.length === 0) {
    return []
  }

  // Group availability by date
  const dateMap = new Map<string, { available: number; maybe: number; unavailable: number }>()

  for (const record of availability) {
    const dateKey = record.date
    const current = dateMap.get(dateKey) || {
      available: 0,
      maybe: 0,
      unavailable: 0,
    }

    if (record.status === "available") {
      current.available += 1
    } else if (record.status === "maybe") {
      current.maybe += 1
    } else if (record.status === "unavailable") {
      current.unavailable += 1
    }

    dateMap.set(dateKey, current)
  }

  // Calculate scores for each date
  const totalParticipants = participants.length
  const dateScores: DateScore[] = []

  for (const [date, counts] of dateMap.entries()) {
    // Calculate normalized score
    const score = (counts.available * 1.0 + counts.maybe * 0.5) / totalParticipants

    dateScores.push({
      date,
      score,
      availableCount: counts.available,
      maybeCount: counts.maybe,
      unavailableCount: counts.unavailable,
      totalParticipants,
    })
  }

  // Sort by score (highest first), then by date (earliest first)
  dateScores.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 0.001) {
      // If scores are equal, prefer earlier dates
      return a.date.localeCompare(b.date)
    }
    return b.score - a.score
  })

  return dateScores
}

/**
 * Format a date score for display
 */
export function formatDateScore(dateScore: DateScore): string {
  const percentage = Math.round(dateScore.score * 100)
  return `${percentage}% (${dateScore.availableCount} available, ${dateScore.maybeCount} maybe, ${dateScore.unavailableCount} unavailable)`
}

/**
 * Check if a date has sufficient availability
 * @param dateScore - The date score to check
 * @param threshold - Minimum score threshold (default: 0.5)
 */
export function hasMinimumAvailability(dateScore: DateScore, threshold = 0.5): boolean {
  return dateScore.score >= threshold
}
