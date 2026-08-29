"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts a numeric figure up when it scrolls into view. Only the digits move —
 * any prefix or suffix ("45+", "3") is held steady, so the line never reflows
 * and the value is correct at every frame.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const target = match ? Number(match[2]) : 0;
  const [n, setN] = useState(target);

  /* Starts at the final value: that is what the server renders, what a reader
     without JavaScript sees, and what a reduced-motion reader keeps. The count
     only rewinds to zero on the first animated frame, which is the same frame
     the element enters view — so there is nothing to see in between. */
  useEffect(() => {
    if (!match || reduced || !inView) return;

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const run = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Same deceleration as everything else on the page.
      const eased = 1 - Math.pow(1 - t, 4);
      setN(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, match, reduced]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {match[1]}
      <span className="tabular-nums">{n}</span>
      {match[3]}
    </span>
  );
}
