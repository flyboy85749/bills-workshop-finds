# Visual Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every guide page its own illustrated hero art and accent color, and make the home page read as twelve distinct destinations, using only code-drawn SVG.

**Architecture:** A registry module (`guides/art.js`) holds per-guide `accent`, `accentSoft`, `label`, `scene` and `badge`. The existing Vite `transformIndexHtml` plugin gains two markers, `data-guide-art` and `data-guide-badge`, that inject those strings at build time exactly the way `data-product-grid` injects product cards today. `scripts/verify-build.mjs` grows completeness checks so a future guide cannot ship art-less.

**Tech Stack:** Vanilla HTML + CSS, ES modules, Vite 7 (MPA mode), `html-validate` 11, Node's built-in test runner (`node:test`) for the registry unit tests, deployed on Vercel.

**Spec:** `docs/superpowers/specs/2026-08-26-visual-design-system-design.md`

## Global Constraints

- **No `<img>` elements and no binary image files.** All art is inline SVG. The one exception is `public/fonts/*.woff2`.
- **No new runtime dependencies.** `sharp`, `resvg-js` and any icon library are out of scope. Dev-only additions are acceptable but none is required by this plan.
- **`npm run verify` must pass at the end of every task.** It runs `html-validate *.html` across all fifteen source pages, then `node scripts/verify-build.mjs` against `dist/`.
- **Amazon Associates:** never introduce a product image sourced from Amazon. Product buttons keep `rel="sponsored nofollow noopener"` and the `tag=billsworkshop-20` query parameter.
- **Brand palette, exact values:** navy `#102a43`, navy-deep `#071b2d`, cream `#fbf6ed`, paper `#fffdf8`, sky `#dbeaf0`, teal `#2f6f73`, coral `#e46f55`, gold `#c99c54`, ink `#17324a`, muted `#617282`, line `#d9d9d0`.
- **Font budget: under 90KB combined.** Measured: Inter latin variable 48,256 B + Fraunces latin variable 36,620 B = 84,876 B. Fraunces must be requested **without** its `opsz` axis.
- **Accessibility:** decorative SVG carries `aria-hidden="true"` and `focusable="false"`; hero SVG carries `role="img"` plus `aria-label`. Any accent used for text meets 4.5:1 against its background. All motion is restricted to non-layout-affecting properties — `transform`, `box-shadow` and `opacity` — and sits inside the existing `prefers-reduced-motion` guard, which disables `transition` universally. Never transition a property that triggers reflow (`width`, `height`, `top`, `margin`, `padding`).
- **Extensionless internal links.** Pages are served without `.html`, so hrefs, canonicals and `public/sitemap.xml` use paths like `/cozy-fall-finds`.
- **Copy is American English.** Match the existing voice: plain, concrete, no marketing adjectives.
- **Keep each `<title>` on one line** — the `long-title` rule counts whitespace inside the element, so a wrapped title fails the 75-character limit even when its text is short.
- **Commit after every task.** Branch is `visual-design-system`.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `guides/art.js` | The art registry. Exports `guideArt` (per-guide, slug-keyed), `homeArt` (pegboard hero), `categoryArt` (six category icons). Data only — no rendering logic. |
| `guides/art-render.js` | Pure functions that wrap registry strings in their accessible container: `renderGuideScene(slug)`, `renderGuideBadge(slug)`. Kept apart from the data so the data file stays a flat, reviewable list of SVG. |
| `test/art.test.js` | Node test-runner unit tests for the registry and its renderers. |
| `public/fonts/inter-latin-var.woff2` | Inter latin variable subset, 48,256 B. |
| `public/fonts/fraunces-latin-var.woff2` | Fraunces latin variable subset, 36,620 B. |

**Modified:**

| File | Change |
|---|---|
| `vite.config.js` | Second and third injection markers plus an extended `closeBundle` guard. |
| `styles.css` | `@font-face` rules, grain, accent custom properties, hero/badge/pegboard layout, retune. |
| `scripts/verify-build.mjs` | `slug` field per guide; three completeness checks. |
| `package.json` | `test` script; `verify` gains the unit tests. |
| `index.html` | Pegboard hero, twelve badge markers, featured scene marker, category and values art, font preloads. |
| The twelve guide `*.html` files | Hero art marker, two-column hero, font preloads. |
| `about.html`, `affiliate-disclosure.html`, `privacy.html` | Font preloads only. |
| `README.md` | "Adding a guide" gains the art step. |

---

## Task 1: Self-host the fonts and fix the unloaded-`Inter` bug

This is first because it changes every page on the site and is independent of all art work. It is also the smallest change with the largest visible effect, so it de-risks the wave-1 review gate.

**Files:**
- Create: `public/fonts/inter-latin-var.woff2`, `public/fonts/fraunces-latin-var.woff2`
- Modify: `styles.css:27` (body font stack), `styles.css:118` (heading font stack), `styles.css:86`, `styles.css:238`, `styles.css:338` (the remaining Georgia references)
- Modify: all fifteen `*.html` files (preload links in `<head>`)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--font-body` and `--font-display`, both declared on `:root` in `styles.css`. Every later task uses these names rather than naming a family directly.

- [ ] **Step 1: Download the two font subsets**

The `User-Agent` matters: without a modern browser UA, Google Fonts serves legacy TTF instead of variable woff2. Note that Fraunces is requested **without** its `opsz` axis — including it costs 67,304 bytes instead of 36,620.

```bash
mkdir -p public/fonts
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"

fetch_latin () {  # $1 = css2 family spec, $2 = output path
  curl -sS -m 30 -A "$UA" "https://fonts.googleapis.com/css2?family=$1&display=swap" -o /tmp/font.css
  url=$(awk '/\/\* latin \*\//{f=1} f&&/src: url\(/{print; exit}' /tmp/font.css \
        | sed -E 's/.*url\(([^)]+)\).*/\1/')
  curl -sS -m 60 -A "$UA" "$url" -o "$2"
}

