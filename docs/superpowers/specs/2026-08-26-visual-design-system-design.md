# Visual Design System — Illustrated Art for the Home and Guide Pages

Date: 2026-08-26
Branch: `visual-design-system` (stacked on `cozy-fall-and-whimsical-kitchen-guides`)

## Problem

The site carries no imagery. `public/` holds only `robots.txt` and `sitemap.xml`. The only visuals are one CSS-drawn navy board on the home page, six emoji category icons, and a large numeral in the featured-guide block. Product cards are entirely text.

Traffic arrives from Pinterest, a visual platform. A visitor lands cold on a single guide page and sees an unbroken wall of navy-on-cream text, indistinguishable from every other guide on the site. Nothing anchors the page in memory, and nothing rewards the click.

Two defects compound this:

1. `styles.css` names `Inter` first in the body font stack, but no `@font-face` rule and no font link exists anywhere in the repo. Every character of body text renders in the system UI fallback. The site has never displayed the typography its CSS describes.
2. No page carries an `og:image`. A visitor who pins directly from a guide gives Pinterest nothing to scrape.

## Goals

- Every guide page opens with illustrated hero art carrying its own accent color and its own drawn motif.
- The home page reads as twelve distinct destinations rather than twelve text blocks.
- The six category cards and the three values cards carry drawn art, not emoji and not Unicode circled digits.
- Body and display type render in the faces the design intends.
- `npm run verify` continues to pass across all fifteen pages, and a new guide cannot ship without art.

## Non-goals

- **Product photography.** The Amazon Associates Operating Agreement prohibits using product images taken from listings or search results. Legitimate images require the Product Advertising API, which needs qualifying sales to stay active. Per-product photography is out of scope and remains so until PA-API access exists.
- **`og:image` and rasterized pins.** Deferred by decision. Pins are authored deliberately through `docs/pinterest-pin-prompts.md`, which produces better pins than anything scraped from the page. Hero art will be structured so it can be rasterized later without rework. Recorded under Deferred work.
- **Layout restructuring.** No masonry grid, no full-bleed section rebuild, no home hero reflow beyond replacing the board illustration. The existing grid structure stays.
- **Photographic imagery of any kind**, including free stock. All art is code-drawn.
- **Refactoring the hand-written home-page guide cards into a generated registry.** Art is injected into the existing markup via a marker element.

## Decisions

Four choices were settled before design, and the rest of this document assumes them:

| Question | Decision |
|---|---|
| Image source | Code-drawn SVG. No photos, no AI generation, no stock. |
| Visual scope | Add art *and* retune the design — color, type, spacing, card treatments. |
| Art granularity | Distinct motif and accent per guide, twelve in total. |
| `og:image` | Skipped for now. |

## Approach

Build-time inline SVG, injected by the Vite plugin that already exists.

Two alternatives were rejected. Standalone `.svg` files under `public/images/` referenced by `<img>` keep the HTML smaller, but each is a separate request, the art cannot inherit palette custom properties (recoloring means editing the file), and it cannot respond to hover or reduced-motion state. Extending the pure-CSS technique of the current `.travel-board` adds no new machinery, but that block already sits at the limit of what stacked gradients and pseudo-elements can express; twelve distinct scenes would be unreadable and fragile.

Inline SVG through the existing plugin wins because it reuses the repo's own pattern, inherits CSS custom properties so one motif recolors per accent, costs no extra requests, and causes no layout shift. Estimated weight on `index.html` is roughly +18KB uncompressed, about 8KB gzipped.

## Architecture

### `guides/art.js` — the registry

A single module exporting `guideArt`, keyed by the same slugs as `collections` in `products.js`. Each entry:

```js
"cozy-fall-finds": {
  accent: "#b4552f",        // per-guide accent, used for hero, badges, rules
  accentSoft: "#f6e7dc",    // tint for card art grounds and chips
  label: "Falling leaves, string lights and a steaming mug",
  scene: `<svg viewBox="0 0 800 500" ...>`,   // guide hero, 16:10
  badge: `<svg viewBox="0 0 480 320" ...>`    // home-page card art, 3:2
}
```

`scene` and `badge` are static strings, not functions. They are authored by hand and contain no interpolation, so nothing needs escaping and nothing can inject.

`label` is the accessible name for the hero. `accent` and `accentSoft` are emitted as inline custom properties on the injected wrapper, so CSS drives everything downstream from them rather than hard-coding twelve variants.

