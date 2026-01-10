"use client"

import { Calendar, Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { generateGoogleCalendarUrl } from "@/lib/utils/calendar"
import { formatSingleDate, parseDate } from "@/lib/utils/dates"

interface LockedEventStatusProps {
  calculatedDate: string
  eventName: string
  eventUrl: string
}

export function LockedEventStatus({ calculatedDate, eventName, eventUrl }: LockedEventStatusProps) {
  const t = useTranslations("eventPage")

  const googleCalendarUrl = generateGoogleCalendarUrl({
    title: eventName,
    date: calculatedDate,
    description: `Event scheduled via MeetMate\n\nView event: ${eventUrl}`,
  })

  return (
    <>
      <div className="p-5 bg-primary/10 border-2 border-primary/30 rounded-xl fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-md hover-scale-icon">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-primary text-lg mb-1">{t("locked.title")}</p>
            <p className="text-foreground mb-3">
              {t("locked.chosenDate", {
                date: formatSingleDate(parseDate(calculatedDate)),
              })}
            </p>
          </div>
        </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("locked.addToCalendar")} (opens in new tab)`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t("locked.addToCalendar")}
              </a>
            </Button>
      </div>
      <Separator />
    </>
  )
}
