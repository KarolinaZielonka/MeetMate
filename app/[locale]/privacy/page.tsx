import { Shield } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { IntroSection, LegalSectionRenderer, PageHeader } from "@/components/legal"
import { LAST_UPDATED_DATE } from "@/config/constants"
import { privacySections } from "@/config/legal-sections"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacy" })

  return {
    title: `${t("title")} - MeetMate`,
    description: t("intro"),
  }
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy")

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <PageHeader
          icon={Shield}
          title={t("title")}
          lastUpdated={t("lastUpdated", { date: LAST_UPDATED_DATE })}
        />

        <IntroSection content={t("intro")} />

        <div className="space-y-8">
          {privacySections.map((section) => (
            <LegalSectionRenderer key={section.key} section={section} namespace="privacy" t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
