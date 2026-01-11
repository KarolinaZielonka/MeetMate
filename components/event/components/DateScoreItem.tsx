"use client"

import { Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { DateScore } from "@/types"
import { formatDate } from "./utils"

interface DateScoreItemProps {
  dateScore: DateScore
  index: number
  isAdmin: boolean
  onLockClick: (date: string) => void
}

export const DateScoreItem = memo(function DateScoreItem({
  dateScore,
  index,
  isAdmin,
  onLockClick,
}: DateScoreItemProps) {
  const t = useTranslations("optimalDates")
  const percentage = Math.round(dateScore.score * 100)

  return (
    <div className="rounded-lg border p-3 sm:p-4 transition-smooth hover:bg-muted/50">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
          <span className="font-semibold text-sm sm:text-base break-words">
            <span className="hidden sm:inline">{formatDate(dateScore.date)}</span>
            <span className="sm:hidden">{formatDate(dateScore.date, true)}</span>
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-spaced">{t("score", { percentage })}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground break-words">
            {t("breakdown", {
              available: dateScore.availableCount,
              maybe: dateScore.maybeCount,
              unavailable: dateScore.unavailableCount,
            })}
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLockClick(dateScore.date)}
            className="w-full sm:w-auto min-h-11"
          >
            <Lock className="mr-2 h-4 w-4" />
            {t("lockButton")}
          </Button>
        )}
      </div>
    </div>
  )
})
