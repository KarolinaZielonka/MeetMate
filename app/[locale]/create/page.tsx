"use client"

import { useTranslations } from "next-intl"
import { AlertMessage } from "@/components/create-event/AlertMessage"
import { EventDetailsSection } from "@/components/create-event/EventDetailsSection"
import { OptionalSettingsSection } from "@/components/create-event/OptionalSettingsSection"
import { SubmitButton } from "@/components/create-event/SubmitButton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCreateEventForm } from "@/hooks/useCreateEventForm"

export default function CreateEventPage() {
  const t = useTranslations("createEvent")

  const { formData, isLoading, validation, handleChange, handleDateChange, handleSubmit } =
    useCreateEventForm()

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{t("title")}</h1>
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

              <Separator />

              <OptionalSettingsSection
                formData={formData}
                isLoading={isLoading}
                onChange={handleChange}
              />

              {validation.warning && <AlertMessage type="warning" message={validation.warning} />}

              {validation.error && <AlertMessage type="error" message={validation.error} />}

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
