"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { inView } from "@/components/motion/config";

/** How much taller than the frame the image sits — the room the drift uses. */
const OVERFLOW = 1.07;

interface ShotProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  /** Shown as a small mono label above the frame — the address it lives at. */
  domain?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * A screenshot in a hairline frame. The image sits in an oversized box and
 * drifts a few percent against the page as it passes, which gives the section
 * depth without moving anything the eye is trying to read.
 */
export function Shot({
  src,
  width,
  height,
  alt,
  caption,
  domain,
  priority = false,
  sizes = "(min-width: 1024px) 62rem, 100vw",
  className,
}: ShotProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });
  const y = useTransform(smooth, [0, 1], ["-3%", "3%"]);

  return (
    <figure className={cn("group", className)}>
      {domain ? (
        <p className="t-meta mb-3 text-ink-faint">{domain}</p>
      ) : null}

      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.985 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={inView}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="reveal relative overflow-hidden border border-rule-strong bg-paper-deep"
        /* The frame is deliberately shorter than the screenshot: the image keeps
           its own aspect ratio inside an oversized box, so the drift only ever
           reveals more of the top or bottom and never crops the sides. */
        style={{ aspectRatio: `${width} / ${height / OVERFLOW}` }}
      >
        <motion.div
          style={{
            top: `${(-(OVERFLOW - 1) / 2) * 100}%`,
            height: `${OVERFLOW * 100}%`,
            y,
          }}
          className="reveal absolute inset-x-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.01]"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={88}
            className="object-cover object-top"
          />
        </motion.div>
      </motion.div>

      {caption ? (
        <figcaption className="mt-4 max-w-[62ch] text-[0.875rem] leading-[1.55] tracking-[-0.005em] text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
