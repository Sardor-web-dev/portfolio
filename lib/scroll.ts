import type Lenis from "lenis";

/**
 * Lenis owns the scroll position, so anchor navigation has to go through it —
 * otherwise the browser's own jump and Lenis's animation fight each other.
 */
let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Offset for the fixed header, so a section title never lands under it. */
const HEADER_OFFSET = -72;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.1 });
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.1 });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}
