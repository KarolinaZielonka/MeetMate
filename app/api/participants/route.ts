import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase/client"

/**
 * POST /api/participants
 * Create a new participant for an event
 *
 * Body: { event_id: string, name: string }
 * Returns: { data: { id: string, session_token: string }, error: null } | { data: null, error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, name } = body

    // Validation
    if (!event_id || typeof event_id !== "string") {
      return NextResponse.json({ data: null, error: "Event ID is required" }, { status: 400 })
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ data: null, error: "Name is required" }, { status: 400 })
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { data: null, error: "Name must be 100 characters or less" },
        { status: 400 }
      )
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, is_locked")
      .eq("id", event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ data: null, error: "Event not found" }, { status: 404 })
    }

    // Check if event is locked
    if (event.is_locked) {
      return NextResponse.json(
        { data: null, error: "This event is locked and no longer accepting participants" },
        { status: 403 }
      )
    }

    // Generate unique session token (UUID v4)
    const sessionToken = uuidv4()

    // Insert participant
    const { data: participant, error: insertError } = await supabase
      .from("participants")
      .insert({
        event_id,
        name: name.trim(),
        session_token: sessionToken,
        has_submitted: false,
      })
      .select("id, session_token")
      .single()

    if (insertError) {
      console.error("Error inserting participant:", insertError)
      return NextResponse.json(
        { data: null, error: "Failed to create participant" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data: {
          id: participant.id,
          session_token: participant.session_token,
        },
        error: null,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error in POST /api/participants:", error)
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}
