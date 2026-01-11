"use client"

import { CalendarOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Label } from "@/components/ui/label"
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <CalendarOff className="w-4 h-4" />
          {t("label")}
          <span className="text-muted-foreground font-normal text-sm">
            {t("optional")}
          </span>
        </Label>
        {excludedCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {t("excludedCount", { count: excludedCount })}
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{t("description")}</p>

      <ExcludedDatesCalendar
        dates={datesInRange}
        excludedDates={excludedDates}
        onToggleDate={onToggleDate}
        disabled={disabled}
      />
    </div>
  )
}
