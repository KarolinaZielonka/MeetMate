import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

/**
 * GET /api/events/[shareUrl]/participants
 * Fetch all participants for an event
 *
 * Returns: { data: Participant[], error: null } | { data: null, error: string }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shareUrl: string }> }
) {
  try {
    const { shareUrl } = await params

    if (!shareUrl) {
      return NextResponse.json({ data: null, error: "Share URL is required" }, { status: 400 })
    }

    // First, get the event ID from share URL
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("share_url", shareUrl)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ data: null, error: "Event not found" }, { status: 404 })
    }

    // Fetch all participants for this event
    const { data: participants, error: participantsError } = await supabase
      .from("participants")
      .select("id, name, has_submitted, created_at")
      .eq("event_id", event.id)
      .order("created_at", { ascending: true })

    if (participantsError) {
      console.error("Error fetching participants:", participantsError)
      return NextResponse.json(
        { data: null, error: "Failed to fetch participants" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data: participants || [],
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error in GET /api/events/[shareUrl]/participants:", error)
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}
