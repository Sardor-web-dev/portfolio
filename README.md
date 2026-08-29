# Sardor Djamolov — portfolio

A bilingual (EN / RU) personal site for a full-stack engineer, built to be read
by hiring managers: two deep case studies, an honest experience section, and no
content that is not backed by something real.

```
npm install
npm run dev        # http://localhost:3000 → redirects to /en
npm run build && npm run start
npm run lint && npm run typecheck
npm run resume     # regenerate both resume PDFs from this repo's content
```

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-intl · Motion · Lenis.

---

## Before this goes out

1. **Domain** — `site.url` in `lib/data/site.ts` is `https://sardordjamolov.com`.
   It feeds canonical URLs, `hreflang`, the sitemap, robots and the share card,
   so set it to the real host before deploying.
2. **Dates** — no role carries one, because none were recorded. A resume without
   dates is unusual; add `period` to a role in `lib/data/experience.ts` and it
   appears in the timeline *and* in the PDF. Then re-run `npm run resume`.

Optional: real phone screenshots of the Oson Uy mobile app. `mobileShots` in
`lib/data/projects.ts` is empty on purpose — no mockups were faked. Add entries
and the device frames, gallery and captions appear on their own.

## The resume PDFs

`npm run resume` writes `public/resume/*.pdf` from the same messages and data
the site renders, so the document and the page can never drift apart. Edit the
content, re-run it, re-commit the PDFs.

It prints through a headless Chrome that is already on the machine — no browser
download, nothing added to the dependency tree. Set `CHROME_PATH` if yours is
somewhere unusual, and `KEEP_HTML=1` to leave the intermediate markup in
`.resume-tmp/` for tweaking the layout in a normal browser.

Setting `resume.ru` to `null` in `lib/data/site.ts` drops the Russian document
and points every resume link at the English one.

## Sound

A few moments tick softly as they land: each line of the large serif statements,
and each word of the hero's opening line. The tone is synthesised with the Web
Audio API rather than loaded as a file — no bytes, no request, and the timbre is
tunable in `components/sound/SoundProvider.tsx`.

**It is off by default**, behind the equaliser control in the header, and the
choice is remembered per browser. That default is deliberate: this link gets
opened cold by people in open-plan offices, and a page that makes noise at a
stranger costs more than the effect earns. To ship it on instead, change the
initial `useState(false)` and the stored-value check in `SoundProvider`.

Turning it on plays three ticks straight away, which is both the confirmation
that it works and the reason the control does not look broken.

Two things make this reliable rather than theoretical:

- `tick` is referentially **stable** (the on/off flag lives in a ref). Scroll
  reveals schedule their ticks in timers created long before the visitor
  touches the toggle; if `tick` changed identity, every one of those callbacks
  would keep calling a stale, permanently-silent copy.
- On a return visit the preference comes back from storage with no user gesture
  behind it, and audio cannot start without one. The `AudioContext` is built up
  front — legal, it simply begins suspended — and resumed on the first pointer,
  key or touch event. Without that the toggle reads "on" and stays silent for
  the whole session.

Ticks are spread across the page — the numbered section labels, each layer of
the Oson Uy architecture as it assembles, the serif statements, the hero line —
so the effect is audible wherever the visitor happens to switch it on. Roughly
eighteen over a full read, rate-limited so a fast scroll cannot machine-gun.

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
components/sound/  the tick synth and its header control
scripts/     resume.mjs — renders the PDFs from the same content as the site
public/
  projects/  screenshots, one folder per project
  resume/    generated PDFs
  portrait.webp
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
`Experience.roles.<id>` block in both message files. `period`, `location` and
`bullets` are all optional — no dates are set because none were supplied, and
the Wepro teaching role carries only a title and a summary for the same reason.
Add any of the three to a role's message block and it renders on its own.

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
* **Motion vocabulary** — `Reveal`/`RevealGroup` for scroll entrances,
  `TypeLine` for word-by-word text, `Counter` for figures, `Shot` for framed
  images with parallax, `StatementLines` for the serif moments.
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
