# Adventure Travel Essentials

Date: 2026-08-19
Status: Draft — awaiting review

## Problem

The Pinterest Trend Opportunity Workbook lists three rows at priority "Create Now". Two shipped
today — retro classroom decor and the pen pal starter kit. The third, **Darecations** (target
keyword `adventure travel essentials`, Spring-Summer), is the last unbuilt item at that priority.

There is also a cosmetic problem the new guide happens to fix. `.guide-card-grid` is
`repeat(3, 1fr)` (`styles.css:246`) and currently holds eight cards, which renders 3 / 3 / 2 with a
short final row. A ninth card closes it to 3 / 3 / 3.

**The layout is not the reason to build this guide.** A guide is fifteen researched items and a
review cycle; that is a disproportionate way to fill a grid slot. The guide is worth building on
its own merits, and the grid is a free side effect. If the grid were the only motivation, changing
the column count would be the correct fix instead — and it was considered (see Non-goals).

## Goal

Publish `/adventure-travel-essentials` — a fifteen-item Amazon-first packing guide for people
taking active trips — wired through the full checklist in `README.md`.

## Non-goals

No new card style, page shell, styling system, or affiliate treatment. No category landing pages.
This does not revisit the standing "replace search-based recommendations with specific reviewed
products" item in `README.md`. No new category card: `.category-grid` is `repeat(3, 1fr)` with a
clean six, and the existing "Travel & Aviation" card already covers this guide.

**`.guide-card-grid` stays at three columns.** Changing it to `repeat(4, 1fr)` would render the
current eight cards as a clean 4 / 4 with no new content, and was rejected: the shell is
`min(1160px, …)` (`styles.css:56`), so four columns give roughly 278px per card against 376px at
three. Headlines like "15 Gifts for Flight Attendants Who Love Dogs" wrap to four lines at that
width. Balanced but cramped is worse than unbalanced and readable.

## Decisions taken

1. **Darecations, not the other six unbuilt workbook rows.** It is the only remaining row at
   priority "Create Now", and it deepens the travel cluster — already the site's strongest with
   three pages — so the guide arrives with cross-links available rather than cold. The
   alternatives were each rejected for a specific reason:

   - **Poetcore** (*17 Gifts for Writers and Poetry Lovers*, Holiday) is the strongest runner-up
     and the tempting one, because Q4 is when affiliate revenue peaks. Held back deliberately. It
     sits in the same content hub as the pen pal guide that shipped today with no performance data
     yet, and it would put three overlapping pages into Q4 — holiday gifts, pen pal, and Poetcore.
     That is the cannibalisation problem the two teacher guides just spent a full review cycle
     avoiding. Poetcore is stronger as next year's Q4 guide, informed by how pen pal performs.
   - **Scent Stacking, Cabbage Crush, Brooched** each open a brand-new audience with no existing
     link equity. Worth doing eventually; each is a cold start rather than a cluster deepening.
   - **Glamoratti, Khaki Coded, Opera Aesthetic** are all Travel Essentials rows too, so they
     compete with this guide rather than complementing it. Build one travel guide, not four.

2. **Active trips, not backcountry and not rugged-general.** The reader flies somewhere, sleeps
   indoors, and does daring things by day — ziplining, canyoning, diving, safari, volcano hikes.
   Backcountry was rejected because it is an outdoor-gear guide rather than a travel guide and
   competes against specialist retailers on those keywords. Rugged-general was rejected because it
   overlaps the existing flight attendant travel guide most heavily, which is the collision most
   worth avoiding.

3. **Fifteen items, not the workbook's twenty-one.** Fifteen matches all nine existing guides, the
   1/4/7/10/13 anchor pattern, and the `cards: 15` assertion in `verify-build`. More importantly it
   matches the home page's own promise — "No endless lists. No unexplained recommendations." At
   twenty-one the weakest six items dilute the rest, and the tip quality is the product here. The
   H1 keeps the workbook's phrasing and keyword, only the number changes.

4. **Grouped by what the trip does to your gear**, not by activity. The buyer does not yet know
   whether they will be canyoning or diving, but they know things will get wet, dropped and carried
   all day. Grouping by activity would force the reader to self-select before the list is useful.

5. **The rugged power bank stays, despite proximity to an existing item.** See below.

6. **`/first-apartment-tools` remains weakly linked, and this guide cannot fix it.** It still has
   zero inbound TOC cross-links — only an inline mention in the holiday guide and its home page
   card. Routing an adventure-travel cross-link to a first-apartment tool guide would be
   nonsensical for a reader, so the debt stands. Recorded here so the next topically-adjacent
   guide picks it up.

