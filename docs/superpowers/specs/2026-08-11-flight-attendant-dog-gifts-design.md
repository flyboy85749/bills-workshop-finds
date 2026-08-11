# Gifts for Flight Attendants Who Love Dogs

Date: 2026-08-11
Status: Approved

## Problem

The site has one guide. Adding a second is the first real test of whether the build-time
product pipeline generalizes, and it does not: `products.js` exports a single flat `essentials`
array, and `renderProductGrid()` renders that array into **every** element matching
`[data-product-grid]`, on every page. Two guides would show identical products.

The content problem is separate. `flight-attendant-travel-essentials` already carries an aside
headed "Shopping for a flight attendant who loves dogs?" that sends readers straight to Etsy.
That aside names a real audience the site has no page for.

## Goal

Publish `/flight-attendant-dog-gifts` — a 15-item Amazon-first gift guide — and generalize the
data, build, and verification layers so a third guide costs one data file and one registry line.

## Non-goals

No framework, no new runtime dependencies, no CMS. The card markup, page shell, styling
system, and affiliate link treatment are unchanged. This does not revisit the outstanding
"replace search-based recommendations with specific reviewed products" item in `README.md` —
the new guide uses the same tagged-search pattern as the existing one, so that change stays a
single future decision applied to both guides at once.

## Decisions taken

Three content decisions were settled before design:

1. **Amazon-first, Etsy callout.** Same shape as the existing guide: numbered Amazon product
   cards plus one Etsy aside. Rejected an Etsy-first showcase (needs a second card style and
   different `rel` treatment) and a split two-section page (most work, and it fragments the
   numbered list the format depends on).
2. **15 items**, matching the existing guide so the listicle format and verification stay
   consistent.
3. **Second card on the home page**, with the travel guide keeping the featured slot. It is the
   established page; promoting an unproven one is not worth the risk.

## Approach

### Data layout

Three options were considered:

- **Add a `guide` field to each item, filter at render.** Smallest diff, but every guide's
  content accumulates in one array. Untenable by the third guide.
- **Keyed `collections` object inside `products.js`.** Works, but the file grows to ~250 lines
  of product copy now and ~500 at four guides, with the escaping and URL logic buried in it.
- **Chosen: split data into `guides/`, keep rendering in `products.js`.** Content files are what
  gets edited routinely; they should not share a file with `escapeHtml`. Adding a guide becomes
  a new file plus one registry entry.

## Design

### `guides/travel-essentials.js` (new)

The existing `essentials` array, moved verbatim. No content changes.

### `guides/flight-attendant-dog-gifts.js` (new)

15 items in the same shape (`category`, `name`, `query`, `reason`, `tip`), ordered so category
runs are contiguous and the table of contents can anchor to the first item of each run.

The guide's premise is that a flight attendant is *away* from the dog for days at a time. That
is why remote-care items lead rather than novelty items, and why a pet-hair remover earns a
place: a dark uniform and a shedding dog is a problem that recurs every single trip.

| # | Group | Items |
|---|---|---|
| 1–3 | Connection & keepsakes | treat-tossing pet camera · custom pet photo blanket · dog-photo luggage tag |
| 4–6 | Care while you're away | programmable automatic feeder · GPS dog tracker · calming donut bed |
| 7–9 | Crew bag & uniform | reusable pet-hair remover · dog-design insulated tumbler · dog-print compression socks |
| 10–12 | Wearable | dog-breed enamel pin set · breed silhouette necklace · dog-print lounge set |
| 13–15 | For the dog | heartbeat comfort toy · aviation dog bandana · collapsible travel bowl |

Tips carry honest caveats in the voice of the existing guide — GPS trackers generally require a
paid subscription; an automatic feeder needs battery backup because a power cut during a
four-day trip is the exact failure that matters.

### `products.js` (modify)

Keeps `escapeHtml`, `amazonUrl`, and `renderProductGrid`. Loses the product data. Gains a
registry:

```js
export const collections = {
  "travel-essentials": travelEssentials,
  "flight-attendant-dog-gifts": dogGifts
};
```

`renderProductGrid(key)` takes a collection key and throws on an unknown one. Still pure data
and string building, still never imported by client code.

### `vite.config.js` (modify)

The marker gains a value: `data-product-grid="travel-essentials"`. The pattern becomes

```js
/(<div[^>]*(?<![-\w])data-product-grid="([\w-]+)"[^>]*>)(\s*)(<\/div>)/
```

