# Classroom Essentials Elementary Teachers Actually Use All Year

Date: 2026-08-12
Status: Approved

## Problem

The home page promises six categories — Travel & Aviation, Dog Lovers, Gifts, Teachers, Seasonal
Finds, Everyday Workshop — and delivers two guides, both aimed at flight attendants. Four
category cards describe an audience the site has no page for. The Teachers card in particular
promises "classroom helpers and gifts that respect how hard teachers actually work" and leads
nowhere.

The timing compounds it. Elementary teachers set up classrooms in the second half of August;
that is when the intent exists and when the out-of-pocket spending happens.

## Goal

Publish `/elementary-classroom-essentials` — a 15-item Amazon-first guide for K–5 teachers
equipping their own room — and make it the featured guide on the home page.

## Non-goals

No new card style, page shell, styling system, or affiliate treatment. No category landing
pages: the six cards on the home page stay decorative anchors, and connecting them to real
category pages is a separate piece of work. This does not revisit the outstanding "replace
search-based recommendations with specific reviewed products" item in `README.md` — the new
guide uses the same tagged-search pattern as the other two, so that stays one future decision
applied to all guides at once.

## Decisions taken

Five content decisions were settled before design:

1. **Teachers**, not Seasonal Finds or Everyday Workshop. It opens an empty category, hits its
   peak intent window this month, and proves the site is not solely an aviation blog.
2. **The teacher buying for their own classroom**, not a parent buying a gift. This mirrors the
   travel-essentials guide — a professional equipping themselves — and it is where the
   "what to look for" advice is strongest. Teacher-gift searches peak in May and December; a
   gift guide published now would wait months for its season.
3. **Elementary K–5.** Specificity is what makes the existing guides work. An all-grades guide
   forces generic picks and vague advice.
4. **Grouped by classroom problem**, not by time of day or by spend tier. This matches how
   `dogGifts` groups by human need rather than product type. Spend tiers were rejected because
   Amazon prices drift and the links are search-based, so a tier can silently become wrong.
5. **Featured on the home page**, taking the slot from the travel guide. It is the freshest and
   the most seasonal. The hero's "Read the newest guide" button moves with it so the two do not
   contradict each other.

## Design

### `guides/elementary-classroom-essentials.js` (new)

15 items in the established shape (`category`, `name`, `query`, `reason`, `tip`), ordered so
category runs are contiguous and the table of contents can anchor to the first item of each run.

The guide's premise is that the district supplies the curriculum and almost nothing else. The
things that make a K–5 room run — storage that survives 25 pairs of hands, a transition signal
that works without shouting, a voice that lasts to June — come out of the teacher's pocket. That
is why storage leads and why a voice amplifier earns a place ahead of anything decorative.

| # | Group (`category`) | Items |
|---|---|---|
| 1–3 | `setup & storage` | rolling 10-drawer cart · clear stackable bins with lids · label maker |
| 4–6 | `noise & transitions` | visual countdown timer · wireless doorbell chime · portable Bluetooth speaker |
| 7–9 | `display & feedback` | thermal laminator and pouches · reusable dry-erase pockets · self-inking teacher stamp set |
| 10–12 | `teacher survival` | anti-fatigue standing mat · large insulated water bottle with straw · personal voice amplifier |
| 13–15 | `worth the splurge` | wobble stools · warm plug-in lamps · rolling teacher tote |

Tips carry honest caveats in the voice of the existing guides:

- Locking casters on the cart, or it drifts across tile.
- Buy one bin size rather than an assortment; mixed footprints will not stack.
- The label maker's real price is the tape cartridge, not the unit.
- The timer disc has to be readable from the back row.
- Check the laminator's supported pouch thickness before buying pouches.
- **Check district fire-code rules before buying lamps or string lights.** Many districts
  prohibit fabric light covers and unapproved plug-in lighting outright. This caveat is the
  single most useful line in the guide and must not be softened.

Queries must not collide with any existing item's `query` — `verify-build` compares the sorted
Amazon query signature across guides and fails on a match.

### `elementary-classroom-essentials.html` (new)

