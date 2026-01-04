"use client"

import { ChevronDown, Info } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import LegendItem from "./LegendItem"

export function Instructions({ readonly = false }: { readonly?: boolean }) {
  const t = useTranslations("calendar")
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Legend and Instructions */}
      {!readonly && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
          <div>
            <div className="text-sm font-medium mb-3 text-foreground">{t("legend")}:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <LegendItem className="state-available" label={t("available")} />
              <LegendItem className="state-maybe" label={t("maybe")} />
              <LegendItem className="state-unavailable" label={t("unavailable")} />
              <LegendItem className="bg-card border-border" label={t("unselected")} />
            </div>
          </div>

          {/* Collapsible Instructions */}
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-sm font-medium text-foreground flex items-center justify-between hover:text-primary transition-smooth"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                {t("howToUse")}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-smooth ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {isExpanded && (
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-background px-2 py-0.5 rounded">1x {t("tap")}</span>
                  <span>→</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {t("available")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-background px-2 py-0.5 rounded">2x {t("tap")}</span>
                  <span>→</span>
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    {t("maybe")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-background px-2 py-0.5 rounded">3x {t("tap")}</span>
                  <span>→</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {t("unavailable")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-background px-2 py-0.5 rounded">4x {t("tap")}</span>
                  <span>→</span>
                  <span className="text-muted-foreground font-medium">{t("unselected")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
