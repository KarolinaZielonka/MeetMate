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

  const monthGroups = useMemo(() => {
    const groups = new Map<string, string[]>()
    for (const date of dates) {
      const d = parseDateAsLocal(date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const existing = groups.get(key) || []
      groups.set(key, [...existing, date])
    }
    return groups
  }, [dates])

  const excludedSet = useMemo(() => new Set(excludedDates), [excludedDates])

  const weekdays = [
    t("mon"),
    t("tue"),
    t("wed"),
    t("thu"),
    t("fri"),
    t("sat"),
    t("sun"),
  ]

  return (
    <div className="space-y-6">
      {Array.from(monthGroups.entries()).map(([monthKey, monthDates]) => {
        const firstDate = parseDateAsLocal(monthDates[0])
        const monthName = firstDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })

        const firstDayOfMonth = new Date(
          firstDate.getFullYear(),
          firstDate.getMonth(),
          1
        )
        let startOffset = firstDayOfMonth.getDay() - 1
        if (startOffset < 0) startOffset = 6

        const calendarDays: (string | null)[] = Array(startOffset).fill(null)
        for (const date of monthDates) {
          calendarDays.push(date)
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
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const d = parseDateAsLocal(date)
                const isExcluded = excludedSet.has(date)
                const dayOfMonth = d.getDate()

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