fetch_latin "Inter:wght@400..800"     public/fonts/inter-latin-var.woff2
fetch_latin "Fraunces:wght@600..800"  public/fonts/fraunces-latin-var.woff2
```

- [ ] **Step 2: Verify the downloads against the measured budget**

```bash
wc -c public/fonts/*.woff2
```

Expected, exactly:

```
 48256 public/fonts/inter-latin-var.woff2
 36620 public/fonts/fraunces-latin-var.woff2
 84876 total
```

If either number differs, the wrong axis range or the wrong UA was used — do not proceed. A file under 1,000 bytes means the URL extraction returned an error page.

Confirm both are really woff2 (each must print `wOF2`):

```bash
head -c 4 public/fonts/inter-latin-var.woff2; echo
head -c 4 public/fonts/fraunces-latin-var.woff2; echo
```

- [ ] **Step 3: Declare the faces in `styles.css`**

Insert at the very top of `styles.css`, above the existing `:root` block. `@font-face` must precede first use.

```css
@font-face {
  font-family: "Inter var";
  src: url("/fonts/inter-latin-var.woff2") format("woff2-variations");
  font-weight: 400 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Fraunces var";
  src: url("/fonts/fraunces-latin-var.woff2") format("woff2-variations");
  font-weight: 600 800;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 4: Add the two font custom properties**

Inside the existing `:root` block in `styles.css`, after `--radius: 24px;`, add:

```css
  --font-body: "Inter var", Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: "Fraunces var", Georgia, "Times New Roman", serif;
```

Georgia stays as the display fallback deliberately: if the woff2 fails to load, the site renders exactly as it does today rather than dropping to a default serif.

- [ ] **Step 5: Point every font reference at the custom properties**

Five edits in `styles.css`. Replace the whole declaration in each case:

| Line | Selector | Was | Becomes |
|---|---|---|---|
| 27 | `body` | `font-family: Inter, ui-sans-serif, …;` | `font-family: var(--font-body);` |
| 86 | `.brand-mark` | `font-family: Georgia, serif;` | `font-family: var(--font-display);` |
| 118 | `h1, h2, h3` | `font-family: Georgia, "Times New Roman", serif;` | `font-family: var(--font-display);` |
| 238 | `.featured-visual .number` | `font-family: Georgia, serif;` | `font-family: var(--font-display);` |
| 338 | `.product-number` | `font-family: Georgia, serif;` | `font-family: var(--font-display);` |

Leave `.board-card strong` (line 205) alone — `.travel-board` is deleted in Task 5, and touching it now creates a needless conflict.

- [ ] **Step 6: Normalize the three out-of-range weights**

Inter is declared `400 800`, so anything above 800 clamps silently. Make the stylesheet state what actually renders:

- `styles.css:110` — `.eyebrow` `font-weight: 900` → `font-weight: 800`
- `styles.css:154` — `.button` `font-weight: 850` → `font-weight: 800`
- `styles.css:210` — `.board-stamp` `font-weight: 900` → `font-weight: 800`

- [ ] **Step 7: Preload both faces in every page head**

In all fifteen `*.html` files, immediately **above** the existing `<link rel="stylesheet" href="/styles.css" />` line, insert:

```html
    <link
      rel="preload"
      href="/fonts/inter-latin-var.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="/fonts/fraunces-latin-var.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
```

`crossorigin` is required even for same-origin font preloads — without it the browser fetches the file twice.

The fifteen files: `index.html`, `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html`, `elementary-classroom-essentials.html`, `dog-lover-gifts.html`, `student-pilot-gifts.html`, `first-apartment-tools.html`, `holiday-gifts.html`, `retro-classroom-decor.html`, `pen-pal-starter-kit.html`, `adventure-travel-essentials.html`, `cozy-fall-finds.html`, `whimsical-kitchen-finds.html`, `about.html`, `affiliate-disclosure.html`, `privacy.html`.

That list is sixteen names because `index.html` plus twelve guides plus three static pages is sixteen — the site has sixteen pages, not fifteen. Verify with `ls *.html | wc -l`, which must print `16`, and treat every one of them.

- [ ] **Step 8: Confirm the preload count**

```bash
grep -c "rel=\"preload\"" *.html
```

Expected: every one of the sixteen files reports `2`.

- [ ] **Step 9: Build and verify**

```bash
npm run build && npm run verify
```

Expected: build succeeds; `verify-build OK: 12 guide(s), 167 cards, all anchor targets present`.

Then confirm the fonts were actually copied into the build — Vite copies `public/` verbatim:

```bash
ls -l dist/fonts/
```

Expected: both woff2 files, at their exact byte sizes.

- [ ] **Step 10: Look at it**

Run `npm run dev`, open the home page, and confirm in DevTools → Network that both woff2 files load with status 200 and that body text is no longer Segoe UI. This is the first moment the site has ever rendered its intended typography; check that headings in Fraunces have not broken any line wrapping in the hero or the featured-guide block.

- [ ] **Step 11: Commit**

```bash
git add public/fonts styles.css *.html
git commit -m "Self-host Inter and Fraunces, fixing the never-loaded body font

styles.css named Inter first in the body stack but no @font-face or font
link existed anywhere, so all body text rendered in the system UI
fallback. Adds both faces as latin variable woff2 subsets (84,876 bytes
total), preloaded on all sixteen pages, with Georgia and the system
stack retained as fallbacks. Fraunces is requested without its opsz
axis, which halves it from 67,304 to 36,620 bytes."
```

---

## Task 2: The art registry and its renderers, with two motifs

**Files:**
- Create: `guides/art.js`, `guides/art-render.js`, `test/art.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `guides/art.js` → `export const guideArt` — object keyed by guide slug; each value `{ accent: string, accentSoft: string, label: string, scene: string, badge: string }`. Also `export const homeArt: string` and `export const categoryArt: Record<string, string>` (both stubbed empty in this task, filled in Tasks 5 and 6).
  - `guides/art-render.js` → `export function renderGuideScene(slug: string): string` and `export function renderGuideBadge(slug: string): string`. Both throw `Error` on an unknown slug, matching how `renderProductGrid` throws.

- [ ] **Step 1: Write the failing tests**

Create `test/art.test.js`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { guideArt } from "../guides/art.js";
import { renderGuideScene, renderGuideBadge } from "../guides/art-render.js";
import { collections } from "../products.js";

const SLUG = "cozy-fall-finds";

test("every registry entry has the five required fields", () => {
  for (const [slug, art] of Object.entries(guideArt)) {
    for (const field of ["accent", "accentSoft", "label", "scene", "badge"]) {
      assert.ok(art[field], `${slug} is missing "${field}"`);
    }
  }
});

test("accents are six-digit hex", () => {
  for (const [slug, art] of Object.entries(guideArt)) {
    assert.match(art.accent, /^#[0-9a-f]{6}$/, `${slug}.accent`);
    assert.match(art.accentSoft, /^#[0-9a-f]{6}$/, `${slug}.accentSoft`);
  }
});

test("every registry key is a real guide", () => {
  for (const slug of Object.keys(guideArt)) {
    assert.ok(collections[slug], `"${slug}" has art but no product collection`);
  }
});

test("scene carries its accessible name and accent custom properties", () => {
  const html = renderGuideScene(SLUG);
  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="[^"]+"/);
  assert.ok(html.includes(guideArt[SLUG].accent), "accent not emitted");
  assert.ok(html.includes(guideArt[SLUG].accentSoft), "accentSoft not emitted");
});

test("badge is decorative, never labelled", () => {
  const html = renderGuideBadge(SLUG);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /focusable="false"/);
  assert.doesNotMatch(html, /role="img"/);
  assert.doesNotMatch(html, /aria-label=/);
});

test("labels are quote-safe, since they land in an HTML attribute", () => {
  for (const [slug, art] of Object.entries(guideArt)) {
    assert.doesNotMatch(art.label, /["<>&]/, `${slug}.label needs escaping`);
  }
});

test("an unknown slug throws rather than rendering nothing", () => {
  assert.throws(() => renderGuideScene("no-such-guide"), /no-such-guide/);
  assert.throws(() => renderGuideBadge("no-such-guide"), /no-such-guide/);
});
```

- [ ] **Step 2: Add the test script and run it to watch it fail**

In `package.json`, add to `"scripts"`:

```json
    "test": "node --test test/*.test.js",
```

and change `"verify"` to:

```json
    "verify": "npm run lint:html && npm test && node scripts/verify-build.mjs",
```

Run:

```bash
npm test
```

Expected: FAIL — `Cannot find module '.../guides/art.js'`.

- [ ] **Step 3: Write `guides/art.js` with two entries**

Both motifs use the shared substrate the spec defines: cream ground, a brass hairline frame on scenes only, dashed navy route line, flat 2px strokes, no gradients inside objects. `currentColor` is used wherever the accent should apply, so the wrapper's `color` drives it.

```js
// Per-guide illustration registry. Data only — rendering lives in art-render.js.
//
// Every scene is 800x500 (16:10) and every badge is 480x320 (3:2). Motifs share
// one substrate so twelve guides read as one site: cream ground, brass hairline
// frame, a dashed navy route line, flat 2px strokes, no gradients inside objects.
//
// `currentColor` resolves to the accent — art-render.js sets `color` on the
// wrapper — so a motif recolors without editing its path data.

const FRAME = `<rect x="1" y="1" width="798" height="498" rx="18" fill="#fbf6ed" stroke="#c99c54" stroke-width="2"/>`;

export const guideArt = {
  "cozy-fall-finds": {
    accent: "#b4552f",
    accentSoft: "#f6e7dc",
    label: "Falling leaves, a string of warm lights and a steaming mug",
    scene: `
      ${FRAME}
      <path d="M40 300 C 200 240, 320 360, 470 280 S 700 220, 760 260"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g stroke="#102a43" stroke-width="2" fill="none">
        <circle cx="130" cy="286" r="13" fill="currentColor"/>
        <circle cx="248" cy="316" r="13" fill="#c99c54"/>
        <circle cx="366" cy="300" r="13" fill="currentColor"/>
        <circle cx="484" cy="272" r="13" fill="#c99c54"/>
        <circle cx="602" cy="246" r="13" fill="currentColor"/>
      </g>
      <g transform="translate(150 120)">
        <path d="M0 60 C 0 20, 34 -8, 70 0 C 106 8, 118 48, 96 76
                 C 74 104, 26 100, 0 60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M4 62 L 96 22" stroke="#102a43" stroke-width="2" fill="none"/>
      </g>
      <g transform="translate(470 330)">
        <rect x="0" y="0" width="120" height="86" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <path d="M120 22 h 22 a 20 20 0 0 1 0 40 h -22"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <path d="M0 30 h 120" stroke="currentColor" stroke-width="8"/>
        <g stroke="#102a43" stroke-width="2" fill="none" opacity=".6">
          <path d="M34 -14 c 10 -12, -10 -20, 0 -32"/>
          <path d="M62 -14 c 10 -12, -10 -20, 0 -32"/>
          <path d="M90 -14 c 10 -12, -10 -20, 0 -32"/>
        </g>
      </g>`,
    badge: `
      <path d="M20 200 C 130 160, 220 240, 320 190 S 440 150, 462 172"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(74 74) scale(.8)">
        <path d="M0 60 C 0 20, 34 -8, 70 0 C 106 8, 118 48, 96 76
                 C 74 104, 26 100, 0 60 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2.5"/>
        <path d="M4 62 L 96 22" stroke="#102a43" stroke-width="2.5" fill="none"/>
      </g>
      <g transform="translate(280 176) scale(.82)">
        <rect x="0" y="0" width="120" height="86" rx="12"
              fill="#fffdf8" stroke="#102a43" stroke-width="2.5"/>
        <path d="M120 22 h 22 a 20 20 0 0 1 0 40 h -22"
              fill="none" stroke="#102a43" stroke-width="2.5"/>
        <path d="M0 30 h 120" stroke="currentColor" stroke-width="8"/>
      </g>`
  },

  "student-pilot-gifts": {
    accent: "#2f6f73",
    accentSoft: "#dde9ea",
    label: "A sectional chart wedge, a headset and a compass rose",
    scene: `
      ${FRAME}
      <path d="M60 420 C 220 380, 300 200, 460 170 S 700 140, 756 96"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="10 9" opacity=".45"/>
      <g transform="translate(96 96)">
        <path d="M0 0 h 250 l -40 210 h -250 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="2"/>
        <g stroke="currentColor" stroke-width="2" fill="none" opacity=".75">
          <path d="M16 44 h 214"/><path d="M8 92 h 214"/>
          <path d="M0 140 h 214"/><path d="M-8 188 h 214"/>
        </g>
        <circle cx="118" cy="104" r="30" fill="none"
                stroke="#102a43" stroke-width="2"/>
        <circle cx="118" cy="104" r="4" fill="currentColor"/>
      </g>
      <g transform="translate(470 210)">
        <path d="M0 90 V 44 a 66 66 0 0 1 132 0 V 90"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <rect x="-16" y="86" width="34" height="66" rx="16"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <rect x="114" y="86" width="34" height="66" rx="16"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M18 130 h -34 a 26 26 0 0 0 -26 26 v 20"
              fill="none" stroke="#102a43" stroke-width="2"/>
        <circle cx="-42" cy="182" r="6" fill="#c99c54"/>
      </g>
      <g transform="translate(640 372)">
        <circle r="42" fill="none" stroke="#c99c54" stroke-width="2"/>
        <path d="M0 -46 L 11 0 L 0 46 L -11 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="2"/>
        <path d="M-46 0 h 92" stroke="#102a43" stroke-width="2" opacity=".4"/>
      </g>`,
    badge: `
      <path d="M24 268 C 130 236, 180 120, 300 100 S 440 74, 460 52"
            fill="none" stroke="#102a43" stroke-width="2"
            stroke-dasharray="9 8" opacity=".45"/>
      <g transform="translate(44 56) scale(.62)">
        <path d="M0 0 h 250 l -40 210 h -250 Z"
              fill="#fffdf8" stroke="#102a43" stroke-width="3"/>
        <g stroke="currentColor" stroke-width="3" fill="none" opacity=".75">
          <path d="M16 44 h 214"/><path d="M8 92 h 214"/><path d="M0 140 h 214"/>
        </g>
        <circle cx="118" cy="104" r="30" fill="none"
                stroke="#102a43" stroke-width="3"/>
        <circle cx="118" cy="104" r="6" fill="currentColor"/>
      </g>
      <g transform="translate(322 150) scale(.66)">
        <circle r="42" fill="none" stroke="#c99c54" stroke-width="3"/>
        <path d="M0 -46 L 11 0 L 0 46 L -11 0 Z"
              fill="currentColor" stroke="#102a43" stroke-width="3"/>
        <path d="M-46 0 h 92" stroke="#102a43" stroke-width="3" opacity=".4"/>
      </g>`
  }
};

// Filled in Task 5.
export const homeArt = "";

// Filled in Task 6.
export const categoryArt = {};
```

- [ ] **Step 4: Write `guides/art-render.js`**

```js
import { guideArt } from "./art.js";

function lookup(slug) {
  const art = guideArt[slug];
  if (!art) {
    throw new Error(
      `art-render: unknown guide "${slug}". Registered keys: ${Object.keys(guideArt).join(", ")}.`
    );
  }
  return art;
}

// The hero. Named for screen readers, and the source of --accent for the page:
// CSS on .guide-art reads these custom properties and cascades them to the
// product-card badges, the TOC rule and the related callout.
export function renderGuideScene(slug) {
  const art = lookup(slug);
  return `<div class="guide-art" role="img" aria-label="${art.label}" style="--accent: ${art.accent}; --accent-soft: ${art.accentSoft}"><svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet">${art.scene}</svg></div>`;
}

// Home-page card art. Decorative: the card's own heading and link already name
// the guide, so labelling the art would make a screen reader say it twice.
export function renderGuideBadge(slug) {
  const art = lookup(slug);
  return `<div class="guide-badge" aria-hidden="true" style="--accent: ${art.accent}; --accent-soft: ${art.accentSoft}"><svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet">${art.badge}</svg></div>`;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
npm test
```

Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
git add guides/art.js guides/art-render.js test/art.test.js package.json
git commit -m "Add the guide art registry with the first two motifs

guides/art.js holds accent, accentSoft, label, scene and badge per guide;
art-render.js wraps them with the right accessibility semantics — scenes
labelled, badges hidden. Covers cozy-fall-finds and student-pilot-gifts,
one warm and one technical, to establish the shared substrate. Unit
tests run under node --test and join npm run verify."
```

---

## Task 3: Inject the art at build time

**Files:**
- Modify: `vite.config.js`

**Interfaces:**
- Consumes: `renderGuideScene(slug)`, `renderGuideBadge(slug)` from `guides/art-render.js`; `guideArt` from `guides/art.js`.
- Produces: two HTML markers usable by every later task — `<div data-guide-art="<slug>"></div>` and `<div data-guide-badge="<slug>"></div>`, each replaced in place at build time.

- [ ] **Step 1: Generalize the marker pattern**

Replace the `GRID_PATTERN` constant at the top of `vite.config.js` with a factory, since three markers now share one shape. Keep the lookbehind — it is what stops `data-x-data-product-grid="k"` being mistaken for the real marker.

```js
// The leading lookbehind guards against a prefixed attribute such as
// data-x-data-product-grid="k" being mistaken for the real marker.
const markerPattern = attribute =>
  new RegExp(`(<div[^>]*(?<![-\\w])${attribute}="([\\w-]+)"[^>]*>)(\\s*)(<\\/div>)`, "g");

const GRID_PATTERN = markerPattern("data-product-grid");
const SCENE_PATTERN = markerPattern("data-guide-art");
const BADGE_PATTERN = markerPattern("data-guide-badge");
```

- [ ] **Step 2: Import the renderers**

Extend the import block at the top of `vite.config.js`:

```js
import { defineConfig } from "vite";
import { collections, renderProductGrid } from "./products.js";
import { guideArt } from "./guides/art.js";
import { renderGuideScene, renderGuideBadge } from "./guides/art-render.js";
```

- [ ] **Step 3: Track scene and badge injections alongside grids**

Inside `prerenderProducts()`, replace the single `const injected = new Map();` with three counters, and clear all three in `buildStart`:

```js
  const injected = new Map();
  const scenes = new Map();
  const badges = new Map();

  const bump = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);
```

`buildStart` becomes:

```js
    buildStart() {
      injected.clear();
      scenes.clear();
      badges.clear();
    },
```

- [ ] **Step 4: Handle all three markers in the transform**

Replace the body of the `handler(html)` function with:

```js
      handler(html) {
        // No .test() guard: the patterns are global, so .test() would advance
        // lastIndex and desync the next page. .replace() is a no-op when
        // nothing matches, which is the same guard for free.
        return html
          .replace(GRID_PATTERN, (_m, open, key, _ws, close) => {
            bump(injected, key);
            return open + renderProductGrid(key) + close;
          })
          .replace(SCENE_PATTERN, (_m, open, key, _ws, close) => {
            bump(scenes, key);
            return open + renderGuideScene(key) + close;
          })
          .replace(BADGE_PATTERN, (_m, open, key, _ws, close) => {
            bump(badges, key);
            return open + renderGuideBadge(key) + close;
          });
      }
```

- [ ] **Step 5: Extend the completeness guard**

Replace the `closeBundle()` body. Scenes are checked "at least once" rather than "exactly once" because `elementary-classroom-essentials` legitimately renders twice — on its own page and inside the home page's featured block. Badges stay "exactly once": a guide card appearing twice on the home page would be a real bug.

```js
    closeBundle() {
      const problems = Object.keys(collections)
        .map(key => [key, injected.get(key) ?? 0])
        .filter(([, count]) => count !== 1)
        .map(([key, count]) =>
          count === 0
            ? `collection "${key}" was never injected — no page carries data-product-grid="${key}"`
            : `collection "${key}" was injected ${count} times, expected exactly 1`
        );

      for (const key of Object.keys(guideArt)) {
        if ((scenes.get(key) ?? 0) < 1) {
          problems.push(
            `art "${key}" has a scene that was never injected — no page carries data-guide-art="${key}"`
          );
        }
        const badgeCount = badges.get(key) ?? 0;
        if (badgeCount !== 1) {
          problems.push(
            badgeCount === 0
              ? `art "${key}" has a badge that was never injected — no page carries data-guide-badge="${key}"`
              : `art "${key}" was injected as a badge ${badgeCount} times, expected exactly 1`
          );
        }
      }

      if (problems.length > 0) {
        throw new Error(`prerender-products: ${problems.join("; ")}.`);
      }
    }
```

- [ ] **Step 6: Verify the guard actually fires**

The guard is the point of this task, so prove it fails before proving it passes. Nothing places the two markers yet, so a build must now fail:

```bash
npm run build
```

Expected: FAIL, with a message naming both slugs — `art "cozy-fall-finds" has a scene that was never injected …; art "cozy-fall-finds" has a badge that was never injected …` and the same pair for `student-pilot-gifts`.

If the build **succeeds**, the guard is not wired up; do not proceed.

- [ ] **Step 7: Place the two scene markers**

In `cozy-fall-finds.html`, inside `<header class="page-hero">`, wrap the existing content. Replace this opening:

```html
      <header class="page-hero">
        <div class="shell">
          <nav class="breadcrumb" aria-label="Breadcrumb">
```

with:

```html
      <header class="page-hero">
        <div class="shell page-hero-grid">
          <div class="page-hero-copy">
          <nav class="breadcrumb" aria-label="Breadcrumb">
```

**Reindent the wrapped content.** Everything that moves inside `.page-hero-copy` gains a nesting level, so its indentation must deepen by two spaces — the `<nav>`, `<p class="eyebrow">`, `<h1>`, `<p class="lede">` and `<div class="disclosure-note">` all move from 10 spaces to 12, along with their own children, and the wrapper's closing tag sits at 10. Leaving the content at its old depth is a visible formatting regression in a repo that is otherwise consistently indented.

and close it by replacing the `</div>\n      </header>` that ends the block with:

```html
          </div>
          <div data-guide-art="cozy-fall-finds"></div>
        </div>
      </header>
```

Apply the identical change to `student-pilot-gifts.html`, using `data-guide-art="student-pilot-gifts"`.

- [ ] **Step 8: Place the two badge markers**

On `index.html`, inside the `<article class="guide-card">` for each of the two guides, insert the marker **directly above the `<a class="button">`**, after the description paragraph:

```html
              </p>
              <div data-guide-badge="cozy-fall-finds"></div>
              <a class="button button-secondary" href="/cozy-fall-finds"
                >Read the guide <span aria-hidden="true">→</span></a
              >
```

and:

```html
              </p>
              <div data-guide-badge="student-pilot-gifts"></div>
              <a class="button button-secondary" href="/student-pilot-gifts"
                >Read the guide <span aria-hidden="true">→</span></a
              >
```

- [ ] **Step 9: Build and verify**

```bash
npm run build && npm run verify
```

Expected: build succeeds; `verify-build OK: 12 guide(s), 167 cards, all anchor targets present`.

Confirm real SVG landed rather than empty containers:

```bash
grep -c "<svg" dist/cozy-fall-finds.html dist/student-pilot-gifts.html dist/index.html
```

Expected: `1`, `1`, `2` respectively.

- [ ] **Step 10: Commit**

```bash
git add vite.config.js cozy-fall-finds.html student-pilot-gifts.html index.html
git commit -m "Inject guide art through the existing prerender plugin

Adds data-guide-art and data-guide-badge markers alongside
data-product-grid, sharing one marker-pattern factory. The closeBundle
guard now also fails the build on art that is defined but never placed.
Scenes are checked at-least-once because the featured block reuses one;
badges stay exactly-once."
```

---

## Task 4: Style the hero, the badge and the accent cascade

**Files:**
- Modify: `styles.css`, `cozy-fall-finds.html`, `student-pilot-gifts.html`

**Interfaces:**
- Consumes: `.guide-art` and `.guide-badge` containers with inline `--accent` / `--accent-soft`, from Task 2; `.page-hero-grid` and `.page-hero-copy` wrappers, from Task 3.
- Produces: the accent cascade. `--accent` defaults on `:root` and is overridden per page by the hero, so every later task styles against `var(--accent)` rather than a literal color.

- [ ] **Step 1: Add the accent defaults and the paper grain**

In `:root` in `styles.css`, after the two font properties added in Task 1:

```css
  --accent: var(--teal);
  --accent-soft: var(--sky);
  --grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)' opacity='.38'/%3E%3C/svg%3E");
```

Then give `body` the grain as a fixed overlay. Add after the existing `body` rule:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: var(--grain);
  opacity: .5;
  pointer-events: none;
}
```

`position: fixed` with `z-index: -1` keeps the texture from scrolling and from ever intercepting a click. It sits behind content but above the body background.

- [ ] **Step 2: Lay out the two-column guide hero**

Add after the existing `.page-hero .lede` rule:

```css
.page-hero-grid {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
}

.guide-art {
  color: var(--accent);
  border-radius: 26px 26px 26px 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  line-height: 0;
}

.guide-art svg { width: 100%; height: auto; display: block; }
```

`color: var(--accent)` is what makes `currentColor` inside the SVG resolve to the guide's accent.

- [ ] **Step 3: Set the accent on the two wave-1 guide pages' `<body>`**

The injected `.guide-art` carries `--accent` as an inline custom property, but the product cards are **siblings** of the hero, not descendants of it, so the property never reaches them from there. A custom property has to sit on a common ancestor, which means `<body>`.

In `cozy-fall-finds.html`:

```html
  <body style="--accent: #b4552f; --accent-soft: #f6e7dc">
```

In `student-pilot-gifts.html`:

```html
  <body style="--accent: #2f6f73; --accent-soft: #dde9ea">
```

Both pairs are that guide's own values from the registry written in Task 2 — they must match exactly, because Task 7's verifier asserts the accent string appears in the built page. `no-inline-style` is switched off in `.htmlvalidate.json`, so this passes lint.

The other ten guide pages get the same treatment in Task 7, Step 3.

- [ ] **Step 4: Cascade the accent to the rest of the guide page**

Now that `--accent` is on `<body>`, these rules can consume it:

```css
.product-number { background: var(--accent); }
.breadcrumb a { color: var(--accent); }
.toc strong { border-left: 3px solid var(--accent); padding-left: .55rem; }
.toc a:hover, .toc a:focus-visible { color: var(--accent); }
.related-callout { background: var(--accent-soft); }
```

Note the ordering constraint: `.product-number` currently sets `background: var(--teal)` inline in its own rule at `styles.css:338`. Delete `background: var(--teal);` from that rule rather than relying on source order.

- [ ] **Step 5: Style the home-page card badge**

```css
.guide-badge {
  color: var(--accent);
  margin: -1.7rem -1.7rem 1.2rem;
  background: var(--accent-soft);
  border-bottom: 1px solid rgba(16, 42, 67, .12);
  line-height: 0;
  overflow: hidden;
}

.guide-badge svg { width: 100%; height: auto; display: block; }

.guide-card { overflow: hidden; transition: transform .18s ease, box-shadow .18s ease; }
.guide-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.guide-card:hover .guide-badge svg { transform: scale(1.03); }
.guide-badge svg { transition: transform .3s ease; }
```

The negative margin equals `.guide-card`'s `1.7rem` padding, so the art runs edge to edge while the copy stays inset.

- [ ] **Step 6: Handle the breakpoints**

In the existing `@media (max-width: 860px)` block, add `.page-hero-grid` to the list of grids that collapse:

```css
  .hero-grid, .featured-guide, .guide-layout, .newsletter, .page-hero-grid { grid-template-columns: 1fr; }
```

Then, in the same block, make the art follow the copy so the headline stays first on a narrow screen:

```css
  .page-hero-copy { order: -1; }
```

- [ ] **Step 7: Build and look at both guide pages**

```bash
npm run build && npm run verify && npm run dev
```

Check in the browser at 1440px and at 390px:
- `/cozy-fall-finds` — hero art right of the copy on desktop, below it on mobile; product number badges are rust `#b4552f`, not teal; the related callout is the soft rust tint.
- `/student-pilot-gifts` — same layout; badges stay teal, because that guide's accent *is* teal.
- Home page — the two guide cards with art show it edge-to-edge above their copy, and lift on hover.
- Confirm the grain is visible but subtle, and that clicking through it works (it must not intercept pointer events).

- [ ] **Step 8: Commit**

```bash
git add styles.css cozy-fall-finds.html student-pilot-gifts.html
git commit -m "Style the guide hero art, card badges and accent cascade

Adds the paper grain overlay, the two-column guide hero that collapses
copy-first on mobile, and the --accent cascade that recolors product
number badges, breadcrumbs, the TOC rule and the related callout per
guide."
```

---

## Task 5: Replace the travel board with the pegboard hero

**Files:**
- Modify: `guides/art.js` (fill `homeArt`), `index.html`, `styles.css`, `vite.config.js`

**Interfaces:**
- Consumes: `homeArt` stub from Task 2; `markerPattern` factory from Task 3.
- Produces: a `data-home-art` marker and the `.home-art` class.

- [ ] **Step 1: Fill `homeArt` in `guides/art.js`**

Replace `export const homeArt = "";` with a navy pegboard carrying the six category motifs. It keeps the dashed-line and floating-card character of the block it replaces.

```js
// The home hero. A navy pegboard with one motif per category, replacing the
// travel board — the hero used to say "travel" while the site now spans dogs,
// teachers, kitchens and tools.
export const homeArt = `
  <rect width="800" height="560" rx="34" fill="#071b2d"/>
  <g fill="#dbeaf0" opacity=".13">
    ${Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 12 }, (_, col) =>
        `<circle cx="${64 + col * 62}" cy="${70 + row * 62}" r="4"/>`
      ).join("")
    ).join("")}
  </g>
  <path d="M70 300 C 240 232, 380 366, 540 292 S 740 236, 760 268"
        fill="none" stroke="#dbeaf0" stroke-width="2"
        stroke-dasharray="11 10" opacity=".38"/>

  <g transform="translate(78 92)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(30 26)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="14" y="22" width="58" height="42" rx="7" fill="#e46f55"/>
      <path d="M28 22 v -9 a 8 8 0 0 1 8 -8 h 14 a 8 8 0 0 1 8 8 v 9"/>
      <path d="M72 44 h 30" stroke-dasharray="6 5"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Travel</text>
  </g>

  <g transform="translate(288 66)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(44 30)" stroke="#102a43" stroke-width="2.5">
      <ellipse cx="18" cy="34" rx="15" ry="19" fill="#c99c54"/>
      <circle cx="4" cy="10" r="7.5" fill="#c99c54"/>
      <circle cx="24" cy="4" r="7.5" fill="#c99c54"/>
      <circle cx="44" cy="12" r="7.5" fill="#c99c54"/>
      <circle cx="52" cy="32" r="7.5" fill="#c99c54"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Dog lovers</text>
  </g>

  <g transform="translate(498 96)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(46 24)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="0" y="20" width="70" height="46" rx="6" fill="#2f6f73"/>
      <path d="M0 34 h 70"/>
      <path d="M35 20 v -10 m -14 0 h 28"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Gifts</text>
  </g>

  <g transform="translate(112 336)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(40 26)" stroke="#102a43" stroke-width="2.5" fill="none">
      <rect x="0" y="6" width="82" height="54" rx="5" fill="#102a43"/>
      <path d="M12 24 h 40 M12 38 h 26" stroke="#fbf6ed"/>
      <path d="M0 60 h 82" stroke="#c99c54" stroke-width="4"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Teachers</text>
  </g>

  <g transform="translate(322 362)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(50 22)" stroke="#102a43" stroke-width="2.5" fill="none">
      <path d="M34 4 l 9 22 h 23 l -19 16 7 24 -20 -14 -20 14 7 -24 -19 -16 h 23 Z"
            fill="#e46f55"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Seasonal</text>
  </g>

  <g transform="translate(532 332)">
    <rect width="168" height="118" rx="16" fill="#fbf6ed"/>
    <g transform="translate(44 28)" stroke="#102a43" stroke-width="2.5" fill="none">
      <path d="M6 50 L 44 12" stroke-width="8" stroke-linecap="round"/>
      <path d="M42 6 l 18 18 -10 10 -18 -18 Z" fill="#c99c54"/>
    </g>
    <text x="30" y="102" font-family="Georgia, serif" font-size="15"
          fill="#102a43">Workshop</text>
  </g>

  <text x="600" y="524" font-size="13" letter-spacing="3.4"
        fill="#dbeaf0" font-weight="700">CURATED BY BILL</text>`;
```

The `<text>` elements deliberately name families directly rather than using `var(--font-display)`: SVG text does not inherit the CSS custom property reliably across engines, and these six words are the only text inside any illustration on the site.

- [ ] **Step 2: Render and inject it**

In `guides/art-render.js`, add:

```js
import { guideArt, homeArt } from "./art.js";
```

(replacing the existing single-name import) and append:

```js
// The home hero. Decorative: the <h1> beside it already carries the message.
export function renderHomeArt() {
  return `<div class="home-art" aria-hidden="true"><svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet">${homeArt}</svg></div>`;
}
```

In `vite.config.js`, add the pattern, the import and the replace. The home art needs no completeness guard — a missing home hero is visible the instant anyone opens the site, unlike a missing guide motif eleven pages deep.

```js
const HOME_PATTERN = markerPattern("data-home-art");
```

Extend the import to `import { renderGuideScene, renderGuideBadge, renderHomeArt } from "./guides/art-render.js";` and add a fourth `.replace()` to the chain:

```js
          .replace(HOME_PATTERN, (_m, open, _key, _ws, close) =>
            open + renderHomeArt() + close
          )
```

- [ ] **Step 3: Swap the markup in `index.html`**

Delete the entire `<div class="travel-board" …>` element — from `<div\n            class="travel-board"` through its closing `</div>`, including the `.route-line`, `.plane`, all three `.board-card`s and the `.board-stamp`. Replace with:

```html
          <div data-home-art="home"></div>
```

- [ ] **Step 4: Swap the CSS**

In `styles.css`, delete these six now-dead rules: `.travel-board`, `.travel-board::before`, `.route-line`, `.plane`, `.board-card`, `.board-card strong`, `.board-card:nth-of-type(1)`, `.board-card:nth-of-type(2)`, `.board-card:nth-of-type(3)`, `.board-stamp`. Add:

```css
.home-art {
  border-radius: 40px 40px 40px 10px;
  box-shadow: var(--shadow);
  overflow: hidden;
  line-height: 0;
}

.home-art svg { width: 100%; height: auto; display: block; }
```

Also remove `.travel-board` from the two media-query blocks that resize it (`@media (max-width: 860px)` and `@media (max-width: 680px)`) — the SVG scales by aspect ratio, so the `min-height` overrides are dead weight.

- [ ] **Step 5: Confirm nothing references the deleted classes**

```bash
grep -rn "travel-board\|board-card\|board-stamp\|route-line\|class=\"plane\"" --include=*.html --include=*.css --include=*.js . --exclude-dir=node_modules --exclude-dir=dist
```

Expected: no output. Any hit is a dangling reference to fix.

- [ ] **Step 6: Build, verify, look**

```bash
npm run build && npm run verify && npm run dev
```

Check the home page at 1440px and 390px: the pegboard fills the hero's right column, all six cards are legible, the six labels have not overflowed their cards, and nothing overlaps at the mobile width.

- [ ] **Step 7: Commit**

```bash
git add guides/art.js guides/art-render.js vite.config.js index.html styles.css
git commit -m "Replace the travel board with a pegboard hero

The old hero illustration announced travel while the site now spans
dogs, teachers, kitchens and tools. The pegboard carries one motif per
category, keeping the dashed-route and floating-card character of the
block it replaces. Deletes ten now-dead CSS rules."
```

---

## Task 6: Draw the category icons and the values numerals

**Files:**
- Modify: `guides/art.js` (fill `categoryArt`), `guides/art-render.js`, `vite.config.js`, `index.html`, `styles.css`

**Interfaces:**
- Consumes: `categoryArt` stub from Task 2; `markerPattern` from Task 3.
- Produces: `renderCategoryIcon(name)` and a `data-category-icon` marker. Valid names, exactly: `travel`, `dogs`, `gifts`, `teachers`, `seasonal`, `workshop`.

- [ ] **Step 1: Fill `categoryArt`**

Replace `export const categoryArt = {};`. Each icon is drawn on a 64×64 grid and inherits `currentColor` so the CSS sets its color per card.

```js
// Category icons, replacing the six emoji on the home page. 64x64, drawn with
// currentColor so each card supplies its own hue.
export const categoryArt = {
  travel: `<rect x="12" y="22" width="40" height="30" rx="6" fill="currentColor" opacity=".18"/><rect x="12" y="22" width="40" height="30" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 22v-6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 30v14" stroke="currentColor" stroke-width="3"/>`,
  dogs: `<ellipse cx="32" cy="42" rx="12" ry="15" fill="currentColor" opacity=".22"/><ellipse cx="32" cy="42" rx="12" ry="15" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="17" cy="21" r="6" fill="currentColor"/><circle cx="28" cy="14" r="6" fill="currentColor"/><circle cx="42" cy="17" r="6" fill="currentColor"/><circle cx="50" cy="29" r="6" fill="currentColor"/>`,
  gifts: `<rect x="12" y="26" width="40" height="28" rx="5" fill="currentColor" opacity=".18"/><rect x="12" y="26" width="40" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 36h40M32 26v28" stroke="currentColor" stroke-width="3"/><path d="M32 26c-8 0-12-4-12-8s8-4 12 8c4-12 12-12 12-8s-4 8-12 8z" fill="none" stroke="currentColor" stroke-width="3"/>`,
  teachers: `<rect x="10" y="14" width="44" height="30" rx="4" fill="currentColor" opacity=".2"/><rect x="10" y="14" width="44" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M19 26h20M19 34h13" stroke="currentColor" stroke-width="3"/><path d="M8 50h48" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  seasonal: `<path d="M32 10l6 15h16l-13 11 5 16-14-10-14 10 5-16-13-11h16z" fill="currentColor" opacity=".22"/><path d="M32 10l6 15h16l-13 11 5 16-14-10-14 10 5-16-13-11h16z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`,
  workshop: `<path d="M14 50l24-24" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path d="M36 20l10 10-6 6-10-10z" fill="currentColor" opacity=".25"/><path d="M36 20l10 10-6 6-10-10z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="48" cy="18" r="6" fill="none" stroke="currentColor" stroke-width="3"/>`
};
```

- [ ] **Step 2: Add the renderer**

Extend the import in `guides/art-render.js` to `import { guideArt, homeArt, categoryArt } from "./art.js";`, then append:

```js
// Category icons. Decorative — each sits above an <h3> that names its category.
export function renderCategoryIcon(name) {
  const icon = categoryArt[name];
  if (!icon) {
    throw new Error(
      `art-render: unknown category "${name}". Registered: ${Object.keys(categoryArt).join(", ")}.`
    );
  }
  return `<svg class="category-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${icon}</svg>`;
}
```

- [ ] **Step 3: Wire the marker**

In `vite.config.js`: add `const ICON_PATTERN = markerPattern("data-category-icon");`, extend the renderer import with `renderCategoryIcon`, and add a fifth `.replace()`:

```js
          .replace(ICON_PATTERN, (_m, open, key, _ws, close) =>
            open + renderCategoryIcon(key) + close
          )
```

- [ ] **Step 4: Add a test for the new renderer**

Append to `test/art.test.js`:

```js
import { renderCategoryIcon } from "../guides/art-render.js";
import { categoryArt } from "../guides/art.js";

test("all six category icons render as hidden decorative SVG", () => {
  const names = ["travel", "dogs", "gifts", "teachers", "seasonal", "workshop"];
  assert.deepEqual(Object.keys(categoryArt).sort(), [...names].sort());
  for (const name of names) {
    const svg = renderCategoryIcon(name);
    assert.match(svg, /aria-hidden="true"/, name);
    assert.match(svg, /viewBox="0 0 64 64"/, name);
  }
});

test("an unknown category throws", () => {
  assert.throws(() => renderCategoryIcon("nope"), /nope/);
});
```

Move the two new `import` statements to the top of the file beside the existing ones — ES modules hoist imports, so leaving them mid-file works but reads badly.

Run `npm test`. Expected: PASS, 9 tests.

- [ ] **Step 5: Swap the six emoji in `index.html`**

In each `.category-card`, replace the emoji div with a marker. The six, in the order they appear:

| Current | Replacement |
|---|---|
| `<div class="icon" aria-hidden="true">✈️</div>` | `<div class="icon" data-category-icon="travel"></div>` |
| `<div class="icon" aria-hidden="true">🐾</div>` | `<div class="icon" data-category-icon="dogs"></div>` |
| `<div class="icon" aria-hidden="true">🎁</div>` | `<div class="icon" data-category-icon="gifts"></div>` |
| `<div class="icon" aria-hidden="true">🧪</div>` | `<div class="icon" data-category-icon="teachers"></div>` |
| `<div class="icon" aria-hidden="true">❄️</div>` | `<div class="icon" data-category-icon="seasonal"></div>` |
| `<div class="icon" aria-hidden="true">🧰</div>` | `<div class="icon" data-category-icon="workshop"></div>` |

Note the teachers card currently uses 🧪, a flask — the drawn icon is a chalkboard, which fits the copy ("classroom helpers") considerably better.

- [ ] **Step 6: Replace the values numerals**

The three `.value-card` icons use Unicode circled digits (`①②③`), which render inconsistently across platforms and are announced unpredictably by screen readers. Replace each `<div class="icon" aria-hidden="true">①</div>` (and ② and ③) with:

```html
              <div class="value-number" aria-hidden="true">1</div>
```

using `2` and `3` for the other two.

- [ ] **Step 7: Style both**

In `styles.css`, replace the existing rule
`.category-card .icon, .value-card .icon { font-size: 1.8rem; margin-bottom: 1rem; }`
with:

```css
.category-card .icon { margin-bottom: 1rem; line-height: 0; }
.category-icon { width: 46px; height: 46px; display: block; }

.category-card:nth-of-type(1) .icon { color: var(--navy); }
.category-card:nth-of-type(2) .icon { color: var(--gold); }
.category-card:nth-of-type(3) .icon { color: var(--coral); }
.category-card:nth-of-type(4) .icon { color: var(--teal); }
.category-card:nth-of-type(5) .icon { color: #7b5ea7; }
.category-card:nth-of-type(6) .icon { color: #b4552f; }

.value-number {
  display: inline-grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 1rem;
  border-radius: 50%;
  color: var(--navy);
  background: rgba(201, 156, 84, .28);
  border: 2px solid var(--gold);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
}
```

- [ ] **Step 8: Build, verify, look**

```bash
npm run build && npm run verify && npm run dev
```

On the home page confirm: six drawn icons in six different colors, no emoji anywhere in the categories grid, and three gold-ringed numerals in the values grid. Check that `#7b5ea7` and `#b4552f` both read clearly on the near-white `.category-card` background.

- [ ] **Step 9: Commit**

```bash
git add guides/art.js guides/art-render.js vite.config.js test/art.test.js index.html styles.css
git commit -m "Draw the category icons and values numerals

Replaces six emoji, which render differently on every platform, with
drawn SVG in six brand colors, and the Unicode circled digits with
gold-ringed numerals. The teachers icon becomes a chalkboard rather
than the flask that was standing in for it."
```

---

## Task 7: The remaining ten motifs

This is the largest task by volume and the most mechanical. Every entry follows the shape established in Task 2 — same `FRAME` constant on scenes, same 800×500 and 480×320 viewBoxes, same flat 2px strokes, same `currentColor` accent convention.

**Badges carry no frame.** Scenes keep the brass `FRAME` because they sit alone on a guide page. Badges do not, because they sit edge-to-edge inside a `.guide-card` that already has its own rounded border — a frame inside a frame reads as boxy. Do not reintroduce a `BADGE_FRAME`.

**Files:**
- Modify: `guides/art.js`, `index.html`, the ten remaining guide `*.html` files, `scripts/verify-build.mjs`

**Interfaces:**
- Consumes: `guideArt` shape and the `FRAME` constant from Task 2 (scenes only — badges are unframed); markers from Task 3; `.page-hero-grid` styling from Task 4.
- Produces: a complete registry — `Object.keys(guideArt)` equals `Object.keys(collections)`.

- [ ] **Step 1: Add the ten entries**

Accents, all drawn by rotation within the existing navy/teal/coral/gold family so no new hue enters the brand. Each must be a six-digit lowercase hex to satisfy the Task 2 test.

| Slug | `accent` | `accentSoft` | Motif |
|---|---|---|---|
| `travel-essentials` | `#1f5f8b` | `#dde8f0` | Rolling bag, luggage tag, dashed route arc |
| `flight-attendant-dog-gifts` | `#7b5ea7` | `#e8e2f1` | Dog at a window, wing pin |
| `elementary-classroom-essentials` | `#2f6f73` | `#dde9ea` | Rolling cart, pencil cup, name tag |
| `dog-lover-gifts` | `#c9752f` | `#f7e6d6` | Three paw prints, bowl, leash loop |
| `first-apartment-tools` | `#4a6572` | `#e2e8eb` | Screwdriver, level bubble, hex keys |
| `holiday-gifts` | `#a63d40` | `#f4dedf` | Stacked boxes, ribbon, gift tag |
| `retro-classroom-decor` | `#c99c54` | `#f6ecda` | Chalkboard, pennant bunting, apple |
| `pen-pal-starter-kit` | `#3f5f8f` | `#e0e6f0` | Envelope, fountain nib, wax seal |
| `adventure-travel-essentials` | `#3d7a5c` | `#dcebe3` | Dry bag, ridge line, filtered bottle |
| `whimsical-kitchen-finds` | `#b8536b` | `#f6e0e6` | Mushroom grinder, nesting cups, wind-up timer |

`elementary-classroom-essentials` keeps teal, the site's current product-badge color, because it is the featured guide and its art also fills the home page's `.featured-visual`.

Two accents need a contrast note. `#c99c54` (retro classroom) is the brand gold and measures roughly 2.3:1 on cream — it is used for **art fills and borders only** on that page, and `.product-number` there must fall back to navy text on gold rather than white. Add to `styles.css`:

```css
/* Brand gold is too light for white text. The one guide that uses it as its
   accent gets navy numerals instead. */
