"use client"

import { useTranslations } from "next-intl"
import type { DateAggregation } from "./types"

interface SelectedDateDetailsProps {
  selectedDate: string
  dateData: DateAggregation
}

export function SelectedDateDetails({ selectedDate, dateData }: SelectedDateDetailsProps) {
  const t = useTranslations("eventPage.heatmap")

  return (
    <div className="border-t border-border pt-4 space-y-2">
      <h4 className="font-semibold text-foreground">
        {new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm">
            {t("legend.available")}: {dateData.available}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span className="text-sm">
            {t("legend.maybe")}: {dateData.maybe}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-sm">
            {t("legend.unavailable")}: {dateData.unavailable}
          </span>
        </div>
      </div>
      <div className="mt-3">
        <h5 className="text-sm font-medium text-muted-foreground mb-2">{t("participants")}:</h5>
        <div className="space-y-1">
          {dateData.participants.map((p) => (
            <div key={p.id} className="flex items-center gap-2 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  p.status === "available"
                    ? "bg-green-500"
                    : p.status === "maybe"
                      ? "bg-orange-500"
                      : "bg-red-500"
                }`}
              />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
