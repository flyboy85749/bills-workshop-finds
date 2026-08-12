# Elementary Classroom Essentials Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/elementary-classroom-essentials`, a 15-item Amazon-first guide for K–5 teachers equipping their own classroom, and make it the featured guide on the home page.

**Architecture:** This is a static multi-page site built by Vite. Guide content lives in `guides/<slug>.js` as an array of plain objects; `products.js` registers those arrays in a `collections` map and renders them to HTML strings; a Vite plugin (`vite.config.js`) injects the rendered grid into any `<div data-product-grid="<slug>"></div>` at build time. There is no client-side rendering and no runtime data fetch. Adding a guide is therefore: one data file, one registry line, one HTML page, one Vite input, one verification entry.

**Tech Stack:** Vite 7 (MPA mode), vanilla HTML/CSS/JS, no framework, no test runner. `scripts/verify-build.mjs` is the test harness — it asserts against the built `dist/` HTML.

## Global Constraints

- **Node scripts only.** No new npm dependencies. The project has exactly one devDependency (`vite`).
- **Amazon tag is `billsworkshop-20`.** Never hand-write an Amazon URL. `renderProductGrid()` builds every product link, applies the tag, and applies `rel="sponsored nofollow noopener"`. Hand-written product links will fail verification.
- **Extensionless internal links.** Vercel serves pages without `.html`. Every internal `href`, every `<link rel="canonical">`, and every `sitemap.xml` entry uses the clean path (`/elementary-classroom-essentials`, never `/elementary-classroom-essentials.html`). Files in `dist/` keep their `.html` names; Vercel maps the clean path at request time.
- **Header and footer are duplicated in every HTML page on purpose** (see `partials-note.txt`) so pages stay deployable on plain static hosting. A footer change means editing every page.
- **Item shape is fixed:** `{ category, name, query, reason, tip }`. All five fields are required on every item. `renderProductGrid()` emits all of them.
- **The fire-code caveat in item 14 must ship verbatim.** It is the most useful line in the guide and carries real-world consequences. Do not shorten or soften it.
- **The slug is `elementary-classroom-essentials`** everywhere: data file name, `collections` key, `data-product-grid` value, HTML filename, canonical path, sitemap entry.
- **Verification commands** are `npm run build` then `npm run verify`. `npm run verify` reads `dist/`, so the build must run first.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `guides/elementary-classroom-essentials.js` | Create | The 15 items. Content only — no logic, no imports. |
| `products.js` | Modify | Add one import and one `collections` entry. |
| `elementary-classroom-essentials.html` | Create | Page shell + grid marker + TOC. No product markup. |
| `vite.config.js` | Modify | Add the page to `rollupOptions.input`. |
| `scripts/verify-build.mjs` | Modify | Add one `GUIDES` entry. |
| `index.html` | Modify | Featured slot, hero button, third guide card, footer. |
| `flight-attendant-travel-essentials.html` | Modify | TOC cross-link, footer. |
| `flight-attendant-dog-gifts.html` | Modify | TOC cross-link, footer. |
| `about.html`, `affiliate-disclosure.html`, `privacy.html` | Modify | Footer only. |
| `public/sitemap.xml` | Modify | One `<url>` entry. |
| `README.md` | Modify | Pages list. |

**Why Task 1 is one task and not four:** `vite.config.js`'s `closeBundle` hook asserts that every key in `collections` was injected into exactly one page. Registering the collection without shipping a page that carries its marker **fails the build**. The data file, the registry line, the page, and the Vite input are therefore a single atomic change — there is no intermediate state that builds.

---

### Task 1: Ship the guide page

**Files:**
- Create: `guides/elementary-classroom-essentials.js`
- Create: `elementary-classroom-essentials.html`
- Modify: `products.js:1-8`
- Modify: `vite.config.js:49-57`
- Modify: `scripts/verify-build.mjs:6-19`

**Interfaces:**
- Consumes: `renderProductGrid(key)` from `products.js`, invoked by the Vite plugin — not called directly by this task. `SITE.amazonTag` from `site.js`.
- Produces: the collection key `"elementary-classroom-essentials"`, and the exported binding `classroomEssentials` from `guides/elementary-classroom-essentials.js`. Task 2 and Task 3 rely on the page existing at the clean path `/elementary-classroom-essentials`.

- [ ] **Step 1: Write the failing check**

