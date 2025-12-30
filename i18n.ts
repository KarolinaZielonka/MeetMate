import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['en', 'pl'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for the locale from the request
  let locale = await requestLocale;

  // Provide a fallback if locale is undefined
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
