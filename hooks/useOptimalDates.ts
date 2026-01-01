import type { DateScore } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseOptimalDatesReturn {
	dateScores: DateScore[];
	loading: boolean;
	fetchOptimalDates: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing optimal dates
 * @param shareUrl - Event share URL
 * @param translationKey - Translation function for error messages
 */
export function useOptimalDates(
	shareUrl: string,
	translationKey: (key: string) => string,
): UseOptimalDatesReturn {
	const [dateScores, setDateScores] = useState<DateScore[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchOptimalDates = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/events/${shareUrl}/calculate`);
			const data = await response.json();

			if (data.error) {
				toast.error(translationKey("errorCalculate"));
				return;
			}

			setDateScores(data.data || []);
		} catch (error) {
			console.error("Error fetching optimal dates:", error);
			toast.error(translationKey("errorCalculate"));
		} finally {
			setLoading(false);
		}
	}, [shareUrl, translationKey]);

	useEffect(() => {
		fetchOptimalDates();
	}, [fetchOptimalDates]);

	return {
		dateScores,
		loading,
		fetchOptimalDates,
	};
}