body[style*="#c99c54"] .product-number { color: var(--navy); }
```

Draw each motif against the substrate. Verify every entry parses by running `npm test` after each addition rather than all ten at once — a malformed template literal is far easier to locate one entry at a time.

- [ ] **Step 2: Place ten scene markers**

Apply the Task 3, Step 7 hero transformation to each of the ten remaining guide pages, using that page's own slug in `data-guide-art`. **Reindent the wrapped content by two spaces**, as that step requires — the content moving inside `.page-hero-copy` gains a nesting level. The file-to-slug map, which is **not** derivable from the filename in the first case:

| File | Slug |
|---|---|
| `flight-attendant-travel-essentials.html` | `travel-essentials` |
| `flight-attendant-dog-gifts.html` | `flight-attendant-dog-gifts` |
| `elementary-classroom-essentials.html` | `elementary-classroom-essentials` |
| `dog-lover-gifts.html` | `dog-lover-gifts` |
| `first-apartment-tools.html` | `first-apartment-tools` |
| `holiday-gifts.html` | `holiday-gifts` |
| `retro-classroom-decor.html` | `retro-classroom-decor` |
| `pen-pal-starter-kit.html` | `pen-pal-starter-kit` |
| `adventure-travel-essentials.html` | `adventure-travel-essentials` |
| `whimsical-kitchen-finds.html` | `whimsical-kitchen-finds` |

- [ ] **Step 3: Set the accent on the remaining ten guide pages' body**

Task 4 established that the accent must live on a common ancestor of both the hero and the product grid, and already did this for `cozy-fall-finds` and `student-pilot-gifts`. Add to the `<body>` tag of the **ten other** guide pages:

```html
  <body style="--accent: #b4552f; --accent-soft: #f6e7dc">
