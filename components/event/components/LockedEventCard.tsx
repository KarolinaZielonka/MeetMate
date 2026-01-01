"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "./utils";

interface LockedEventCardProps {
	calculatedDate: string;
}

export function LockedEventCard({ calculatedDate }: LockedEventCardProps) {
	const t = useTranslations("optimalDates");

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
