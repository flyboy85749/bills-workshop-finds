# Retro Classroom Decor & The Pen Pal Starter Kit

Date: 2026-08-19
Status: Draft — awaiting review

## Problem

Two rows of the Pinterest Trend Opportunity Workbook were selected for build: **Throwback Kid**
(target keyword `retro classroom decor`, back-to-school) and **Pen Pals** (target keyword
`pen pal supplies`, evergreen plus holidays). Neither has a page on the site.

The Throwback Kid row is the harder of the two, because the site already ranks a teacher guide.
`/elementary-classroom-essentials` is the current featured guide and holds fifteen items chosen
for function. A second teacher guide built carelessly would split the same query space, duplicate
products, and cannibalise the page that is in its peak season this week.

The Pen Pals row has the opposite problem: it opens an audience the site has never addressed.
Nothing here is written for stationery, letter-writing, or the snail-mail revival, so the guide
arrives with no internal link equity and no category card of its own.

## Goal

Publish two guides in one pass — `/retro-classroom-decor` and `/pen-pal-starter-kit`, fifteen
items each — wired through the full checklist in `README.md`, and re-point the home page's
back-to-school messaging at the new decor guide.

## Non-goals

No new card style, page shell, styling system, or affiliate treatment. No category landing pages.
This does not revisit the standing "replace search-based recommendations with specific reviewed
products" item in `README.md` — both new guides use the same tagged-search pattern as the other
seven, so that stays one future decision applied to all guides at once. No new category card for
the stationery audience (see "Home page" below). The partial extraction contemplated by
`partials-note.txt` stays out of scope.

## Decisions taken

1. **The decor guide is pure decor, not retro-styled essentials.** The live classroom guide owns
   *function*; this one owns *how the room looks*. This was chosen over two alternatives —
   retro-styled versions of the same essentials, and nostalgia gifts *for* teachers — because it
   is the only framing that both matches the `retro classroom decor` keyword exactly and produces
   a disjoint item list. See "Separation from the classroom guide" below.

2. **The pen pal guide is written for the adult letter-writing hobbyist**, not for children or
   parents setting up a first pen pal, and not split across both. The adult framing carries
   higher-ticket items (fountain pens, bottled ink, wax seals, archival storage), matches the
   site's existing voice, and keeps buyer intent legible. The kid framing has more Pinterest
   volume but thinner commissions, and a split guide muddies both.

3. **Fifteen items each**, matching all seven existing guides and the `cards: 15` assertion in
   `verify-build`. The workbook's title for the pen pal row carries no number; the guide adopts
   one for consistency with the rest of the site.

4. **Five groups of three**, putting anchors on items 1, 4, 7, 10 and 13 — the pattern every
   guide since the classroom guide uses.

5. **The retro decor guide takes the featured slot**, displacing the classroom essentials guide,
   which moves down into the card grid. This reverses the recommendation made during design. The
   reason is coherence rather than performance: the hero button now points at the decor guide
   (decision 6), and leaving a *different* teacher guide in the featured block directly beneath
   would put two competing teacher claims above the fold in the same week.

6. **The hero button points at `/retro-classroom-decor` and reads "Back-to-school favorite".**
   The button previously read "Read the newest guide" and pointed at
   `/elementary-classroom-essentials`, which stopped being the newest guide two guides ago — the
   label was already stale and is fixed here.

   **This is a bet, not a measurement, and is recorded as such.** Vercel Web Analytics is not
   enabled on the project (`get_web_analytics` returns `404 Web Analytics not found`), so no
   traffic data was available to identify the most popular back-to-school guide. The target was
   chosen by the site owner on the expectation that the Throwback Kid trend outperforms. If it
   does not, the fix is a one-line `href` change. Enabling Web Analytics would turn this class of
   decision into a measurement; that is a suggestion, not part of this change.

7. **No "Writing & Stationery" category card.** `.category-grid` is `repeat(3, 1fr)`
   (`styles.css:258`) and currently holds a clean six. A seventh would leave a single orphaned
   card on its own row. The pen pal guide sits under the existing "Gifts" card, which already
   promises "thoughtful collections for specific personalities, professions and occasions".

8. **The guide card grid is allowed to land at eight.** See "Home page" below.

## Separation from the classroom guide

`elementary-classroom-essentials` answers "my room has to survive twenty-five pairs of hands for
a year." `retro-classroom-decor` answers "my room works, but it feels like a cinderblock box."

All fifteen live classroom items were checked against the proposed decor list. One genuine
collision was found and routed around:

