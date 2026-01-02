"use client"

import { Globe } from "lucide-react"
import { useLocale } from "next-intl"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Locale, locales } from "@/i18n"
import { usePathname, useRouter } from "@/i18n/routing"

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: Locale) => {
    // Store preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("NEXT_LOCALE", newLocale)
    }

    // Navigate to new locale using next-intl's router
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  const languages = {
    en: { name: "English", flag: "🇬🇧" },
    pl: { name: "Polski", flag: "🇵🇱" },
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 transition-smooth"
          disabled={isPending}
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{languages[locale].name}</span>
          <span className="sm:hidden">{languages[locale].flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`cursor-pointer ${locale === loc ? "bg-secondary font-semibold" : ""}`}
          >
            <span className="mr-2">{languages[loc].flag}</span>
            {languages[loc].name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
