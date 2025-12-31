import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"
import type { AvailabilityStatus } from "@/types"

/**
 * POST /api/availability
 * Submit or update participant availability
 *
 * Body: {
 *   participant_id: string (UUID)
 *   dates: Array<{ date: string (YYYY-MM-DD), status: AvailabilityStatus }>
 * }
 *
 * Response: { data: { success: boolean }, error: string | null }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { participant_id, dates } = body

    // Validation
    if (!participant_id || typeof participant_id !== "string") {
      return NextResponse.json({ data: null, error: "participant_id is required" }, { status: 400 })
    }

    if (!Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        { data: null, error: "dates array is required and cannot be empty" },
        { status: 400 }
      )
    }

    // Validate date format and status
    const validStatuses: AvailabilityStatus[] = ["available", "maybe", "unavailable"]
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    for (const dateEntry of dates) {
      if (!dateEntry.date || !dateRegex.test(dateEntry.date)) {
        return NextResponse.json(
          {
            data: null,
            error: `Invalid date format: ${dateEntry.date}. Expected YYYY-MM-DD`,
          },
          { status: 400 }
        )
      }

      if (!validStatuses.includes(dateEntry.status)) {
        return NextResponse.json(
          {
            data: null,
            error: `Invalid status: ${dateEntry.status}. Must be available, maybe, or unavailable`,
          },
          { status: 400 }
        )
      }
    }

    // Verify participant exists
    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .select("id, event_id")
      .eq("id", participant_id)
      .single()

    if (participantError || !participant) {
      return NextResponse.json({ data: null, error: "Participant not found" }, { status: 404 })
    }

    // Upsert availability records (insert or update on conflict)
    const availabilityRecords = dates.map((dateEntry) => ({
      participant_id,
      date: dateEntry.date,
      status: dateEntry.status,
    }))

    const { error: upsertError } = await supabase.from("availability").upsert(availabilityRecords, {
      onConflict: "participant_id,date",
    })

    if (upsertError) {
      console.error("Availability upsert error:", upsertError)
      return NextResponse.json(
        { data: null, error: "Failed to save availability" },
        { status: 500 }
      )
    }

    // Update participant has_submitted status
    const { error: updateError } = await supabase
      .from("participants")
      .update({ has_submitted: true })
      .eq("id", participant_id)

    if (updateError) {
      console.error("Participant update error:", updateError)
      // Non-critical error, availability is already saved
    }

    return NextResponse.json({
      data: { success: true },
      error: null,
    })
  } catch (error) {
    console.error("Availability submission error:", error)
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}
