"use client"

import { ChevronDown, Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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
  const [isExpanded, setIsExpanded] = useState(false)
  const hasPassword = formData.password.length > 0

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left hover:bg-muted/50 rounded-md transition-smooth -mx-2 px-2"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <span className="text-base font-semibold">{t("password.label")}</span>
          <span className="text-muted-foreground font-normal text-sm">
            ({t("password.optional")})
          </span>
          {hasPassword && (
            <span className="text-sm text-primary ml-1">
              ({t("password.set")})
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="space-y-3 pt-1">
          <p className="text-sm text-muted-foreground">{t("password.helper")}</p>
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
        </div>
      )}
    </div>
  )
}
