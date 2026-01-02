"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import { useLocale } from "next-intl"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  date: string
  onDateChange: (date: string) => void
  placeholder?: string
  disabled?: boolean
  disabledDates?: (date: Date) => boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled,
  disabledDates,
}: DatePickerProps) {
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => {
    return date ? new Date(date) : undefined
  }, [date])

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const formatted = formatDateForInput(newDate)
      onDateChange(formatted)
      setOpen(false)
    }
  }

  const formatDateForInput = (dateObj: Date): string => {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, "0")
    const day = String(dateObj.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const formatDateForDisplay = React.useCallback(
    (dateStr: string): string => {
      if (!dateStr) return ""
      const dateObj = new Date(dateStr)
      return dateObj.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    },
    [locale]
  )

  const displayText = React.useMemo(() => {
    return date ? formatDateForDisplay(date) : placeholder
  }, [date, placeholder, formatDateForDisplay])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full h-12 justify-start text-left font-normal transition-smooth focus:shadow-md",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  )
}
