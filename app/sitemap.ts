import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const locales = ["en", "pl"]
  const staticPages = ["", "/create", "/about", "/privacy", "/terms"]

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const page of staticPages) {
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${page}`
      const alternates: Record<string, string> = {}

      for (const altLocale of locales) {
        alternates[altLocale] = `${baseUrl}/${altLocale}${page}`
      }

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : page === "/create" ? 0.9 : 0.7,
        alternates: {
          languages: alternates,
        },
      })
    }
  }

  return sitemapEntries
}
