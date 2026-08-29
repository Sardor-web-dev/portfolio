"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useSound } from "./SoundProvider";

const BARS = [0.35, 0.8, 0.5, 1, 0.6];

/**
 * An equaliser that stands up when sound is on and lies flat under a strike
 * when it is off. The strike matters: five flat bars on their own read as a
 * stray ellipsis rather than as a muted control.
 */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();
  const t = useTranslations("Nav");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? t("soundOff") : t("soundOn")}
      title={enabled ? t("soundOff") : t("soundOn")}
      className={cn(
        "group relative flex h-8 w-8 items-center justify-center rounded-[2px] transition-colors duration-300",
        enabled ? "text-ink" : "text-ink-faint hover:text-ink-muted",
        className,
      )}
    >
      <span aria-hidden className="flex h-4 items-center gap-[2px]">
        {BARS.map((height, i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-current"
            initial={false}
            animate={{ height: enabled ? Math.round(height * 15) : 3 }}
            transition={{
              duration: 0.4,
              delay: enabled ? i * 0.035 : (BARS.length - 1 - i) * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </span>

      {/* The muted strike. */}
      <motion.span
        aria-hidden
        className="absolute h-px w-[22px] origin-center rotate-[-38deg] bg-current"
        initial={false}
        animate={{ scaleX: enabled ? 0 : 1, opacity: enabled ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </button>
  );
}
