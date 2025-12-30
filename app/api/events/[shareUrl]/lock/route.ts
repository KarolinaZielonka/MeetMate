import { supabase } from "@/lib/supabase/client";
import { getSession } from "@/lib/utils/session";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ shareUrl: string }> },
) {
	try {
		const { shareUrl } = await params;
		const body = await request.json();
		const { chosen_date } = body;

		if (!shareUrl) {
			return NextResponse.json(
				{ data: null, error: "Share URL is required" },
				{ status: 400 },
			);
		}

		if (!chosen_date) {
			return NextResponse.json(
				{ data: null, error: "Chosen date is required" },
				{ status: 400 },
			);
		}

		// Validate date format (YYYY-MM-DD)
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(chosen_date)) {
			return NextResponse.json(
				{ data: null, error: "Invalid date format. Expected YYYY-MM-DD" },
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

		// Check if event is already locked
		if (event.is_locked) {
			return NextResponse.json(
				{ data: null, error: "Event is already locked" },
				{ status: 400 },
			);
		}

		// Verify admin session
		const session = getSession(event.id);
		if (!session || session.role !== "admin") {
			return NextResponse.json(
				{ data: null, error: "Only the event creator can lock the event" },
				{ status: 403 },
			);
		}

		// Lock the event and set the calculated date
		const { data: updatedEvent, error: updateError } = await supabase
			.from("events")
			.update({
				is_locked: true,
				calculated_date: chosen_date,
			})
			.eq("id", event.id)
			.select()
			.single();

		if (updateError) {
			console.error("Error locking event:", updateError);
			return NextResponse.json(
				{ data: null, error: "Failed to lock event. Please try again." },
				{ status: 500 },
			);
		}

		return NextResponse.json({ data: updatedEvent, error: null });
	} catch (error) {
		console.error("Error locking event:", error);
		return NextResponse.json(
			{ data: null, error: "Failed to lock event. Please try again." },
			{ status: 500 },
		);
	}
}
