import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  isLoading: boolean
  isDisabled: boolean
}

export function SubmitButton({ isLoading, isDisabled }: SubmitButtonProps) {
  const t = useTranslations("createEvent")
  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-smooth hover-lift"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          {t("submittingButton")}
        </span>
      ) : (
        t("submitButton")
      )}
    </Button>
  )
}
