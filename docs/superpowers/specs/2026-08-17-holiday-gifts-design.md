# Holiday Gifts

Date: 2026-08-17
Status: Approved

## Problem

Seasonal Finds is the last home-page category card with nothing behind it. It has promised
"holiday ideas with personality, including dog-lover and aviation themes" since launch, and that
promise is now the only unkept one on the page — Everyday Workshop was answered by the first
apartment tools guide.

There is a second, larger gap. The site has six guides serving five distinct audiences, and
nothing that works across them. Every page is a destination for someone who already knows who
they are shopping for and what that person does. Nobody arrives at this site in December knowing
they want a snuffle mat.

## Goal

Publish `/holiday-gifts` — 15 gifts in five trios, one trio per audience the site already serves,
each trio routing to that audience's deeper guide — and make it the site's Q4 front door.

## Non-goals

No new card style, page shell, styling system, or affiliate treatment. No CSS change at all: six
grid cards is exactly 3 + 3 under the rule the first apartment tools guide added. The six category
cards stay decorative anchors; this does not make Seasonal Finds a linking card. This does not
revisit the search-based recommendation pattern recorded in `README.md`. The October featured-slot
swap is recorded here but NOT implemented — it is a separate one-line change.

## Decisions taken

1. **One trio per existing audience**, not a standalone holiday list and not a hub page. It
   delivers the category card's stated promise, reinforces all five other guides, and is the only
   structure that makes a seventh guide additive rather than competitive. A standalone holiday
   list would compete with every gift list on the internet on the site's weakest ground; a hub page
   would break the uniform 15-card pattern `verify-build` enforces and would rank for nothing.
2. **Undated.** No year in the title, the copy, or the URL. The site has no annual-maintenance
   process, and a page reading "2026" in February 2027 damages trust in the other six guides. The
   page peaks every Q4 and never needs a rewrite. Tagged-search links mean no specific product pick
   can rot either.
3. **Fifteen products that appear nowhere else on the site.** All 90 existing product names were
   checked against this list. The deep guides carry the practical gear; this page carries the
   giftable items, which is what keeps them disjoint without editorial effort.
4. **The editorial rule is about knowledge, not price: nothing here needs a size, a measurement,
   or any knowledge of what they already own.** That is the difference between a gift you can buy
   for someone and a gift you have to interrogate them about first. Deliberately NOT a price
   ceiling — the dog-lover, student-pilot and first-apartment specs all rejected price bands
   because Amazon prices drift under search-based links and a promised tier can silently go wrong.
5. **The classroom guide keeps the featured slot for now; this guide takes it in October.** See
   "Featured slot" below. This supersedes the dog-lover spec's planned October swap to the
   dog-lover guide, on the grounds that a page written for the season and routing into all five
   audiences is the better Q4 feature than a general gift guide.
6. **Routing lives in the body copy, not the TOC.** Each trio's intro sentence links inline to its
   deep guide. The TOC keeps the same two-cross-links-plus-All-guides cap as every other guide.

## Separation from the existing guides

The six existing guides serve cabin crew, student pilots, dog owners, elementary teachers, and
people setting up a first place. This guide serves the person buying for any of them in December,
which is a different buyer with a different question: not "what does a student pilot need" but
"what do I get someone who flies and I know nothing about it."

Every one of the 15 items was checked by name against all 90 existing items. The trios are drawn
from a different shelf than the deep guides on purpose: the deep guides answer "what is missing
from their kit", this one answers "what will look good unwrapped". A paw-print ornament kit and an
orthopedic dog bed do not compete on any query.

## Design

### `guides/holiday-gifts.js` (new)

15 items in the established shape (`category`, `name`, `query`, `reason`, `tip`), ordered so
category runs are contiguous. Five trios put the anchors on items 1, 4, 7, 10 and 13 — the pattern
every guide since the classroom one uses.

