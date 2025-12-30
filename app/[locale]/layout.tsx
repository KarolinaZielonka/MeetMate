import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { Header } from "@/components/Header";
import { FloatingAboutButton } from "@/components/FloatingAboutButton";
import { ThemeProvider } from "@/components/ThemeProvider";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Fetch messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Header />
            {children}
            <FloatingAboutButton />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
