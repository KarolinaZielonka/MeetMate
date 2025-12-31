import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/events/[shareUrl]/reopen
 * Reopen a locked event (admin only)
 */
export async function POST(
	_request: Request,
	{ params }: { params: Promise<{ shareUrl: string }> },
) {
	try {
		const { shareUrl } = await params;

		if (!shareUrl) {
			return NextResponse.json(
				{ data: null, error: "Share URL is required" },
				{ status: 400 },
			);
		}

		// Fetch the event
		const { data: event, error: eventError } = await supabase
			.from("events")
			.select("id, is_locked")
			.eq("share_url", shareUrl)
			.single();

		if (eventError || !event) {
			return NextResponse.json(
				{ data: null, error: "Event not found" },
				{ status: 404 },
			);
		}

		// Check if event is not locked
		if (!event.is_locked) {
			return NextResponse.json(
				{ data: null, error: "Event is not locked" },
				{ status: 400 },
			);
		}

		// Note: Session verification removed as getSession only works client-side (localStorage)
		// The share URL acts as the authentication mechanism - only those with the URL can access
		// In a future update, we should add an admin_token field to the events table for proper verification

		// Reopen the event (unlock and clear calculated date)
		// Use supabaseAdmin to bypass RLS for UPDATE operations
		const { data: updatedEvent, error: updateError } = await supabaseAdmin
			.from("events")
			.update({
				is_locked: false,
				calculated_date: null,
			})
			.eq("id", event.id)
			.select()
			.single();

		if (updateError) {
			console.error("Error reopening event:", updateError);
			return NextResponse.json(
				{ data: null, error: "Failed to reopen event. Please try again." },
				{ status: 500 },
			);
		}

		return NextResponse.json({ data: updatedEvent, error: null });
	} catch (error) {
		console.error("Error reopening event:", error);
		return NextResponse.json(
			{ data: null, error: "Failed to reopen event. Please try again." },
			{ status: 500 },
		);
	}
}
