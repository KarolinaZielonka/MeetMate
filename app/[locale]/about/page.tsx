import { Calendar, Sparkles, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { AboutHero } from "@/components/about/AboutHero"
import { StepCard } from "@/components/about/StepCard"

export default function AboutPage() {
  const t = useTranslations("aboutPage")

  const steps = [
    {
      icon: Calendar,
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
      color: "blue" as const,
    },
    {
      icon: Users,
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
      color: "red" as const,
    },
    {
      icon: Sparkles,
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
      color: "green" as const,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <AboutHero />
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="divider-dot">
            <span />
          </div>
          <div className="relative space-y-6">
            {/* Vertical timeline line */}
            <div className="absolute left-7 top-16 bottom-16 w-0.5 bg-border hidden lg:block" />
            {steps.map((step) => (
              <div key={step.title} className="relative">
                <StepCard {...step} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