```

using that guide's own two values from the table above. `no-inline-style` is switched off in `.htmlvalidate.json`, so this passes lint.

- [ ] **Step 4: Place ten badge markers**

Add `<div data-guide-badge="<slug>"></div>` to each remaining `.guide-card` in `index.html`, placed **directly above that card's `<a class="button">`**, after its description paragraph — matching Task 3, Step 8. All twelve cards must end up with exactly one, in that same slot.

- [ ] **Step 5: Swap the featured visual**

In `index.html`, inside `<div class="featured-visual">`, keep `<span class="number">15</span>` and the two following elements, and add the scene behind them:

```html
            <div class="featured-visual">
              <div data-guide-art="elementary-classroom-essentials"></div>
              <span class="number">15</span>
```

In `styles.css`, delete the `repeating-linear-gradient(...)` layer from the `.featured-visual` background, keeping the `linear-gradient` scrim so the white text stays legible over the art, and add:

```css
.featured-visual { position: relative; }
.featured-visual .guide-art {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 0;
  box-shadow: none;
}
.featured-visual .guide-art svg { height: 100%; object-fit: cover; }
```

- [ ] **Step 6: Add `slug` to every entry in `scripts/verify-build.mjs`**

Each of the twelve `GUIDES` entries gains a `slug` field. This is required because the slug is not derivable from the filename — `dist/flight-attendant-travel-essentials.html` maps to `travel-essentials`. Use the table from Step 2.

```js
  {
    file: "dist/flight-attendant-travel-essentials.html",
    slug: "travel-essentials",
    cards: 15,
    …
  },
