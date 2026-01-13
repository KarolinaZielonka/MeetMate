"use client"

import { Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "./utils"

export function LockedEventCard({ calculatedDate }: { calculatedDate: string }) {
  const t = useTranslations("optimalDates")

  return (
    <Card className="state-available">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Lock className="h-5 w-5" />
          {t("singular")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-card border border-border p-4">
            <span className="font-semibold text-lg text-foreground">
              {formatDate(calculatedDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
