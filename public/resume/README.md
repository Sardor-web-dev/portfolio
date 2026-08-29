# Resume PDFs

**These are generated — don't edit them by hand.**

    npm run resume

The script (`scripts/resume.mjs`) renders both documents from `messages/*.json`
and `lib/data/*.ts`, the same content the website is built from, so the resume
and the page can never drift apart. Change the content, re-run it, re-commit
the PDFs.

- `sardor-djamolov-resume-en.pdf` — primary
- `sardor-djamolov-resume-ru.pdf` — set `resume.ru` to `null` in
  `lib/data/site.ts` to drop it and hide the second download button

To replace them with hand-made files instead, just overwrite them and stop
running the script; the buttons point at these paths either way.
