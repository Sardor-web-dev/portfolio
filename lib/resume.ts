import { resume } from "./data/site";

/**
 * The English resume is the primary document. A Russian reader gets the
 * Russian file when one exists, and the English one otherwise.
 */
export function resumeHref(locale: string) {
  if (locale === "ru" && resume.ru) return resume.ru;
  return resume.en;
}

export const russianResume = resume.ru;