Add the new entry to the `GUIDES` array in `scripts/verify-build.mjs`, after the `flight-attendant-dog-gifts` entry:

```js
  {
    file: "dist/flight-attendant-dog-gifts.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Treat-tossing pet camera"
  },
  {
    file: "dist/elementary-classroom-essentials.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Rolling 10-drawer cart"
  }
```

- [ ] **Step 2: Run the check to verify it fails**

```bash
npm run build && npm run verify
```

Expected: the build succeeds (nothing is wired yet) and `verify` FAILS with
`GUIDES has 3 entries but collections has 2 — a guide is registered but not checked, or checked but not registered.`

- [ ] **Step 3: Create the content file**

Create `guides/elementary-classroom-essentials.js`:

```js
export const classroomEssentials = [
  {
    category: "setup & storage",
    name: "Rolling 10-drawer cart",
    query: "rolling cart 10 drawer organizer classroom",
    reason: "Ten labeled drawers hold a week of centers, small-group sets and copies, and the whole thing rolls to wherever the lesson is happening instead of anchoring the materials to one corner of the room.",
    tip: "Check that the casters lock. An unlocked cart drifts across tile every time a child leans on it, and the locking versions cost a dollar or two more."
  },
  {
    category: "setup & storage",
    name: "Clear stackable bins with lids",
    query: "clear stackable storage bins with lids latching",
    reason: "Seeing the contents without opening the lid is the difference between a five-second grab and a dig through three bins, which matters when twenty-five children are waiting on you.",
    tip: "Buy one size in quantity rather than an assortment pack. Mixed footprints will not stack, and stacking is the entire reason to buy them."
  },
  {
    category: "setup & storage",
    name: "Label maker",
    query: "label maker machine tape cartridge handheld",
    reason: "Printed labels survive a year of bins being emptied and refilled by children who cannot yet read a handwritten sticky note.",
    tip: "The purchase price is not the real price. Check what a replacement tape cartridge costs and how many feet it holds before committing to a system."
  },
  {
    category: "noise & transitions",
    name: "Visual countdown timer",
    query: "visual countdown timer classroom 60 minute",
    reason: "A shrinking colored disc tells a six-year-old how much time is left without requiring them to read a clock, which removes most of the negotiating at the end of an activity.",
    tip: "Check the size against your room. A timer sized for a desk is unreadable from the back tables, and one that only the front row can see causes the arguments it was bought to prevent."
  },
  {
    category: "noise & transitions",
    name: "Wireless doorbell chime",
    query: "wireless doorbell chime multiple tones portable",
    reason: "A chime gets thirty children's attention without the teacher raising their voice, and a single press cuts through room noise in a way a raised voice competes with.",
    tip: "Pick a model with several selectable tones and a volume control. A single tone stops working within about a month, once the class has habituated to it."
  },
  {
    category: "noise & transitions",
    name: "Portable Bluetooth speaker",
    query: "portable bluetooth speaker classroom loud battery",
    reason: "Music running the clean-up routine means the transition ends when the song ends rather than when the teacher finishes counting down.",
    tip: "Pairing speed matters more than sound quality here. A speaker that takes thirty seconds to reconnect has already lost the transition you bought it for."
  },
  {
    category: "display & feedback",
    name: "Thermal laminator and pouches",
    query: "thermal laminator machine classroom pouches",
    reason: "Anything a child handles daily — name plates, center cards, sorting pieces — lasts about a week unlaminated and the whole year laminated.",
    tip: "Confirm the pouch thickness the machine supports before buying pouches in bulk. A 3 mil machine jams on 5 mil pouches, and that mismatch is the most common reason these get returned."
  },
  {
    category: "display & feedback",
    name: "Reusable dry-erase pockets",
    query: "reusable dry erase pockets sleeves classroom",
    reason: "One printed page in a sleeve replaces a class set of copies every time you reuse it, which makes this one of the few classroom purchases that pays for itself within a semester.",
    tip: "Seal quality separates the good ones from the rest. Cheap sleeves ghost within a month and stop wiping clean, so check that the edges are sealed on all sides."
  },
  {
    category: "display & feedback",
    name: "Self-inking teacher stamp set",
    query: "self inking teacher stamps grading set",
    reason: "Stamping a stack of papers is faster than writing the same three words twenty-five times, and children respond to a stamp in a way they do not respond to a check mark.",
    tip: "Choose refillable self-inking stamps. The sealed ones dry out partway through the year and cost about what the set cost in the first place."
  },
  {
    category: "teacher survival",
    name: "Anti-fatigue standing mat",
    query: "anti fatigue standing mat classroom desk",
    reason: "Elementary teaching is a standing job done on a concrete slab under thin tile, and the ache at the end of the day comes from the floor as much as from the hours.",
    tip: "Look for beveled edges. A mat with a square lip in a classroom is a trip hazard, and in most rooms it is a child who will catch it."
  },
  {
    category: "teacher survival",
    name: "Large insulated water bottle with straw",
    query: "insulated water bottle straw handle 40 oz",
    reason: "A teacher cannot leave the room to get a drink, so the bottle has to hold enough for the stretch between breaks and open with whichever hand is free.",
    tip: "Straw lids work one-handed and screw tops do not. Measure your desk drawer or cup holder before buying the largest size — the 40 oz bottles do not fit most of them."
  },
  {
    category: "teacher survival",
    name: "Personal voice amplifier",
    query: "personal voice amplifier teacher headset microphone",
    reason: "Teachers lose their voice every year for the same reason, projecting across a room for six hours a day, and this is the only item here that protects something the job cannot work without.",
    tip: "Check the battery life against a full school day and whether the headset is comfortable for hours rather than minutes. Ask your school first — some buildings already own classroom amplification systems."
  },
  {
    category: "worth the splurge",
    name: "Wobble stools",
    query: "wobble stool flexible seating classroom",
    reason: "For the children who cannot hold still, a seat that permits motion keeps them at the table instead of out of it.",
    tip: "Check the weight rating and the base material against your floors. Hard plastic bases mark tile and are loud on it; look for a felt or rubber base."
  },
  {
    category: "worth the splurge",
    name: "Warm plug-in lamps",
    query: "plug in table lamp warm light classroom",
    reason: "Overhead fluorescents are the loudest thing in an elementary room that does not make a sound, and two lamps in the reading corner change how the space feels for very little money.",
    tip: "Check your district's fire-code rules before you buy. Many districts prohibit fabric coverings over fluorescent fixtures and restrict plug-in lighting and string lights outright, and this is enforced by the fire marshal rather than by your principal."
  },
  {
    category: "worth the splurge",
    name: "Rolling teacher tote",
    query: "rolling teacher tote bag wheels",
    reason: "The work that goes home goes home every night, and that weight is what wears out a shoulder bag and the shoulder carrying it.",
    tip: "Check the wheels against a parking lot rather than a hallway. Small hard wheels that glide on tile stick in gravel and catch on every curb cut."
  }
];
```

