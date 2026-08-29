/**
 * Generates the resume PDFs from exactly the same content as the website.
 *
 *   npm run resume
 *
 * There is no second copy of anything: the text comes from messages/*.json and
 * the ordering from lib/data/*.ts, so editing the site edits the resume. Run it
 * again after any content change and re-commit the PDFs.
 *
 * Rendering goes through a headless Chrome that is already on the machine —
 * no browser is downloaded and nothing is added to the dependency tree. Set
 * CHROME_PATH if yours lives somewhere unusual.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const { site, resume } = await import(pathToFileURL(join(root, "lib/data/site.ts")).href);
const { roles } = await import(pathToFileURL(join(root, "lib/data/experience.ts")).href);
const { stackGroups } = await import(pathToFileURL(join(root, "lib/data/stack.ts")).href);
const { osonUy, kidscity, otherProjects } = await import(
  pathToFileURL(join(root, "lib/data/projects.ts")).href
);

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (hit) return hit;
  console.error(
    "\n  Could not find Chrome. Install it, or point CHROME_PATH at a Chromium build:\n" +
      "    CHROME_PATH=/path/to/chrome npm run resume\n",
  );
  process.exit(1);
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Font files are read straight out of node_modules and inlined. */
function fontFace(family, file, weight) {
  const path = join(root, "node_modules/geist/dist/fonts", file);
  const data = readFileSync(path).toString("base64");
  return `@font-face{font-family:"${family}";font-weight:${weight};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${data}) format("woff2")}`;
}

const FONTS = [
  fontFace("GeistR", "geist-sans/Geist-Regular.woff2", 400),
  fontFace("GeistR", "geist-sans/Geist-Medium.woff2", 500),
  fontFace("GeistM", "geist-mono/GeistMono-Regular.woff2", 400),
  fontFace("GeistM", "geist-mono/GeistMono-Medium.woff2", 500),
].join("");

const CSS = `
${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:14mm 14mm 12mm}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"GeistR",system-ui,sans-serif;font-size:9.6pt;line-height:1.5;color:#14140f;letter-spacing:-.005em}
.meta{font-family:"GeistM",monospace;font-size:6.9pt;letter-spacing:.12em;text-transform:uppercase;color:#57574e}
h1{font-size:26pt;font-weight:500;letter-spacing:-.035em;line-height:1}
h1 .last{color:#3d3d36}
.role{font-size:10.5pt;letter-spacing:-.015em;color:#3d3d36;margin-top:5pt}
.contact{margin-top:9pt;font-family:"GeistM",monospace;font-size:8pt;color:#3d3d36;letter-spacing:-.01em}
.contact span+span::before{content:"·";margin:0 7pt;color:#8d8d84}
.rule{height:.6pt;background:#14140f;margin:12pt 0 0}
.hair{height:.4pt;background:rgba(20,20,15,.18)}
section{margin-top:13pt;break-inside:avoid}
.grid{display:grid;grid-template-columns:27mm 1fr;gap:0 6mm}
.entry{break-inside:avoid;padding-top:7pt}
.entry+.entry{border-top:.4pt solid rgba(20,20,15,.15);margin-top:7pt}
.co{font-size:11pt;font-weight:500;letter-spacing:-.022em}
.pos{font-weight:500;letter-spacing:-.012em;margin-top:2pt}
.note{color:#0f6b58;font-family:"GeistM",monospace;font-size:7pt;letter-spacing:.1em;text-transform:uppercase;margin-top:3pt}
.sum{color:#3d3d36;margin-top:3pt}
ul{list-style:none;margin-top:4pt;column-gap:7mm}
li{position:relative;padding-left:8pt;color:#3d3d36;font-size:9pt;line-height:1.45;break-inside:avoid}
li::before{content:"";position:absolute;left:0;top:.62em;width:4pt;height:.4pt;background:#8d8d84}
.two{columns:2}
.proj{break-inside:avoid;padding-top:7pt}
.proj+.proj{border-top:.4pt solid rgba(20,20,15,.15);margin-top:7pt}
.pt{font-weight:500;letter-spacing:-.015em}
.dom{font-family:"GeistM",monospace;font-size:7.6pt;color:#57574e;margin-left:6pt}
.stack{font-family:"GeistM",monospace;font-size:7.6pt;color:#57574e;margin-top:3pt}
.row{display:flex;gap:7mm;padding:3.5pt 0;border-top:.4pt solid rgba(20,20,15,.15)}
.row:first-child{border-top:0}
.row .k{width:27mm;flex:none}
.langs{display:grid;grid-template-columns:repeat(2,1fr);gap:0 7mm}
`;

