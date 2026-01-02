import { ShieldCheck, Users, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FeatureCardProps } from "@/components/homepage/FeatureCard"
import { FeatureCard } from "@/components/homepage/FeatureCard"

export function AboutFeatures() {
  const t = useTranslations("aboutPage")
  const tHome = useTranslations("homepage")

  const features: FeatureCardProps[] = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: tHome("features.fast.title"),
      description: t("features.noSignup"),
      gradientClass: "gradient-purple",
      iconBgClass: "icon-bg-purple",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: tHome("features.realtime.title"),
      description: t("features.realtime"),
      gradientClass: "gradient-blue",
      iconBgClass: "icon-bg-blue",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: tHome("features.smart.title"),
      description: t("features.secure"),
      gradientClass: "gradient-green",
      iconBgClass: "icon-bg-green",
    },
  ]

  return (
    <section className="pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("whyTitle")}</h2>
          <p className="text-lg text-muted-foreground">{t("whySubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
