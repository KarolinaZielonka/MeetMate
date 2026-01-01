"use client"

import { Calendar } from "lucide-react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

export function Header() {
  const t = useTranslations("header")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-medium transition-smooth group-hover:shadow-elevated group-hover:scale-105">
            <Calendar className="w-5 h-5 text-white transition-smooth group-hover:rotate-12" />
          </div>
          <span className="text-2xl font-bold text-foreground transition-smooth">MeetMate</span>
        </Link>

        {/* Right side: Theme Toggle + Language Switcher + CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />

          <div className="hidden sm:block">
            <Button
              asChild
              size="sm"
              className="bg-gradient-primary hover:brightness-110 shadow-medium hover:shadow-elevated hover-lift transition-all duration-200"
            >
              <Link href="/create">{t("createEvent")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