- [ ] **Step 4: Register the collection**

In `products.js`, add the import after the existing two and the registry entry after the existing two:

```js
import { SITE } from "./site.js";
import { travelEssentials } from "./guides/travel-essentials.js";
import { dogGifts } from "./guides/flight-attendant-dog-gifts.js";
import { classroomEssentials } from "./guides/elementary-classroom-essentials.js";

export const collections = {
  "travel-essentials": travelEssentials,
  "flight-attendant-dog-gifts": dogGifts,
  "elementary-classroom-essentials": classroomEssentials
};
```

- [ ] **Step 5: Confirm the build now fails for the right reason**

```bash
npm run build
```

Expected: FAIL with `prerender-products: collection "elementary-classroom-essentials" was never injected — no page carries data-product-grid="elementary-classroom-essentials".`

This is the guard working. It proves a half-wired guide cannot ship.

- [ ] **Step 6: Create the page**

Create `elementary-classroom-essentials.html` by copying `flight-attendant-dog-gifts.html` verbatim, then replacing three regions.

Copy the file:

```bash
cp flight-attendant-dog-gifts.html elementary-classroom-essentials.html
```

Replace the whole `<head>` block (everything between `<head>` and `</head>`) with:

```html
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>
      15 Classroom Essentials Elementary Teachers Actually Use All Year | Bill's
      Workshop Finds
    </title>
    <meta
      name="description"
      content="Fifteen classroom essentials for elementary teachers, from rolling carts and laminators to a voice amplifier and flexible seating, with what to check before you buy."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/elementary-classroom-essentials"
    />
    <meta
      property="og:title"
      content="15 Classroom Essentials Elementary Teachers Actually Use All Year"
    />
    <meta
      property="og:description"
      content="The storage, transition and survival gear that makes a K-5 room run, and what to check before buying each one."
    />
    <link rel="stylesheet" href="/styles.css" />
    <script type="module" src="/main.js" defer></script>
```

