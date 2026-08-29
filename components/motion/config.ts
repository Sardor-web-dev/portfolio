import type { Transition, Variants } from "motion/react";

/**
 * One easing curve for the whole site. Everything decelerates the same way,
 * which is most of what makes motion feel like a single system rather than a
 * pile of effects.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const transition: Transition = { duration: 0.85, ease: EASE };
export const quick: Transition = { duration: 0.45, ease: EASE };

/** Scroll reveal: a short rise out of nothing. No scale, no blur, no bounce. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition },
};

/** Same, for a container whose children should arrive one after another. */
export const riseStagger = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** A masked line of type sliding up from behind its own edge. */
export const maskLine: Variants = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { duration: 1, ease: EASE } },
};

/** Standard in-view trigger: fire once, slightly before the element is centred. */
export const inView = { once: true, margin: "-8% 0px -12% 0px" } as const;
