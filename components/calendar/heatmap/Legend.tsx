import { useTranslations } from "next-intl"

export function Legend() {
  const t = useTranslations("eventPage.heatmap")

  return (
    <section
      className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4"
      aria-labelledby="legend-label"
    >
      <span className="font-medium" id="legend-label">
        {t("legend.title")}:
      </span>
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 bg-muted border border-border rounded"
          role="img"
          aria-label="No data indicator"
        />
        <span>{t("legend.noData")}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded"
          role="img"
          aria-label="0 percent availability indicator"
        />
        <span>0%</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-800 rounded"
          role="img"
          aria-label="Low availability indicator"
        />
        <span>1-49%</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-800 rounded"
          role="img"
          aria-label="High availability indicator"
        />
        <span>50-99%</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 bg-green-500 dark:bg-green-600 border border-green-600 dark:border-green-500 rounded"
          role="img"
          aria-label="Full availability indicator"
        />
        <span>100%</span>
      </div>
    </section>
  )
}