function render(locale) {
  const m = JSON.parse(readFileSync(join(root, `messages/${locale}.json`), "utf8"));
  // The wordmark stays Latin on the site; the resume greets a Russian reader
  // in their own script, since that is the document they will read line by line.
  const name = locale === "ru" ? "Сардор Джамолов" : site.name;
  const [rf, rl] = name.split(" ");

  const contact = [
    site.email,
    site.githubHandle,
    site.telegramHandle,
    m.Hero.location,
  ].filter(Boolean);

  const experience = roles
    .map((r) => {
      const e = m.Experience.roles[r.id];
      const bullets = Array.isArray(e.bullets) ? e.bullets : [];
      return `<div class="entry">
        <div class="grid">
          <div>
            <div class="co">${esc(r.company)}</div>
            ${e.location ? `<div class="meta" style="margin-top:4pt">${esc(e.location)}</div>` : ""}
            ${r.period ? `<div class="meta" style="margin-top:2pt">${esc(r.period)}</div>` : ""}
          </div>
          <div>
            <div class="pos">${esc(e.role)}</div>
            ${e.note ? `<div class="note">${esc(e.note)}</div>` : ""}
            <div class="sum">${esc(e.summary)}</div>
            ${
              bullets.length
                ? `<ul class="two">${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                : ""
            }
          </div>
        </div>
      </div>`;
    })
    .join("");

  const feature = (proj, copy, extra) => `<div class="proj">
    <div class="grid">
      <div class="meta" style="padding-top:2pt">${esc(copy.subtitle ?? "")}</div>
      <div>
        <div><span class="pt">${esc(proj.name)}</span>${
          proj.domain ? `<span class="dom">${esc(proj.domain)}</span>` : ""
        }</div>
        <div class="sum">${esc(copy.description)}</div>
        ${extra ?? ""}
        <div class="stack">${proj.tech.join(" · ")}</div>
      </div>
    </div>
  </div>`;

  const metrics = m.Work["oson-uy"].metrics
    .map((x) => `${x.value} ${x.label.charAt(0).toLowerCase()}${x.label.slice(1)}`)
    .join(" · ");

  const others = otherProjects
    .map((p) => {
      const c = m.Work.more[p.slug];
      return `<div class="proj">
        <div class="grid">
          <div class="meta" style="padding-top:2pt">${esc(c.type)}</div>
          <div>
            <div><span class="pt">${esc(p.name)}</span>${
              p.domain ? `<span class="dom">${esc(p.domain)}</span>` : ""
            }</div>
            ${c.description ? `<div class="sum">${esc(c.description)}</div>` : ""}
            <div class="stack">${p.tech.join(" · ")}</div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  const stack = stackGroups
    .map(
      (g) => `<div class="row">
        <div class="k meta" style="padding-top:1.5pt">${esc(m.Stack.groups[g.id])}</div>
        <div>${g.items.join(" · ")}</div>
      </div>`,
    )
    .join("");

  const langs = m.Background.languages
    .map(
      (l) =>
        `<div class="row"><div class="k">${esc(l.name)}</div><div class="meta" style="padding-top:1.5pt">${esc(l.level)}</div></div>`,
    )
    .join("");

  const head = (label) =>
    `<div class="rule"></div><div class="meta" style="margin-top:6pt">${esc(label)}</div>`;

  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<title>${esc(name)} — ${esc(m.Hero.eyebrow)}</title><style>${CSS}</style></head><body>

<header>
  <div class="meta">${esc(m.Hero.eyebrow)}</div>
  <h1 style="margin-top:6pt">${esc(rf)} <span class="last">${esc(rl)}</span></h1>
  <div class="role">${esc(m.Hero.lead)}</div>
  <div class="contact">${contact.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
</header>

<section>${head(m.Profile.label)}
  <div style="margin-top:6pt;color:#3d3d36;max-width:155mm">${esc(m.Profile.body1)}</div>
  <div style="margin-top:4pt;color:#3d3d36;max-width:155mm">${esc(m.Profile.body2)}</div>
</section>

<section>${head(m.Experience.label)}${experience}</section>

<section>${head(m.Work.label)}
  ${feature(osonUy, m.Work["oson-uy"], `<div class="sum" style="margin-top:3pt">${esc(metrics)}</div>`)}
  ${feature(kidscity, m.Work.kidscity, "")}
  ${others}
</section>

<section>${head(m.Stack.label)}<div style="margin-top:6pt">${stack}</div></section>

<section>${head(m.Background.label)}
  <div class="grid" style="margin-top:6pt">
    <div class="meta" style="padding-top:2pt">${esc(m.Background.languagesTitle)}</div>
    <div>${langs}</div>
  </div>
  <div class="grid" style="margin-top:7pt">
    <div class="meta" style="padding-top:2pt">${esc(m.Background.educationTitle)}</div>
    <div class="sum" style="margin-top:0">${esc(m.Background.educationBody)}</div>
  </div>
</section>

</body></html>`;
}

const chrome = findChrome();
const outDir = join(root, "public/resume");
mkdirSync(outDir, { recursive: true });
const tmp = join(root, ".resume-tmp");
mkdirSync(tmp, { recursive: true });

const targets = [
  ["en", resume.en],
  ["ru", resume.ru],
].filter(([, out]) => Boolean(out));

for (const [locale, outPath] of targets) {
  const html = join(tmp, `${locale}.html`);
  writeFileSync(html, render(locale));
  const pdf = join(root, "public", outPath.replace(/^\//, ""));
  execFileSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdf}`,
      pathToFileURL(html).href,
    ],
    { stdio: "ignore" },
  );
  console.log(`  ✓ ${outPath}`);
}

// KEEP_HTML=1 leaves the intermediate markup behind, which is the quickest way
// to iterate on the layout in a normal browser.
if (!process.env.KEEP_HTML) rmSync(tmp, { recursive: true, force: true });
else console.log(`  html kept in ${tmp}`);
console.log(`\n  Rendered with ${chrome}\n`);
