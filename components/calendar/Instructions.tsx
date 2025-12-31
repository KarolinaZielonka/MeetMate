"use client";

import { useTranslations } from "next-intl";
import LegendItem from "./LegendItem";

export function Instructions({ readonly = false }: { readonly?: boolean }) {
  const t = useTranslations("calendar");

  return (
    <>
      {/* Legend and Instructions */}
      {!readonly && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
          <div>
            <div className="text-sm font-medium mb-3 text-foreground">
              {t("legend")}:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <LegendItem className="state-available" label={t("available")} />
              <LegendItem className="state-maybe" label={t("maybe")} />
              <LegendItem
                className="state-unavailable"
                label={t("unavailable")}
              />
              <LegendItem
                className="bg-card border-border"
                label={t("unselected")}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-border pt-4">
            <div className="text-sm font-medium mb-2 text-foreground flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t("howToUse")}:
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-background px-2 py-0.5 rounded">
                  1x {t("tap")}
                </span>
                <span>→</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {t("available")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-background px-2 py-0.5 rounded">
                  2x {t("tap")}
                </span>
                <span>→</span>
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  {t("maybe")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-background px-2 py-0.5 rounded">
                  3x {t("tap")}
                </span>
                <span>→</span>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {t("unavailable")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-background px-2 py-0.5 rounded">
                  4x {t("tap")}
                </span>
                <span>→</span>
                <span className="text-muted-foreground font-medium">
                  {t("unselected")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
