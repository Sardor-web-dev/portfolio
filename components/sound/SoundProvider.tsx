"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/**
 * The knock that punctuates text as it lands.
 *
 * Synthesised with the Web Audio API rather than loaded as a file: it costs no
 * bytes, no request, and every parameter is tunable here.
 *
 * Sound is ON for everyone, with no control to turn it off. Note that no code
 * can make it play the instant the page opens — browsers refuse audio until the
 * visitor has actually interacted, and a wheel-scroll does not count. The
 * context is therefore built immediately (legal; it simply starts suspended)
 * and resumed on the first pointer, key or touch event, so the very first
 * interaction switches it on for the rest of the visit.
 */

interface SoundApi {
  /** Play one knock. `step` shifts the pitch slightly so runs don't feel flat. */
  tick: (step?: number) => void;
}

const SoundContext = createContext<SoundApi>({ tick: () => {} });

/**
 * Floor between two knocks. Each typed line paces itself at roughly 165 ms, but
 * several lines can be revealing at once — without a floor those overlap into a
 * burst. Set just under a single line's own cadence so a line is never thinned,
 * while two lines together are.
 */
const MIN_GAP = 0.09;
/** Peak of a single knock. */
const PEAK = 0.3;

/**
 * One low, blunt knock — the "тын" of a wooden ball coming to rest.
 *
 * The character is entirely in three choices: a plain sine (any harmonic
 * content at all reads as a beep), a low fundamental around 300 Hz, and a
 * downward glide to 60% of it across 60 ms. That glide is what makes it land
 * like a knock rather than sound like a note. The envelope is a 3 ms attack and
 * an 80 ms exponential fall, which is short enough that a run of them reads as
 * a rhythm instead of a chord.
 *
 * `step` nudges the pitch up 18 Hz at a time, wrapped so a long page of knocks
 * cannot creep upward into the register this was written to avoid.
 */
function strike(ctx: AudioContext, step: number, at: number) {
  const freq = 300 + 18 * (step % 6);

  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(PEAK, at + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, at + 0.08);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, at);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.6, at + 0.06);
  osc.connect(gain);
  osc.start(at);
  osc.stop(at + 0.09);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef(0);

  useEffect(() => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    const ctx = (ctxRef.current ??= new Ctor());
    void ctx.resume();

    /**
     * `wheel` and `scroll` do not count as user activation in Chrome, but a
     * visitor who has used this site before may already be permitted — so they
     * are worth trying, and cost nothing when they fail.
     */
    const events = [
      "pointerdown",
      "keydown",
      "touchstart",
      "click",
      "wheel",
      "scroll",
    ] as const;
    const arm = () => {
      if (ctx.state === "running") return;
      void ctx.resume();
    };
    events.forEach((e) =>
      window.addEventListener(e, arm, { passive: true }),
    );

    return () => {
      events.forEach((e) => window.removeEventListener(e, arm));
      void ctx.close();
      ctxRef.current = null;
    };
  }, []);

  /**
   * Referentially stable, forever. Scroll reveals schedule their knocks inside
   * timers created long before the audio context is permitted to run; if this
   * changed identity, those callbacks would keep calling a stale copy.
   */
  const tick = useCallback((step = 0) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (ctx.state !== "running") {
      void ctx.resume();
      return;
    }

    const now = ctx.currentTime;
    if (now - lastRef.current < MIN_GAP) return;
    lastRef.current = now;

    strike(ctx, step, now);
  }, []);

  const value = useMemo(() => ({ tick }), [tick]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
