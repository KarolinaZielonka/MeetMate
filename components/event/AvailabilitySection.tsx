"use client"

import { MousePointer } from "lucide-react"
import { useTranslations } from "next-intl"
import { DateRangePicker } from "@/components/calendar/DateRangePicker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { parseDateAsLocal } from "@/lib/utils/dates"
import { getSession } from "@/lib/utils/session"
import { useEventStore } from "@/store/eventStore"

interface AvailabilitySectionProps {
  eventId: string
}

export function AvailabilitySection({ eventId }: AvailabilitySectionProps) {
  const t = useTranslations("eventPage.availability")
  const tCommon = useTranslations("common")

  const {
    event,
    availabilitySelections,
    setAvailabilitySelections,
    hasSubmittedAvailability,
    isEditingAvailability,
    isSubmittingAvailability,
    submitAvailability,
    startEditingAvailability,
    cancelEditingAvailability,
  } = useEventStore()

  const session = getSession(eventId)
  const participantId = session?.participantId

  if (!event || !participantId) {
    return null
  }

  const handleSubmit = async () => {
    await submitAvailability(participantId, t)
  }

  const handleCancel = () => {
    cancelEditingAvailability(eventId, participantId)
  }

  return (
    <Card className="shadow-lg border-none slide-up">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
            <MousePointer className="w-5 h-5 text-white" />
          </div>
          {t("title")}
        </CardTitle>
        <CardDescription className="text-base">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DateRangePicker
          startDate={parseDateAsLocal(event.start_date)}
          endDate={parseDateAsLocal(event.end_date)}
          onAvailabilityChange={setAvailabilitySelections}
          initialAvailability={availabilitySelections}
          readonly={hasSubmittedAvailability && !isEditingAvailability}
        />

        <div className="flex gap-3">
          {!hasSubmittedAvailability || isEditingAvailability ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmittingAvailability || availabilitySelections.size === 0}
              className="flex-1 h-12 text-base"
            >
              {isSubmittingAvailability
                ? hasSubmittedAvailability
                  ? t("updatingButton")
                  : t("submittingButton")
                : hasSubmittedAvailability
                  ? t("updateButton")
                  : t("submitButton")}
            </Button>
          ) : (
            <Button
              onClick={startEditingAvailability}
              variant="outline"
              className="flex-1 h-12 text-base"
            >
              {t("editButton")}
            </Button>
          )}

          {isEditingAvailability && (
            <Button onClick={handleCancel} variant="ghost" className="h-12">
              {tCommon("cancel")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