- **Warm plug-in lamps** (`plug in table lamp warm light classroom`) already exist in the live
  guide, complete with the fire-code caveat about districts restricting plug-in lighting and
  string lights. Lighting is the first thing a decor list reaches for, so this is the collision
  most likely to happen by accident. **Lighting is excluded from the decor guide entirely** and
  the fire-code caveat stays with the guide that already carries it.

Two further near-misses were avoided by specification rather than exclusion:

- The live guide's **clear stackable bins** are storage specified by visibility and stacking. The
  decor guide's **metal storage tins** are specified by appearance and are not sold or searched
  as classroom storage.
- The live guide's **thermal laminator** covers display durability. The decor guide's
  **bulletin board paper and border trim** cover display *surface*, a different product category.

This is a content constraint, not a build-enforced one. `verify-build` compares the sorted set of
Amazon queries per guide and only catches a wholesale collection collision, not two or three
shared items. Manual review is required on every future teacher guide.

## Design

### `guides/retro-classroom-decor.js` (new)

| # | Group (`category`) | Items |
|---|---|---|
| 1–3 | `walls & charts` | vintage pull-down map reproduction · retro science & botanical charts · cursive penmanship alphabet strip |
| 4–6 | `signage & letters` | felt letter board · wooden schoolhouse-style sign · library pockets & date-due cards |
| 7–9 | `the reading corner` | washable low-pile area rug · wooden crate book display · silent-sweep schoolhouse clock |
| 10–12 | `boards & display` | kraft bulletin board paper roll · scalloped border trim · clothespin & twine photo line |
| 13–15 | `objects with mileage` | clamp-mount hand-crank pencil sharpener · vintage-style desk globe · decorative metal storage tins |

Five `tip` fields carry information the buyer cannot be expected to have, and two of them prevent
a purchase that cannot legally or physically be installed:

- **Wall coverage is capped in most districts.** Many limit the percentage of wall area that may
  be covered with paper or fabric and prohibit hanging anything from the ceiling. This is enforced
  by the fire marshal, not the principal, and it applies to the paper, trim, banner and photo-line
  items. The tip tells the reader to check the building policy before buying by the roll.
- **The hand-crank sharpener must be clamp-mount, not screw-mount.** Wall-mounted units need to be
  drilled into a solid surface, which most buildings will not permit a teacher to do without
  custodial approval. A clamp-mount unit gets the same object onto a desk or shelf edge with no
  holes. Wrong version, unusable gift.
- **Actual vintage maps show dissolved countries.** A genuine mid-century pull-down map has the
  USSR, Yugoslavia and Rhodesia on it. That is charming as decor and actively confusing if a child
  reads it as current, so the tip tells the buyer to choose a reproduction for a room where the
  map will be read, and to place a genuine one where it will only be looked at.
- **Silent sweep, not ticking.** A ticking second hand is inaudible in a shop and maddening in a
  quiet room during testing.
- **The rug is the only item that gets stepped on two hundred times a day.** Machine-washable,
  low pile, and either a non-slip backing or a separate pad — a rug that slides is a fall.

### `guides/pen-pal-starter-kit.js` (new)

| # | Group (`category`) | Items |
|---|---|---|
| 1–3 | `what you write on` | fountain-pen-friendly writing pad · airmail-style letter set · blank correspondence cards |
| 4–6 | `what you write with` | starter fountain pen · bottled fountain pen ink · archival fine-tip rollerballs |
| 7–9 | `sealing & sending` | wax seal kit · digital postal scale · self-inking return address stamp |
| 10–12 | `what goes in the envelope` | washi tape set · vintage ephemera & sticker pack · portable phone photo printer |
| 13–15 | `keeping it going` | acid-free archival letter box · hardcover address book · portable lap desk |

Six `tip` fields, two of which prevent a wasted purchase and one of which is a safety note:

- **Copy paper feathers and bleeds under fountain ink.** Smooth 80–100 gsm paper is the single
  thing that makes the pen feel worth owning. Pairing a good pen with bad paper is the most common
  way a beginner concludes fountain pens are not for them.
- **Never put India ink or pigmented/waterproof ink in a fountain pen.** It dries in the feed and
  the pen is finished. This is the highest-consequence tip on the page and the easiest to lose to
  brevity, which is why it lives in the ink item's `tip` rather than in the intro.