The existing lookarounds are preserved for the reason the current comment gives — a plain `\b`
would still match `data-product-grid-BROKEN`, so a renamed or typo'd marker would slip past the
build guard, which is the exact failure the guard exists to catch.

The `closeBundle` check gets stronger rather than merely surviving. Today it asserts at least
one injection happened anywhere. It will instead track which collection keys were injected and
assert that **every registered collection was injected exactly once**. This catches three
distinct failures: a marker that shipped empty, a guide added to `guides/` but never wired to a
page, and the same collection accidentally rendered on two pages. An unknown key throws during
`transformIndexHtml`, naming the key and the valid ones.

Adds `dogGifts: "flight-attendant-dog-gifts.html"` to the rollup inputs.

### `flight-attendant-dog-gifts.html` (new)

Cloned from the travel guide's shell: same header, nav, page hero, affiliate disclosure note,
`guide-layout` with the TOC aside, and footer. Canonical
`https://finds.billsworkshopcompany.com/flight-attendant-dog-gifts` — extensionless, per the
Vercel clean-URL rule that governs internal links, canonicals, and the sitemap.

Breadcrumb and eyebrow read "Gifts" rather than "Travel & aviation". TOC anchors point at
`#item-1`, `#item-4`, `#item-7`, `#item-10`, `#item-13` plus the disclosure page, matching the
five content groups.

The Etsy aside mirrors the travel guide's, pointing at the profession-and-dog designs that are
the closest thing the workshop sells to this guide's subject.

### `flight-attendant-travel-essentials.html` (modify)

Marker becomes `data-product-grid="travel-essentials"`. The existing "Shopping for a flight
attendant who loves dogs?" aside gains a link to the new guide alongside its Etsy button — the
aside already poses the question this page now answers. Footer "Explore" gains the new guide.

### `index.html` (modify)

A guides row beneath the existing featured guide, holding two cards: the travel guide and the
dog gift guide. The featured treatment stays on the travel guide. Footer "Explore" gains the
new guide.

### `styles.css` (modify)

One addition for the guides row — a responsive card grid reusing the existing card visual
language. No changes to existing rules.

### `public/sitemap.xml` (modify)

Adds `https://finds.billsworkshopcompany.com/flight-attendant-dog-gifts`.

### `scripts/verify-build.mjs` (modify)

Currently hardcodes one file, 15 cards, and six anchor targets as module constants. Becomes a
config table iterated per guide:

```js
const GUIDES = [
  { file: "dist/flight-attendant-travel-essentials.html", cards: 15, anchors: [1, 3, 4, 6, 8, 11] },
  { file: "dist/flight-attendant-dog-gifts.html",         cards: 15, anchors: [1, 4, 7, 10, 13] }
];
```

All five existing assertions run against each guide — card count, `tag=billsworkshop-20` on
every product URL, `rel="sponsored nofollow noopener"` on every product link, every anchor
target present, and no empty grid container. Failures report which file failed.

One assertion is added: the two guides must not render identical product content. This is the
specific regression the shared-array bug would have caused, and card counts alone cannot detect
it — both pages have 15 cards either way.

## Verification

1. `npm run build` succeeds.
2. `npm run verify` passes for both guides.
3. Raw HTML of `dist/flight-attendant-dog-gifts.html` contains the new product names, tips, and
   tagged Amazon URLs — not an empty container.
4. The two guides' rendered grids differ.
5. `npm run dev` serves both guides with their correct, distinct grids, confirming dev/prod
   parity.
6. Renaming a marker, removing one, or pointing one at an unregistered key each fail the build
   with a specific message rather than shipping an empty or wrong grid.
7. Home page shows both guide cards; internal links resolve extensionless.

## Risks

- **Cross-contamination.** The failure this design exists to prevent is each page rendering the
  other's products, or both rendering the same. Verification steps 4 and the added
  distinct-content assertion cover it.
- **Marker migration.** The existing page's bare `data-product-grid` no longer matches the new
  pattern. If it were missed, the travel guide would ship an empty grid — caught by the
  every-collection-injected check in `closeBundle`, which fails the build.
- **Affiliate compliance.** Every new product link must carry `rel="sponsored nofollow noopener"`
  and the `billsworkshop-20` tag. Both are asserted per card by `verify-build`, and both come
  from shared render code rather than hand-written markup.
