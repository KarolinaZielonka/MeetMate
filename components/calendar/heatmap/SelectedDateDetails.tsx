"use client"

import { useTranslations } from "next-intl"
import { parseDateAsLocal } from "@/lib/utils/dates"
import type { DateAggregation } from "./types"

interface SelectedDateDetailsProps {
  selectedDate: string
  dateData: DateAggregation
}

export function SelectedDateDetails({ selectedDate, dateData }: SelectedDateDetailsProps) {
  const t = useTranslations("eventPage.heatmap")

  return (
    <div className="border-t border-border pt-4 space-y-4">
      <h4 className="font-semibold text-foreground">
        {parseDateAsLocal(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="availability-slot availability-available">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("legend.available")}</span>
            <span className="stat-number">{dateData.available}</span>
          </div>
        </div>
        <div className="availability-slot availability-maybe">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("legend.maybe")}</span>
            <span className="stat-number">{dateData.maybe}</span>
          </div>
        </div>
        <div className="availability-slot availability-unavailable">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("legend.unavailable")}</span>
            <span className="stat-number">{dateData.unavailable}</span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h5 className="label-spaced mb-3">{t("participants")}</h5>
        <div className="space-y-1">
          {dateData.participants.map((p) => (
            <div
              key={p.id}
              className={`availability-slot ${
                p.status === "available"
                  ? "availability-available"
                  : p.status === "maybe"
                    ? "availability-maybe"
                    : "availability-unavailable"
              }`}
            >
              <span className="text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
