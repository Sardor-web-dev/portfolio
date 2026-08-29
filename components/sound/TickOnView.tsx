"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { useSound } from "./SoundProvider";

/**
 * Renders nothing; ticks once when it scrolls into view. Used to punctuate the
 * numbered section labels, so the effect is audible wherever on the page the
 * visitor happens to switch sound on.
 */
export function TickOnView({ step = 0 }: { step?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px -40% 0px" });
  const { tick } = useSound();

  useEffect(() => {
    if (seen) tick(step);
  }, [seen, tick, step]);

  return <span ref={ref} aria-hidden className="sr-only" />;
}