```

- [ ] **Step 7: Add the three completeness checks**

In `scripts/verify-build.mjs`, extend the import:

```js
import { collections } from "../products.js";
import { guideArt } from "../guides/art.js";
```

Replace the existing length-only guard with set equality — it catches strictly more, including a rename that keeps the count the same:

```js
const collectionKeys = Object.keys(collections).sort();
const artKeys = Object.keys(guideArt).sort();
const guideSlugs = GUIDES.map(g => g.slug).sort();

if (collectionKeys.join() !== artKeys.join()) {
  console.error(
    `verify-build FAILED:\n  - guideArt and collections disagree.\n    collections: ${collectionKeys.join(", ")}\n    guideArt:    ${artKeys.join(", ")}`
  );
  process.exit(1);
}

if (collectionKeys.join() !== guideSlugs.join()) {
  console.error(
    `verify-build FAILED:\n  - GUIDES slugs and collections disagree.\n    collections: ${collectionKeys.join(", ")}\n    GUIDES:      ${guideSlugs.join(", ")}`
  );
  process.exit(1);
}
```

Then, inside the existing `for (const guide of GUIDES)` loop, after the `guide.contains` check, add the per-guide art assertions:

```js
  const art = guideArt[guide.slug];
  if (!html.includes(`aria-label="${art.label}"`)) {
    fail(`hero art is missing its aria-label "${art.label}"`);
  }
  if (!html.includes(art.accent)) {
    fail(`accent ${art.accent} never appears — the body style or hero art is missing`);
  }
  if (count('class="guide-art"') !== 1) {
    fail(`expected exactly 1 hero art container, found ${count('class="guide-art"')}`);
  }
