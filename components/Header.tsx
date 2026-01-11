"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function Header() {
  const t = useTranslations("header");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-soft">
      <nav
        className="container mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="MeetMate home"
        >
          <div className="transition-smooth group-hover:scale-105">
            <Logo className="w-9 h-9"/>
          </div>
          <span className="text-xl font-bold text-foreground transition-smooth font-display tracking-tight">
            Meet<span className="text-primary">Mate</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
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
      </nav>
    </header>
  );
}
