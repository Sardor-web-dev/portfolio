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

A few moments knock softly as they land. The tone is synthesised with the Web
Audio API rather than loaded as a file — no bytes, no request, and every
parameter is tunable in `strike()` in `components/sound/SoundProvider.tsx`.

The character lives in three choices, and getting any of them wrong turns a
knock into a beep:

- a **plain sine** — harmonic content is what makes a tick sound shrill
- a **low fundamental** near 300 Hz
- a **downward glide** to 60% of it over 60 ms, which is what makes it land like
  a wooden ball settling rather than sound like a note

Envelope is a 3 ms attack and an 80 ms exponential fall, short enough that a run
reads as a rhythm rather than a chord. Measured on an `OfflineAudioContext`:
~288 Hz dominant, 0.28 peak, 77 ms audible.

Knocks are spread across the page — the numbered section labels, each layer of
the Oson Uy architecture as it assembles, the serif statements, and every typed
line — and rate-limited so overlapping reveals cannot burst. Measured over a
full read: 66 knocks, peak 9 a second, median gap 116 ms.

### On by default, and what that actually means

There is no control to turn sound off, and it is on for every visitor.

**No code can make it play the instant the page opens.** Browsers refuse audio
until the visitor has genuinely interacted, and a wheel-scroll does not count as
interaction in Chrome. The `AudioContext` is therefore constructed immediately —
legal, it simply begins suspended — and resumed on the first pointer, key or
touch event, so the first real interaction switches it on for the rest of the
visit. `wheel` and `scroll` are listened for as well: they will not grant
permission on their own, but they cost nothing and do work for a visitor the
browser already trusts with this origin.

In practice: on a phone, the first touch-scroll arms it. On a desktop, a visitor
who only ever spins the wheel and never clicks will hear nothing — that is the
browser's rule, not this code's.

Two consequences worth being deliberate about:

- **The hero line is silent on a first visit.** It finishes typing about a
  second and a half after load, before anyone has clicked. Every later reveal
  knocks normally.
- **A visitor cannot mute the page.** They can mute the browser tab, but the
  site offers nothing. To give them a control back, restore `SoundToggle` from
  version history and gate `tick` on its state.

## Deploying

Static apart from the locale middleware, so it drops onto Vercel unchanged.
Set `site.url` first. If you host somewhere else, keep the middleware — the
locale prefix depends on it.
