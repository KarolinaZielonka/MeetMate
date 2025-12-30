"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay } from "date-fns"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { AvailabilityStatus } from "@/types"

interface DateRangePickerProps {
  startDate: Date
  endDate: Date
  onSelectionChange?: (selections: Map<string, AvailabilityStatus>) => void
  initialSelections?: Map<string, AvailabilityStatus>
  disabled?: boolean
}

const statusColors: Record<AvailabilityStatus, string> = {
  available: "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600",
  maybe: "bg-orange-100 border-orange-500 dark:bg-orange-900/30 dark:border-orange-600",
  unavailable: "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-600",
}

const unselectedColor = "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"

// Cycle order: null → available → maybe → unavailable → null
const cycleStatus = (current: AvailabilityStatus | null): AvailabilityStatus | null => {
  if (current === null) return "available"
  if (current === "available") return "maybe"
  if (current === "maybe") return "unavailable"
  return null // unavailable → null
}

const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

export function DateRangePicker({
  startDate,
  endDate,
  onSelectionChange,
  initialSelections,
  disabled = false,
}: DateRangePickerProps) {
  const [selections, setSelections] = useState<Map<string, AvailabilityStatus>>(
    initialSelections || new Map()
  )

  // Update selections when initialSelections changes
  useEffect(() => {
    if (initialSelections) {
      setSelections(initialSelections)
    }
  }, [initialSelections])

  // Generate all dates in range
  const allDates = eachDayOfInterval({ start: startDate, end: endDate })

  // Group dates by month
  const monthGroups = allDates.reduce(
    (groups, date) => {
      const monthKey = format(date, "yyyy-MM")
      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(date)
      return groups
    },
    {} as Record<string, Date[]>
  )

  const handleDateClick = (date: Date) => {
    if (disabled) return

    const dateKey = format(date, "yyyy-MM-dd")
    const currentStatus = selections.get(dateKey) || null
    const newStatus = cycleStatus(currentStatus)

    const newSelections = new Map(selections)
    if (newStatus === null) {
      newSelections.delete(dateKey)
    } else {
      newSelections.set(dateKey, newStatus)
    }

    setSelections(newSelections)
    onSelectionChange?.(newSelections)
  }

  const renderMonth = (monthKey: string, dates: Date[]) => {
    const firstDate = dates[0]
    const monthStart = startOfMonth(firstDate)
    const monthEnd = endOfMonth(firstDate)

    // Get the day of week for the first day of the month (0 = Sunday)
    const startDay = getDay(monthStart)

    // Create empty cells for days before the month starts
    const leadingEmptyCells = Array(startDay).fill(null)

    return (
      <div key={monthKey} className="mb-8">
        {/* Month header */}
        <h3 className="text-lg font-semibold mb-4">{format(firstDate, "MMMM yyyy")}</h3>

        {/* Calendar grid */}
        <div className="inline-block">
          {/* Week day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, index) => (
              <div
                key={`${monthKey}-weekday-${index}`}
                className="w-11 h-11 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for alignment */}
            {leadingEmptyCells.map((_, index) => (
              <div key={`empty-${monthKey}-${index}`} className="w-11 h-11" />
            ))}

            {/* Date cells */}
            {eachDayOfInterval({ start: monthStart, end: monthEnd }).map((date) => {
              const dateKey = format(date, "yyyy-MM-dd")
              const isInRange = date >= startDate && date <= endDate
              const status = selections.get(dateKey)

              if (!isInRange) {
                // Out of range - show but disabled
                return (
                  <div
                    key={dateKey}
                    className="w-11 h-11 flex items-center justify-center text-sm text-gray-300 dark:text-gray-600"
                  >
                    {format(date, "d")}
                  </div>
                )
              }

              return (
                <motion.button
                  key={dateKey}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  whileTap={{ scale: disabled ? 1 : 0.9 }}
                  className={cn(
                    "w-11 h-11 rounded-md border-2 text-sm font-medium transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    status ? statusColors[status] : unselectedColor,
                    !disabled && "cursor-pointer hover:opacity-80"
                  )}
                >
                  {format(date, "d")}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded border-2", statusColors.available)} />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded border-2", statusColors.maybe)} />
          <span>Maybe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded border-2", statusColors.unavailable)} />
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded border-2", unselectedColor)} />
          <span>Not selected</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Tap dates to cycle through: Not selected → Available → Maybe → Unavailable → Not selected
      </p>

      {/* Calendar months */}
      <div>
        {Object.entries(monthGroups).map(([monthKey, dates]) => renderMonth(monthKey, dates))}
      </div>
    </div>
  )
}