Cloned from the dog-gifts shell: same header, nav, page hero, affiliate disclosure note,
`guide-layout` with the TOC aside, and footer. Canonical
`https://finds.billsworkshopcompany.com/elementary-classroom-essentials` — extensionless, per
the Vercel clean-URL rule that governs internal links, canonicals, and the sitemap.

Breadcrumb and eyebrow read "Teachers". Grid marker is
`data-product-grid="elementary-classroom-essentials"`. TOC anchors point at `#item-1`,
`#item-4`, `#item-7`, `#item-10`, `#item-13`, plus a cross-link to one existing guide and the
disclosure page.

The Etsy `related-callout` points at teacher designs rather than the profession-and-dog angle
the other two guides use.

### `products.js` (modify)

One import and one registry line:

```js
"elementary-classroom-essentials": classroomEssentials
```

No changes to `escapeHtml`, `amazonUrl`, or `renderProductGrid`.

### `vite.config.js` (modify)

Adds `classroom: "elementary-classroom-essentials.html"` to `rollupOptions.input`. The
`closeBundle` check already asserts every registered collection is injected exactly once, so a
half-wired guide fails the build without any change here.

### `index.html` (modify)

The featured-guide block switches to the classroom guide: visual number 15, eyebrow "Teachers",
new title, lede and link. The hero's "Read the newest guide" button repoints to
`/elementary-classroom-essentials`.

The travel guide moves down into `.guide-card-grid`, which then holds three cards: travel
essentials, dog gifts, classroom essentials.

### `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html` (modify)

Each gains a TOC cross-link to the classroom guide. Both are flight-attendant guides and the new
one is not, so the cross-link is a sidebar entry rather than a `related-callout` rewrite — the
asides make an audience-specific promise that a teacher guide does not answer.

### Footer, all pages (modify)

"Explore" gains a "Classroom guide" link. The footer is duplicated by design
(`partials-note.txt`), so this touches all seven HTML pages: `index`, `about`,
`affiliate-disclosure`, `privacy`, both existing guides, and the new one.

This list does not scale. At roughly five guides the three per-guide links should collapse to a
single "All guides" pointing at `/#guides`. Noted, not done now.

### `public/sitemap.xml` (modify)

Adds `https://finds.billsworkshopcompany.com/elementary-classroom-essentials`.

### `scripts/verify-build.mjs` (modify)

One new `GUIDES` entry:

```js
{
  file: "dist/elementary-classroom-essentials.html",
  cards: 15,
  anchors: [1, 4, 7, 10, 13],
  contains: "Rolling 10-drawer cart"
}
```

The existing length assertion (`GUIDES.length !== Object.keys(collections).length`) already
fails the build if the entry is forgotten, so no structural change is needed.

## Verification

1. `npm run build` succeeds.
2. `npm run verify` passes for all three guides and reports 45 cards.
3. Raw HTML of `dist/elementary-classroom-essentials.html` contains the new product names, tips,
   and tagged Amazon URLs — not an empty container.
4. All three guides' rendered grids differ from one another.
5. `npm run dev` serves the new guide with the correct grid, confirming dev/prod parity.
6. Home page shows the classroom guide featured, three cards in the grid, and a hero button
   pointing at the new guide.
7. Every page's footer links to the new guide, and every internal link resolves extensionless.

## Risks

- **Query collision.** A generic query such as `label maker` could plausibly repeat wording from
  another guide. The distinct-signature assertion in `verify-build` catches an exact match only;
  near-duplicates are a content review item, not a build failure.
- **Featured-slot churn.** Demoting the travel guide costs it home-page prominence. The hero
  button moves with the featured block so the page does not point two ways at once.
- **Fire-code advice.** The lamp recommendation carries real-world risk if the caveat is dropped
  in editing. It stays in the item's `tip`, which `renderProductGrid` always emits.
- **Affiliate compliance.** Every product link must carry `rel="sponsored nofollow noopener"`
  and the `billsworkshop-20` tag. Both are asserted per card by `verify-build` and both come
  from shared render code rather than hand-written markup.
