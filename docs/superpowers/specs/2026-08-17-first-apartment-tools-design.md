# Tools for a First Apartment

Date: 2026-08-17
Status: Approved

## Problem

Two of the six home-page category cards still lead nowhere. Everyday Workshop promises "simple,
useful products that reduce friction in work and everyday routines" and Seasonal Finds promises
"holiday ideas with personality" — neither has a page behind it, and both have been making that
promise since launch.

Everyday Workshop is the card worth closing first. It names the site: a workshop with no guide
about tools is the one gap a reader would actually notice. It is also evergreen, where a Seasonal
Finds guide goes stale every January and competes with every holiday gift list on the internet.

## Goal

Publish `/first-apartment-tools` — a 15-item Amazon-first guide to the tools someone needs the
first time something breaks in a place of their own — and reflow the home page guide grid so it
absorbs a sixth guide without a dangling half-row.

## Non-goals

No new card style, page shell, styling system, or affiliate treatment. The six category cards
stay decorative anchors; this does not make Everyday Workshop a linking card or build a category
landing page. Seasonal Finds remains unserved. This does not revisit the outstanding "replace
search-based recommendations with specific reviewed products" item in `README.md` — the new guide
uses the same tagged-search pattern as the other five, so that stays one future decision applied
to all guides at once. The footer needs no change: the Explore column collapsed to a single "All
guides" link in the student pilot pass, and it no longer grows with the guide count.

## Decisions taken

1. **Everyday Workshop**, not Seasonal Finds and not a sixth guide inside an existing cluster.
   It closes the category card that names the site, it is evergreen, and it is the one topic where
   the site's voice has obvious standing.
2. **A first apartment**, not a garage workshop. A garage build-out is a gear guide for a
   self-shopper; every other page here is written for someone furnishing a life they have just
   started. It also keeps the gift occasions intact — housewarming, graduation, moving out.
3. **Grouped by the moment the tool is needed**, not by tool category and not by buy-order tier.
   Tool categories assume the buyer already thinks in tool categories, which is exactly what a
   first-timer does not do. Buy-order tiers blur, because nearly everything on a starter list is
   arguably day one. Grouping by what just went wrong is the site's established "by problem"
   pattern and it matches the framing in the headline.
4. **Nothing that needs a landlord's permission or a workbench.** Everything fits in one bag: no
   bench-mounted tools, no hardwired fixtures, no plumbing that has to be replaced rather than
   cleared. This is an editorial constraint on the whole list, stated in the lede, so the reader
   understands why a site called "Workshop" is not selling them a miter saw.
5. **The slug commits to renters** — `first-apartment-tools`, even though the guide serves first
   homeowners equally well. The renter-safe constraint is what makes the list distinctive, and it
   matches how people search. Accepted knowingly: this is expensive to change once the URL is
   indexed.
6. **The classroom guide keeps the featured slot.** The dog-lover spec records a planned swap to
   the dog-lover guide in October for Q4. Featuring this guide would pre-empt that plan for a
   guide with no seasonal urgency of its own.

## Separation from the existing guides

The five existing guides serve cabin crew, student pilots, dog owners, and elementary teachers.
This one shares no audience with any of them, so the item lists stay disjoint without editorial
effort. The signature check in `verify-build` catches a wholesale collection collision, not a few
shared items, so the near-misses are worth naming:

- **Headlamps.** The student pilot guide carries a *red-lens* headlamp for preserving night vision
  in a cockpit. This guide's is a rechargeable white-light headlamp for a dark utility closet.
  Different product category, different query, no competition.
- **Tool and equipment bags.** The pilot guide's flight bag is specified by headset-compartment
  fit; the travel guide's organization items are crew-bag specific. The bag here is a
  small-tool tote sized for an apartment closet.

Being the first guide in a new cluster has a cost worth recording: it starts as the least
internally-linked page on the site — one TOC inbound, plus the home card and `/#guides`. The
dog-lover guide launched from the same position.