Replace the `<header class="page-hero">` block with:

```html
      <header class="page-hero">
        <div class="shell">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>Teachers</span>
          </nav>
          <p class="eyebrow">Teachers</p>
          <h1>
            15 Classroom Essentials Elementary Teachers Actually Use All Year
          </h1>
          <p class="lede">
            The district supplies the curriculum. The things that make a K–5
            room actually run tend to come out of the teacher's own pocket—so
            these are chosen to survive a full year of twenty-five pairs of
            hands.
          </p>
          <div class="disclosure-note">
            <strong>Affiliate disclosure:</strong> This guide contains paid
            affiliate links. As an Amazon Associate I earn from qualifying
            purchases, at no additional cost to you. Recommendations are
            selected independently.
          </div>
        </div>
      </header>
```

Replace everything from `<article>` through `</aside>` inside `.guide-layout` — that is, the `guide-intro`, the grid `div`, the `related-callout`, and the TOC `aside` — with:

```html
          <article>
            <div class="guide-intro">
              <p>
                A classroom supply list is easy to write and hard to trust. Most
                of what gets recommended is bought once in August, used for a
                week, and shoved on top of a cabinet by October.
              </p>
              <p>
                So this list is organized by the problems that actually repeat:
                <strong
                  >storage that survives being emptied and refilled every
                  day</strong
                >, transitions that work without shouting, materials that get
                reused instead of recopied, and a few things that protect the
                teacher rather than the room. Check your district's rules before
                buying anything that plugs in.
              </p>
            </div>
            <div
              class="product-grid"
              data-product-grid="elementary-classroom-essentials"
            ></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original teacher designs</h2>
              <p>
                Bill's Workshop Company creates designs for the people who do
                the work, including teachers who would rather carry something
                with a bit of personality than another apple.
              </p>
              <a
                class="button button-coral"
                href="https://www.etsy.com/shop/BillsWorkshopCompany"
                data-etsy-link
                target="_blank"
                rel="noopener"
                >Browse the designs on Etsy
                <span aria-hidden="true">↗</span></a
              >
            </aside>
          </article>
          <aside class="toc" aria-label="Table of contents">
            <strong>In this guide</strong
            ><a href="#item-1">Setup &amp; storage</a
            ><a href="#item-4">Noise &amp; transitions</a
            ><a href="#item-7">Display &amp; feedback</a
            ><a href="#item-10">Teacher survival</a
            ><a href="#item-13">Worth the splurge</a
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
          </aside>
```

Leave the site header, the nav, and the footer exactly as copied. Task 3 updates the footer on every page at once.

- [ ] **Step 7: Add the page to the build**

In `vite.config.js`, add the entry to `rollupOptions.input` after `dogGifts`:

```js
      input: {
        home: "index.html",
        guide: "flight-attendant-travel-essentials.html",
        dogGifts: "flight-attendant-dog-gifts.html",
        classroom: "elementary-classroom-essentials.html",
        about: "about.html",
        disclosure: "affiliate-disclosure.html",
        privacy: "privacy.html"
      }
```

- [ ] **Step 8: Run the check to verify it passes**

```bash
npm run build && npm run verify
```

Expected: `verify-build OK: 3 guide(s), 45 cards, all anchor targets present`

- [ ] **Step 9: Confirm the grid actually rendered**

```bash
grep -o 'class="product-card"' dist/elementary-classroom-essentials.html | wc -l
grep -o 'tag=billsworkshop-20' dist/elementary-classroom-essentials.html | wc -l
grep -o 'fire-code' dist/elementary-classroom-essentials.html | wc -l
```

Expected: `15`, `15`, `1`. The third confirms the fire-code caveat survived into the built page.

Use `grep -o … | wc -l` rather than `grep -c` throughout this plan. `grep -c` counts matching *lines*, and the built HTML puts several of these on one line, so it undercounts.

- [ ] **Step 10: Commit**

```bash
git add guides/elementary-classroom-essentials.js elementary-classroom-essentials.html products.js vite.config.js scripts/verify-build.mjs
git commit -m "Add the elementary classroom essentials guide"
```

