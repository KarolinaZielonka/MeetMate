"use client"

import { Moon, Sun } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("themeToggle")

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="min-w-11 min-h-11" disabled>
        <Sun className="h-5 w-5" />
        <span className="sr-only">{t("loading")}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="min-w-11 min-h-11 group"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5 text-foreground group-hover:text-primary transition-smooth" />
          <span className="sr-only">{t("switchToLight")}</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-foreground group-hover:text-primary transition-smooth" />
          <span className="sr-only">{t("switchToDark")}</span>
        </>
      )}
    </Button>
  )
}
