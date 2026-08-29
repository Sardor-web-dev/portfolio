"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * A hairline at the very top showing how far through the page you are. On a
 * document this long it is genuinely useful, and at 2px in the accent colour it
 * costs the design nothing.
 *
 * Deliberately not marked `.reveal`: it reports the reader's own position
 * rather than playing an animation, so it stays live under reduced motion —
 * and the rule that flattens transforms would otherwise pin it at full width.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
    />
  );
}
