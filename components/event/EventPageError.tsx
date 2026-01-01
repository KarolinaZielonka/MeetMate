import { AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "@/i18n/routing"

interface EventPageErrorProps {
  error?: string
  isNotFound?: boolean
}

export function EventPageError({ error, isNotFound = false }: EventPageErrorProps) {
  const router = useRouter()
  const t = useTranslations("eventPage.errors")

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto fade-in">
        <Card className="shadow-lg border-none">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6 bounce-subtle">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {isNotFound ? t("notFound") : t("oops")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              {error || t("notFoundMessage")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 hover-lift"
              >
                {t("goHome")}
              </Button>
              <Button
                onClick={() => window.location.reload()}
                size="lg"
                variant="outline"
                className="hover-lift"
              >
                {t("refreshPage")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
