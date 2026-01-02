import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Header } from "@/components/Header"
import { ThemeProvider } from "@/components/ThemeProvider"
import { locales } from "@/i18n"
import "../globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  // Fetch messages for the locale
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Toaster />
            <Header />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
