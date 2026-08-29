"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * A short, soft tick played when a line of type lands.
 *
 * Synthesised with the Web Audio API rather than loaded as a file: it costs no
 * bytes, no request, and the tone can be tuned precisely. Two detuned triangle
 * partials through a fast decay give a wooden "tik" rather than a beep.
 *
 * Off by default. A hiring manager opening this in an open-plan office should
 * never be surprised by sound, so it plays only after they turn it on, and the
 * choice is remembered per browser.
 */

interface SoundApi {
  enabled: boolean;
  toggle: () => void;
  /** Play one tick. `step` shifts the pitch slightly so runs don't feel flat. */
  tick: (step?: number) => void;
}

const SoundContext = createContext<SoundApi>({
  enabled: false,
  toggle: () => {},
  tick: () => {},
});

const STORAGE_KEY = "sound";
/** Closest two ticks may fall, so a fast scroll can't machine-gun. */
const MIN_GAP = 0.045;
/** Peak of a single tick, roughly -20 dBFS: present, but never startling. */
const PEAK = 0.1;

/** One wooden tick, scheduled `at` seconds on the context clock. */
function strike(ctx: AudioContext, step: number, at: number) {
  const base = 880 * Math.pow(2, ((step % 4) * 2) / 12);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(PEAK, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
  gain.connect(ctx.destination);

  for (const [ratio, level] of [
    [1, 1],
    [2.02, 0.35],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(base * ratio, at);
    osc.frequency.exponentialRampToValueAtTime(base * ratio * 0.86, at + 0.12);
    const partial = ctx.createGain();
    partial.gain.value = level;
    osc.connect(partial).connect(gain);
    osc.start(at);
    osc.stop(at + 0.14);
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef(0);

  /**
   * `tick` is read from callbacks that were created before the visitor turned
   * sound on — a scroll reveal's timer, a running interval. Keeping the flag in
   * a ref lets `tick` stay referentially stable forever, so none of those
   * callbacks can capture a stale, permanently-silent copy.
   */
  const enabledRef = useRef(false);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(STORAGE_KEY) === "on");
    } catch {
      /* private mode — stays off */
    }
  }, []);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  /**
   * On a return visit the preference comes back from storage but no gesture has
   * happened yet, and audio may not start without one. Constructing the context
   * is always allowed — it simply begins suspended — so it is built up front
   * and resumed at the first gesture. Without this the toggle reads "on" and
   * stays silent for the entire session.
   */
  useEffect(() => {
    if (!enabled) return;

    const ctx = (ctxRef.current ??= new AudioContext());
    void ctx.resume();
    if (ctx.state === "running") return;

    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const arm = () => void ctx.resume();
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, arm));
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((was) => {
      const next = !was;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }

      if (next) {
        // Created inside the click, which is what satisfies autoplay policy.
        const ctx = (ctxRef.current ??= new AudioContext());
        void ctx.resume();
        // Three ticks, straight away: turning it on has to prove it works.
        const from = ctx.currentTime + 0.04;
        [0, 1, 2].forEach((i) => strike(ctx, i, from + i * 0.13));
        lastRef.current = from + 0.26;
      }

      return next;
    });
  }, []);

  const tick = useCallback((step = 0) => {
    if (!enabledRef.current) return;

    const ctx = ctxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume();
      return;
    }

    const now = ctx.currentTime;
    if (now - lastRef.current < MIN_GAP) return;
    lastRef.current = now;

    strike(ctx, step, now);
  }, []);

  const value = useMemo(() => ({ enabled, toggle, tick }), [enabled, toggle, tick]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
