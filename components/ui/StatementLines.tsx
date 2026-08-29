"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/cn";
import { inView } from "@/components/motion/config";
import { useSound } from "@/components/sound/SoundProvider";

const LINE_DELAY = 0.09;

/**
 * The site's large serif statements: separate lines that rise from behind their
 * own edge as they enter the viewport, one soft tick as each one lands.
 *
 * Used three times in total. Sparing it is what keeps it feeling like a moment
 * rather than a mannerism.
 */
export function StatementLines({
  lines,
  emphasiseLast = false,
  className,
}: {
  lines: string[];
  /** Renders the final line in italic serif, which reads as the emphasis. */
  emphasiseLast?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref, { once: true, margin: "-8% 0px -12% 0px" });
  const { tick } = useSound();

  /* One tick per line, timed to when that line finishes rising. */
  useEffect(() => {
    if (!seen) return;
    const timers = lines.map((_, i) =>
      setTimeout(() => tick(i), (i * LINE_DELAY + 0.42) * 1000),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, lines.length]);

  return (
    <p ref={ref} className={cn("t-statement max-w-[16ch]", className)}>
      {lines.map((line, i) => {
        const emphasised = emphasiseLast && i === lines.length - 1;

        return (
          <motion.span
            key={line}
            className="block overflow-hidden pb-[0.08em]"
            initial="hidden"
            whileInView="visible"
            viewport={inView}
          >
            <motion.span
              className={cn("reveal block", emphasised && "italic text-accent")}
              variants={{
                hidden: { y: "112%" },
                visible: {
                  y: "0%",
                  transition: {
                    duration: 1,
                    delay: i * LINE_DELAY,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              {line}
            </motion.span>
          </motion.span>
        );
      })}
    </p>
  );
}
