import { Calendar, Sparkles, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { AboutFeatures } from "@/components/about/AboutFeatures"
import { AboutHero } from "@/components/about/AboutHero"
import { StepCard } from "@/components/about/StepCard"

export default function AboutPage() {
  const t = useTranslations("aboutPage")

  const steps = [
    {
      icon: Calendar,
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
      gradient: "gradient-blue" as const,
      iconBg: "icon-bg-blue" as const,
    },
    {
      icon: Users,
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
      gradient: "gradient-purple" as const,
      iconBg: "icon-bg-purple" as const,
    },
    {
      icon: Sparkles,
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
      gradient: "gradient-green" as const,
      iconBg: "icon-bg-green" as const,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <AboutHero />
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative space-y-6">
            <div className="absolute left-7 top-16 bottom-16 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 opacity-20 hidden lg:block" />
            {steps.map((step) => (
              <div key={step.title} className="relative">
                <StepCard {...step} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutFeatures />
    </main>
  )
}
