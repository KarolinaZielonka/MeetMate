import { format } from "date-fns"

/**
 * Formats a date string for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param short - Use shorter format for mobile (default: false)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, short = false): string {
  try {
    if (short) {
      return format(new Date(dateString), "EEE, MMM d, yyyy")
    }
    return format(new Date(dateString), "EEEE, MMMM d, yyyy")
  } catch {
    return dateString
  }
}
