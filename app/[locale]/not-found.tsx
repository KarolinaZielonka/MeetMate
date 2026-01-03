import { AlertCircle, Home } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"

export default async function NotFound() {
  const t = await getTranslations("errors.notFound")

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild>
            <a href="/" className="gap-2">
              <Home className="w-4 h-4" />
              {t("goHome")}
            </a>
          </Button>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <p>{t("helpText")}</p>
        </div>
      </div>
    </div>
  )
}