```

Finally, after the loop and before the `failures.length` check, add the home-page assertion:

```js
const home = readFileSync("dist/index.html", "utf8");
const badges = home.split('class="guide-badge"').length - 1;
if (badges !== GUIDES.length) {
  failures.push(
    `dist/index.html: expected ${GUIDES.length} guide card badges, found ${badges}`
  );
}
```

- [ ] **Step 8: Prove the new checks fail before proving they pass**

Temporarily comment out one entry in `guideArt`, run `npm run verify`, and confirm it fails with the `guideArt and collections disagree` message naming that slug. Restore the entry. A check that has never been seen failing has not been tested.

- [ ] **Step 9: Build, verify, look**

```bash
npm run build && npm run verify
```

Expected: `verify-build OK: 12 guide(s), 167 cards, all anchor targets present`.

```bash
grep -c "class=\"guide-badge\"" dist/index.html   # expect 12
grep -c "class=\"guide-art\""   dist/index.html   # expect 1 (the featured block)
```

Then open all twelve guide pages in the browser and confirm each shows its own motif and accent, and that the home page's twelve cards are visually distinct from one another.

- [ ] **Step 10: Commit**

```bash
git add guides/art.js index.html *.html scripts/verify-build.mjs styles.css
git commit -m "Complete the art registry with the remaining ten motifs

