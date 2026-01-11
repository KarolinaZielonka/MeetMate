import { useMemo } from "react"
import type { CalendarDay } from "../types"
import { formatDateToYYYYMMDD } from "../utils/calendarUtils"

interface UseCalendarGridProps {
  year: number
  month: number
  startDate: Date
  endDate: Date
  excludedDates?: string[]
}

/**
 * Generates calendar grid data for a given month
 * Handles empty cells for week alignment and marks dates within range
 */
export function useCalendarGrid({
  year,
  month,
  startDate,
  endDate,
  excludedDates = [],
}: UseCalendarGridProps) {
  const excludedSet = useMemo(() => new Set(excludedDates), [excludedDates])

  const calendarDays = useMemo(() => {
    const days: (CalendarDay | null)[] = []
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0 (ISO week standard)
    let firstDayOfWeek = firstDayOfMonth.getDay() - 1
    if (firstDayOfWeek === -1) firstDayOfWeek = 6

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(year, month, day)
      currentDate.setHours(0, 0, 0, 0)

      const dateStr = formatDateToYYYYMMDD(currentDate)
      const isInRange = currentDate >= startDate && currentDate <= endDate
      const isToday = currentDate.getTime() === today.getTime()
      const isExcluded = excludedSet.has(dateStr)

      days.push({
        date: dateStr,
        dayOfMonth: day,
        isInRange,
        isToday,
        isExcluded,
      })
    }

    return days
  }, [year, month, startDate, endDate, excludedSet])

  const monthName = useMemo(() => {
    const date = new Date(year, month, 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }, [year, month])

  return { calendarDays, monthName }
}
