"use client";

import type { ElementType, ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";
import { EASE, inView, rise, riseStagger } from "./config";

/**
 * motion.create() must not run during render or the component identity changes
 * on every pass and the subtree remounts. Build each tag once and keep it.
 */
const cache = new Map<string, ElementType>();
function motionTag(tag: ElementType): ElementType {
  if (typeof tag !== "string") return motion.create(tag);
  const hit = cache.get(tag);
  if (hit) return hit;
  const made = motion.create(tag) as ElementType;
  cache.set(tag, made);
  return made;
}

const riseWith = (delay: number): Variants =>
  delay === 0
    ? rise
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, ease: EASE, delay },
        },
      };

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds to wait before this element rises. */
  delay?: number;
}

/**
 * Fade + 18px rise, once, when the element scrolls into view.
 *
 * The reduced-motion case is handled by the `.reveal` class rather than by
 * rendering something different — see globals.css. Branching here would make
 * the server and the client disagree and leave stale inline styles behind.
 */
export function Reveal({ children, className, as = "div", delay = 0 }: RevealProps) {
  const Tag = motionTag(as);
  return (
    <Tag
      className={cn("reveal", className)}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={riseWith(delay)}
    >
      {children}
    </Tag>
  );
}

interface GroupProps extends RevealProps {
  stagger?: number;
}

/** Wrap a list; every <RevealItem> inside arrives in sequence. */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.07,
  delay = 0,
}: GroupProps) {
  const Tag = motionTag(as);
  return (
    <Tag
      className={cn("reveal", className)}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={riseStagger(stagger, delay)}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = motionTag(as);
  return (
    <Tag className={cn("reveal", className)} variants={rise}>
      {children}
    </Tag>
  );
}
