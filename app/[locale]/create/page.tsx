"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { AlertMessage } from "@/components/create-event/AlertMessage"
import { EventDetailsSection } from "@/components/create-event/EventDetailsSection"
import { ExcludedDatesSection } from "@/components/create-event/ExcludedDatesSection"
import { OptionalSettingsSection } from "@/components/create-event/OptionalSettingsSection"
import { SubmitButton } from "@/components/create-event/SubmitButton"
import { SkeletonForm } from "@/components/skeletons"
import { Turnstile } from "@/components/Turnstile"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "@/i18n/routing"
import { useCreateEventStore } from "@/store/createEventStore"

export default function CreateEventPage() {
  const router = useRouter()
  const t = useTranslations("createEvent")
  const tApi = useTranslations("api")

  const { formData, isLoading, validation, setFormField, setDateRange, toggleExcludedDate, createEvent } =
    useCreateEventStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormField(name as keyof typeof formData, value)
  }

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange(startDate, endDate)
  }

  const handleCaptchaVerify = (token: string) => {
    setFormField("captchaToken", token)
  }

  const handleCaptchaError = () => {
    setFormField("captchaToken", "")
    toast.error(t("errors.captchaFailed"))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await createEvent(t, tApi)

    if (!result.success) {
      // Error toast is shown based on validation.error
      if (validation.error) {
        toast.error(validation.error)
      }
      return
    }

    if (result.shareUrl) {
      router.push(`/e/${result.shareUrl}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SkeletonForm fields={10} shimmer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl headline-tight text-foreground mb-3">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Card className="shadow-xl border-none slide-up">
          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              <EventDetailsSection
                formData={formData}
                isLoading={isLoading}
                hasError={!!validation.error}
                onChange={handleChange}
                onDateChange={handleDateChange}
              />

              {formData.startDate && formData.endDate && !validation.error && (
                <>
                  <div className="divider-dot">
                    <span />
                  </div>

                  <ExcludedDatesSection
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    excludedDates={formData.excludedDates}
                    onToggleDate={toggleExcludedDate}
                    disabled={isLoading}
                  />
                </>
              )}

              <div className="divider-dot">
                <span />
              </div>

              <OptionalSettingsSection
                formData={formData}
                isLoading={isLoading}
                onChange={handleChange}
              />

              {validation.warning && <AlertMessage type="warning" message={validation.warning} />}

              {validation.error && <AlertMessage type="error" message={validation.error} />}

              <Turnstile onVerify={handleCaptchaVerify} onError={handleCaptchaError} />

              <SubmitButton isLoading={isLoading} isDisabled={isLoading || !!validation.error} />
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-center text-sm text-muted-foreground">{t("successMessage")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
