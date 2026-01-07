"use client"

import { Turnstile as TurnstileWidget } from "@marsidev/react-turnstile"
import { useTranslations } from "next-intl"

interface TurnstileProps {
	onVerify: (token: string) => void
	onError?: () => void
}

export function Turnstile({ onVerify, onError }: TurnstileProps) {
	const t = useTranslations("events")
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

	// If no site key is configured, don't render the CAPTCHA
	if (!siteKey) {
		return null
	}

	return (
		<div className="flex justify-center">
			<TurnstileWidget
				siteKey={siteKey}
				onSuccess={onVerify}
				onError={onError}
				options={{
					theme: "auto",
					size: "normal",
				}}
			/>
		</div>
	)
}
