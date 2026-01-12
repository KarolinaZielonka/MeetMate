"use client"

import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { parseDateAsLocal } from "@/lib/utils/dates"

interface ExcludedDatesCalendarProps {
  dates: string[]
  excludedDates: string[]
  onToggleDate: (date: string) => void
  disabled?: boolean
}

export function ExcludedDatesCalendar({
  dates,
  excludedDates,
  onToggleDate,
  disabled,
}: ExcludedDatesCalendarProps) {
  const t = useTranslations("calendar.weekdays")

  const availableDatesSet = useMemo(() => new Set(dates), [dates])

  const monthGroups = useMemo(() => {
    const groups = new Map<string, { year: number; month: number }>()
    for (const date of dates) {
      const d = parseDateAsLocal(date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!groups.has(key)) {
        groups.set(key, { year: d.getFullYear(), month: d.getMonth() })
      }
    }
    return groups
  }, [dates])

  const excludedSet = useMemo(() => new Set(excludedDates), [excludedDates])

  const weekdays = [
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
    t("sunday"),
  ]

  return (
    <div className="space-y-6">
      {Array.from(monthGroups.entries()).map(([monthKey, { year, month }]) => {
        const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })

        const firstDayOfMonth = new Date(year, month, 1)
        let startOffset = firstDayOfMonth.getDay() - 1
        if (startOffset < 0) startOffset = 6

        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const calendarDays: { date: string; dayOfMonth: number; isAvailable: boolean }[] = []
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          calendarDays.push({
            date: dateStr,
            dayOfMonth: day,
            isAvailable: availableDatesSet.has(dateStr),
          })
        }

        return (
          <div key={monthKey} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {monthName}
            </h4>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-muted-foreground font-medium py-1"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(startOffset)
                .fill(null)
                .map((_, index) => (
                  <div key={`empty-start-${index}`} className="aspect-square" />
                ))}
              {calendarDays.map(({ date, dayOfMonth, isAvailable }) => {
                const isExcluded = excludedSet.has(date)

                if (!isAvailable) {
                  return (
                    <div
                      key={date}
                      className="aspect-square flex items-center justify-center rounded-md text-sm min-h-10 min-w-10 text-muted-foreground/40"
                    >
                      {dayOfMonth}
                    </div>
                  )
                }

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => onToggleDate(date)}
                    disabled={disabled}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-md text-sm font-medium",
                      "min-h-10 min-w-10 border-2 transition-smooth select-bounce",
                      isExcluded
                        ? "bg-muted/70 border-muted-foreground/50 text-muted-foreground line-through"
                        : "bg-card border-border text-card-foreground hover:bg-muted/50",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                    aria-label={`${dayOfMonth} - ${isExcluded ? "excluded" : "included"}`}
                    aria-pressed={isExcluded}
                  >
                    {dayOfMonth}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
