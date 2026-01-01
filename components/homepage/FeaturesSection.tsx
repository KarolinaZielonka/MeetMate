import { ShieldCheck, Users, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FeatureCardProps } from "./FeatureCard"
import { FeatureCard } from "./FeatureCard"

export function FeaturesSection() {
  const t = useTranslations("homepage")

  const features: FeatureCardProps[] = [
    {
      icon: <Zap className="w-7 h-7 text-white" />,
      title: t("features.fast.title"),
      description: t("features.fast.description"),
      gradientClass: "bg-gradient-primary",
    },
    {
      icon: <Users className="w-7 h-7 text-white" />,
      title: t("features.realtime.title"),
      description: t("features.realtime.description"),
      gradientClass: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-white" />,
      title: t("features.smart.title"),
      description: t("features.smart.description"),
      gradientClass: "bg-gradient-to-br from-green-500 to-green-600",
    },
  ]

  return (
    <section className="pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
