import type { AvailabilityStatus } from "@/types"
import { cn } from "@/lib/utils"

/**
 * Formats a Date object to YYYY-MM-DD string
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Returns appropriate Tailwind classes for calendar day based on state
 * Uses semantic color classes from globals.css for theme compatibility
 */
export function getDateStyles(
  status: AvailabilityStatus | undefined,
  isInRange: boolean,
  isToday: boolean
): string {
  // Out of range dates are disabled
  if (!isInRange) {
    return "bg-muted/50 text-muted-foreground cursor-not-allowed border-border"
  }

  const baseStyles = "cursor-pointer transition-smooth hover:scale-105 border-2"
  const todayRing = isToday ? "ring-2 ring-primary ring-offset-1" : ""

  switch (status) {
    case "available":
      return cn(baseStyles, todayRing, "state-available")
    case "maybe":
      return cn(baseStyles, todayRing, "state-maybe")
    case "unavailable":
      return cn(baseStyles, todayRing, "state-unavailable")
    default:
      return cn(
        baseStyles,
        todayRing,
        "bg-card border-border text-card-foreground hover:bg-muted/50"
      )
  }
}

/**
 * Returns array of weekday keys for translation lookup
 * Order: Monday-first (ISO week standard)
 */
export function getWeekdayKeys(): readonly string[] {
  return ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
}
