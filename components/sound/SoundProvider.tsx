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

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef(0);

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
        ctxRef.current ??= new AudioContext();
        void ctxRef.current.resume();
      }
      return next;
    });
  }, []);

  const tick = useCallback(
    (step = 0) => {
      if (!enabled) return;

      const ctx = ctxRef.current;
      if (!ctx || ctx.state !== "running") return;

      // Never let a fast run of reveals turn into a machine gun.
      const now = ctx.currentTime;
      if (now - lastRef.current < 0.045) return;
      lastRef.current = now;

      const base = 880 * Math.pow(2, ((step % 4) * 2) / 12);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      gain.connect(ctx.destination);

      for (const [ratio, level] of [
        [1, 1],
        [2.02, 0.35],
      ] as const) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(base * ratio, now);
        osc.frequency.exponentialRampToValueAtTime(base * ratio * 0.86, now + 0.12);
        const partial = ctx.createGain();
        partial.gain.value = level;
        osc.connect(partial).connect(gain);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    },
    [enabled],
  );

  const value = useMemo(() => ({ enabled, toggle, tick }), [enabled, toggle, tick]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
