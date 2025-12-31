import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { calculateOptimalDates } from "@/lib/utils/dateCalculation";

export async function GET(
	request: Request,
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

		// Calculate optimal dates
		const dateScores = await calculateOptimalDates(event.id);

		return NextResponse.json({ data: dateScores, error: null });
	} catch (error) {
		console.error("Error calculating optimal dates:", error);
		return NextResponse.json(
			{
				data: null,
				error: "Failed to calculate optimal dates. Please try again.",
			},
			{ status: 500 },
		);
	}
}
