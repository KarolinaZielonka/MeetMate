import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/routing"

export default function HomePage() {
  const t = useTranslations("homepage")

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-none shadow-lg card-hover">
              <CardContent className="pt-6 pb-6 text-center space-y-4">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg hover-scale-icon">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("features.fast.title")}</h3>
                <p className="text-muted-foreground">{t("features.fast.description")}</p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-lg card-hover">
              <CardContent className="pt-6 pb-6 text-center space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg hover-scale-icon">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("features.realtime.title")}
                </h3>
                <p className="text-muted-foreground">{t("features.realtime.description")}</p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-lg card-hover">
              <CardContent className="pt-6 pb-6 text-center space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg hover-scale-icon">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("features.smart.title")}</h3>
                <p className="text-muted-foreground">{t("features.smart.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