## Design

### `guides/first-apartment-tools.js` (new)

15 items in the established shape (`category`, `name`, `query`, `reason`, `tip`), ordered so
category runs are contiguous. Five groups of three put the anchors on items 1, 4, 7, 10 and 13 —
the same pattern the last four guides use.

| # | Group (`category`) | Items |
|---|---|---|
| 1–3 | `flat-pack day` | ratcheting screwdriver with bit set · rubber mallet · folding hex-key set |
| 4–6 | `hanging things` | compact cordless drill/driver · stud finder · drywall anchor assortment |
| 7–9 | `water where it shouldn't be` | flange plunger · hair-clog drain tool · 8-inch adjustable wrench |
| 10–12 | `power problems` | rechargeable headlamp · non-contact voltage tester · 12-gauge extension cord |
| 13–15 | `what lives in the bag` | small tool tote · 25-foot tape measure · 9-inch torpedo level |

Six `tip` fields carry information a first-timer cannot be expected to have. Three of them prevent
damage or injury rather than mild regret:

- **A non-contact voltage tester before touching an outlet or a switch.** Roughly $20, and the
  item most likely to be dismissed as optional by the person who needs it most. Safety-critical.
- **Extension cord gauge is not a detail.** 16 AWG is fine for a lamp and a genuine fire risk
  under a space heater or a window air conditioner. 12-gauge costs a few dollars more.
- **Reach for the drain tool before the chemical cleaner.** Caustic cleaner sits in the trap,
  damages older pipes, and converts a ten-minute job into a plumber's invoice — which in a rental
  is an argument about who pays.
- **Do not use the drill on flat-pack furniture.** A driver strips particleboard cam screws
  instantly. This is why the ratcheting screwdriver is item 1 and the drill does not appear until
  the wall group.
- **Anchors are weight-rated and the rating is not a suggestion.** Match anchor type to wall type
  and load. This is the difference between a shelf and a deduction from the deposit.
- **Most people own the wrong plunger.** Flange for toilets, cup for sinks. A cup plunger on a
  toilet mostly moves water around.

### `first-apartment-tools.html` (new)

Page shell copied from the established pattern: breadcrumb, eyebrow, h1, lede, disclosure note,
guide intro, `<div class="product-grid" data-product-grid="first-apartment-tools"></div>`, Etsy
related-callout, TOC aside.

Titles are split, as on the classroom and pilot pages, because the full headline plus the site
suffix exceeds the `long-title` limit:

- `<title>15 First Home Tool Kit Essentials | Bill's Workshop Finds</title>` — 57 characters, on
  one line (a wrapped title fails `long-title` on its own indentation; see `README.md`).
- `<h1>` and `og:title`: "15 Tools for a First Apartment, Sorted by What Just Went Wrong" — 62
  characters.

The lede addresses both readers — the person buying for themselves and the person buying a
housewarming gift — and states the one editorial rule, so nobody wonders where the power tools
went.

### `products.js` (modify)

Imports `firstApartmentTools` from `./guides/first-apartment-tools.js` and registers
`"first-apartment-tools"` in `collections`. No changes to `escapeHtml`, `amazonUrl`, or
`renderProductGrid`.

### `vite.config.js` (modify)

Adds `firstApartment: "first-apartment-tools.html"` to `rollupOptions.input`. The `closeBundle`
check already asserts every registered collection is injected exactly once, so a half-wired guide
fails the build without any change here.

### `scripts/verify-build.mjs` (modify)

One new `GUIDES` entry:

```js
{
  file: "dist/first-apartment-tools.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "Flange plunger"
}
```

The existing length assertion already fails the build if the entry is forgotten.

### `index.html` and `styles.css` — home page (modify)

