import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // Always prefix so the URL is explicit: /en and /ru.
  localePrefix: "always",
  localeDetection: false,
});
