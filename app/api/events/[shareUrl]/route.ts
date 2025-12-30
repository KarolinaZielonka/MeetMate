import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

/**
 * GET /api/events/[shareUrl]
 * Fetch event details by share URL
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ shareUrl: string }> }) {
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
