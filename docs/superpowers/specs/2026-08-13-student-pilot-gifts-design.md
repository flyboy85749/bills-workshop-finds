# Gifts for Student Pilots

Date: 2026-08-13
Status: Approved

## Problem

The home page's Travel & Aviation card promises "crew-bag organization, pilot gifts and practical
products for frequent travel." Two of the three are delivered. Pilot gifts are not: both aviation
guides are written for cabin crew, and nothing on the site addresses the flight deck.

Two of the six category cards still lead nowhere at all — Seasonal Finds and Everyday Workshop —
but the pilot gap is the cheaper one to close. It deepens a cluster the site already has two
pages in, so the new guide and the existing aviation guides reinforce each other through
cross-links, rather than starting a fourth audience cold.

## Goal

Publish `/student-pilot-gifts` — a 15-item Amazon-first gift guide for people shopping for
someone in flight training — and, in the same pass, pay the footer-link debt recorded in the
dog-lover spec.

## Non-goals

No new card style, page shell, styling system, or affiliate treatment. No category landing pages:
the six home-page cards stay decorative anchors. This does not revisit the outstanding "replace
search-based recommendations with specific reviewed products" item in `README.md` — the new guide
uses the same tagged-search pattern as the other four, so that stays one future decision applied
to all guides at once. Seasonal Finds and Everyday Workshop remain unserved.

## Decisions taken

1. **Pilots**, not Seasonal Finds or Everyday Workshop. Deepens the site's strongest cluster,
   collects cross-links from two existing pages, and delivers a promise the category card has
   been making since launch.
2. **Student pilots**, not GA weekend flyers or professional pilots. It is the only pilot
   audience with genuine third-party gift intent — parents, partners and friends buy for people
   in training, which is the same buyer the site's other gift guides are written for. A GA or
   airline audience mostly buys for itself, which is a gear guide, not a gift guide.
3. **Grouped by training stage**, not by price band or by problem. The buyer's answerable
   question is "how far along are they?", and each stage carries visibly distinct gear. Price
   bands were rejected for the reason the last two guides rejected them: Amazon prices drift and
   the links are search-based, so a tier can silently become wrong. Grouping by problem is the
   house pattern but assumes the buyer knows what a student pilot struggles with.
4. **Nothing that installs in the aircraft.** Most students rent, a renter cannot legally modify
   the aircraft, and installed avionics need an A&P sign-off. Every item is portable and leaves
   in the flight bag. This is an editorial constraint on the whole list, not a per-item caveat.
5. **The classroom guide keeps the featured slot** — see "Home page" below. This reverses the
   promotion discussed during design, for a seasonal reason surfaced afterwards.

## Separation from the existing aviation guides

`flight-attendant-travel-essentials` answers "I work in the back of the aircraft and live out of
a bag." This guide answers "someone I know is learning to fly and I have no idea what is already
in their flight bag." The audiences barely overlap, which is what keeps the item lists disjoint
without editorial gymnastics.

Two near-misses were routed around deliberately. This is a content constraint, not a
build-enforced one — `verify-build` only catches a wholesale collection collision, not three
shared items:

- Compression packing cubes and the crew-bag organization items are taken by the travel guide.
  The flight-bag item here is specified by headset-compartment fit, which is a flight-deck
  concern the travel guide never raises.
- Noise-cancelling consumer headphones appear in the travel guide. An aviation headset is a
  different product category — intercom-wired, aviation-connectored, not consumer Bluetooth — so
  the two do not compete on query.

## Design

### `guides/student-pilot-gifts.js` (new)

15 items in the established shape (`category`, `name`, `query`, `reason`, `tip`), ordered so
category runs are contiguous. Five groups of three put the anchors on items 1, 4, 7, 10 and 13 —
the same pattern the last three guides use.

| # | Group (`category`) | Items |
|---|---|---|
| 1–3 | `first lessons` | entry-level ANR aviation headset · paper pilot logbook · non-drowsy motion sickness kit |
| 4–6 | `pre-solo` | VFR kneeboard · non-polarized aviation sunglasses · GATS jar fuel tester |
| 7–9 | `cross-country` | portable ADS-B receiver · yoke or suction tablet mount · manual E6B and plotter |
| 10–12 | `checkride prep` | private pilot oral exam guide · view-limiting foggles · red-lens headlamp |
| 13–15 | `newly certificated` | flight bag · second passenger headset · tail-number commemorative piece |

Six `tip` fields carry information a gift buyer cannot be expected to have, and three of them
prevent a wasted or unsafe purchase rather than a suboptimal one:

- **Sunglasses must not be polarized.** Polarized lenses wash out LCD glass-panel displays and
  hide stress cracks in a windshield. Buying polarized aviators is the most common well-meant
  pilot-gift mistake and the reason this item is on the list at all.
- **Motion sickness: ginger and acupressure, not sedating antihistamines.** Standard Dramamine
  impairs a pilot, and a student cannot fly having taken it. Safety-critical, not a preference.
- **Headset connectors differ.** Twin GA plugs are standard; helicopter single-plug and LEMO
  panel-power are not interchangeable. Wrong connector, useless gift.
- **ADS-B receivers pair with an app.** Sentry units integrate with ForeFlight, Garmin's with
  Garmin Pilot. Match what they already fly with.
- **Buy the manual E6B, not the electronic one.** It is what they are tested on and it has no
  battery to die.
- **Personalized items have lead times.** Same caveat the dog-lover guide carries. If the buyer
  does not know a tail number, the airport identifier or the solo date works.

### `student-pilot-gifts.html` (new)

