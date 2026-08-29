# Sardor Djamolov — portfolio

A bilingual (EN / RU) personal site for a full-stack engineer, built to be read
by hiring managers: two deep case studies, an honest experience section, and no
content that is not backed by something real.

```
npm install
npm run dev        # http://localhost:3000 → redirects to /en
npm run build && npm run start
npm run lint && npm run typecheck
```

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-intl · Motion · Lenis.

---

## Before this goes out

Three things need real files or real values. Everything else is finished.

1. **Resume PDFs** — drop them in `public/resume/` (see the README there).
   The English file is the primary download; the Russian one is optional and
   the second button only appears once `resume.ru` in `lib/data/site.ts` points
   at a file.
2. **Domain** — `site.url` in `lib/data/site.ts` is `https://sardordjamolov.com`.
   It feeds canonical URLs, `hreflang`, the sitemap, robots and the share card,
   so set it to the real host before deploying.
3. **Telegram** — `site.telegram` / `site.telegramHandle` are `null` because no
   handle was supplied. Fill both in and the Telegram row appears in Contact and
   in the footer automatically. Nothing here is invented.

Optional: real phone screenshots of the Oson Uy mobile app. `mobileShots` in
`lib/data/projects.ts` is empty on purpose — no mockups were faked. Add entries
and the device frames, gallery and captions appear on their own.

---

## Layout of the code

```
app/
  [locale]/layout.tsx   document shell, fonts, per-locale metadata
  [locale]/page.tsx     section order + Person JSON-LD
  globals.css           the whole design system: tokens, type scale, motion rules
  opengraph-image.tsx   1200×630 share card, drawn in the site's own type
  sitemap.ts robots.ts icon.svg
components/
  layout/    page rules, smooth scroll, footer
  nav/       header, mobile sheet, locale switch, locale transition
  hero/      hero + the idea→deployment diagram
  sections/  profile, experience, work, stack, process, numbers, background, contact
  work/      case studies, screenshot frames, architecture figure, project index
  motion/    reveal primitives, shared easing, MotionConfig provider
  ui/        Section, Action, Metric, StatementLines
i18n/        next-intl routing, request config, typed navigation
lib/data/    site, experience, stack, projects — structure only, never prose
messages/    en.json, ru.json — every visible string
public/
  projects/  screenshots, one folder per project
  resume/    PDFs go here
```

## Content model

Structure and prose are deliberately separate.

* `lib/data/*` holds facts and assets: slugs, URLs, image dimensions, tech lists,
  the order of things. No sentences.
* `messages/{en,ru}.json` holds every visible string, including project copy,
  captions and image alt text. Both files have the same 160-odd keys.

Lists whose length may change — responsibilities, features, "what I built",
process steps — are read with `t.raw()`, so a translator can add or remove a
line without touching a component.

**Adding a project to the index:** add a row to `otherProjects` in
`lib/data/projects.ts`, then a `Work.more.<slug>` entry with `type` (and
optionally `description`) in both message files. A row with no description
renders name, type and stack, which is the honest presentation when there is
nothing verified to say.

**Adding a role:** add it to `roles` in `lib/data/experience.ts` and a
`Experience.roles.<id>` block in both message files. Roles carry an optional
`period` — none are set, because no dates were supplied; add one and it renders
in the timeline rail.

## Internationalisation

`/en` and `/ru`, always prefixed, no automatic detection — an American reader
who lands on the root gets English. Locale switching uses
`router.replace(pathname, { locale })` so the reader keeps their scroll position,
and the page gets a short fade *only* when arriving from the switch, so a first
visit never pays for the transition (`components/nav/LocaleFade.tsx`).

The name stays in Latin in both locales: it is how it appears on GitHub, in the
email address and on the resume.

## Design system

Ink on warm paper, one accent, hairlines instead of shadows. Everything lives in
`app/globals.css`:

* **Colour** — `--color-ink*` for text, `--color-paper*` for surfaces,
  `--color-accent` (`#0f6b58`) for interaction and one emphasised line,
  `--color-rule*` for hairlines. Every text colour clears WCAG AA (4.5:1) on
  both the paper and the sunken band; anything lighter is a rule, never text.
* **Type** — `.t-display`, `.t-h2`, `.t-h3`, `.t-statement` (serif),
  `.t-lead`, `.t-body`, `.t-meta` (the mono label used for every piece of
  metadata on the site), `.t-mono`.
* **Layout** — the `shell` utility sets the content column; `PageRules` draws
  the two hairlines that run the height of the page along its edges. `Section`
  gives every section the same shape: a numbered label in the left margin,
  content in the columns beside it.

## Motion

One easing curve (`components/motion/config.ts`) for everything, so the page
reads as one system: reveals rise 18px and fade once on entry, screenshots
settle from 0.985 and drift a few percent against the scroll, the architecture
figure assembles in the order it is explained in, and the process rail fills
with the reader's own position. Lenis smooths the scroll itself.

**Reduced motion is handled in CSS, not JavaScript.** Every animated element
carries `.reveal`, and the `prefers-reduced-motion` block in `globals.css`
forces those elements to `opacity: 1; transform: none`. That is correct in the
first painted frame, needs no hydration, and cannot leave content stranded at
opacity 0 — which is exactly what happens if you branch on `useReducedMotion()`
during render. `MotionConfig reducedMotion="user"` stops the animation layer
from running transform animations at all.

Measured on the production build: CLS 0, FCP under 100 ms, LCP ~1.4 s (the hero
name is the LCP element and is masked until its reveal, which is the one place
the entrance animation costs anything).

## Deploying

Static apart from the locale middleware, so it drops onto Vercel unchanged.
Set `site.url` first. If you host somewhere else, keep the middleware — the
locale prefix depends on it.
