"use client"

import { CalendarOff, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { getDatesInRange, formatDateForAPI, parseDate } from "@/lib/utils/dates"
import { ExcludedDatesCalendar } from "./ExcludedDatesCalendar"

interface ExcludedDatesSectionProps {
  startDate: string
  endDate: string
  excludedDates: string[]
  onToggleDate: (date: string) => void
  disabled?: boolean
}

export function ExcludedDatesSection({
  startDate,
  endDate,
  excludedDates,
  onToggleDate,
  disabled,
}: ExcludedDatesSectionProps) {
  const t = useTranslations("createEvent.excludedDates")
  const [isExpanded, setIsExpanded] = useState(false)

  const datesInRange = useMemo(() => {
    if (!startDate || !endDate) return []
    const start = parseDate(startDate)
    const end = parseDate(endDate)
    return getDatesInRange(start, end).map((d) => formatDateForAPI(d))
  }, [startDate, endDate])

  if (!startDate || !endDate || datesInRange.length === 0) {
    return null
  }

  const excludedCount = excludedDates.length

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left hover:bg-muted/50 rounded-md transition-smooth -mx-2 px-2"
      >
        <div className="flex items-center gap-2">
          <CalendarOff className="w-4 h-4 text-muted-foreground" />
          <span className="text-base font-semibold">{t("label")}</span>
          <span className="text-muted-foreground font-normal text-sm">
            {t("optional")}
          </span>
          {excludedCount > 0 && (
            <span className="text-sm text-muted-foreground ml-1">
              ({t("excludedCount", { count: excludedCount })})
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          <p className="text-sm text-muted-foreground">{t("description")}</p>

          <ExcludedDatesCalendar
            dates={datesInRange}
            excludedDates={excludedDates}
            onToggleDate={onToggleDate}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
