"use client"

import { Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import { formatDateRange, parseDate } from "@/lib/utils/dates"

interface LockedEventStatusProps {
  calculatedDate: string
}

export function LockedEventStatus({ calculatedDate }: LockedEventStatusProps) {
  const t = useTranslations("eventPage")

  return (
    <>
      <div className="p-5 bg-primary/10 border-2 border-primary/30 rounded-xl fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-md hover-scale-icon">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-primary text-lg mb-1">{t("locked.title")}</p>
            <p className="text-foreground">
              {t("locked.chosenDate", {
                date: formatDateRange(parseDate(calculatedDate), parseDate(calculatedDate)),
              })}
            </p>
          </div>
        </div>
      </div>
      <Separator />
    </>
  )
}
