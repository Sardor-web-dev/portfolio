"use client";

import { useId, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * EN / RU. The active locale is marked by a block that slides between the two
 * labels rather than by a colour change, so the switch reads as one control.
 */
export function LocaleSwitch({ className }: { className?: string }) {
  const active = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Nav");
  const [pending, startTransition] = useTransition();
  /* The header and the mobile sheet each render one of these. Without a unique
     id they would share a layout animation and the marker would jump between
     them, leaving one switch with no visible active state. */
  const pillId = useId();

  const go = (next: Locale) => {
    if (next === active) return;
    // Picked up by LocaleFade on the next page so the swap gets a short fade.
    try {
      sessionStorage.setItem("locale-switch", "1");
    } catch {
      /* private mode — the fade is optional */
    }
    startTransition(() => {
      router.replace(pathname, { locale: next, scroll: false });
    });
  };

  return (
    <div
      className={cn(
        "relative flex items-center rounded-[2px] border border-rule",
        pending && "opacity-60",
        className,
      )}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => go(locale)}
            aria-current={isActive ? "true" : undefined}
            lang={locale}
            className={cn(
              "relative z-10 px-2.5 py-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300",
              isActive ? "text-paper" : "text-ink-muted hover:text-ink",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={`locale-pill-${pillId}`}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-[1px] bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
              />
            ) : null}
            <span className="relative">{locale}</span>
          </button>
        );
      })}
    </div>
  );
}
