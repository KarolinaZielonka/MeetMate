"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { MainHeadline } from "./MainHeadline"

export function HeroSection() {
  const t = useTranslations("homepage")

  return (
    <section className="pt-32 pb-20 px-4 pattern-dots">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <MainHeadline />
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up">
          <Button
            asChild
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-smooth hover-lift text-lg p-6 h-auto"
          >
            <Link href="/create">{t("createEventButton")}</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 hover:border-accent-foreground hover:text-accent-foreground text-lg p-6 h-auto transition-smooth hover-scale"
          >
            <Link href="/about">{t("howItWorksButton")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
