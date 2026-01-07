"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="bg-background/90 backdrop-blur-md border-t border-border/50 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-smooth">
              {t("privacy")}
            </Link>
            <span className="text-border">•</span>
            <Link href="/terms" className="hover:text-foreground transition-smooth">
              {t("terms")}
            </Link>
          </div>

          <Link
            href="https://github.com/KarolinaZielonka"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group"
            aria-label="Created by kZielonka on GitHub"
          >
            <span className="text-xs text-foreground transition-smooth">{t("createdWith")}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-smooth group-hover:shadow-elevated group-hover:scale-105">
              <Heart
                className="w-5 h-5 text-destructive transition-smooth group-hover:rotate-12"
                aria-hidden="true"
              />
            </div>
            <span className="text-xs text-foreground transition-smooth">{t("by")} @kZielonka</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