| # | Group (`category`) | Items | Trio routes to |
|---|---|---|---|
| 1–3 | `for the dog lover` | paw-print ornament kit · dog treat advent calendar · personalized dog stocking | `/dog-lover-gifts` |
| 4–6 | `for the flight attendant` | scratch-off world map · home-base coordinates keychain · portable white noise machine | `/flight-attendant-travel-essentials` |
| 7–9 | `for the student pilot` | first-solo shirttail display frame · etched airport-diagram glassware · *Stick and Rudder* | `/student-pilot-gifts` |
| 10–12 | `for the teacher` | desk mug warmer · felt-tip grading pen set · hand cream set | `/elementary-classroom-essentials` |
| 13–15 | `for the first place` | kitchen fire extinguisher · pre-seasoned cast-iron skillet · smart plug set | `/first-apartment-tools` |

The `tip` fields that carry information the buyer cannot be expected to have:

- **The shirttail frame only works for someone who has already soloed.** A student's shirt tail is
  cut off and displayed after their first solo flight. Given to someone who has soloed it is the
  best thing on this list; given to someone who has not, it is a countdown clock they did not ask
  for. Ask, or give it after the fact.
- **The advent calendar and the stocking have a hard date.** Both are useless if they arrive on the
  20th, and personalized work runs on its own lead time. Order by late November.
- **The fire extinguisher needs an ABC rating and the right mounting spot** — near the kitchen exit,
  not under the sink, because the point is reaching it while standing between the fire and the door.
- **Hand cream is not a generic gift for a teacher.** Whiteboard markers and constant hand
  sanitizer wreck their hands by December; this is the gift that reads as "you noticed."
- **Cast iron arrives pre-seasoned and stays that way with use, not ceremony.** The elaborate
  re-seasoning ritual is what puts people off owning one.
- **Smart plugs need 2.4GHz Wi-Fi.** Most do not join a 5GHz network, which is the single most
  common reason a smart-plug gift ends up back in its box in January.

Item 9 is a named title rather than a product category: *Stick and Rudder* (Langewiesche), the
1944 book on flying by feel that most instructors still recommend. It is the one item on the site
identified by name instead of by specification, which is defensible for a book — an edition of a
named title is the same thing, where "an aviation headset" is a hundred different products — and
it does not conflict with the student pilot guide's oral exam guide, which is a current-regulations
study aid rather than a book anyone reads twice.

The teacher trio is the least distinctive of the five — a mug warmer, pens and hand cream are
ordinary objects. Kept deliberately: they are what teachers actually want, and the classroom guide
already carries the interesting gear. Recorded so a future editor knows it was a choice.

### `holiday-gifts.html` (new)

Page shell copied from the established pattern: breadcrumb, eyebrow, h1, lede, disclosure note,
guide intro, `<div class="product-grid" data-product-grid="holiday-gifts"></div>`, Etsy
related-callout, TOC aside.

Titles are split, as on the classroom, pilot and first-apartment pages:

- `<title>15 Holiday Gifts With Personality | Bill's Workshop Finds</title>` — 57 characters, on
  one line (a wrapped title fails `long-title` on its own indentation; see `README.md`).
- `<h1>` and `og:title`: "15 Holiday Gifts, Grouped by Who You're Buying For" — 50 characters.

**New pattern, called out deliberately:** the guide intro carries five inline links, one per trio,
into the deep guides. Every existing page keeps its cross-links in the TOC aside only. This is a
departure from site convention and it is load-bearing for the routing design — without it the page
is a gift list that happens to sit next to six guides. A future editor removing "stray" body links
would break the thing this page exists to do.

### `products.js` (modify)

Imports `holidayGifts` from `./guides/holiday-gifts.js` and registers `"holiday-gifts"` in
`collections`. No changes to `escapeHtml`, `amazonUrl`, or `renderProductGrid`.

### `vite.config.js` (modify)

Adds `holiday: "holiday-gifts.html"` to `rollupOptions.input`, bringing it to eleven entries.

### `scripts/verify-build.mjs` (modify)

One new `GUIDES` entry:

```js
{
  file: "dist/holiday-gifts.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "First-solo shirttail display frame"
}
```

### `index.html` — home page (modify)

One new `.guide-card`, eyebrow "Seasonal finds", heading "15 Holiday Gifts With Personality",
appended as the sixth card in `.guide-card-grid`.

