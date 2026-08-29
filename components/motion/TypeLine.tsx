"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useSound } from "@/components/sound/SoundProvider";

interface TypeLineProps {
  text: string;
  className?: string;
  /** Milliseconds between words. */
  step?: number;
  /** Seconds to wait before the first word. */
  delay?: number;
  /** Wait for the element to scroll into view instead of starting on mount. */
  onView?: boolean;
}

/**
 * Reveals a sentence word by word, with one soft tick per word when sound is on.
 *
 * Word-level rather than character-level on purpose: per-character ticking turns
 * into a machine gun, while a word cadence reads as deliberate — and it is far
 * cheaper, since a sentence is a dozen steps rather than eighty.
 *
 * Words are laid out normally and only their opacity and offset change, so the
 * line wraps exactly as it would without the effect and nothing shifts.
 */
export function TypeLine({
  text,
  className,
  step = 90,
  delay = 0,
  onView = false,
}: TypeLineProps) {
  const words = text.split(" ");
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const { tick } = useSound();

  const [shown, setShown] = useState(0);
  const started = useRef(false);

  const ready = reduced ? true : onView ? inView : true;

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
        tick(i);
        if (i >= words.length) clearInterval(interval);
      }, step);
    }, delay * 1000);

    return () => {
      clearTimeout(begin);
      clearInterval(interval);
    };
    // `tick` changes identity when sound is toggled; the run must not restart.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced, words.length, step, delay]);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {/* `.reveal` is what makes the reduced-motion case correct in the
              first painted frame — see globals.css. Branching on the hook here
              would leave the server's opacity:0 stranded on the word. */}
          <span
            className="reveal inline-block transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]"
            style={{
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "translateY(0)" : "translateY(0.32em)",
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
