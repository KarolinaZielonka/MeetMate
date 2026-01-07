"use client"

import { Legend } from "./Legend"
import { SelectedDateDetails } from "./SelectedDateDetails"
import type { DateAggregation } from "./types"

interface HeatmapViewProps {
  dates: string[]
  aggregatedData: Map<string, DateAggregation>
  selectedDate: string | null
  onDateSelect: (date: string) => void
  participants: number
}

export function HeatmapView({
  dates,
  aggregatedData,
  selectedDate,
  onDateSelect,
  participants,
}: HeatmapViewProps) {
  const getHeatmapColor = (dateData: DateAggregation): string => {
    if (dateData.total === 0) {
      return "bg-muted border border-border"
    }

    const availablePercentage = (dateData.available / participants) * 100

    if (availablePercentage === 0) {
      return "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
    }
    if (availablePercentage <= 33) {
      return "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900"
    }
    if (availablePercentage <= 66) {
      return "bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-800"
    }
    return "bg-green-300 dark:bg-green-700 border border-green-500 dark:border-green-600"
  }

  const getAvailabilityLabel = (dateData: DateAggregation): string => {
    if (dateData.total === 0) return "No responses yet"
    const availablePercentage = Math.round((dateData.available / participants) * 100)
    return `${availablePercentage}% available, ${dateData.available} out of ${participants} participants`
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const dateData = aggregatedData.get(date)
          if (!dateData) return null

          const dateObj = new Date(date)
          const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" })
          const dayOfMonth = dateObj.getDate()
          const monthName = dateObj.toLocaleDateString("en-US", { month: "long" })
          const isSelected = selectedDate === date

          return (
            <button
              type="button"
              key={date}
              onClick={() => onDateSelect(date)}
              className={`
                ${getHeatmapColor(dateData)}
                rounded-lg p-3 transition-smooth hover-lift
                min-h-[44px] cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
              `}
              aria-label={`${dayOfWeek}, ${monthName} ${dayOfMonth}. ${getAvailabilityLabel(dateData)}${isSelected ? ". Currently selected" : ""}`}
              aria-current={isSelected ? "date" : undefined}
            >
              <div className="text-xs text-muted-foreground font-medium" aria-hidden="true">
                {dayOfWeek.slice(0, 3)}
              </div>
              <div className="text-lg font-bold text-foreground" aria-hidden="true">
                {dayOfMonth}
              </div>
              <div className="text-xs text-foreground font-medium mt-1" aria-hidden="true">
                {dateData.available}/{participants}
              </div>
            </button>
          )
        })}
      </div>

      <Legend />

      {selectedDate && aggregatedData.get(selectedDate) && (
        <section aria-live="polite" aria-atomic="true">
          <SelectedDateDetails
            selectedDate={selectedDate}
            dateData={aggregatedData.get(selectedDate)!}
          />
        </section>
      )}
    </div>
  )
}
