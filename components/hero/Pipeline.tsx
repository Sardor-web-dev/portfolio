"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

const STEPS = ["idea", "product", "code", "deployment"] as const;

/**
 * The four states a piece of work passes through, drawn as a small system
 * diagram in the margin. It draws itself once and then holds still — it is a
 * label for the page, not an animation.
 */
export function Pipeline({ className }: { className?: string }) {
  const t = useTranslations("Hero");
  const base = 0.62;

  return (
    <figure
      className={cn("relative", className)}
      aria-label={`${t("pipelineLabel")}: ${STEPS.map((s) => t(`pipeline.${s}`)).join(" → ")}`}
    >
      <figcaption className="t-meta mb-6 text-ink-faint">
        {t("pipelineLabel")}
      </figcaption>

      <ol className="relative" role="list">
        {STEPS.map((step, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li key={step} className="relative flex gap-4 pb-7 last:pb-0">
              {/* connector */}
              {!last ? (
                <motion.span
                  aria-hidden
                  className="reveal absolute left-[3px] top-2.5 w-px origin-top bg-rule-strong"
                  style={{ height: "calc(100% - 0.375rem)" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: base + 0.14 + i * 0.16,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ) : null}

              <motion.span
                aria-hidden
                className={cn(
                  "reveal mt-[7px] h-[7px] w-[7px] shrink-0",
                  last ? "bg-accent" : "bg-ink",
                )}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: base + i * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              <motion.span
                className={cn("reveal t-meta", last ? "text-ink" : "text-ink-soft")}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: base + 0.05 + i * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {t(`pipeline.${step}`)}
              </motion.span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
