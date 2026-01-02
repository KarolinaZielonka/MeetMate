import { useTranslations } from "next-intl"

export function AboutHero() {
  const t = useTranslations("aboutPage")

  return (
    <section className="pt-32 pb-10 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="fade-in space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </section>
  )
}
