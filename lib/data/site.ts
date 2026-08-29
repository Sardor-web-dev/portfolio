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
  telegram: "https://t.me/Djamolov_Sardor",
  telegramHandle: "@Djamolov_Sardor",
  /** Environmental portrait used in the profile section. */
  portrait: { src: "/portrait.webp", width: 1181, height: 1476 },
} as const;

/**
 * Both files are generated from this repo's own content by `npm run resume` —
 * see scripts/resume.mjs. English is the primary document; setting `ru` to null
 * removes the second download link and points every resume link at English.
 */
export const resume: { en: string; ru: string | null } = {
  en: "/resume/sardor-djamolov-resume-en.pdf",
  ru: "/resume/sardor-djamolov-resume-ru.pdf",
};

export const navSections = [
  { id: "profile", key: "about" },
  { id: "experience", key: "experience" },
  { id: "work", key: "projects" },
  { id: "stack", key: "stack" },
  { id: "contact", key: "contact" },
] as const;
