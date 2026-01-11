"use client"

import { useTranslations } from "next-intl"
import { CalendarDay } from "./components/CalendarDay"
import { useCalendarGrid } from "./hooks/useCalendarGrid"
import type { MonthCalendarProps } from "./types"
import { getWeekdayKeys } from "./utils/calendarUtils"

/**
 * MonthCalendar - Displays a single month calendar with availability selection
 *
 * Features:
 * - Mobile-first design with 44px minimum touch targets
 * - Three-state availability (available/maybe/unavailable)
 * - Today indicator with ring highlight
 * - Read-only mode support
 * - Accessible with ARIA labels and keyboard navigation
 */
export function MonthCalendar({
  year,
  month,
  startDate,
  endDate,
  availability,
  onDateSelect,
  readonly = false,
  excludedDates = [],
}: MonthCalendarProps) {
  const t = useTranslations("calendar.weekdays")
  const { calendarDays, monthName } = useCalendarGrid({
    year,
    month,
    startDate,
    endDate,
    excludedDates,
  })

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {getWeekdayKeys().map((weekdayKey) => (
          <div
            key={weekdayKey}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {t(weekdayKey)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const status = availability.get(day.date)

          return (
            <CalendarDay
              key={day.date}
              day={day}
              status={status}
              monthName={monthName}
              readonly={readonly}
              onClick={onDateSelect}
            />
          )
        })}
      </div>
    </div>
  )
}
