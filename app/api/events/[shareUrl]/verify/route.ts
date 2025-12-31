import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { verifyPassword } from "@/lib/utils/auth";
import { randomUUID } from "crypto";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ shareUrl: string }> },
) {
	try {
		const { shareUrl } = await params;
		const body = await request.json();
		const { password } = body;

		if (!password || typeof password !== "string") {
			return NextResponse.json(
				{ data: null, error: "Password is required" },
				{ status: 400 },
			);
		}

		// Fetch event with password hash
		const { data: event, error: eventError } = await supabase
			.from("events")
			.select("id, password_hash")
			.eq("share_url", shareUrl)
			.single();

		if (eventError || !event) {
			return NextResponse.json(
				{ data: null, error: "Event not found" },
				{ status: 404 },
			);
		}

		// Check if event has password protection
		if (!event.password_hash) {
			return NextResponse.json(
				{ data: null, error: "Event is not password protected" },
				{ status: 400 },
			);
		}

		// Verify password
		const isValid = await verifyPassword(password, event.password_hash);

		if (!isValid) {
			return NextResponse.json(
				{ data: null, error: "Incorrect password" },
				{ status: 401 },
			);
		}

		// Generate access token
		const accessToken = randomUUID();

		// Return success with token
		return NextResponse.json({
			data: {
				success: true,
				accessToken,
				eventId: event.id,
			},
			error: null,
		});
	} catch (error) {
		console.error("Password verification error:", error);
		return NextResponse.json(
			{ data: null, error: "Failed to verify password" },
			{ status: 500 },
		);
	}
}
