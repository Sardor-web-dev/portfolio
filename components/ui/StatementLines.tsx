"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { inView } from "@/components/motion/config";

/**
 * The site has three of these: large serif statements set as separate lines
 * that rise from behind their own edge as they enter the viewport. Used
 * sparingly, it is the one moment of theatre on the page.
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
  return (
    <p className={cn("t-statement max-w-[16ch]", className)}>
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
                    delay: i * 0.09,
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