- **Wax seals and square envelopes trigger the USPS non-machinable surcharge.** A rigid, lumpy
  seal jams automated sorting equipment, so a sealed letter needs the surcharge and hand-cancelling
  at the counter. Sending one at ordinary postage risks it coming back. This is the tip that makes
  the postal scale item make sense, and the two are placed in the same group for that reason.
- **Archival means acid-free *and* lignin-free.** Ordinary cardboard yellows and embrittles the
  letters the box was bought to protect, over years rather than months.
- **A PO box, not a home address, for pen pals met online.** Attached to the address book item.
  This is a safety note and stays in the item `tip`, which `renderProductGrid` always emits.
- **Fine nib, and a converter rather than cartridges only.** A converter lets the pen use bottled
  ink, which is what makes item 5 usable; a cartridge-only pen strands the buyer on proprietary
  refills.

### `retro-classroom-decor.html`, `pen-pal-starter-kit.html` (new)

Page shell copied from the established pattern: breadcrumb, eyebrow, h1, lede, disclosure note,
guide intro, `<div class="product-grid" data-product-grid="<slug>"></div>`, Etsy related-callout,
TOC aside.

Titles are split so the `<title>` clears the `long-title` gate, and each `<title>` sits on one
line — the rule counts the whitespace inside the element, so a wrapped title fails at 75
characters even when its text is well under (`README.md`).

| Page | `<title>` (chars) | `<h1>` / `og:title` (chars) | Eyebrow |
|---|---|---|---|
| retro classroom decor | `15 Retro Classroom Decor Ideas \| Bill's Workshop Finds` (54) | 15 Retro Classroom Decor Finds That Warm Up a Cold Room (55) | Teachers |
| pen pal starter kit | `The Ultimate Pen Pal Starter Kit \| Bill's Workshop Finds` (56) | The Ultimate Pen Pal Starter Kit: 15 Things Worth Owning (56) | Writing & stationery |

The decor guide's lede states the editorial rule — that this guide is about how the room feels,
and the guide it links to covers what the room needs — so a reader who wants carts and laminators
leaves for the right page instead of bouncing. The pen pal lede addresses an adult writing to a
person they may never have met, which sets up both the archival-storage group and the PO box tip.

### `products.js` (modify)

Imports `retroClassroomDecor` and `penPalStarterKit`, registers `"retro-classroom-decor"` and
`"pen-pal-starter-kit"` in `collections`. No changes to `escapeHtml`, `amazonUrl` or
`renderProductGrid`.

### `vite.config.js` (modify)

Adds `retroClassroom: "retro-classroom-decor.html"` and `penPal: "pen-pal-starter-kit.html"` to
`rollupOptions.input`. The `closeBundle` check already asserts every registered collection is
injected exactly once, so a half-wired guide fails the build without any change here.

### `scripts/verify-build.mjs` (modify)

Two new `GUIDES` entries:

```js
{
  file: "dist/retro-classroom-decor.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "Vintage pull-down map reproduction"
},
{
  file: "dist/pen-pal-starter-kit.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "Starter fountain pen"
}
```

The existing length assertion fails the build if either entry is forgotten.

### `index.html` — home page (modify)

Three changes.

**Hero button.** `href` moves from `/elementary-classroom-essentials` to `/retro-classroom-decor`
and the label moves from "Read the newest guide" to "Back-to-school favorite". Decision 6 records
that this target is a bet rather than a measurement.

**Featured slot.** The featured guide becomes retro classroom decor — visual number `15`, caption
"Retro decor that warms up a cinderblock room", eyebrow "Teachers", chips Walls · Signage ·
Reading corner · Display. The classroom essentials guide moves down into the card grid.

**Card grid.** Goes from six cards to eight: the classroom essentials guide arrives from the
featured slot, and the pen pal guide is added. The retro decor guide does not appear here, because
it now occupies the featured slot.

| Slot | Card | Eyebrow |
|---|---|---|
| 1 | 15 Flight Attendant Travel Essentials | Travel & aviation |
| 2 | 15 Gifts for Flight Attendants Who Love Dogs | Gifts & dog lovers |
| 3 | 15 Gifts for Student Pilots | Student pilots |
| 4 | 15 Gifts for Dog Lovers That Aren't Junk | Dog lovers |
| 5 | 15 Tools for a First Apartment | Everyday workshop |
| 6 | 15 Holiday Gifts With Personality | Seasonal finds |
| 7 | 15 Classroom Essentials Elementary Teachers Use All Year | Teachers |
| 8 | The Ultimate Pen Pal Starter Kit | Writing & stationery |

