import { format } from "date-fns"
import { parseDateAsLocal } from "@/lib/utils/dates"

/**
 * Formats a date string for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param short - Use shorter format for mobile (default: false)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, short = false): string {
  try {
    if (short) {
      return format(parseDateAsLocal(dateString), "EEE, MMM d, yyyy")
    }
    return format(parseDateAsLocal(dateString), "EEEE, MMMM d, yyyy")
  } catch {
    return dateString
  }
}
