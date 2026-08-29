import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";

import { routing } from "@/i18n/routing";
import { site } from "@/lib/data/site";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SoundProvider } from "@/components/sound/SoundProvider";

import "../globals.css";

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${site.url}/${l}`]),
  );

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: site.name,
    authors: [{ name: site.name, url: site.github }],
    creator: site.name,
    keywords: [
      "Sardor Djamolov",
      "Full-Stack Engineer",
      "Software Engineer",
      "TypeScript",
      "React",
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "React Native",
      "Uzbekistan",
    ],
    alternates: {
      canonical: `${site.url}/${locale}`,
      languages: { ...languages, "x-default": `${site.url}/en` },
    },
    openGraph: {
      type: "profile",
      siteName: site.name,
      title: t("title"),
      description: t("description"),
      url: `${site.url}/${locale}`,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      alternateLocale: locale === "ru" ? "en_US" : "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport = {
  themeColor: "#fbfaf8",
  colorScheme: "light" as const,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${editorial.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <MotionProvider>
            <SoundProvider>
              <SmoothScroll />
              {children}
            </SoundProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