The same module carries two further exports that are **not** guide-keyed and therefore take no part in the parity check below:

- `homeArt` — the pegboard hero scene, used only on `index.html`
- `categoryArt` — the six drawn category icons, keyed by category name, not by guide slug

The `guideArt` key set must equal `collections`' key set exactly. That invariant is enforced in verification, below, and lands in wave 2 rather than wave 1 — see Delivery.

### Injection

`vite.config.js` gains two markers handled by the same `transformIndexHtml` hook as `data-product-grid`:

- `data-guide-art="<slug>"` → the guide's `scene`, wrapped in an element carrying `role="img"`, `aria-label="<label>"`, and inline `--accent` / `--accent-soft`.
- `data-guide-badge="<slug>"` → the guide's `badge`, wrapped with `aria-hidden="true"` and `focusable="false"`. Home-page card art is decorative: the card's heading and link already name the guide, so an accessible name on the art would be a duplicate announcement.

The existing pattern's lookbehind guard against prefixed attributes is reused. The existing `closeBundle` check is extended, but with a deliberately looser rule than the one guarding product grids: every `guideArt` key must be injected as a scene **at least** once and as a badge **exactly** once.

Scenes are "at least once" rather than "exactly once" because `elementary-classroom-essentials` legitimately appears twice — on its own guide page and inside the home page's `.featured-visual` block. Badges stay "exactly once" because a guide card appearing twice on the home page would be a real bug. The purpose of the guard is unchanged: art written but never placed fails the build, matching how an orphaned product collection fails today.

### Shared visual vocabulary

Twelve independent illustrations would read as twelve unrelated sites. Every motif is constrained to a shared substrate:

- Warm cream ground (`--cream`)
- A brass-gold hairline frame
- The dashed navy route line already established by `.travel-board`
- A soft grain overlay
- Flat editorial vector style — no gradients inside objects, no drop shadows on art, consistent 2px stroke weight

Per guide, two to four distinctive objects sit on that substrate:

| Slug | Motif |
|---|---|
| `travel-essentials` | Rolling bag, luggage tag, dashed route arc |
| `flight-attendant-dog-gifts` | Dog at a window, wing pin |
| `elementary-classroom-essentials` | Rolling cart, pencil cup, name tag |
| `dog-lover-gifts` | Three paw prints, bowl, leash loop |
| `student-pilot-gifts` | Sectional-chart wedge, headset, compass rose |
| `first-apartment-tools` | Screwdriver, level bubble, hex keys |
| `holiday-gifts` | Stacked boxes, ribbon, gift tag |
| `retro-classroom-decor` | Chalkboard, pennant bunting, apple |
| `pen-pal-starter-kit` | Envelope, fountain nib, wax seal |
| `adventure-travel-essentials` | Dry bag, ridge line, filtered bottle |
| `cozy-fall-finds` | Leaves, string lights, steaming mug |
| `whimsical-kitchen-finds` | Mushroom grinder, nesting cups, wind-up timer |

## Page changes

### Home page

`.travel-board` is removed. It is off-message: the hero announces travel while the site now spans dogs, teachers, kitchens and tools. It is replaced by an illustrated navy **pegboard** with the six category motifs hung on it — on-brand for "Bill's Workshop," representative of every guide, and retaining the dashed-line and floating-card character of the block it replaces.

Also on the home page:

- Each of the twelve guide cards gains a 3:2 badge art panel above its copy, ground tinted with the guide's `accentSoft`, lifting on hover.
- The six emoji category icons become drawn SVG in their category accent.
- The three values cards' Unicode circled digits (`①②③`) become drawn numerals in brass gold.
- Section boundaries become soft torn-paper arcs in place of hairline borders.
- `.featured-visual` keeps its structure and its numeral but swaps its `repeating-linear-gradient` stripe for the `scene` of the currently featured guide, `elementary-classroom-essentials`. It is marked with `data-guide-art`, so this is that guide's second scene injection on the site — the injection guard's per-page count is therefore "exactly once per page," not "exactly once per build."

### Guide pages

`.page-hero` becomes a two-column grid — copy left, `scene` art right — collapsing to a single column at the existing 860px breakpoint, with art below copy on mobile so the headline stays first.

The hero sets `--accent` and `--accent-soft`, which then flow to:

- `.product-number` badges, currently hard-coded to `--teal`
- The `.toc` heading rule
- `.related-callout`, which additionally picks up a faint motif watermark
- `.breadcrumb` links