Every guide now carries its own motif and accent, and the home page
shows twelve distinct cards. verify-build gains set-equality checks
between collections, guideArt and its own GUIDES table, so a future
guide cannot ship without art, and per-guide assertions that the hero
label and accent actually reached the built page."
```

---

## Task 8: The retune pass

**Files:**
- Modify: `styles.css`, `index.html`

**Interfaces:**
- Consumes: everything from Tasks 1–7.
- Produces: no new interfaces. Presentation only.

- [ ] **Step 1: Soften the section boundaries**

Replace the hairline `border-block` on `.section-soft` with a torn-paper arc. In `styles.css`, change:

```css
.section-soft { background: rgba(219, 234, 240, .42); border-block: 1px solid rgba(16, 42, 67, .08); }
```

to:

```css
.section-soft {
  position: relative;
  background: rgba(219, 234, 240, .42);
}

.section-soft::before,
.section-soft::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 26px;
  background: inherit;
}

.section-soft::before { top: -25px; border-radius: 50% 50% 0 0 / 100% 100% 0 0; }
.section-soft::after { bottom: -25px; border-radius: 0 0 50% 50% / 0 0 100% 100%; }
```

- [ ] **Step 2: Warm the card treatments**

```css
.guide-card, .category-card, .value-card {
  border-color: rgba(201, 156, 84, .3);
  background: var(--paper);
  box-shadow: 0 2px 0 rgba(16, 42, 67, .04);
}

