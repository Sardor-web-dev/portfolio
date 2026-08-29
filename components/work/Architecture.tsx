"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { osonUyArchitecture as arch } from "@/lib/data/projects";
import { useSound } from "@/components/sound/SoundProvider";
import { inView } from "@/components/motion/config";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Three clients over one core. The figure assembles as it scrolls into view —
 * clients, then the lines that join them, then each layer of the core — so the
 * order the system is drawn in matches the order it is explained in.
 *
 * On narrow screens the converging lines are replaced by a single rail; the
 * relationships are identical, the drawing is simpler.
 */
export function Architecture() {
  const t = useTranslations("Work.oson-uy.architecture");
  const { tick } = useSound();

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: inView,
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <div className="relative">
      <motion.p {...fade(0)} className="reveal t-meta text-ink-faint">
        {t("clientsLabel")}
      </motion.p>

      <div className="mt-4 grid grid-cols-1 border border-rule-strong bg-paper sm:grid-cols-3">
        {arch.clients.map((node, i) => (
          <motion.div
            key={node.id}
            {...fade(0.06 + i * 0.09)}
            onViewportEnter={() => setTimeout(() => tick(i), (0.06 + i * 0.09) * 1000)}
            className="reveal border-b border-rule-strong px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
          >
            <p className="t-meta text-ink-faint">{node.tag}</p>
            <p className="mt-2 text-[0.9375rem] font-medium tracking-[-0.015em] text-ink">
              {node.label}
            </p>
            <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-muted">
              {t(`nodes.${node.note}`)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Wide: three drops onto a bus, then one line down into the core.
          Drawn with rules rather than an SVG path so the geometry stays exact
          at every width. */}
      <div className="relative hidden h-20 w-full sm:block" aria-hidden>
        {[16.667, 50, 83.333].map((x, i) => (
          <motion.span
            key={x}
            className="reveal absolute top-0 h-6 w-px origin-top bg-ink-faint"
            style={{ left: `${x}%` }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={inView}
            transition={{ duration: 0.4, delay: 0.34 + i * 0.06, ease: EASE }}
          />
        ))}
        <motion.span
          className="reveal absolute top-6 h-px origin-center bg-ink-faint"
          style={{ left: "16.667%", right: "16.667%" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={inView}
          transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
        />
        {[16.667, 50, 83.333].map((x, i) => (
          <motion.span
            key={`node-${x}`}
            className="reveal absolute h-[3px] w-[3px] bg-ink"
            style={{ left: `calc(${x}% - 1.5px)`, top: "calc(1.5rem - 1.5px)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inView}
            transition={{ duration: 0.3, delay: 0.62 + i * 0.05, ease: EASE }}
          />
        ))}
        <motion.span
          className="reveal absolute left-1/2 top-6 h-14 w-px origin-top bg-ink-faint"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={inView}
          transition={{ duration: 0.4, delay: 0.72, ease: EASE }}
        />
      </div>

      {/* Narrow: one plain rail. */}
      <div className="flex h-10 justify-center sm:hidden" aria-hidden>
        <motion.span
          className="w-px origin-top bg-rule-strong"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={inView}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        />
      </div>

      <motion.p {...fade(0.82)} className="reveal t-meta text-ink-faint">
        {t("coreLabel")}
      </motion.p>

      <ol className="mt-4">
        {arch.core.map((node, i) => (
          <motion.li
            key={node.id}
            {...fade(0.88 + i * 0.1)}
            onViewportEnter={() => setTimeout(() => tick(i + 3), (0.88 + i * 0.1) * 1000)}
            className="reveal relative"
          >
            <div className="flex flex-col gap-2 border border-rule-strong bg-paper px-4 py-4 sm:flex-row sm:items-baseline sm:gap-6">
              <p className="t-meta w-full shrink-0 text-ink-faint sm:w-32">
                {node.tag}
              </p>
              <p className="w-full shrink-0 text-[0.9375rem] font-medium tracking-[-0.015em] text-ink sm:w-40">
                {node.label}
              </p>
              <p className="text-[0.8125rem] leading-[1.5] text-ink-muted">
                {t(`nodes.${node.note}`)}
              </p>
            </div>
            {i < arch.core.length - 1 ? (
              <div className="flex h-7 justify-center" aria-hidden>
                <motion.span
                  className="reveal w-px origin-top bg-ink-faint"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={inView}
                  transition={{
                    duration: 0.4,
                    delay: 0.94 + i * 0.1,
                    ease: EASE,
                  }}
                />
              </div>
            ) : null}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
