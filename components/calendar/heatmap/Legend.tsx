import { useTranslations } from "next-intl"

export function Legend() {
  const t = useTranslations("eventPage.heatmap")

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
      <span className="font-medium">{t("legend.title")}:</span>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-muted border border-border rounded" />
        <span>{t("legend.noData")}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded" />
        <span>0%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded" />
        <span>1-33%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-800 rounded" />
        <span>34-66%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-300 dark:bg-green-700 border border-green-500 dark:border-green-600 rounded" />
        <span>67-100%</span>
      </div>
    </div>
  )
}
