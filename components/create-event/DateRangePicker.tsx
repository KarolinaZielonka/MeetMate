"use client"

import { useTranslations } from "next-intl"
import * as React from "react"
import { DatePicker } from "@/components/create-event/DatePicker"
import { Label } from "@/components/ui/label"

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onDateChange: (startDate: string, endDate: string) => void
  disabled?: boolean
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  disabled,
}: DateRangePickerProps) {
  const t = useTranslations("createEvent")

  const handleStartDateChange = (newStartDate: string) => {
    onDateChange(newStartDate, endDate)
  }

  const handleEndDateChange = (newEndDate: string) => {
    onDateChange(startDate, newEndDate)
  }

  const disableBeforeToday = React.useCallback((date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }, [])

  const disableBeforeStartDate = React.useCallback(
    (date: Date) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (date < today) return true

      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        return date < start
      }
      return false
    },
    [startDate]
  )

  const endDateDefaultMonth = React.useMemo(() => {
    if (startDate) {
      return new Date(startDate)
    }
    return undefined
  }, [startDate])

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">
        {t("dateRange.label")} <span className="text-destructive">{t("dateRange.required")}</span>
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t("dateRange.startDate")}</Label>
          <DatePicker
            date={startDate}
            onDateChange={handleStartDateChange}
            placeholder={t("dateRange.startDate")}
            disabled={disabled}
            disabledDates={disableBeforeToday}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t("dateRange.endDate")}</Label>
          <DatePicker
            date={endDate}
            onDateChange={handleEndDateChange}
            placeholder={t("dateRange.endDate")}
            disabled={disabled}
            disabledDates={disableBeforeStartDate}
            defaultMonth={endDateDefaultMonth}
          />
        </div>
      </div>
    </div>
  )
}
