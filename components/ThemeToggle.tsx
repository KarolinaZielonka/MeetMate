"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9" disabled>
        <Sun className="h-5 w-5" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 hover-scale-icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5 text-amber-500 transition-smooth" />
          <span className="sr-only">Switch to light mode</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-slate-700 transition-smooth" />
          <span className="sr-only">Switch to dark mode</span>
        </>
      )}
    </Button>
  )
}
