import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";

/**
 * One labelled block of a case study: a mono label in the margin, the content
 * beside it. The same shape repeats for problem, solution, architecture and
 * result, which is what makes a long page still feel navigable.
 */
export function CaseBlock({
  label,
  children,
  className,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  /** Lets the content use the full width instead of the reading column. */
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-x-6 gap-y-4 border-t border-rule pt-8",
        className,
      )}
    >
      <Reveal className="col-span-12 md:col-span-3">
        <p className="t-meta text-ink-faint md:sticky md:top-28">{label}</p>
      </Reveal>
      <div
        className={cn(
          "col-span-12",
          wide
            ? "md:col-span-9 md:col-start-4"
            : "md:col-span-8 md:col-start-4 lg:col-span-7",
        )}
      >
        {children}
      </div>
    </div>
  );
}
