import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Header } from "@/components/Header"
import { ThemeProvider } from "@/components/ThemeProvider"
import { locales } from "@/i18n"
import "../globals.css"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              <a href="#main-content" className="skip-to-main">
                Skip to main content
              </a>
              <Toaster />
              <Header />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
