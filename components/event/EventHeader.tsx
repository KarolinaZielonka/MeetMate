"use client"

import { Calendar } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDateRange, parseDate } from "@/lib/utils/dates"
import { LockedEventStatus } from "./LockedEventStatus"
import { RoleBadge } from "./RoleBadge"
import { ShareSection } from "./ShareSection"

interface EventHeaderProps {
  event: {
    name: string
    start_date: string
    end_date: string
    creator_name: string | null
    is_locked: boolean
    calculated_date: string | null
  }
  userRole: "admin" | "participant" | "visitor"
  shareUrl: string
}

export function EventHeader({ event, userRole, shareUrl }: EventHeaderProps) {
  const t = useTranslations("eventPage")
  const startDate = parseDate(event.start_date)
  const endDate = parseDate(event.end_date)
  const dateRangeText = formatDateRange(startDate, endDate)

  return (
    <Card className="shadow-xl border-none fade-in">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{event.name}</h1>
              <RoleBadge role={userRole} />
            </div>

            <div className="flex items-center gap-2 text-lg text-muted-foreground mb-2">
              <Calendar className="w-5 h-5 text-primary transition-smooth hover:scale-110" />
              {dateRangeText}
            </div>

            {event.creator_name && (
              <p className="text-sm text-muted-foreground">
                {t("createdBy")} <span className="font-semibold">{event.creator_name}</span>
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {event.is_locked && event.calculated_date && (
          <LockedEventStatus calculatedDate={event.calculated_date} />
        )}

        <ShareSection shareUrl={shareUrl} />
      </CardContent>
    </Card>
  )
}