The result is that a visitor landing cold from Pinterest on one guide sees a page with its own identity rather than the same navy-and-cream as the other eleven.

`about.html`, `affiliate-disclosure.html` and `privacy.html` receive the typography and background retune only. They get no motif — they are not destinations, and art would imply they are.

### Typography

Self-hosted variable woff2 subsets in `public/fonts/`:

- **Fraunces** — display serif for `h1`–`h3`, replacing Georgia
- **Inter** — body, finally actually loaded

Self-hosted rather than linked from Google Fonts: no third-party origin to reconcile with the security headers in `vercel.json`, and one fewer connection to open. `font-display: swap`, with both faces preloaded in each page head. Budget: under 80KB combined. Georgia and the current system stack remain as fallbacks, so a failed font load degrades to exactly today's rendering.

### Palette

Twelve accents, each derived by rotation within the existing navy / teal / coral / gold family, so no accent introduces a hue the brand does not already use. Plus a paper grain over the body background — an inline `feTurbulence` data URI at low opacity, roughly 200 bytes, and the highest ratio of visual impact to cost on this list.

## Accessibility

- Decorative art: `aria-hidden="true"` and `focusable="false"`.
- Hero art: `role="img"` with the registry `label` as accessible name.
- Every accent verified at 4.5:1 against both cream and navy for any text use. Accents failing that ratio are restricted to borders, rules and large shapes, never to text.
- All motion is transform-only and sits inside the existing `prefers-reduced-motion` guard.
- The LCP element remains text. No `<img>` element is introduced, so no image-driven layout shift is possible.
- Heading order is unchanged on every page.

## Verification

`npm run verify` — `html-validate` across all fifteen pages, then `scripts/verify-build.mjs` — must pass, unchanged in scope and extended in coverage.

Additions to `scripts/verify-build.mjs`:

1. **Registry parity.** `Object.keys(guideArt)` must equal `Object.keys(collections)`. Fails loudly on either a guide with a product grid and no art, or art with no grid. This is the check that stops a future guide shipping art-less.
2. **Per-guide assertions.** Each built guide page must contain its accent value and its `role="img"` hero wrapper.
3. **Home-page assertions.** `dist/index.html` must contain all twelve badges.

The plugin's own `closeBundle` guard covers injection counts, as described under Injection.

**These completeness checks cannot pass during wave 1**, when the registry holds two entries and `collections` holds twelve. Rather than weaken them or ship placeholder art for ten guides, all three land in **wave 2**, at the point the registry is complete. Wave 1 builds the injection mechanism and its two motifs, and `npm run verify` must pass in its current form at the wave-1 gate. Waves are review gates inside one branch, not separate deployments, so no partially-arted state ever reaches production.

Beyond automated checks: a real `npm run build`, then browser screenshots of the home page and both wave-1 guides at desktop and mobile widths.

## Delivery

Three waves. Each ends with a build, verification and a look in the browser.

**Wave 1 — direction.** Font loading, grain, palette, the `guides/art.js` scaffold, the plugin markers, the pegboard hero, and two guides: `cozy-fall-finds` and `student-pilot-gifts`. One warm and one technical, chosen to show the range of the style. Review gate here: the visual direction is confirmed or corrected before any further motif is drawn.

**Wave 2 — the remaining ten motifs**, plus the home-page card art, category icons and values numerals that depend on them, and the three completeness checks in `scripts/verify-build.mjs`, which only become satisfiable once the registry is full.

**Wave 3 — the retune passes**: section dividers, card treatments, spacing and mobile rhythm, the static pages, and the full accessibility and contrast audit.

Correcting the visual direction after two motifs is far cheaper than after twelve. That is the reason for the wave-1 gate.

## Deferred work

- `og:image` and pinnable images. Either rasterize hero art to 1000×1500 PNG at build time via `sharp` or `resvg-js`, or wire inert meta tags pointing at hand-authored pins dropped into `public/images/og/`. Hero art is structured for the former.
- Replacing search-based Amazon links with specific reviewed products, and the per-product photography that PA-API access would unlock. Already noted in `README.md`.

## README updates

The "Adding a guide" section gains a step: add a `guides/art.js` entry with `accent`, `accentSoft`, `label`, `scene` and `badge`, mark the guide hero with `data-guide-art="<slug>"`, and mark the home card with `data-guide-badge="<slug>"`. Note that the build fails if a registry key has no grid, or a grid no art.
