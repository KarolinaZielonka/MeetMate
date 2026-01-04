"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useDateSelection } from "@/hooks/useDateSelection"
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation"
import { cn } from "@/lib/utils"
import { Instructions } from "./components/Instructions"
import { MonthCalendar } from "./MonthCalendar"
import type { DateRangePickerProps } from "./types"

export function DateRangePicker({
  startDate,
  endDate,
  initialAvailability,
  onAvailabilityChange,
  readonly = false,
  className,
}: DateRangePickerProps) {
  const t = useTranslations("calendar")
  const { availability, selectDate } = useDateSelection(initialAvailability)

  // Current viewing index (0 = first month in range)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Generate list of months in the date range
  const monthsInRange = useMemo(() => {
    const months: Array<{ year: number; month: number }> = []
    const current = new Date(startDate)
    current.setDate(1) // Set to first day of month
    current.setHours(0, 0, 0, 0)

    const end = new Date(endDate)
    end.setDate(1)
    end.setHours(0, 0, 0, 0)

    while (current <= end) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth(),
      })
      current.setMonth(current.getMonth() + 1)
    }

    return months
  }, [startDate, endDate])

  const totalMonths = monthsInRange.length
  const monthsPerView = isMobile ? 1 : 2
  const maxIndex = Math.max(0, totalMonths - monthsPerView)

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Sync availability changes with parent
  useEffect(() => {
    if (onAvailabilityChange) {
      onAvailabilityChange(availability)
    }
  }, [availability, onAvailabilityChange])

  const handlePrevious = useCallback(() => {
    if (currentMonthIndex > 0) {
      setSwipeDirection("right")
      setCurrentMonthIndex((prev) => prev - 1)
    }
  }, [currentMonthIndex])

  const handleNext = useCallback(() => {
    if (currentMonthIndex < maxIndex) {
      setSwipeDirection("left")
      setCurrentMonthIndex((prev) => prev + 1)
    }
  }, [currentMonthIndex, maxIndex])

  // Swipe navigation
  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
  })

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handlePrevious, handleNext])

  // Get currently visible months
  const visibleMonths = useMemo(() => {
    return monthsInRange.slice(currentMonthIndex, currentMonthIndex + monthsPerView)
  }, [monthsInRange, currentMonthIndex, monthsPerView])

  // Get header text
  const headerText = useMemo(() => {
    if (visibleMonths.length === 0) return ""

    const firstMonth = new Date(visibleMonths[0].year, visibleMonths[0].month, 1)

    if (visibleMonths.length === 1 || isMobile) {
      return firstMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    const secondMonth = new Date(visibleMonths[1].year, visibleMonths[1].month, 1)
    const firstMonthName = firstMonth.toLocaleDateString("en-US", { month: "long" })
    const secondMonthName = secondMonth.toLocaleDateString("en-US", { month: "long" })

    // If same year, show: "January - February 2025"
    if (visibleMonths[0].year === visibleMonths[1].year) {
      return `${firstMonthName} - ${secondMonthName} ${visibleMonths[0].year}`
    }

    // Different years: "December 2024 - January 2025"
    return `${firstMonthName} ${visibleMonths[0].year} - ${secondMonthName} ${visibleMonths[1].year}`
  }, [visibleMonths, isMobile])

  const canGoPrevious = currentMonthIndex > 0
  const canGoNext = currentMonthIndex < maxIndex

  return (
    <div className={cn("w-full", className)}>
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={!canGoPrevious || readonly}
          aria-label={t("previousMonth")}
          className="h-11 w-11"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="text-center font-semibold text-lg flex-1 px-4">{headerText}</div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={!canGoNext || readonly}
          aria-label={t("nextMonth")}
          className="h-11 w-11"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="relative overflow-hidden" {...swipeHandlers}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentMonthIndex}
            initial={{
              opacity: 0,
              x: swipeDirection === "left" ? 100 : swipeDirection === "right" ? -100 : 0,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: swipeDirection === "left" ? -100 : swipeDirection === "right" ? 100 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-2")}
          >
            {visibleMonths.map((monthData) => (
              <div key={`${monthData.year}-${monthData.month}`}>
                <MonthCalendar
                  year={monthData.year}
                  month={monthData.month}
                  startDate={startDate}
                  endDate={endDate}
                  availability={availability}
                  onDateSelect={selectDate}
                  readonly={readonly}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators (dots) - only show if more than monthsPerView */}
      {totalMonths > monthsPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(totalMonths / monthsPerView) }).map((_, index) => {
            const monthIndex = index * monthsPerView
            return (
              <button
                key={`month-indicator-${monthIndex}`}
                type="button"
                onClick={() => {
                  if (monthIndex <= maxIndex) {
                    setSwipeDirection(monthIndex > currentMonthIndex ? "left" : "right")
                    setCurrentMonthIndex(monthIndex)
                  }
                }}
                className={cn(
                  "min-h-11 min-w-11 rounded-full transition-all duration-200 flex items-center justify-center",
                  Math.floor(currentMonthIndex / monthsPerView) === index
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to ${isMobile ? "month" : "months"} ${monthIndex + 1}`}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    Math.floor(currentMonthIndex / monthsPerView) === index
                      ? "bg-primary-foreground"
                      : "bg-current"
                  )}
                />
              </button>
            )
          })}
        </div>
      )}
      <Instructions readonly={readonly} />
    </div>
  )
}
