"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Fades the page in, but only when arriving from the language switch — a first
 * visit paints at full opacity so nothing delays the largest contentful paint.
 */
export function LocaleFade({ children }: { children: ReactNode }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("locale-switch")) {
        sessionStorage.removeItem("locale-switch");
        setFading(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!fading) return <>{children}</>;

  return (
    <motion.div
      className="reveal"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
