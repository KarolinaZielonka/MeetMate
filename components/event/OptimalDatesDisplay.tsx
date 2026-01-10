"use client"

import { BadgeCheck, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, useMemo } from "react"
import { SkeletonText } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEventLock } from "@/hooks/useEventLock"
import { useOptimalDates } from "@/hooks/useOptimalDates"
import { useEventStore } from "@/store/eventStore"
import { DateScoreItem } from "./components/DateScoreItem"
import { EmptyState } from "./components/EmptyState"
import { LockConfirmationDialog } from "./components/LockConfirmationDialog"

interface OptimalDatesDisplayProps {
  shareUrl: string
  onEventLocked?: () => void
}

const MAX_DISPLAYED_DATES = 3

export function OptimalDatesDisplay({ shareUrl, onEventLocked }: OptimalDatesDisplayProps) {
  const t = useTranslations("optimalDates")

  const { userRole } = useEventStore()

  const isAdmin = userRole === "admin"

  const { dateScores, loading, fetchOptimalDates } = useOptimalDates(shareUrl, t)
  const {
    locking,
    selectedDate,
    showLockDialog,
    setSelectedDate,
    setShowLockDialog,
    handleLockEvent,
  } = useEventLock(shareUrl, t, onEventLocked)

  const topDates = useMemo(() => dateScores.slice(0, MAX_DISPLAYED_DATES), [dateScores])

  const handleLockClick = useCallback(
    (date: string) => {
      setSelectedDate(date)
      setShowLockDialog(true)
    },
    [setSelectedDate, setShowLockDialog]
  )

  return (
    <>
      <Card className="shadow-lg border-none slide-up">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
                {t("title")}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{t("description")}</p>
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOptimalDates}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">
                  {loading ? t("recalculatingButton") : t("recalculateButton")}
                </span>
                <span className="sm:hidden">
                  {loading ? t("recalculatingButton") : t("recalculateButton")}
                </span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SkeletonText lines={3} height="h-24" widths={["w-full", "w-full", "w-full"]} shimmer />
          ) : dateScores.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {topDates.map((dateScore, index) => (
                <DateScoreItem
                  key={dateScore.date}
                  dateScore={dateScore}
                  index={index}
                  isAdmin={isAdmin}
                  onLockClick={handleLockClick}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <LockConfirmationDialog
        isOpen={showLockDialog}
        selectedDate={selectedDate}
        isLocking={locking}
        onClose={() => setShowLockDialog(false)}
        onConfirm={handleLockEvent}
      />
    </>
  )
}
