"use client";

import { useTranslations } from "next-intl";
import { site } from "@/lib/data/site";
import { scrollToTop } from "@/lib/scroll";
import { Arrow } from "@/components/ui/Action";

export function SiteFooter() {
  const t = useTranslations("Footer");

  const links = [
    { label: "GitHub", href: site.github },
    { label: "Email", href: `mailto:${site.email}` },
    ...(site.telegram ? [{ label: "Telegram", href: site.telegram }] : []),
  ];

  return (
    <footer className="relative z-10 border-t border-ink">
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 py-14 md:py-16">
          <div className="col-span-12 md:col-span-5">
            <p className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
              {site.name}
            </p>
            <p className="t-meta mt-2 text-ink-muted">{t("role")}</p>
          </div>

          <nav
            aria-label="Footer"
            className="col-span-12 flex flex-wrap gap-x-8 gap-y-3 md:col-span-4"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noreferrer noopener"
                }
                className="t-mono leading-[1.4] text-ink-soft transition-colors duration-300 hover:text-accent link-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="col-span-12 flex md:col-span-3 md:justify-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex h-fit items-center gap-2 text-[0.8125rem] leading-[1.4] tracking-[-0.005em] text-ink-muted transition-colors duration-300 hover:text-ink"
            >
              {t("backToTop")}
              <Arrow className="-rotate-90 group-hover:translate-x-0 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-rule py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-meta text-ink-faint">
            {t("rights", { year: new Date().getFullYear() })}
          </p>
          <p className="t-meta text-ink-faint">{t("colophon")}</p>
        </div>
      </div>
    </footer>
  );
}
