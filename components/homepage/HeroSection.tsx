import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

export function HeroSection() {
  const t = useTranslations("homepage")

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Main Headline */}
        <div className="space-y-4 fade-in">
          <div className="inline-block">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 hover-scale">
              {t("badge")}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            {t("title")}
            <span className="text-primary">{t("titleAccent")}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 slide-up">
          <Button
            asChild
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-smooth hover-lift text-lg px-8 py-6 h-auto"
          >
            <Link href="/create">{t("createEventButton")}</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 hover:border-primary hover:text-primary text-lg px-8 py-6 h-auto transition-smooth hover-scale"
          >
            <Link href="/about">{t("howItWorksButton")}</Link>
          </Button>
        </div>

        {/* Social Proof */}
        <p className="text-sm text-muted-foreground pt-4 fade-in">{t("socialProof")}</p>
      </div>
    </section>
  )
}
