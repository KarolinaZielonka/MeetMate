import { supabase } from "@/lib/supabase/client"
import { NextResponse } from "next/server"
import type { AvailabilityStatus } from "@/types"

/**
 * GET /api/participants/[participantId]/availability
 * Fetch availability for a specific participant
 *
 * Response: {
 *   data: Record<string, AvailabilityStatus> | null,
 *   error: string | null
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ participantId: string }> }
) {
  try {
    const { participantId } = await params

    if (!participantId) {
      return NextResponse.json({ data: null, error: "participantId is required" }, { status: 400 })
    }

    // Verify participant exists
    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .select("id")
      .eq("id", participantId)
      .single()

    if (participantError || !participant) {
      return NextResponse.json({ data: null, error: "Participant not found" }, { status: 404 })
    }

    // Fetch availability records
    const { data: availabilityRecords, error: availabilityError } = await supabase
      .from("availability")
      .select("date, status")
      .eq("participant_id", participantId)

    if (availabilityError) {
      console.error("Availability fetch error:", availabilityError)
      return NextResponse.json(
        { data: null, error: "Failed to fetch availability" },
        { status: 500 }
      )
    }

    // Convert array to map: { "2024-01-15": "available", ... }
    const availabilityMap: Record<string, AvailabilityStatus> = {}
    for (const record of availabilityRecords || []) {
      availabilityMap[record.date] = record.status as AvailabilityStatus
    }

    return NextResponse.json({
      data: availabilityMap,
      error: null,
    })
  } catch (error) {
    console.error("Availability fetch error:", error)
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}
