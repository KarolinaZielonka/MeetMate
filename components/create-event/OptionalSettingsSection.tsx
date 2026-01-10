import { Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OptionalSettingsSectionProps {
  formData: {
    password: string
  }
  isLoading: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function OptionalSettingsSection({
  formData,
  isLoading,
  onChange,
}: OptionalSettingsSectionProps) {
  const t = useTranslations("createEvent")
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-bold transition-smooth hover:scale-110">
          2
        </div>
        <h2 className="text-xl font-bold text-foreground">{t("optionalSettings")}</h2>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="password" className="text-base font-semibold">
            {t("password.label")}
          </Label>
          <Badge variant="secondary" className="text-xs hover-scale">
            {t("password.optional")}
          </Badge>
        </div>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder={t("password.placeholder")}
          disabled={isLoading}
          className="h-12 text-base transition-smooth focus:shadow-md"
        />
        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">{t("password.helper")}</p>
        </div>
      </div>
    </div>
  )
}
