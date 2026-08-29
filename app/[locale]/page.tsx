import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageRules } from "@/components/layout/PageRules";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LocaleFade } from "@/components/nav/LocaleFade";
import { Hero } from "@/components/hero/Hero";
import { Profile } from "@/components/sections/Profile";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { Process } from "@/components/sections/Process";
import { Numbers } from "@/components/sections/Numbers";
import { Background } from "@/components/sections/Background";
import { Contact } from "@/components/sections/Contact";
import { site } from "@/lib/data/site";
import { stackGroups } from "@/lib/data/stack";
import { warnAboutMissingResume } from "@/lib/resume-check";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Surfaced in the build log, so a missing PDF cannot ship unnoticed.
  warnAboutMissingResume();

  const t = await getTranslations({ locale, namespace: "Meta" });
  const hero = await getTranslations({ locale, namespace: "Hero" });

  /* Person schema, so a search result shows a human rather than a page title. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: `${site.url}/${locale}`,
    email: `mailto:${site.email}`,
    jobTitle: hero("eyebrow"),
    description: t("description"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Samarkand",
      addressCountry: "UZ",
    },
    sameAs: [site.github, site.telegram],
    knowsAbout: stackGroups.flatMap((group) => group.items),
    knowsLanguage: ["ru", "uz", "tg", "en", "de"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageRules />
      <SiteHeader />
      <LocaleFade>
        <main id="main">
          <Hero />
          <Profile />
          <Experience />
          <Work />
          <Stack />
          <Process />
          <Numbers />
          <Background />
          <Contact />
        </main>
        <SiteFooter />
      </LocaleFade>
    </>
  );
}
