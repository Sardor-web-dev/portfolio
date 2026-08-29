/**
 * Everything about the person, in one place. No prose lives here — only facts
 * and addresses. Translated copy belongs in /messages.
 */
export const site = {
  name: "Sardor Djamolov",
  /** Latin initials used for the monogram / favicon. */
  monogram: "SD",
  url: "https://sardordjamolov.com",
  email: "dzamolovsardor5@gmail.com",
  github: "https://github.com/Sardor-web-dev",
  githubHandle: "github.com/Sardor-web-dev",
  /**
   * Not published, because no handle was supplied — nothing here is invented.
   * Fill both fields in and the Telegram row appears in Contact and the footer
   * on its own.
   */
  telegram: null as string | null,
  telegramHandle: null as string | null,
} as const;

/**
 * Drop the real PDFs at these paths (see public/resume/README.md).
 * English is the primary document. Set `ru` to the Russian file once it
 * exists and the second download link appears on its own; leave it null and
 * every resume link points at the English version.
 */
export const resume: { en: string; ru: string | null } = {
  en: "/resume/sardor-djamolov-resume-en.pdf",
  ru: null,
};

export const navSections = [
  { id: "profile", key: "about" },
  { id: "experience", key: "experience" },
  { id: "work", key: "projects" },
  { id: "stack", key: "stack" },
  { id: "contact", key: "contact" },
] as const;