---

### Task 2: Feature the guide on the home page

**Files:**
- Modify: `index.html:53-62` (hero actions), `index.html:88-151` (featured block and card grid)

**Interfaces:**
- Consumes: the page published at `/elementary-classroom-essentials` by Task 1.
- Produces: nothing other tasks depend on.

The travel guide moves out of the featured slot and into the card grid, so the grid ends with three cards. The section heading currently reads "Start with a trip-tested problem, not a product." — that framing is travel-specific and stops being true once a classroom guide is featured, so it becomes category-neutral in the same edit.

- [ ] **Step 1: Repoint the hero button**

In `index.html`, in `.hero-actions`, change the primary button's `href`:

```html
              <a
                class="button button-primary"
                href="/elementary-classroom-essentials"
                >Read the newest guide <span aria-hidden="true">→</span></a
              >
```

- [ ] **Step 2: Make the section heading category-neutral**

Replace the `.section-heading` contents inside `<section class="section section-soft" id="guides">`:

```html
          <div class="section-heading">
            <p class="eyebrow">Featured guide</p>
            <h2>Start with a real problem, not a product.</h2>
            <p>
              Every recommendation begins with something that actually repeats—a
              packing, organization or classroom problem worth solving once.
            </p>
          </div>
```

- [ ] **Step 3: Swap the featured guide**

Replace the entire `<article class="featured-guide">` block:

```html
          <article class="featured-guide">
            <div class="featured-visual">
              <span class="number">15</span>
              <p>Classroom essentials that survive a full school year</p>
              <span>Teachers · 10 min read</span>
            </div>
            <div class="featured-copy">
              <p class="eyebrow">Teachers</p>
              <h2>
                15 Classroom Essentials Elementary Teachers Actually Use All
                Year
              </h2>
              <p>
                Storage that holds up, transitions that work without shouting,
                and a few things that protect the teacher rather than the
                room—with what to check before buying each one.
              </p>
              <div class="chip-row">
                <span class="chip">Storage</span
                ><span class="chip">Transitions</span
                ><span class="chip">Classroom setup</span
                ><span class="chip">Teacher comfort</span>
              </div>
              <a
                class="button button-coral"
                href="/elementary-classroom-essentials"
                >Open the complete guide <span aria-hidden="true">→</span></a
              >
            </div>
          </article>
```

- [ ] **Step 4: Add the third card to the grid**

Inside `<div class="guide-card-grid">`, after the existing dog-gifts card, add:

```html
            <article class="guide-card">
              <p class="eyebrow">Teachers</p>
              <h3>15 Classroom Essentials for Elementary Teachers</h3>
              <p>
                Storage, transition tools and survival gear for the K–5 room,
                chosen to last past October.
              </p>
              <a class="button button-secondary" href="/elementary-classroom-essentials"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
```

The two existing cards stay exactly as they are.

- [ ] **Step 5: Verify the home page**

```bash
npm run build && npm run verify
grep -o 'href="/elementary-classroom-essentials"' dist/index.html | wc -l
grep -o 'class="guide-card"' dist/index.html | wc -l
grep -o 'trip-tested' dist/index.html | wc -l
```

Expected: verify passes, then `3` (hero button, featured button, card button), `3` (three guide cards), and `0` (the travel-specific heading is gone).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Feature the classroom essentials guide on the home page"
```

---

### Task 3: Make the guide reachable everywhere

**Files:**
- Modify: `index.html`, `about.html`, `affiliate-disclosure.html`, `privacy.html`, `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html`, `elementary-classroom-essentials.html` (footer in all seven)
- Modify: `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html` (TOC cross-link)
- Modify: `public/sitemap.xml`
- Modify: `README.md`

**Interfaces:**
- Consumes: the page published by Task 1.
- Produces: nothing other tasks depend on. This is the last task.

- [ ] **Step 1: Add the footer link to all seven pages**

Every page carries an identical footer "Explore" block. In each of the seven HTML files, find:

```html
            <a href="/flight-attendant-travel-essentials">Travel guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gift guide</a
            ><a href="/#categories">Categories</a
            ><a href="/about">About</a>
