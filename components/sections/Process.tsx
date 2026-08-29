"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { StatementLines } from "@/components/ui/StatementLines";
import { inView } from "@/components/motion/config";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const t = useTranslations("Process");
  const steps = t.raw("steps") as { title: string; body: string }[];
  const listRef = useRef<HTMLOListElement>(null);

  /* The rail fills as the list scrolls past — the section's only continuous
     motion, and it is tied to the reader's own position. */
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 78%", "end 65%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });
  const scaleY = useTransform(fill, [0, 1], [0, 1]);

  return (
    <Section id="process" index={t("index")} label={t("label")} tone="sunk">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-6">
          <StatementLines lines={[t("statement")]} />
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-4">
          <Reveal delay={0.08}>
            <p className="t-body max-w-[46ch]">{t("body")}</p>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-20 md:mt-28">
        {/* rail */}
        <span
          aria-hidden
          className="absolute left-[3px] top-2 hidden h-[calc(100%-1rem)] w-px bg-rule sm:block"
        />
        <motion.span
          aria-hidden
          className="reveal absolute left-[3px] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-ink sm:block"
          style={{ scaleY }}
        />

        <ol ref={listRef} className="sm:pl-10">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.7, delay: i * 0.04, ease: EASE }}
              className="reveal relative grid grid-cols-12 gap-x-6 gap-y-2 border-t border-rule py-6 last:border-b"
            >
              <span
                aria-hidden
                className="absolute -left-10 top-[1.9rem] hidden h-[7px] w-[7px] bg-ink sm:block"
              />
              <div className="col-span-12 flex items-baseline gap-4 sm:col-span-5 md:col-span-4">
                <span className="t-meta tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[1.125rem] font-medium tracking-[-0.022em] text-ink">
                  {step.title}
                </span>
              </div>
              <p className="col-span-12 text-[0.9375rem] leading-[1.55] tracking-[-0.008em] text-ink-soft sm:col-span-7 md:col-span-8">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
