"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PasswordDialogProps {
	shareUrl: string;
	open: boolean;
	onSuccess: (accessToken: string) => void;
}

export function PasswordDialog({
	shareUrl,
	open,
	onSuccess,
}: PasswordDialogProps) {
	const t = useTranslations("events");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!password.trim()) {
			toast.error(t("passwordRequired"));
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`/api/events/${shareUrl}/verify`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password }),
			});

			const result = await response.json();

			if (result.error) {
				toast.error(result.error);
				setPassword("");
				return;
			}

			// Store access token in localStorage
			localStorage.setItem(
				`password_access_${result.data.eventId}`,
				result.data.accessToken,
			);

			toast.success(t("passwordVerified"));
			onSuccess(result.data.accessToken);
		} catch (error) {
			console.error("Password verification error:", error);
			toast.error(t("passwordVerificationFailed"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={() => {}}>
			<DialogContent
				className="sm:max-w-md w-[calc(100vw-2rem)] max-h-[90vh] p-6"
				onInteractOutside={(e) => e.preventDefault()}
			>
				{/* Lock Icon */}
				<div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
					<svg
						className="w-8 h-8 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
							clipRule="evenodd"
						/>
					</svg>
				</div>

				<DialogHeader className="space-y-3">
					<DialogTitle className="text-2xl text-center">{t("passwordRequired")}</DialogTitle>
					<DialogDescription className="text-base text-center">
						{t("passwordDialogDescription")}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 mt-4">
					<div className="space-y-2">
						<Label htmlFor="password" className="text-base font-semibold">
							{t("password")}
						</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder={t("enterPassword")}
							disabled={isLoading}
							autoFocus
							className="h-12 text-base"
						/>
					</div>
					<Button
						type="submit"
						className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 shadow-md"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="flex items-center gap-2">
								<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								{t("verifying")}
							</span>
						) : (
							t("unlock")
						)}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