**No CSS change.** `.guide-card-grid` is `repeat(3, 1fr)` above 860px, `repeat(2, 1fr)` from 681 to
860px, and `1fr` below — set when the first apartment tools guide widened it. Six cards render
3 + 3, 2 + 2 + 2, and stacked respectively. This is the first time since launch that the grid is
exactly full at every breakpoint.

A seventh grid card — an eighth guide — reopens the question, at 3 + 3 + 1. That is the same debt
the first-apartment spec recorded, one guide later and unchanged.

### Featured slot

The classroom guide keeps the featured slot through this change. In October, this guide takes it:
a single `<article class="featured-guide">` swap in `index.html`, no other file touched.

This supersedes the dog-lover spec's recorded plan to feature the dog-lover guide in October. That
matters beyond bookkeeping: it is the second time a swap has been recorded in a spec and the first
time one has been superseded before happening, which is evidence about the mechanism rather than
about either guide. **A swap recorded in a spec is a reminder for whoever reads the spec next, not
a scheduled job, and nothing in the repository will execute it or warn that its date has passed.**
If the October swap matters, it needs a calendar entry somewhere outside this repository.

### TOC cross-links (modify)

The new page joins the table, and one existing link is swapped so it has an inbound link:

| Guide | Cross-links |
|---|---|
| holiday gifts | dog lover gifts · student pilot gifts |
| dog lover gifts | crew dog gifts · **holiday gifts** |
| first apartment tools | classroom essentials · dog lover gifts |
| classroom essentials | first apartment tools · dog lover gifts |
| student pilots | travel essentials · crew dog gifts |
| travel essentials | student pilots · crew dog gifts |
| crew dog gifts | travel essentials · dog lover gifts |

The new guide links to the site's two other explicitly gift-framed pages. The dog-lover guide
trades its classroom link, the weaker of its two by buyer intent, for this one. Classroom
essentials keeps one inbound link, from the first apartment tools guide.

Inbound links are thin by design here — one TOC link plus the home card, rising to the featured
slot in October. The five inline body links point outward, not inward: this page is built to
distribute traffic, not accumulate it.

### `public/sitemap.xml`, `README.md` (modify)

Adds `https://finds.billsworkshopcompany.com/holiday-gifts` and the Pages-list entry.

## Verification

1. `npm run build` succeeds; `closeBundle` confirms the new collection was injected exactly once.
2. `npm run verify` passes — `lint:html` clean across all eleven pages, then verify-build reporting
   7 guides, 105 cards, all anchor targets present, all seven product signatures distinct.
3. Raw `dist/holiday-gifts.html` contains the new product names, tips, and tagged Amazon URLs —
   not an empty container.
4. All seven guides' rendered grids differ from one another.
5. `npm run dev` serves the new guide with the correct grid, confirming dev/prod parity.
6. The home guide grid renders 3 + 3 above 860px, 2 + 2 + 2 between 681 and 860px, and one-up below
   680px, with no CSS file modified.
7. Home page still features the classroom guide, with no duplicate of it in the grid.
8. Every guide's TOC carries exactly two cross-links plus "All guides"; every internal link
   resolves extensionless; the five inline routing links in the guide intro resolve to the five
   deep guides.

## Risks

- **The routing links are undefended.** Five inline body links carry the page's whole purpose and
  nothing in the build asserts they exist. `verify-build` counts cards, anchors and affiliate
  attributes; it has no concept of a body link. An editor tidying the intro would silently reduce
  this page to an ordinary gift list.
- **Seasonality is invisible to the build.** Nothing warns that a holiday page is live in June, or
  that the October featured swap did not happen. This is the mechanism failing once already,
  documented above.
- **Item overlap with future guides.** This guide draws from the giftable shelf of five different
  audiences, which is the widest surface on the site. Every future guide in any of those five
  areas now needs a manual check against this list as well as its own neighbours.
- **The teacher trio is generic on purpose** and will look like weak editing to anyone who has not
  read this spec.
- **Two items are lead-time-dependent.** The advent calendar and the personalized stocking are the
  only products on the site that are worthless if they arrive late. Both carry it in the `tip`.
- **Affiliate compliance.** Every product link must carry `rel="sponsored nofollow noopener"` and
  the `billsworkshop-20` tag. Both are asserted per card by `verify-build` and both come from
  shared render code rather than hand-written markup.