Page shell copied from the established pattern: breadcrumb, eyebrow, h1, lede, disclosure note,
guide intro, `<div class="product-grid" data-product-grid="student-pilot-gifts"></div>`, Etsy
related-callout, TOC aside.

Titles are split, as on the classroom page, because the full headline plus the site suffix
exceeds the new gate:

- `<title>15 Gifts for Student Pilots | Bill's Workshop Finds</title>` — 51 characters, on one
  line (a wrapped title fails `long-title` on its own indentation; see `README.md`).
- `<h1>` and `og:title`: "15 Gifts for Student Pilots, Sorted by Where They Are in Training" — 65
  characters.

The lede addresses the non-pilot buyer directly and states the one editorial rule, so the reader
understands why nothing on the list bolts to an airplane.

### `products.js` (modify)

Imports `studentPilotGifts` from `./guides/student-pilot-gifts.js` and registers
`"student-pilot-gifts"` in `collections`. No changes to `escapeHtml`, `amazonUrl`, or
`renderProductGrid`.

### `vite.config.js` (modify)

Adds `studentPilots: "student-pilot-gifts.html"` to `rollupOptions.input`. The `closeBundle`
check already asserts every registered collection is injected exactly once, so a half-wired guide
fails the build without any change here.

### `scripts/verify-build.mjs` (modify)

One new `GUIDES` entry:

```js
{
  file: "dist/student-pilot-gifts.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "Non-polarized aviation sunglasses"
}
```

The existing length assertion already fails the build if the entry is forgotten.

### `index.html` — home page (modify)

`.guide-card-grid` is `repeat(2, 1fr)` (`styles.css:246`), so a fifth card would leave a dangling
half-row. The grid also currently duplicates the featured guide: the classroom guide appears both
in the featured slot and as a grid card.

Both problems resolve with one change: **the classroom guide's duplicate grid card is removed and
the pilot card takes its place.** The grid stays a clean 2×2 — travel essentials, crew dog gifts,
dog lover gifts, student pilots — and the featured slot stops repeating a card directly beneath
it. The new card's eyebrow is "Student pilots".

The classroom guide keeps the featured slot. During design the intent was to promote the pilot
guide there, but the dog-lover spec's fifth decision records that the classroom guide holds the
feature through late August — elementary teachers set up rooms right now — with a planned swap to
the dog-lover guide in October for Q4. Promoting this guide would displace a guide in its peak
week and pre-empt that swap. Featuring the pilot guide is a one-line change available whenever
its own moment arrives.

### TOC cross-links, all five guides (modify)

Each guide's TOC aside currently links to every other guide, so the list grows with each new
page — the same disease as the footer. Each TOC is capped at its two topically-nearest guides
plus one "All guides" link to `/#guides`, inserted before the disclosure link:

| Guide | Cross-links |
|---|---|
| student pilots | travel essentials · crew dog gifts |
| travel essentials | student pilots · crew dog gifts |
| crew dog gifts | travel essentials · dog lover gifts |
| dog lover gifts | crew dog gifts · classroom essentials |
| classroom essentials | travel essentials · dog lover gifts |

This keeps descriptive internal-link anchors, which a bare "All guides" would throw away, while
capping the list at a fixed length no matter how many guides exist.

### Footer, all pages (modify)

The debt recorded in the dog-lover spec, paid here. The Explore column's four per-guide links
collapse to a single `<a href="/#guides">All guides</a>`, keeping Categories and About. The
footer is duplicated by design (`partials-note.txt`), so this touches all nine HTML pages:
`index`, `about`, `affiliate-disclosure`, `privacy`, the four existing guides, and the new one.
After this change the footer no longer grows with the guide count.

### `public/sitemap.xml`, `README.md` (modify)

Adds `https://finds.billsworkshopcompany.com/student-pilot-gifts` and the Pages-list entry.

## Verification

1. `npm run build` succeeds; `closeBundle` confirms the new collection was injected exactly once.
2. `npm run verify` passes — `lint:html` clean across all nine pages, then verify-build reporting
   5 guides, 75 cards, all anchor targets present, all five product signatures distinct.
3. Raw `dist/student-pilot-gifts.html` contains the new product names, tips, and tagged Amazon
   URLs — not an empty container.
4. All five guides' rendered grids differ from one another.
5. `npm run dev` serves the new guide with the correct grid, confirming dev/prod parity.
6. Home page shows four cards in a full 2×2 grid, the classroom guide still featured, and no
   duplicate classroom card.
7. Every page's footer shows "All guides" and no per-guide links; every guide's TOC carries
   exactly two cross-links plus "All guides"; every internal link resolves extensionless.

## Risks

- **Item overlap with `travel-essentials.js`.** The signature check catches a wholesale
  collision, not three shared items. A manual review item on every future aviation guide.
- **Safety-critical tips.** The non-polarized lens caveat and the sedating-antihistamine caveat
  carry real-world consequences if dropped in editing. Both live in the item `tip`, which
  `renderProductGrid` always emits.
- **Headset connector mismatch.** The highest-value tip on the page and the easiest to lose to
  brevity.
- **Regulatory drift in the oral exam guide.** Editions go stale as regs change; the item `tip`
  tells the buyer to check the edition year rather than the site tracking it.
- **Nine-page footer edit.** The footer is hand-duplicated, so the collapse must land identically
  on all nine pages. Nothing in the build asserts footer consistency — this is the strongest
  argument yet for the partial extraction that `partials-note.txt` contemplates, but that stays
  out of scope here.
- **Affiliate compliance.** Every product link must carry `rel="sponsored nofollow noopener"` and
  the `billsworkshop-20` tag. Both are asserted per card by `verify-build` and both come from
  shared render code rather than hand-written markup.
