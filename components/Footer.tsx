"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="bg-background/90 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-end">
        <Link href="https://github.com/KarolinaZielonka" target="_blank" className="flex items-center group">
          <span className="text-xs text-foreground transition-smooth">
            {t("createdWith")}
          </span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-smooth group-hover:shadow-elevated group-hover:scale-105">
            <Heart className="w-5 h-5 text-destructive transition-smooth group-hover:rotate-12" />
          </div>
          <span className="text-xs text-foreground transition-smooth">
            {t('by')} @kZielonka
          </span> 
        </Link>
      </div>
    </footer>
  )
}
