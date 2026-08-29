import { cn } from "@/lib/cn";

/**
 * A figure and what it counts. Values are not always numbers — "Web · Mobile ·
 * Backend" is a legitimate answer — so the type size steps down for long ones
 * instead of letting a phrase shout louder than a number.
 */
export function Metric({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const long = value.length > 8;

  return (
    <div className={className}>
      {/* A fixed box under the figure keeps every label on the same line,
          whatever size the value ended up at. */}
      <div className="flex min-h-[clamp(1.875rem,3.4vw,2.875rem)] items-end">
        <p
          className={cn(
            "font-medium leading-[0.98] tracking-[-0.035em] text-ink",
            long
              ? "text-[clamp(1.125rem,1.7vw,1.5rem)] tracking-[-0.022em]"
              : "text-[clamp(1.875rem,3.4vw,2.875rem)] tabular-nums",
          )}
        >
          {value}
        </p>
      </div>
      <p className="t-meta mt-4 max-w-[24ch] text-ink-muted">{label}</p>
    </div>
  );
}
