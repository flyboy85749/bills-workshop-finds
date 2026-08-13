# Gifts for Dog Lovers That Aren't Junk

Date: 2026-08-13
Status: Approved

## Problem

The home page promises six categories and now delivers three guides. Two of the six cards still
lead nowhere: Seasonal Finds and Everyday Workshop. The Dog Lovers card promises "useful
dog-parent finds, breed-inspired gifts and travel gear for life with a dog," and the only page
behind it is `/flight-attendant-dog-gifts` — a guide written for working cabin crew, not for a
dog owner in general.

The timing matters. Gift guides need to be indexed and aging before the Q4 window they serve;
publishing one in November is publishing it too late. Mid-August is early enough for the page to
establish itself and late enough that the work is not speculative.

## Goal

Publish `/dog-lover-gifts` — a 15-item Amazon-first gift guide for people shopping for a dog
owner — that deepens the Dog Lovers category with a gift-focused guide, without becoming a page that dies in January. Seasonal Finds remains unserved.

## Non-goals

No new card style, page shell, styling system, or affiliate treatment. No category landing
pages: the six home-page cards stay decorative anchors. No change to the featured-guide slot
(see decision 5). This does not revisit the outstanding "replace search-based recommendations
with specific reviewed products" item in `README.md` — the new guide uses the same tagged-search
pattern as the other three, so that stays one future decision applied to all guides at once.

## Decisions taken

Five content decisions were settled before design:

1. **Seasonal**, not Everyday Workshop, a pilot guide, or a second teacher guide. The seasonal
   *timing* drove this decision—a gift guide published in August has time to age into its own season.
2. **Dog lovers**, not teachers or flight crew. It carries the broadest search volume of the
   candidate personas and deepens a category the site already established, so the new page and
   the existing dog guide reinforce each other rather than starting a fourth audience cold.
3. **Evergreen title with seasonal framing.** The page is titled "15 Gifts for Dog Lovers That
   Aren't Junk" rather than naming Christmas or a year. A Christmas title matches high-intent
   seasonal queries but reads as dead weight for eight months; a year in the title needs an
   annual retitle or it looks abandoned. The lede names holiday shopping as the moment most
   readers arrive and carries one seasonal caution — check sizing and the return window before
   December — which earns the seasonal relevance without dating the page. The guide also stays
   valid for birthdays and Mother's/Father's Day, which is where its non-Q4 traffic comes from.
4. **Grouped by recipient**, not by price band or by problem. A gift-buyer's actual question is
   "what is this person's dog like?", so the groups answer that question directly. Price bands
   were rejected for the same reason the classroom guide rejected spend tiers: Amazon prices
   drift and the links are search-based, so a tier can silently become wrong. Grouping by problem
   is the house pattern but reads as a gear guide rather than a gift guide.
5. **Not featured on the home page.** The classroom guide keeps the featured slot. Its season is
   happening now — elementary teachers set up rooms in the second half of August — while this
   guide's window is Q4. Swapping the feature in October gets both guides featured during the
   period each one converts. That is a one-line change later, deliberately not made now.

## Separation from the existing dog guide

The two dog pages must not cannibalize each other. `flight-attendant-dog-gifts` answers "my job
takes me away from my dog": remote care, crew-bag practicality, wearables. This guide answers
"I am buying a present for someone whose dog I know a little about."

No item repeats across the two. The near-misses were routed around deliberately, and this is a
content constraint, not a build-enforced one:

- The heartbeat comfort toy is taken, so the puppy group leads with enrichment rather than
  separation comfort.
- The calming donut bed is taken, so the senior group takes an orthopedic memory-foam bed.
- The GPS tracker, automatic feeder and collapsible travel bowl are taken and have no substitute
  here; the adventure group covers leash, car and drying instead.
- The custom photo blanket is taken, so the personalization group uses line-art rather than
  photo-print.
- The reusable lint roller is taken, so the apartment group takes a handheld grooming vacuum,
  which solves shedding at the source rather than on clothing.

## Design

### `guides/dog-lover-gifts.js` (new)

15 items in the established shape (`category`, `name`, `query`, `reason`, `tip`), ordered so
category runs are contiguous and the table of contents can anchor to the first item of each run.
Five groups of three put the anchors on items 1, 4, 7, 10 and 13 — the same pattern the dog and
classroom guides use.

| # | Group (`category`) | Items |
|---|---|---|
| 1–3 | `new puppy` | snuffle enrichment mat · foldable indoor playpen · freezable stuffable chew toy |
| 4–6 | `senior dog` | orthopedic memory-foam bed · folding ramp for bed or sofa · adjustable elevated feeder |
| 7–9 | `the dog that goes everywhere` | hands-free bungee running leash · waterproof back-seat hammock · microfiber drying coat |
| 10–12 | `apartment dog` | handheld pet grooming vacuum · airtight rolling food bin · odor-sealing waste pail |
| 13–15 | `for the person, not the dog` | custom line-art portrait · personalized name doormat · breed identification DNA kit |

Each `reason` names the repeating problem the gift solves. Each `tip` is a real pre-purchase
check, not a restatement of the reason:

- A snuffle mat has to go in the washing machine, because its whole job is holding food.
- Measure the playpen's panel height against the dog rather than trusting the label.
- Freezable chew toys need the right size band; an undersized one is a choking risk.
- Orthopedic beds should state real memory-foam thickness — an egg-crate layer over polyfill is
  not orthopedic whatever the listing says.
