"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { DateScore } from "@/types";
import { format } from "date-fns";
import { Calendar, Lock, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OptimalDatesDisplayProps {
	shareUrl: string;
	isAdmin: boolean;
	isLocked: boolean;
	calculatedDate: string | null;
	onEventLocked?: () => void;
}

export function OptimalDatesDisplay({
	shareUrl,
	isAdmin,
	isLocked,
	calculatedDate,
	onEventLocked,
}: OptimalDatesDisplayProps) {
	const t = useTranslations("optimalDates");
	const [dateScores, setDateScores] = useState<DateScore[]>([]);
	const [loading, setLoading] = useState(true);
	const [locking, setLocking] = useState(false);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [showLockDialog, setShowLockDialog] = useState(false);

	const fetchOptimalDates = async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/events/${shareUrl}/calculate`);
			const data = await response.json();

			if (data.error) {
				toast.error(t("errorCalculate"));
				return;
			}

			setDateScores(data.data || []);
		} catch (error) {
			console.error("Error fetching optimal dates:", error);
			toast.error(t("errorCalculate"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOptimalDates();
	}, [shareUrl]);

	const handleLockEvent = async () => {
		if (!selectedDate) return;

		setLocking(true);
		try {
			const response = await fetch(`/api/events/${shareUrl}/lock`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chosen_date: selectedDate }),
			});

			const data = await response.json();

			if (data.error) {
				toast.error(data.error);
				return;
			}

			toast.success(t("successLock"));
			setShowLockDialog(false);
			onEventLocked?.();
		} catch (error) {
			console.error("Error locking event:", error);
			toast.error(t("errorLock"));
		} finally {
			setLocking(false);
		}
	};

	const formatDate = (dateString: string, short = false) => {
		try {
			// Use shorter format for mobile
			if (short) {
				return format(new Date(dateString), "EEE, MMM d, yyyy");
			}
			return format(new Date(dateString), "EEEE, MMMM d, yyyy");
		} catch {
			return dateString;
		}
	};

	// If event is locked, show locked message
	if (isLocked && calculatedDate) {
		return (
			<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
						<Lock className="h-5 w-5" />
						{t("title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<p className="text-sm text-green-600 dark:text-green-500">
							{t("lockedMessage", { date: formatDate(calculatedDate) })}
						</p>
						<div className="flex items-center gap-2 rounded-lg bg-white p-4 dark:bg-gray-900">
							<Calendar className="h-5 w-5 text-green-600" />
							<span className="font-semibold text-lg">
								{formatDate(calculatedDate)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card className="shadow-lg border-none slide-up">
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="flex-1">
							<CardTitle className="text-2xl flex items-center gap-2">
								<div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
									<Calendar className="w-5 h-5 text-white" />
								</div>
								{t("title")}
							</CardTitle>
							<p className="text-sm text-muted-foreground mt-2">{t("description")}</p>
						</div>
						{isAdmin && (
							<Button
								variant="outline"
								size="sm"
								onClick={fetchOptimalDates}
								disabled={loading}
								className="w-full sm:w-auto"
							>
								<RefreshCw
									className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
								/>
								<span className="hidden sm:inline">
									{loading ? t("recalculatingButton") : t("recalculateButton")}
								</span>
								<span className="sm:hidden">
									{loading ? t("recalculatingButton") : t("recalculateButton")}
								</span>
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="space-y-3">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-24 w-full" />
							))}
						</div>
					) : dateScores.length === 0 ? (
						<div className="rounded-lg border border-dashed p-8 text-center">
							<Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
							<p className="mt-4 text-sm text-muted-foreground">{t("noData")}</p>
							<p className="mt-2 text-xs text-muted-foreground">
								{t("minParticipants")}
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{dateScores.slice(0, 5).map((dateScore, index) => {
								const percentage = Math.round(dateScore.score * 100);
								return (
									<div
										key={dateScore.date}
										className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-accent"
									>
										<div className="space-y-3">
											{/* Date and Badge */}
											<div className="flex items-center gap-2 flex-wrap">
												<Badge variant={index === 0 ? "default" : "secondary"}>
													#{index + 1}
												</Badge>
												<span className="font-semibold text-sm sm:text-base break-words">
													<span className="hidden sm:inline">
														{formatDate(dateScore.date)}
													</span>
													<span className="sm:hidden">
														{formatDate(dateScore.date, true)}
													</span>
												</span>
											</div>

											{/* Score and Progress */}
											<div className="space-y-1">
												<div className="flex items-center justify-between text-sm">
													<span className="text-muted-foreground">
														{t("score", { percentage })}
													</span>
													<span className="text-xs text-muted-foreground">
														{t("outOf", { total: dateScore.totalParticipants })}
													</span>
												</div>
												<Progress value={percentage} className="h-2" />
												<p className="text-xs text-muted-foreground break-words">
													{t("breakdown", {
														available: dateScore.availableCount,
														maybe: dateScore.maybeCount,
														unavailable: dateScore.unavailableCount,
													})}
												</p>
											</div>

											{/* Lock Button */}
											{isAdmin && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setSelectedDate(dateScore.date);
														setShowLockDialog(true);
													}}
													className="w-full sm:w-auto h-10 sm:h-9"
												>
													<Lock className="mr-2 h-4 w-4" />
													{t("lockButton")}
												</Button>
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Lock Confirmation Dialog */}
			<Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("lockConfirm.title")}</DialogTitle>
						<DialogDescription>
							{selectedDate &&
								t("lockConfirm.description", {
									date: formatDate(selectedDate),
								})}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowLockDialog(false)}
							disabled={locking}
						>
							{t("lockConfirm.cancel")}
						</Button>
						<Button onClick={handleLockEvent} disabled={locking}>
							<Lock className="mr-2 h-4 w-4" />
							{locking ? t("lockingButton") : t("lockConfirm.confirm")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