## Separation from the existing travel guides

`flight-attendant-travel-essentials` answers "I live out of a bag on rotations and need to arrive
presentable." This guide answers "my gear is going to get wet, dropped and covered in salt, and I
am carrying it all day."

All fifteen live travel items were checked against the proposed list. No exact query collision
exists, but one pair is close enough to record as a decision rather than leave implicit:

- **Rugged waterproof power bank** (item 6) against the live guide's **Compact portable charger**.
  The decision is to **keep both**, specified apart: the existing item is a slim bank for a long
  flight, this one is IP-rated and survives a wet day. The precedent is the student pilot guide,
  which kept an aviation headset despite the travel guide's consumer headphones — different product
  category, different failure mode, different query. This is deliberately the opposite call from
  the decor guide's lighting exclusion, where the two items would have been the *same* product.
  **Cost:** this becomes the one item requiring manual review on every future travel guide.

Two further near-misses were avoided by specification rather than exclusion:

- The live guide's **leak-resistant insulated bottle** keeps drinks cold. This guide's **filtered
  water bottle** makes questionable tap water safe. Different product, different query.
- The live guide's **airline-approved underseat backpack** and **foldable extra tote** are sized to
  airline rules. This guide's **packable daypack** is specified by carry comfort under load.

`verify-build` compares the sorted query set per guide and only catches a wholesale collection
collision, not two or three shared items. Manual review remains required on every future travel
guide, and this guide adds one named item to that watch list.

## Design

### `guides/adventure-travel-essentials.js` (new)

Fifteen items in the established shape (`category`, `name`, `query`, `reason`, `tip`), ordered so
category runs are contiguous and anchors land on 1, 4, 7, 10 and 13.

| # | Group (`category`) | Items |
|---|---|---|
| 1–3 | `keeping gear dry` | roll-top dry bag · waterproof phone pouch · quick-dry microfiber towel |
| 4–6 | `the day pack` | packable daypack · filtered water bottle · rugged waterproof power bank |
| 7–9 | `what you wear` | quick-dry water shoes · packable rain shell · blister prevention tape |
| 10–12 | `skin, bugs & scrapes` | reef-safe mineral sunscreen stick · picaridin insect repellent · compact first-aid kit |
| 13–15 | `the small things that save a day` | rechargeable headlamp · universal travel adapter · floating camera wrist strap |

Six `tip` fields carry information the buyer cannot be expected to have. Three prevent a purchase
that is wasted, destructive, or unsafe:

- **Universal adapters do not convert voltage.** This is the item's entire reason for being on the
  list. A 110V appliance in a 240V socket is destroyed on the first night, and the adapter is
  usually blamed for a mistake it never claimed to prevent.
- **A filter is not a purifier.** Filters handle bacteria and protozoa; viruses need a purifier.
  In parts of Asia, Africa and Latin America the wrong choice is a stomach illness rather than a
  preference, and the two products look identical on a listing page.
- **Airlines cap power banks at 100Wh in carry-on and prohibit them in checked baggage.** A bank
  bought for its capacity can be confiscated at the gate. Applies to item 6 and is the reason its
  tip names a watt-hour figure rather than a milliamp-hour one.
- **Picaridin rather than DEET on this particular list.** Comparable effectiveness, and DEET
  degrades synthetics — sunglasses frames, watch straps, technical fabrics and dry-bag coatings,
  which is most of what this guide recommends. This is a compatibility argument specific to the
  list, not a general claim that one repellent beats the other.
- **Reef-safe is an entry requirement in some places, not a preference.** Hawaii and Palau restrict
  oxybenzone and octinoxate, and snorkel operators turn people away over it.
- **Roll-top dry bags need three folds to seal.** The most common reason a dry bag leaks is that it
  was closed like a lunch sack.

### `adventure-travel-essentials.html` (new)

Page shell copied from the established pattern: breadcrumb, eyebrow, h1, lede, disclosure note,
guide intro, `<div class="product-grid" data-product-grid="adventure-travel-essentials"></div>`,
Etsy related-callout, TOC aside.

The `<title>` sits on one line — the `long-title` rule counts the whitespace inside the element, so
a wrapped title fails at 75 characters even when its text is well under (`README.md`).

| Field | Value | Length |
|---|---|---|
| `<title>` | `15 Adventure Travel Essentials \| Bill's Workshop Finds` | 54 |
| `<h1>` / `og:title` | 15 Adventure Travel Essentials Worth Packing | 44 |
| eyebrow / breadcrumb | Travel | — |

