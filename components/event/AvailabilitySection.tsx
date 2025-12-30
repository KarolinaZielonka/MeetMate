"use client"

import { useTranslations } from "next-intl"
import { DateRangePicker } from "@/components/calendar/DateRangePicker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AvailabilityStatus } from "@/types"

interface AvailabilitySectionProps {
  startDate: Date
  endDate: Date
  availabilitySelections: Map<string, AvailabilityStatus>
  onSelectionChange: (selections: Map<string, AvailabilityStatus>) => void
  hasSubmitted: boolean
  isEditingAvailability: boolean
  isSubmittingAvailability: boolean
  onSubmit: () => void
  onEdit: () => void
  onCancel: () => void
}

export function AvailabilitySection({
  startDate,
  endDate,
  availabilitySelections,
  onSelectionChange,
  hasSubmitted,
  isEditingAvailability,
  isSubmittingAvailability,
  onSubmit,
  onEdit,
  onCancel,
}: AvailabilitySectionProps) {
  const t = useTranslations("eventPage.availability")
  const tCommon = useTranslations("common")
  return (
    <Card className="shadow-lg border-none slide-up">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md hover-scale-icon">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {t("title")}
        </CardTitle>
        <CardDescription className="text-base">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onSelectionChange={onSelectionChange}
          initialSelections={availabilitySelections}
          disabled={hasSubmitted && !isEditingAvailability}
        />

        <div className="flex gap-3">
          {!hasSubmitted || isEditingAvailability ? (
            <Button
              onClick={onSubmit}
              disabled={isSubmittingAvailability || availabilitySelections.size === 0}
              className="flex-1 h-12 text-base"
            >
              {isSubmittingAvailability
                ? hasSubmitted
                  ? t("updatingButton")
                  : t("submittingButton")
                : hasSubmitted
                  ? t("updateButton")
                  : t("submitButton")}
            </Button>
          ) : (
            <Button onClick={onEdit} variant="outline" className="flex-1 h-12 text-base">
              {t("editButton")}
            </Button>
          )}

          {isEditingAvailability && (
            <Button onClick={onCancel} variant="ghost" className="h-12">
              {tCommon("cancel")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
