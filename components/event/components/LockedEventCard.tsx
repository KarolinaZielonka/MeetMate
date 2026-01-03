"use client"

import { Calendar, Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "./utils"

interface LockedEventCardProps {
  calculatedDate: string
}

export function LockedEventCard({ calculatedDate }: LockedEventCardProps) {
  const t = useTranslations("optimalDates")

  return (
    <Card className="state-available">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Lock className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("lockedMessage", { date: formatDate(calculatedDate) })}
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-card border border-border p-4">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg text-foreground">
              {formatDate(calculatedDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
