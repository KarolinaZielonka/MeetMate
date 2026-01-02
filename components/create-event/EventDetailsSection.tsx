import { Info } from "lucide-react"
import { useTranslations } from "next-intl"
import { DateRangePicker } from "@/components/create-event/DateRangePicker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDateRangeLength } from "@/lib/utils/dates"

interface EventDetailsSectionProps {
  formData: {
    name: string
    creatorName: string
    startDate: string
    endDate: string
  }
  isLoading: boolean
  hasError: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDateChange: (startDate: string, endDate: string) => void
}

export function EventDetailsSection({
  formData,
  isLoading,
  hasError,
  onChange,
  onDateChange,
}: EventDetailsSectionProps) {
  const t = useTranslations("createEvent")
  const showDateRangeInfo = formData.startDate && formData.endDate && !hasError

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md transition-smooth hover:scale-110">
          1
        </div>
        <h2 className="text-xl font-bold text-foreground">{t("eventDetails")}</h2>
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="name" className="text-base font-semibold">
          {t("eventName.label")} <span className="text-destructive">{t("eventName.required")}</span>
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder={t("eventName.placeholder")}
          maxLength={255}
          required
          disabled={isLoading}
          className="h-12 text-base transition-smooth focus:shadow-md"
        />
        <p className="text-sm text-muted-foreground">{t("eventName.helper")}</p>
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="creatorName" className="text-base font-semibold">
          {t("creatorName.label")}{" "}
          <span className="text-destructive">{t("eventName.required")}</span>
        </Label>
        <Input
          type="text"
          id="creatorName"
          name="creatorName"
          value={formData.creatorName}
          onChange={onChange}
          placeholder={t("creatorName.placeholder")}
          maxLength={100}
          required
          disabled={isLoading}
          className="h-12 text-base transition-smooth focus:shadow-md"
        />
        <p className="text-sm text-muted-foreground">{t("creatorName.helper")}</p>
      </div>

      <div className="space-y-4">
        <DateRangePicker
          startDate={formData.startDate}
          endDate={formData.endDate}
          onDateChange={onDateChange}
          disabled={isLoading}
        />
        {showDateRangeInfo && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg fade-in">
            <Info className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-primary font-medium">
              {t("dateRange.daysInfo", {
                days: getDateRangeLength(formData.startDate, formData.endDate),
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