```

and replace it with:

```html
            <a href="/flight-attendant-travel-essentials">Travel guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gift guide</a
            ><a href="/elementary-classroom-essentials">Classroom guide</a
            ><a href="/#categories">Categories</a
            ><a href="/about">About</a>
```

The `><a` line-joining style is deliberate — it suppresses whitespace between inline links. Match it exactly.

This block is byte-identical in all six existing pages (verified during planning: `index.html:298`, `about.html:123`, `affiliate-disclosure.html:115`, `privacy.html:132`, `flight-attendant-travel-essentials.html:152`, `flight-attendant-dog-gifts.html:144`), and the seventh page inherits it from the Task 1 copy. The same replacement applies unchanged to every one.

- [ ] **Step 2: Cross-link from the two existing guides**

In both `flight-attendant-travel-essentials.html` and `flight-attendant-dog-gifts.html`, the TOC aside ends with a link to the other guide followed by the disclosure link. Add a classroom link before the disclosure link. In `flight-attendant-dog-gifts.html` that means:

```html
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
```

In `flight-attendant-travel-essentials.html`, make the same insertion: keep whatever guide link is already there, add the classroom link immediately after it, and leave the disclosure link last.

Do not touch either page's `related-callout`. Those asides make an audience-specific promise about flight attendants that a teacher guide does not answer.

- [ ] **Step 3: Add the sitemap entry**

In `public/sitemap.xml`, add after the dog-gifts line:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/elementary-classroom-essentials</loc></url>
```

- [ ] **Step 4: Update the README pages list**

In `README.md`, under `## Pages`, add after the dog gifts line:

```markdown
- 15 Classroom Essentials Elementary Teachers Actually Use All Year guide
```

- [ ] **Step 5: Verify every page links the guide**

```bash
npm run build && npm run verify
for f in index about affiliate-disclosure privacy flight-attendant-travel-essentials flight-attendant-dog-gifts elementary-classroom-essentials; do
  printf '%s: %s\n' "$f" "$(grep -o 'href="/elementary-classroom-essentials"' "dist/$f.html" | wc -l)"
done
grep -o 'elementary-classroom-essentials' dist/sitemap.xml | wc -l
```

Expected: verify passes. Every page reports at least `1`. `index` reports `4` (hero, featured, card, footer). The two existing guides report `2` (TOC and footer). `elementary-classroom-essentials` reports `1` (its own footer). The sitemap reports `1`.

- [ ] **Step 6: Confirm no `.html` leaked into an internal link**

```bash
grep -rn 'href="/[a-z-]*\.html"' dist/*.html || echo "clean"
```

Expected: `clean`. Any hit is a broken link under Vercel's clean-URL routing.

- [ ] **Step 7: Commit**

```bash
git add index.html about.html affiliate-disclosure.html privacy.html flight-attendant-travel-essentials.html flight-attendant-dog-gifts.html elementary-classroom-essentials.html public/sitemap.xml README.md
git commit -m "Link the classroom essentials guide into the site"
```

---

## Final verification

Run after all three tasks are complete, before opening a pull request.

- [ ] `npm run build` succeeds with no warnings about product injection.
- [ ] `npm run verify` reports `3 guide(s), 45 cards`.
- [ ] `npm run dev` serves `/elementary-classroom-essentials` with all 15 cards rendered — this confirms dev/prod parity, since dev and build use the same plugin.
- [ ] In the browser: the five TOC links jump to items 1, 4, 7, 10 and 13, and each lands on the first card of its group.
- [ ] In the browser: the home page shows the classroom guide featured, three cards in the grid below it, and the hero's "Read the newest guide" button opens the classroom guide.
- [ ] Spot-check three product buttons: each opens an Amazon search, each URL carries `tag=billsworkshop-20`, and each link has `rel="sponsored nofollow noopener"` in the page source.
- [ ] Read item 14's tip in the rendered page and confirm the fire-code wording is intact.
- [ ] `git log --oneline` shows three commits on `elementary-classroom-essentials`, plus the spec commit.

## Known follow-ups (do not do in this plan)

- The footer "Explore" list now carries three per-guide links. At roughly five guides it should collapse to a single "All guides" link pointing at `/#guides`.
- The six category cards on the home page are still decorative. Three of six categories now have a guide behind them; connecting the cards to real category landing pages is separate work.
- `README.md` still lists "replace the search-based recommendations with specific reviewed products" as an open improvement. That decision now applies to three guides at once.
