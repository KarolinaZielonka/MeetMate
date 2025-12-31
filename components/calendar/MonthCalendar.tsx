"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import type { AvailabilityStatus } from "@/types"
import { cn } from "@/lib/utils"
import type { CalendarDay, MonthCalendarProps } from "./types"
import { getWeekdayKeys } from "./utils/calendarUtils"

export function MonthCalendar({
  year,
  month,
  startDate,
  endDate,
  availability,
  onDateSelect,
  readonly = false,
}: MonthCalendarProps) {
  const t = useTranslations("calendar.weekdays")

  const calendarDays = useMemo(() => {
    const days: (CalendarDay | null)[] = []
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0
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

      days.push({
        date: dateStr,
        dayOfMonth: day,
        isInRange,
        isToday,
      })
    }

    return days
  }, [year, month, startDate, endDate])

  const monthName = useMemo(() => {
    const date = new Date(year, month, 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }, [year, month])

  const getDateStyles = (
    status: AvailabilityStatus | undefined,
    isInRange: boolean,
    isToday: boolean
  ) => {
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

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isInRange || readonly) return
    onDateSelect(day.date)
  }

  return (
    <div className="w-full">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {getWeekdayKeys().map((weekdayKey) => (
          <div key={weekdayKey} className="text-center text-xs font-medium text-muted-foreground py-1">
            {t(weekdayKey)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          if (!day) {
            return <div key={`empty-${day}`} className="aspect-square" />
          }

          const status = availability.get(day.date)
          const styles = getDateStyles(status, day.isInRange, day.isToday)

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={!day.isInRange || readonly}
              className={cn(
                "aspect-square flex items-center justify-center rounded-md text-sm font-medium",
                "min-h-[44px] min-w-[44px]", // Minimum touch target
                styles
              )}
              aria-label={`${day.dayOfMonth} ${monthName} - ${status || "unselected"}`}
            >
              {day.dayOfMonth}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
