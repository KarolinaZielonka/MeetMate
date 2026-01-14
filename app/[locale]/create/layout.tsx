import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "createEvent" })

  const title = t("title")
  const description = t("subtitle")

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/create`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/create`,
      languages: {
        en: `${baseUrl}/en/create`,
        pl: `${baseUrl}/pl/create`,
      },
    },
  }
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
