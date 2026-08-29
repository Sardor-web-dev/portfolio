"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useSound } from "@/components/sound/SoundProvider";

/** Total time a line takes to arrive, however many words it has. */
const BUDGET = 1600;
/** Bounds on the per-word interval, in ms. */
const MIN_STEP = 18;
const MAX_STEP = 115;
/** Roughly how often a knock should land, in ms. */
const TICK_EVERY_MS = 165;

interface TypeLineProps {
  text: string;
  className?: string;
  /** Seconds to wait before the first word. */
  delay?: number;
  /** Start on mount instead of waiting to be scrolled into view. */
  immediate?: boolean;
  /** Reveal without knocking — for text that would crowd the rhythm. */
  silent?: boolean;
}

/**
 * Reveals a sentence word by word, knocking softly as it goes.
 *
 * Two things keep this usable on real paragraphs rather than just on a headline:
 *
 * - the per-word interval is derived from the word count against a fixed time
 *   budget, so a forty-word paragraph still lands in about a second and a half
 *   instead of taking six and being scrolled past half-finished;
 * - the knock fires every *n*th word, with n chosen to hold the cadence near
 *   six per second whatever the interval is. Ticking every word of a long
 *   paragraph is a machine gun, not a rhythm.
 *
 * Words are laid out normally and only their opacity and offset change, so the
 * line wraps exactly as it would without the effect and nothing shifts.
 */
export function TypeLine({
  text,
  className,
  delay = 0,
  immediate = false,
  silent = false,
}: TypeLineProps) {
  const words = text.split(" ");
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-8% 0px -14% 0px" });
  const { tick } = useSound();

  const [shown, setShown] = useState(0);
  const started = useRef(false);

  const step = Math.min(MAX_STEP, Math.max(MIN_STEP, BUDGET / words.length));
  const tickEvery = Math.max(1, Math.round(TICK_EVERY_MS / step));
  const ready = reduced || immediate || inView;

  useEffect(() => {
    if (reduced) {
      setShown(words.length);
      return;
    }
    if (!ready || started.current) return;
    started.current = true;

    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const begin = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(i);
        if (!silent && (i - 1) % tickEvery === 0) tick(i);
        if (i >= words.length) clearInterval(interval);
      }, step);
    }, delay * 1000);

    return () => {
      clearTimeout(begin);
      clearInterval(interval);
    };
    // `tick` is referentially stable by design — see SoundProvider.
  }, [ready, reduced, words.length, step, tickEvery, delay, silent, tick]);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {/* `.reveal` is what makes the reduced-motion case correct in the
              first painted frame — see globals.css. */}
          <span
            className="reveal inline-block transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]"
            style={{
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "translateY(0)" : "translateY(0.3em)",
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
