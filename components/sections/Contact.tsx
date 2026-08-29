import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TypeLine } from "@/components/motion/TypeLine";
import { StatementLines } from "@/components/ui/StatementLines";
import { Action, ArrowUpRight } from "@/components/ui/Action";
import { site } from "@/lib/data/site";
import { resumeHref, russianResume } from "@/lib/resume";

export function Contact() {
  const t = useTranslations("Contact");
  const hero = useTranslations("Hero");
  const locale = useLocale();

  const rows = [
    { label: t("emailLabel"), value: site.email, href: `mailto:${site.email}` },
    { label: t("githubLabel"), value: site.githubHandle, href: site.github },
    ...(site.telegram && site.telegramHandle
      ? [
          {
            label: t("telegramLabel"),
            value: site.telegramHandle,
            href: site.telegram,
          },
        ]
      : []),
  ];

  return (
    <Section id="contact" index={t("index")} label={t("label")}>
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-7">
          <StatementLines lines={[t("title")]} className="max-w-[18ch]" />
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-4">
          <p className="t-body max-w-[42ch]">
            <TypeLine text={t("body")} delay={0.2} />
          </p>
        </div>
      </div>

      <RevealGroup as="dl" stagger={0.06} className="mt-16 md:mt-20">
        {rows.map((row) => (
          <RevealItem key={row.label} className="border-t border-rule last:border-b">
            <a
              href={row.href}
              target={row.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={row.href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
              className="group grid grid-cols-12 items-baseline gap-x-6 gap-y-1 py-5 transition-colors duration-500 hover:bg-paper-sunk"
            >
              <dt className="t-meta col-span-12 text-ink-faint sm:col-span-3">
                {row.label}
              </dt>
              <dd className="col-span-12 flex items-baseline gap-2 sm:col-span-9">
                <span className="text-[clamp(1.0625rem,1.7vw,1.375rem)] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-accent">
                  {row.value}
                </span>
                <ArrowUpRight className="text-ink-faint" />
              </dd>
            </a>
          </RevealItem>
        ))}
        <RevealItem className="border-b border-rule">
          <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-1 py-5">
            <p className="t-meta col-span-12 text-ink-faint sm:col-span-3">
              {t("locationLabel")}
            </p>
            <p className="col-span-12 text-[clamp(1.0625rem,1.7vw,1.375rem)] tracking-[-0.02em] text-ink-soft sm:col-span-9">
              {hero("location")}
            </p>
          </div>
        </RevealItem>
      </RevealGroup>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          {/* Telegram is the fastest way to reach him; email stays one row above. */}
          <Action
            href={site.telegram ?? `mailto:${site.email}`}
            target={site.telegram ? "_blank" : undefined}
            rel={site.telegram ? "noreferrer noopener" : undefined}
            arrow
          >
            {t("getInTouch")}
          </Action>
          <Action href={resumeHref(locale)} variant="secondary" download>
            {russianResume ? t("resumeEn") : t("downloadResume")}
          </Action>
          {russianResume ? (
            <Action href={russianResume} variant="secondary" download>
              {t("resumeRu")}
            </Action>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}
