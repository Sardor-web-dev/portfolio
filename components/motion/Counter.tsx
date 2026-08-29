"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useInView, useReducedMotion } from "motion/react";

/** useLayoutEffect warns during SSR; on the server there is nothing to lay out. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Counts a numeric figure up when it scrolls into view. Only the digits move —
 * any prefix or suffix ("45+", "3") is held steady, so the line never reflows
 * and the value is correct at every frame.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  /**
   * Memoised deliberately. A fresh `value.match()` on every render is a new
   * array, and an unstable value in the effect's dependencies restarts the
   * animation on the very re-render the animation causes — the counter then
   * loops near zero forever instead of arriving.
   */
  const parsed = useMemo(() => {
    const m = value.match(/^(\D*)(\d+)(.*)$/);
    return m ? { prefix: m[1], suffix: m[3], target: Number(m[2]) } : null;
  }, [value]);

  const target = parsed?.target ?? 0;
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  /* Server-rendered — and kept, without JavaScript or under reduced motion. */
  const [n, setN] = useState(target);

  /* Zeroed before the browser paints, so the figure is never seen to rewind. */
  useIsoLayoutEffect(() => {
    if (parsed && !reduced) setN(0);
  }, [parsed, reduced]);

  useEffect(() => {
    if (!parsed || reduced || !inView) return;

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const run = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Same deceleration as everything else on the page.
      setN(Math.round(target * (1 - Math.pow(1 - t, 4))));
      if (t < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, parsed, reduced]);

  if (!parsed) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      <span className="tabular-nums">{n}</span>
      {parsed.suffix}
    </span>
  );
}
