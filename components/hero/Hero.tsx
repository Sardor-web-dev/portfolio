"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { site } from "@/lib/data/site";
import { resumeHref } from "@/lib/resume";
import { scrollToId } from "@/lib/scroll";
import { Action } from "@/components/ui/Action";
import { Pipeline } from "./Pipeline";
import { TypeLine } from "@/components/motion/TypeLine";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A line of type that rises out from behind its own edge. */
function MaskLine({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`reveal block ${className ?? ""}`}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function FadeUp({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`reveal ${className ?? ""}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);

  /* The hero recedes as the page moves past it. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);

  const [first, last] = site.name.split(" ");

  return (
    <section
      id="top"
      ref={ref}
      aria-label={site.name}
      className="relative z-10"
    >
      <div className="shell">
        <motion.div
          style={{ y, opacity }}
          className="reveal flex min-h-[100svh] flex-col justify-end pb-14 pt-32 md:min-h-[94svh] md:pb-16"
        >
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-9">
              <FadeUp delay={0.08}>
                <p className="t-meta flex items-center gap-3 text-ink-muted">
                  <span aria-hidden className="h-px w-8 bg-rule-strong" />
                  {t("eyebrow")}
                </p>
              </FadeUp>

              <h1 className="t-display mt-7 md:mt-9">
                <MaskLine delay={0.12}>{first}</MaskLine>
                <MaskLine delay={0.19} className="text-ink-soft">
                  {last}
                </MaskLine>
              </h1>
            </div>

            {/* The pipeline sits in the right margin, quiet and small. */}
            <div className="col-span-12 hidden lg:col-span-3 lg:flex lg:items-end lg:justify-end lg:pb-3">
              <Pipeline className="w-full max-w-[11rem]" />
            </div>
          </div>

          <FadeUp delay={0.38}>
            <div className="mt-10 h-px w-full bg-rule md:mt-12" />
          </FadeUp>

          <div className="grid grid-cols-12 gap-x-6 gap-y-8 pt-8 md:pt-10">
            <div className="col-span-12 md:col-span-7 lg:col-span-6">
              <FadeUp delay={0.44}>
                <p className="max-w-[26ch] text-[clamp(1.35rem,2.6vw,2rem)] font-medium leading-[1.16] tracking-[-0.03em] text-ink">
                  <TypeLine text={t("lead")} delay={0.62} step={85} />
                </p>
              </FadeUp>
            </div>

            <div className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-8">
              <FadeUp delay={0.52}>
                <p className="t-body max-w-[46ch]">{t("description")}</p>
              </FadeUp>

              <FadeUp delay={0.6}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Action
                    href="#work"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("work");
                    }}
                    arrow
                  >
                    {t("viewProjects")}
                  </Action>
                  <Action
                    href={resumeHref(locale)}
                    variant="secondary"
                    download
                  >
                    {t("downloadResume")}
                  </Action>
                </div>
              </FadeUp>
            </div>
          </div>

          <FadeUp delay={0.7}>
            <div className="mt-14 flex flex-col gap-3 border-t border-rule pt-5 md:mt-16 md:flex-row md:items-center md:justify-between md:gap-6">
              <p className="t-meta text-ink-muted">{t("location")}</p>
              <p className="t-meta flex items-start gap-2.5 text-ink-muted">
                <span
                  aria-hidden
                  className="mt-[0.42em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                {t("availability")}
              </p>
            </div>
          </FadeUp>

          {/* Small-screen fallback for the margin diagram. */}
          <FadeUp delay={0.74} className="lg:hidden">
            <Pipeline className="mt-12" />
          </FadeUp>
        </motion.div>
      </div>
    </section>
  );
}
