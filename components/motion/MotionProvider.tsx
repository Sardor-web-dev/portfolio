"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` makes the animation layer honour the OS setting on its
 * own: transform and layout animations stop, and values snap to their target.
 * The `.reveal` rule in globals.css is the belt to this braces — it guarantees
 * the correct state in the first frame, before any JavaScript has run.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
