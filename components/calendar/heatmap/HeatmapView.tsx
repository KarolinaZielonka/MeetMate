"use client"

import { Legend } from "./Legend"
import { SelectedDateDetails } from "./SelectedDateDetails"
import type { DateAggregation } from "./types"

interface HeatmapViewProps {
  dates: string[]
  aggregatedData: Map<string, DateAggregation>
  selectedDate: string | null
  onDateSelect: (date: string) => void
}

export function HeatmapView({
  dates,
  aggregatedData,
  selectedDate,
  onDateSelect,
}: HeatmapViewProps) {
  const getHeatmapColor = (dateData: DateAggregation): string => {
    if (dateData.total === 0) {
      return "bg-muted border border-border"
    }

    const availablePercentage = (dateData.available / dateData.total) * 100

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {dates.map((date) => {
          const dateData = aggregatedData.get(date)
          if (!dateData) return null

          const dateObj = new Date(date)
          const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "short" })
          const dayOfMonth = dateObj.getDate()

          return (
            <button
              type="button"
              key={date}
              onClick={() => onDateSelect(date)}
              className={`
                ${getHeatmapColor(dateData)}
                rounded-lg p-3 transition-smooth hover-lift
                min-h-[44px] cursor-pointer
                ${selectedDate === date ? "ring-2 ring-primary" : ""}
              `}
            >
              <div className="text-xs text-muted-foreground font-medium">{dayOfWeek}</div>
              <div className="text-lg font-bold text-foreground">{dayOfMonth}</div>
              <div className="text-xs text-foreground font-medium mt-1">
                {dateData.available}/{dateData.total}
              </div>
            </button>
          )
        })}
      </div>

      <Legend />

      {selectedDate && aggregatedData.get(selectedDate) && (
        <SelectedDateDetails
          selectedDate={selectedDate}
          dateData={aggregatedData.get(selectedDate)!}
        />
      )}
    </div>
  )
}