`.guide-card-grid` is `repeat(3, 1fr)` at desktop (`styles.css:246`), so eight cards render as
3 / 3 / 2 with a short final row. This is accepted rather than padded. The alternative — repeating
the featured guide as a grid card to reach nine — is the exact duplication the student-pilot spec
removed, and the next guide added closes the row anyway. At the two-column breakpoint
(`styles.css:372`) eight is a clean four rows, and at one column it does not arise.

The home page `meta name="description"` gains the stationery audience: "…for travel, aviation, dog
lovers, teachers, letter writers and everyday life."

### TOC cross-links (modify, 4 files)

The two-cross-links-plus-All-guides cap set by the student-pilot spec holds, so the two new guides
are absorbed by swapping links rather than lengthening any list:

| Guide | Cross-links |
|---|---|
| retro classroom decor *(new)* | classroom essentials · pen pal starter kit |
| pen pal starter kit *(new)* | retro classroom decor · holiday gifts |
| classroom essentials | **retro classroom decor** (replaces first apartment tools) · dog lover gifts |
| holiday gifts | dog lover gifts · **pen pal starter kit** (replaces student pilots) |

Neither dropped link orphans its target: `first-apartment-tools` keeps its inbound link from the
classroom guide's own reciprocal entry in the first-apartment TOC, and `student-pilot-gifts` keeps
its inbound link from the travel essentials TOC.

### Footer (no change)

The Explore column was collapsed to a single `/#guides` link by the student-pilot spec, so the
footer does not grow with the guide count and no page needs editing here. This is the first guide
addition where that debt payment pays off.

### `public/sitemap.xml`, `README.md` (modify)

Adds `https://finds.billsworkshopcompany.com/retro-classroom-decor` and
`https://finds.billsworkshopcompany.com/pen-pal-starter-kit`, plus the two Pages-list entries.

## Verification

1. `npm run build` succeeds; `closeBundle` confirms both new collections were injected exactly
   once.
2. `npm run verify` passes — `lint:html` clean across all thirteen pages, then verify-build
   reporting 9 guides, 135 cards, all anchor targets present, all nine product signatures distinct.
3. Raw `dist/retro-classroom-decor.html` and `dist/pen-pal-starter-kit.html` contain the new
   product names, tips and tagged Amazon URLs — not an empty container.
4. All nine guides' rendered grids differ from one another.
5. Manual check that no decor item collides with a live classroom-essentials item, since
   `verify-build` only catches wholesale collection collisions.
6. `npm run dev` serves both new guides with the correct grid, confirming dev/prod parity.
7. Home page: hero button reads "Back-to-school favorite" and resolves to `/retro-classroom-decor`;
   retro decor occupies the featured slot; the card grid shows eight cards with no duplicate of the
   featured guide.
8. Every guide's TOC carries exactly two cross-links plus "All guides"; every internal link
   resolves extensionless.

## Risks

- **Cannibalisation of the classroom guide.** Two teacher pages now compete for overlapping
  queries in the same season. The decor/function split is the mitigation, but it is editorial and
  unenforced — nothing in the build stops a future edit from drifting the decor guide back toward
  essentials.
- **Displacing a guide in its peak week.** The classroom essentials guide loses both the hero
  button and the featured slot during back-to-school, in favour of a page with no track record.
  Decision 6 records this as a deliberate bet; both changes are one-line reversions.
- **No analytics to check the bet against.** Web Analytics is not enabled, so there is no way to
  tell afterwards whether the swap helped. Enabling it is the obvious follow-up and is out of
  scope here.
- **Fire-code and mounting tips.** The wall-coverage cap and the clamp-mount requirement are the
  two tips on the decor page that prevent an unusable purchase, and both are easy to lose to
  editing for brevity.
- **Fountain pen ink compatibility.** India or pigmented ink in a fountain pen destroys the pen.
  Highest-consequence tip on the pen pal page.
- **USPS surcharge rules drift.** Non-machinable surcharge amounts change with postage rates. The
  tip states the rule (rigid seals and square envelopes are non-machinable) rather than a price,
  so it does not go stale with the next rate change.
- **A brand-new audience with no internal link equity.** The pen pal guide arrives with two
  inbound TOC links and one grid card, and no category card. If it underperforms, the first thing
  to try is a category card, which requires taking `.category-grid` from six to nine rather than
  seven.
- **Affiliate compliance.** Every product link must carry `rel="sponsored nofollow noopener"` and
  the `billsworkshop-20` tag. Both are asserted per card by `verify-build` and both come from
  shared render code rather than hand-written markup.
