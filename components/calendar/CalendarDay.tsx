"use client"

import type { AvailabilityStatus } from "@/types"
import { cn } from "@/lib/utils"
import type { CalendarDay as CalendarDayType } from "./types"
import { getDateStyles } from "./utils/calendarUtils"

interface CalendarDayProps {
  day: CalendarDayType
  status: AvailabilityStatus | undefined
  monthName: string
  readonly: boolean
  onClick: (date: string) => void
}

/**
 * Individual calendar day cell component
 * Handles interaction, styling, and accessibility for a single date
 */
export function CalendarDay({
  day,
  status,
  monthName,
  readonly,
  onClick,
}: CalendarDayProps) {
  const styles = getDateStyles(status, day.isInRange, day.isToday)
  const isDisabled = !day.isInRange || readonly

  const handleClick = () => {
    if (!isDisabled) {
      onClick(day.date)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
      e.preventDefault()
      onClick(day.date)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      className={cn(
        "aspect-square flex items-center justify-center rounded-md text-sm font-medium",
        "min-h-11 min-w-11", // 44px minimum touch target
        styles
      )}
      aria-label={`${day.dayOfMonth} ${monthName} - ${status || "unselected"}`}
      aria-pressed={status ? "true" : "false"}
    >
      {day.dayOfMonth}
    </button>
  )
}
