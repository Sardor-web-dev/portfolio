"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { navSections, site } from "@/lib/data/site";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";
import { LocaleSwitch } from "./LocaleSwitch";
import { SoundToggle } from "@/components/sound/SoundToggle";

const SECTION_IDS = navSections.map((s) => s.id);

export function SiteHeader() {
  const t = useTranslations("Nav");
  const tHero = useTranslations("Hero");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  /* Header gains a surface once the hero is behind it. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Which section is currently under the header. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Lock the page while the mobile sheet is open. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = useCallback((id: string) => {
    setOpen(false);
    // Let the sheet finish closing before the scroll starts.
    requestAnimationFrame(() => scrollToId(id));
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-[2px] bg-ink px-4 py-2 text-paper focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60]"
      >
        {t("skip")}
      </a>

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "reveal fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? "border-b border-rule bg-paper/85 backdrop-blur-[10px]"
            : "border-b border-transparent",
        )}
      >
        <div className="shell">
          <div className="flex h-16 items-center justify-between gap-6">
            <button
              type="button"
              onClick={() => scrollToId("top")}
              className="-ml-1 rounded-[2px] px-1 text-[0.9375rem] font-medium tracking-[-0.015em] transition-opacity duration-300 hover:opacity-70"
            >
              <span className="text-ink">Sardor</span>{" "}
              <span className="text-ink-faint">Djamolov</span>
            </button>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-1 md:flex"
            >
              {navSections.map((section) => {
                const isActive = active === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => jump(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-[2px] px-3 py-2 text-[0.8125rem] tracking-[-0.005em] transition-colors duration-300",
                      isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {t(section.key)}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-x-3 -bottom-px h-px bg-ink"
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <SoundToggle />
              <LocaleSwitch />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t("close") : t("menu")}
                className="relative -mr-1 flex h-9 w-9 items-center justify-center rounded-[2px] md:hidden"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute h-px w-5 bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    open ? "rotate-45" : "-translate-y-1",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute h-px w-5 bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    open ? "-rotate-45" : "translate-y-1",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="reveal fixed inset-0 z-40 bg-paper md:hidden"
          >
            <div className="shell flex h-full flex-col pt-24 pb-10">
              <nav aria-label="Primary" className="flex flex-col">
                {navSections.map((section, i) => (
                  <motion.button
                    key={section.id}
                    type="button"
                    onClick={() => jump(section.id)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.06 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="reveal flex items-baseline gap-4 border-b border-rule py-5 text-left"
                  >
                    <span className="t-meta text-ink-faint tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-2xl font-medium tracking-[-0.025em]">
                      {t(section.key)}
                    </span>
                  </motion.button>
                ))}
              </nav>

              {/* The language control already sits in the header above; one
                  is enough. This row carries the thing a visitor came for. */}
              <div className="mt-auto flex flex-col gap-3 border-t border-rule pt-6">
                <a
                  href={`mailto:${site.email}`}
                  className="t-mono text-ink link-underline link-underline-on"
                >
                  {site.email}
                </a>
                <p className="t-meta text-ink-muted">{tHero("location")}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