- **A ramp must state a weight rating above the dog's weight, and the surface has to be gripped
  rather than smooth.** A ramp that slips is worse than no ramp for the arthritic dog it was
  bought for. This caveat stays in the item's `tip`.
- Elevated feeders suit some dogs and not others; height should match the dog's chest, and the
  owner should raise it with their vet if the dog is a large deep-chested breed.
- Confirm the car hammock's anchor style fits the recipient's back seat and does not block a
  seatbelt buckle.
- Grooming vacuums are rated by suction and bin size; a small bin turns one grooming session into
  four emptying trips.
- A DNA kit's headline price often excludes ongoing membership fees. Confirm the total cost, and
  check the kit ships to the recipient's country.
- Personalized items have long production times and are usually non-returnable, which is the
  single most useful caveat for a holiday buyer. Order early.

Queries must not collide with any existing item's `query`. `verify-build` compares the sorted
Amazon query signature across guides and fails on a whole-guide match; per-item near-duplicates
are a content review item, not a build failure.

### `dog-lover-gifts.html` (new)

Cloned from `elementary-classroom-essentials.html`, the newest and cleanest shell: same header,
nav, page hero, affiliate disclosure note, `guide-layout` with the TOC aside, and footer.
Canonical `https://finds.billsworkshopcompany.com/dog-lover-gifts` — extensionless, per the
Vercel clean-URL rule that governs internal links, canonicals, and the sitemap.

Breadcrumb and eyebrow read "Dog lovers", deliberately distinct from the crew guide's "Gifts &
dog lovers". Grid marker is `data-product-grid="dog-lover-gifts"`. TOC anchors point at
`#item-1`, `#item-4`, `#item-7`, `#item-10`, `#item-13`, plus cross-links to the existing guides
and the disclosure page.

The Etsy `related-callout` points at dog-lover designs rather than the profession-and-dog angle
the crew guide uses.

### `products.js` (modify)

One import and one registry line:

```js
"dog-lover-gifts": dogLoverGifts
```

No changes to `escapeHtml`, `amazonUrl`, or `renderProductGrid`.

### `vite.config.js` (modify)

Adds `dogLovers: "dog-lover-gifts.html"` to `rollupOptions.input`. The `closeBundle` check
already asserts every registered collection is injected exactly once, so a half-wired guide fails
the build without any change here.

### `index.html` (modify)

The featured-guide block is untouched. `.guide-card-grid` gains a fourth card for the dog-lover
guide, with the eyebrow "Dog lovers".

### `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html`, `elementary-classroom-essentials.html` (modify)

Each gains a TOC cross-link to the new guide, inserted before the disclosure link, matching how
the classroom guide was cross-linked from the other two.

### Footer, all pages (modify)

"Explore" gains a "Dog lover gifts" link. The footer is duplicated by design
(`partials-note.txt`), so this touches all eight HTML pages: `index`, `about`,
`affiliate-disclosure`, `privacy`, the three existing guides, and the new one.

The previous spec noted this list stops scaling at about five guides, where the per-guide links
should collapse to a single "All guides" pointing at `/#guides`. This guide makes four. The
observation stands and the collapse is still not done here — but the next guide should do it
rather than add a fifth link.

### `public/sitemap.xml` (modify)

Adds `https://finds.billsworkshopcompany.com/dog-lover-gifts`.

### `scripts/verify-build.mjs` (modify)

One new `GUIDES` entry:

```js
{
  file: "dist/dog-lover-gifts.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "Snuffle mat"
}
```

The existing length assertion (`GUIDES.length !== Object.keys(collections).length`) already fails
the build if the entry is forgotten, so no structural change is needed.

### `README.md` (modify)

Adds the guide to the Pages list.

## Verification

1. `npm run build` succeeds.
2. `npm run verify` passes for all four guides and reports 60 cards.
3. Raw HTML of `dist/dog-lover-gifts.html` contains the new product names, tips, and tagged
   Amazon URLs — not an empty container.
4. All four guides' rendered grids differ from one another.
5. `npm run dev` serves the new guide with the correct grid, confirming dev/prod parity.
6. Home page shows four cards in the guide grid and the classroom guide still featured.
7. Every page's footer links to the new guide, all three existing guides cross-link to it in
   their TOC, and every internal link resolves extensionless.

## Risks

- **Cannibalization.** Two dog pages can compete for the same queries. Mitigated by disjoint item
  lists, a distinct audience framing in the lede, and different eyebrow labels — but nothing in
  the build enforces it, so item overlap is a review item on every future dog guide.
- **Seasonal framing decay.** An evergreen title trades peak-season click-through for
  year-round relevance. Accepted deliberately; if Q4 data shows the page underperforming against
  explicitly seasonal competitors, the title is a cheap experiment to run later.
- **Ramp safety advice.** The weight-rating and grip caveat carries real-world risk to an elderly
  dog if dropped in editing. It stays in the item's `tip`, which `renderProductGrid` always emits.
- **Personalized-item lead times.** A holiday buyer who orders a custom portrait on December 20
  will not receive it. The caveat lives in the item `tip` for the same reason.
- **Footer link growth.** Four per-guide footer links is the practical ceiling. Recorded above as
  a debt the next guide pays.
- **Affiliate compliance.** Every product link must carry `rel="sponsored nofollow noopener"` and
  the `billsworkshop-20` tag. Both are asserted per card by `verify-build` and both come from
  shared render code rather than hand-written markup.
