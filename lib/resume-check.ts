import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { resume } from "./data/site";

let warned = false;

/**
 * The resume download is the one link on this site that points at a file rather
 * than at content in the repo, so it is the one link that can quietly 404.
 * Called from the page during build; server-side only, and it never throws —
 * the site is still perfectly usable while the PDF is being prepared.
 */
export function warnAboutMissingResume() {
  if (warned) return;
  warned = true;

  const missing = [resume.en, resume.ru]
    .filter((p): p is string => Boolean(p))
    .filter((p) => !existsSync(join(process.cwd(), "public", p)));

  if (missing.length === 0) return;

  console.warn(
    `\n  ⚠  Resume file(s) not found: ${missing.join(", ")}\n` +
      `     The download button will 404 until they are added to public/resume/.\n`,
  );
}
