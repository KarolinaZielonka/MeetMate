import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"
import { hashPassword } from "@/lib/utils/auth"
import { formatDateForAPI, parseDate, validateDateRange } from "@/lib/utils/dates"
import { generateUniqueShareUrl } from "@/lib/utils/urlGenerator"

/**
 * POST /api/events
 * Create a new event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, start_date, end_date, creator_name, password } = body

    // Validate required fields
    if (!name || typeof name !== "string") {
      return NextResponse.json({ data: null, error: "Event name is required" }, { status: 400 })
    }

    if (name.length < 1 || name.length > 255) {
      return NextResponse.json(
        { data: null, error: "Event name must be between 1 and 255 characters" },
        { status: 400 }
      )
    }

    if (!start_date || !end_date) {
      return NextResponse.json(
        { data: null, error: "Start date and end date are required" },
        { status: 400 }
      )
    }

    // Validate creator name if provided
    if (creator_name && (creator_name.length < 1 || creator_name.length > 100)) {
      return NextResponse.json(
        { data: null, error: "Creator name must be between 1 and 100 characters" },
        { status: 400 }
      )
    }

    // Validate date range
    let parsedStartDate: Date
    let parsedEndDate: Date

    try {
      parsedStartDate = parseDate(start_date)
      parsedEndDate = parseDate(end_date)
    } catch (_error) {
      return NextResponse.json(
        { data: null, error: "Invalid date format. Please use ISO date strings (YYYY-MM-DD)" },
        { status: 400 }
      )
    }

    const dateValidation = validateDateRange(parsedStartDate, parsedEndDate)
    if (!dateValidation.valid) {
      return NextResponse.json({ data: null, error: dateValidation.error }, { status: 400 })
    }

    // Generate unique share URL
    const shareUrl = await generateUniqueShareUrl()

    // Hash password if provided
    let passwordHash: string | null = null
    if (password && typeof password === "string" && password.length > 0) {
      try {
        passwordHash = await hashPassword(password)
      } catch (error) {
        console.error("Error hashing password:", error)
        return NextResponse.json(
          { data: null, error: "Failed to process password" },
          { status: 500 }
        )
      }
    }

    // Format dates for database (YYYY-MM-DD)
    const formattedStartDate = formatDateForAPI(parsedStartDate)
    const formattedEndDate = formatDateForAPI(parsedEndDate)

    // Insert event into database
    const { data, error } = await supabase
      .from("events")
      .insert({
        name: name.trim(),
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        share_url: shareUrl,
        password_hash: passwordHash,
        creator_name: creator_name?.trim() || null,
        is_locked: false,
        calculated_date: null,
      })
      .select("id, share_url, name, start_date, end_date, creator_name, is_locked")
      .single()

    if (error) {
      console.error("Database error creating event:", error)
      return NextResponse.json(
        { data: null, error: "Failed to create event. Please try again." },
        { status: 500 }
      )
    }

    // Automatically create a participant record for the creator if they provided a name
    let participantData = null
    if (creator_name && creator_name.trim().length > 0) {
      const sessionToken = crypto.randomUUID()

      const { data: participant, error: participantError } = await supabase
        .from("participants")
        .insert({
          event_id: data.id,
          name: creator_name.trim(),
          session_token: sessionToken,
          has_submitted: false,
        })
        .select("id, session_token")
        .single()

      if (!participantError && participant) {
        participantData = {
          participant_id: participant.id,
          session_token: participant.session_token,
        }
      }
    }

    // Return success response
    return NextResponse.json(
      {
        data: {
          id: data.id,
          share_url: data.share_url,
          name: data.name,
          start_date: data.start_date,
          end_date: data.end_date,
          creator_name: data.creator_name,
          is_locked: data.is_locked,
          participant: participantData,
        },
        error: null,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error in POST /api/events:", error)
    return NextResponse.json({ data: null, error: "An unexpected error occurred" }, { status: 500 })
  }
}
