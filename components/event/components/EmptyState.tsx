"use client"

import { Calendar } from "lucide-react"
import { useTranslations } from "next-intl"

export function EmptyState() {
  const t = useTranslations("optimalDates")

  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">{t("noData")}</p>
      <p className="mt-2 text-xs text-muted-foreground">{t("minParticipants")}</p>
    </div>
  )
}
