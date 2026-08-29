/**
 * Two hairlines running the full height of the viewport, aligned to the content
 * column. They give the page the feel of a ruled sheet and, more usefully, make
 * the grid legible so every section reads as deliberately aligned.
 */
export function PageRules() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
    >
      <div className="shell h-full">
        <div className="h-full border-x border-rule-soft" />
      </div>
    </div>
  );
}
