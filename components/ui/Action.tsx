import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "group inline-flex items-center gap-2.5 rounded-[2px] text-[0.9375rem] font-medium " +
  "leading-none tracking-[-0.01em] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

const variants: Record<Variant, string> = {
  primary: "bg-ink px-5 py-3.5 text-paper hover:bg-accent",
  secondary:
    "border border-rule-strong px-5 py-3.5 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  quiet: "text-ink-soft hover:text-accent",
};

interface ActionProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
  /** Renders the small travelling arrow on the right. */
  arrow?: boolean;
}

/**
 * One button. Three weights. The only motion is the arrow nudging forward,
 * which is enough to register as responsive without animating a rectangle.
 */
export function Action({
  variant = "primary",
  className,
  children,
  arrow = false,
  ...props
}: ActionProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </a>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1",
        className,
      )}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "h-3 w-3 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
        className,
      )}
    >
      <path
        d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
