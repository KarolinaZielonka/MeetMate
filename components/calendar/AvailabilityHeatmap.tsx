"use client"

import { HeartHandshake } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateForAPI, getDatesInRange, parseDate } from "@/lib/utils/dates"
import type { Event, Participant } from "@/types"
import { HeatmapView } from "./heatmap/HeatmapView"
import { IndividualView } from "./heatmap/IndividualView"
import type { ViewMode } from "./heatmap/types"
import { useHeatmapData } from "./heatmap/useHeatmapData"

interface AvailabilityHeatmapProps {
  event: Event
  participants: Participant[]
}

export function AvailabilityHeatmap({ event, participants }: AvailabilityHeatmapProps) {
  const t = useTranslations("eventPage.heatmap")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap")

  const { isLoading, aggregatedData } = useHeatmapData(event, participants)

  // Convert date strings to Date objects, get range, then convert back to strings
  const allDates = useMemo(() => {
    const startDate = parseDate(event.start_date)
    const endDate = parseDate(event.end_date)
    const dateObjects = getDatesInRange(startDate, endDate)
    return dateObjects.map((date) => formatDateForAPI(date))
  }, [event.start_date, event.end_date])

  const handleDateSelect = (date: string) => {
    setSelectedDate(selectedDate === date ? null : date)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "heatmap" ? "individual" : "heatmap")
  }

  // Don't show heatmap if less than 2 participants have submitted
  const submittedCount = participants.filter((p) => p.has_submitted).length
  if (submittedCount < 2) {
    return null
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg border-none slide-up">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-none slide-up">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md hover-scale-icon flex-shrink-0">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <span className="truncate">{t("title")}</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2 line-clamp-2">
              {t("description")}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className="self-start sm:self-center flex-shrink-0 whitespace-nowrap"
          >
            {viewMode === "heatmap" ? t("viewIndividual") : t("viewHeatmap")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "heatmap" ? (
          <HeatmapView
            dates={allDates}
            aggregatedData={aggregatedData}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            participants={participants.length}
          />
        ) : (
          <IndividualView
            dates={allDates}
            participants={participants}
            aggregatedData={aggregatedData}
          />
        )}
      </CardContent>
    </Card>
  )
}
