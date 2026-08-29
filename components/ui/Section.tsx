import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { TickOnView } from "@/components/sound/TickOnView";

interface SectionProps {
  id: string;
  index: string;
  label: string;
  children: ReactNode;
  /** Drops the sunken background band used to separate neighbouring sections. */
  tone?: "paper" | "sunk";
  className?: string;
  /** Full-bleed sections manage their own grid. */
  bare?: boolean;
}

/**
 * Every section on the site is the same shape: a numbered label in the left
 * margin, content in the right nine columns. Repeating one structure is what
 * makes the page scan as a single document.
 */
export function Section({
  id,
  index,
  label,
  children,
  tone = "paper",
  className,
  bare = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className={cn(
        "relative z-10 border-t border-rule",
        tone === "sunk" && "bg-paper-sunk",
        className,
      )}
      style={{ scrollMarginTop: "5rem" }}
    >
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-6 py-section">
          <div className="col-span-12 mb-10 md:col-span-3 md:mb-0 lg:col-span-2">
            <Reveal className="md:sticky md:top-28">
              <h2 id={`${id}-label`} className="t-meta flex items-baseline gap-3">
                <span className="text-ink-faint tabular-nums">{index}</span>
                <span className="text-ink">{label}</span>
                <TickOnView step={Number(index)} />
              </h2>
            </Reveal>
          </div>
          <div
            className={cn(
              "col-span-12",
              !bare && "md:col-span-9 md:col-start-4 lg:col-span-10 lg:col-start-3",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
