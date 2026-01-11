import { ShieldCheck, Users, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FeatureCardProps } from "./FeatureCard"
import { FeatureCard } from "./FeatureCard"

export function FeaturesSection() {
  const t = useTranslations("homepage")

  const features: FeatureCardProps[] = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: t("features.fast.title"),
      description: t("features.fast.description"),
      iconBgClass: "icon-bg-purple",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: t("features.realtime.title"),
      description: t("features.realtime.description"),
      iconBgClass: "icon-bg-blue",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: t("features.smart.title"),
      description: t("features.smart.description"),
      iconBgClass: "icon-bg-green",
    },
  ]

  return (
    <section className="pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="divider-dot">
          <span />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