A new `.guide-card` for the workshop guide, eyebrow "Everyday workshop", heading "15 Tools for a
First Apartment". That makes five cards in the grid beneath the featured classroom guide, and
`.guide-card-grid` is `repeat(2, 1fr)` (`styles.css:246`), which would leave a dangling half-row —
the same problem the pilot guide's card swap solved by removing a duplicate. There is no duplicate
left to remove, so the grid itself changes, using the breakpoints that already exist:

| Width | Columns | Where |
|---|---|---|
| above 860px | `repeat(3, 1fr)` | `styles.css:246` |
| 681–860px | `repeat(2, 1fr)` | new entry in the existing `@media (max-width: 860px)` block |
| 680px and below | `1fr` | existing `@media (max-width: 680px)` block, untouched |

Five cards render 3 + 2 at desktop. Explicit column counts are used rather than
`repeat(auto-fit, minmax(...))` so the layout is deterministic at every width instead of depending
on how many columns a given container width happens to yield.

The classroom guide keeps the featured slot, and the grid still holds no duplicate of it.

### TOC cross-links (modify)

Each guide's TOC carries its two topically-nearest guides plus "All guides", capped regardless of
how many guides exist. The new page joins the table, and one existing link is swapped so the new
guide has an inbound link:

| Guide | Cross-links |
|---|---|
| first apartment tools | classroom essentials · dog lover gifts |
| classroom essentials | **first apartment tools** · dog lover gifts |
| student pilots | travel essentials · crew dog gifts |
| travel essentials | student pilots · crew dog gifts |
| crew dog gifts | travel essentials · dog lover gifts |
| dog lover gifts | crew dog gifts · classroom essentials |

Classroom essentials trades its travel-essentials link, the weakest of its two by buyer intent,
for the new guide. Nothing else changes.

### `public/sitemap.xml`, `README.md` (modify)

Adds `https://finds.billsworkshopcompany.com/first-apartment-tools` and the Pages-list entry.

## Verification

1. `npm run build` succeeds; `closeBundle` confirms the new collection was injected exactly once.
2. `npm run verify` passes — `lint:html` clean across all ten pages, then verify-build reporting
   6 guides, 90 cards, all anchor targets present, all six product signatures distinct.
3. Raw `dist/first-apartment-tools.html` contains the new product names, tips, and tagged Amazon
   URLs — not an empty container.
4. All six guides' rendered grids differ from one another.
5. `npm run dev` serves the new guide with the correct grid, confirming dev/prod parity.
6. The home guide grid renders 3 + 2 above 860px, two-up between 681 and 860px, and one-up below
   680px — checked at all three widths, not only the one that happens to be open.
7. Home page still features the classroom guide, with no duplicate of it in the grid.
8. Every guide's TOC carries exactly two cross-links plus "All guides"; every page's footer shows
   "All guides" and no per-guide links; every internal link resolves extensionless.

## Risks

- **Safety-critical tips.** The voltage-tester and extension-cord-gauge caveats carry real-world
  consequences if dropped in editing. Both live in the item `tip`, which `renderProductGrid` always
  emits.
- **A hand-edited CSS grid with no test.** Nothing in the build asserts the home page layout;
  verification step 6 is manual and is the only thing standing between a sixth guide and a ragged
  grid. A seventh guide will need this decision revisited — six cards plus a feature is 3 + 3, but
  a seventh is 3 + 3 + 1.
- **Weakest internal linking on the site.** One TOC inbound. If the page underperforms, that is the
  first thing to look at, not the item list.
- **Tool recommendations invite disagreement.** Unlike a gift guide, readers hold opinions about
  tool brands and specifications. Every `reason` should defend the category and the specification,
  never a brand, which the tagged-search link pattern already enforces.
- **Product overlap with future workshop guides.** This opens a cluster; a second workshop guide
  will need the same manual review against this list that every aviation guide now needs.
- **Affiliate compliance.** Every product link must carry `rel="sponsored nofollow noopener"` and
  the `billsworkshop-20` tag. Both are asserted per card by `verify-build` and both come from
  shared render code rather than hand-written markup.
