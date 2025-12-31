import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"
import { supabaseAdmin } from "@/lib/supabase/server"

/**
 * GET /api/events/[shareUrl]
 * Fetch event details by share URL
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

    // Fetch event from database by share_url
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, name, start_date, end_date, share_url, creator_name, is_locked, calculated_date, created_at, password_hash"
      )
      .eq("share_url", shareUrl)
      .single()

    if (error) {
      // Handle "not found" error specifically
      if (error.code === "PGRST116") {
        return NextResponse.json({ data: null, error: "Event not found" }, { status: 404 })
      }

      console.error("Database error fetching event:", error)
      return NextResponse.json({ data: null, error: "Failed to fetch event" }, { status: 500 })
    }

    // Check if event has password protection (don't expose the hash itself)
    const hasPassword = !!data.password_hash

    // Return event data WITHOUT password_hash
    const eventData = {
      id: data.id,
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      share_url: data.share_url,
      creator_name: data.creator_name,
      is_locked: data.is_locked,
      calculated_date: data.calculated_date,
      created_at: data.created_at,
      has_password: hasPassword,
    }

    return NextResponse.json({ data: eventData, error: null }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error in GET /api/events/[shareUrl]:", error)
    return NextResponse.json({ data: null, error: "An unexpected error occurred" }, { status: 500 })
  }
}

/**
 * DELETE /api/events/[shareUrl]
 * Delete event and all associated data (admin only)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ shareUrl: string }> }
) {
  try {
    const { shareUrl } = await params

    if (!shareUrl) {
      return NextResponse.json({ data: null, error: "Share URL is required" }, { status: 400 })
    }

    // Fetch the event to verify it exists and get the ID
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("share_url", shareUrl)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ data: null, error: "Event not found" }, { status: 404 })
    }

    // Note: Session verification removed as getSession only works client-side (localStorage)
    // The share URL acts as the authentication mechanism - only those with the URL can access
    // In a future update, we should add an admin_token field to the events table for proper verification

    // Delete the event (cascade will handle participants and availability)
    // Use supabaseAdmin to bypass RLS for DELETE operations
    const { error: deleteError } = await supabaseAdmin.from("events").delete().eq("id", event.id)

    if (deleteError) {
      console.error("Error deleting event:", deleteError)
      return NextResponse.json(
        { data: null, error: "Failed to delete event. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: { success: true }, error: null })
  } catch (error) {
    console.error("Unexpected error in DELETE /api/events/[shareUrl]:", error)
    return NextResponse.json(
      { data: null, error: "Failed to delete event. Please try again." },
      { status: 500 }
    )
  }
}
