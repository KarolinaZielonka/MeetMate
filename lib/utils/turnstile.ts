/**
 * Verify Cloudflare Turnstile token
 * @param token - The token from the client-side Turnstile widget
 * @returns Promise<boolean> - True if verification succeeds
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
	const secretKey = process.env.TURNSTILE_SECRET_KEY

	// If no secret key is configured, skip verification (development mode)
	if (!secretKey) {
		console.warn("Turnstile secret key not configured, skipping verification")
		return true
	}

	try {
		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				secret: secretKey,
				response: token,
			}),
		})

		const data = await response.json()
		return data.success === true
	} catch (error) {
		console.error("Turnstile verification error:", error)
		return false
	}
}