The lede states the separation rule plainly, so a reader who wants packing cubes and a garment
steamer leaves for the flight attendant guide rather than bouncing.

### `products.js` (modify)

Imports `adventureTravelEssentials` from `./guides/adventure-travel-essentials.js` and registers
`"adventure-travel-essentials"` in `collections`. No changes to `escapeHtml`, `amazonUrl` or
`renderProductGrid`.

### `vite.config.js` (modify)

Adds `adventure: "adventure-travel-essentials.html"` to `rollupOptions.input`. The `closeBundle`
check already asserts every registered collection is injected exactly once, so a half-wired guide
fails the build without any change here.

### `scripts/verify-build.mjs` (modify)

One new `GUIDES` entry, plus a `links` array added to the existing travel essentials entry to
enforce the cross-link swap:

```js
{
  file: "dist/adventure-travel-essentials.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "Roll-top dry bag",
  links: ["/flight-attendant-travel-essentials", "/student-pilot-gifts"]
}
```

The existing length assertion fails the build if the entry is forgotten.

### `index.html` — home page (modify)

One change: a ninth card in `.guide-card-grid`, eyebrow "Travel & adventure", placed after the pen
pal card. The grid goes from 3 / 3 / 2 to a full 3 / 3 / 3.

The hero button and the featured slot are untouched. The classroom essentials guide keeps both, on
the same reasoning recorded in the previous spec — it is in its back-to-school season and has a
track record, and this guide has neither.

### TOC cross-links (modify, 2 files)

The two-cross-links-plus-All-guides cap holds, so the new guide is absorbed by one swap:

| Guide | Cross-links |
|---|---|
| adventure travel essentials *(new)* | flight attendant travel essentials · student pilot gifts |
| flight attendant travel essentials | **adventure travel essentials** (replaces crew dog gifts) · student pilot gifts |

`flight-attendant-dog-gifts` currently has four inbound internal links, so losing one leaves it
comfortably linked. No guide is orphaned by this change, and none gains or loses its only inbound
link.

### Footer (no change)

The Explore column collapsed to a single `/#guides` link two specs ago, so the footer does not grow
with the guide count.

### `public/sitemap.xml`, `README.md` (modify)

Adds `https://finds.billsworkshopcompany.com/adventure-travel-essentials` and the Pages-list entry.

## Verification

1. `npm run build` succeeds; `closeBundle` confirms the new collection was injected exactly once.
2. `npm run verify` passes — `lint:html` clean across all fourteen pages, then verify-build
   reporting 10 guides, 150 cards, all anchor targets present, all ten product signatures distinct.
   Note that `lint:html` globs the source pages, where the grid containers are still empty, so the
   injected cards are never linted; `verify-build` is what checks the rendered output.
3. Raw `dist/adventure-travel-essentials.html` contains the new product names, tips and tagged
   Amazon URLs — not an empty container.
4. All ten guides' rendered grids differ from one another.
5. Manual check that no item collides with a live `travel-essentials.js` item beyond the power bank
   pair recorded above, since `verify-build` only catches wholesale collection collisions.
6. `npm run dev` serves the new guide with the correct grid, confirming dev/prod parity.
7. Home page shows nine cards in a full 3 / 3 / 3 grid at desktop width, with the hero button and
   featured slot unchanged.
8. Every guide's TOC carries exactly two cross-links plus "All guides"; every internal link resolves
   extensionless.

## Risks

- **The power bank pair.** The deliberate near-collision recorded above. Nothing in the build
  enforces the distinction, so a future edit could collapse the two items onto the same query.
- **Seasonal timing is a bet.** A Spring-Summer guide published in late August is betting that
  ranking lead time exceeds the wait. That is the normal way to publish seasonal content, but the
  page will look like it is underperforming for months before its season arrives, and there is no
  analytics on this project to tell the difference between "not ranked yet" and "not working".
- **Safety-relevant tips.** The voltage caveat, the filter-versus-purifier distinction and the
  100Wh airline limit each prevent a real loss. All three live in the item `tip`, which
  `renderProductGrid` always emits.
- **Product claims that drift.** Reef-safe sunscreen rules are set per jurisdiction and change;
  the tip states the mechanism and names jurisdictions rather than promising a current list.
- **A fourth travel page.** The site now has four pages in the travel cluster. Each further travel
  guide raises the manual overlap-review burden, and the workbook holds three more travel rows that
  would compete with this one rather than complement it.
- **Affiliate compliance.** Every product link must carry `rel="sponsored nofollow noopener"` and
  the `billsworkshop-20` tag. Both are asserted per card by `verify-build` and both come from
  shared render code rather than hand-written markup.