.category-card, .value-card {
  transition: transform .18s ease, box-shadow .18s ease;
}

.category-card:hover, .value-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(16, 42, 67, .1);
}

.product-card { transition: transform .18s ease, box-shadow .18s ease; }
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(16, 42, 67, .1);
}
```

- [ ] **Step 3: Add the related-callout watermark**

```css
.related-callout {
  position: relative;
  overflow: hidden;
}

.related-callout::after {
  content: "";
  position: absolute;
  right: -40px;
  bottom: -50px;
  width: 220px;
  height: 220px;
  border: 3px dashed var(--accent);
  border-radius: 50%;
  opacity: .16;
  pointer-events: none;
}
```

- [ ] **Step 4: Tighten the mobile rhythm**

In the `@media (max-width: 680px)` block:

```css
  .section { padding: 3rem 0; }
  .page-hero { padding: 2.5rem 0 1.5rem; }
  .guide-badge { margin: -1.7rem -1.7rem 1rem; }
  .product-grid { gap: .9rem; }
```

- [ ] **Step 5: Audit contrast on every accent**

For each of the twelve accents, confirm in DevTools that:
- White text on the accent (`.product-number`) meets 4.5:1, **or** the gold override from Task 7 applies.
- `.breadcrumb a` in the accent meets 4.5:1 against the cream page background.

Record any accent that fails and darken it until it passes. Do not ship a failing accent — adjust the hex in `guideArt` and rerun `npm run verify`, which asserts the accent value appears in the built page and will catch a stale copy left in a `<body>` style attribute.

- [ ] **Step 6: Check reduced motion actually holds**

In DevTools → Rendering, set `prefers-reduced-motion: reduce` and confirm every hover lift added in Steps 2 and 4 stops animating. The existing guard at the bottom of `styles.css` disables `transition` globally, so this should pass — verify rather than assume.

- [ ] **Step 7: Full check across the site**

```bash
npm run build && npm run verify
```

Then walk all sixteen pages at 1440px, 860px and 390px. The three static pages (`about`, `affiliate-disclosure`, `privacy`) must show the new typography and grain but no motif.

- [ ] **Step 8: Commit**

```bash
git add styles.css index.html
git commit -m "Retune cards, section edges and mobile rhythm

Torn-paper arcs replace the hairline section borders, cards get warmer
gold-tinted borders and a hover lift, and the related callout picks up
an accent watermark. Includes the contrast audit across all twelve
accents."
```

---

## Task 9: Document the new step and hand off

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: everything.
- Produces: nothing.

- [ ] **Step 1: Extend "Adding a guide"**

In `README.md`, in the "Adding a guide" section, after the sentence ending `...a half-wired guide cannot ship.`, add:

```markdown
Guide art lives in `guides/art.js` as a `guideArt` entry: `accent` and `accentSoft`
(six-digit lowercase hex), `label` (the hero's accessible name — no quotes, angle
brackets or ampersands, since it lands in an HTML attribute), `scene` (800×500) and
`badge` (480×320). Mark the guide's hero with `data-guide-art="<slug>"`, put
`data-guide-badge="<slug>"` as the first child of its home-page card, and set
`style="--accent: …; --accent-soft: …"` on the page's `<body>`.

Three checks make a half-arted guide impossible to ship: the Vite plugin fails the
build if a registry key is never injected, and `verify-build.mjs` fails if
`collections`, `guideArt` and its own `GUIDES` table do not name exactly the same
slugs. A new guide therefore has to be added in all three places or none.

Motifs share one substrate — cream ground, a brass hairline frame on scenes only, dashed navy route
line, flat 2px strokes, no gradients inside objects — and use `currentColor` for
anything that should pick up the accent.
```

- [ ] **Step 2: Note the test script**

In the "Checks" section, after the `npm run verify` block, add:

```markdown
`verify` runs `html-validate` over every page, then the `node --test` unit tests in
`test/`, then the built-output checks in `scripts/verify-build.mjs`. Run
`npm test` alone to check the art registry without a build.
```

- [ ] **Step 3: Final full verification**

```bash
npm run build && npm run verify
```

Expected: html-validate clean across sixteen pages; 9 unit tests passing; `verify-build OK: 12 guide(s), 167 cards, all anchor targets present`.

- [ ] **Step 4: Confirm the font budget held**

```bash
du -ch dist/fonts/*.woff2 | tail -1
```

Expected: under 90KB — the measured figure is 84,876 bytes.

- [ ] **Step 5: Commit and push**

```bash
git add README.md
git commit -m "Document the art registry step for adding a guide"
git push -u origin visual-design-system
```

Stop after pushing. Per project convention, the pull request is opened by the repository owner, not by the agent.

---

## Self-Review

**Spec coverage.** Every spec section maps to a task: the registry and its two non-guide exports → Task 2; injection and the looser scene guard → Task 3; the accent cascade and hero layout → Task 4; the pegboard replacing `.travel-board` → Task 5; category icons and values numerals → Task 6; the ten remaining motifs, registry parity and the per-guide/home assertions → Task 7; section dividers, card treatments, mobile rhythm and the contrast audit → Task 8; the README step → Task 9. The typography section, including the measured font budget and the 850/900 weight normalization, is Task 1. Non-goals stay out: no `og:image` task, no rasterizer dependency, no `<img>`, no home-card registry refactor.

**Placeholder scan.** No "TBD", no "add error handling", no "similar to Task N" — the hero transformation is spelled out in Task 3 and re-pointed at by file-and-slug table in Task 7 rather than by cross-reference alone. Every code step carries the actual code.

**Type consistency.** `renderGuideScene` / `renderGuideBadge` / `renderHomeArt` / `renderCategoryIcon` keep those exact names from definition through `vite.config.js` and the tests. `guideArt` / `homeArt` / `categoryArt` are consistent throughout. The registry field names — `accent`, `accentSoft`, `label`, `scene`, `badge` — match across Task 2's tests, Task 7's table and Task 9's README text. The `.guide-art` and `.guide-badge` class names emitted in Task 2 are the ones styled in Task 4 and asserted in Task 7.

**One correction made during review.** Task 1 originally said "all fifteen `*.html` files," carried over from the spec's own miscount. The site has sixteen pages — `index.html`, twelve guides, three static — and Step 7 now says so explicitly, with `ls *.html | wc -l` as the check. The "fifteen pages" phrasing in the spec is wrong in the same way and should be read as sixteen.
