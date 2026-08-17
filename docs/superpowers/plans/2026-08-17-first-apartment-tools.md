# First Apartment Tools Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/first-apartment-tools`, a 15-item guide to the tools someone needs the first time something breaks in a place of their own, and reflow the home page guide grid to hold a sixth guide.

**Architecture:** Guide content is data, not markup. A new `guides/first-apartment-tools.js` exports an array of 15 item objects; `products.js` registers it under the key `first-apartment-tools`; a Vite plugin (`vite.config.js`) replaces the empty `<div data-product-grid="first-apartment-tools">` on the new page with rendered cards at build time. Nothing about the card markup, styling, or affiliate treatment is hand-written per page. The one visual change is the home page guide grid moving from two columns to three at desktop so five cards render 3 + 2.

**Tech Stack:** Vite 7 (multi-page app), vanilla ES modules, hand-written HTML/CSS, `html-validate` 11, a custom `scripts/verify-build.mjs` post-build checker. No framework, no CSS preprocessor, no test runner — `npm run verify` is the test suite.

**Spec:** `docs/superpowers/specs/2026-08-17-first-apartment-tools-design.md`

## Global Constraints

- **Slug is `first-apartment-tools`** everywhere — file name, collection key, `data-product-grid` value, canonical URL, sitemap entry, home card link.
- **Internal links are extensionless.** `/first-apartment-tools`, never `/first-apartment-tools.html`. Vercel maps clean paths to the `.html` files in `dist/`.
- **Every `<title>` stays on one line.** The `long-title` rule counts whitespace inside the element, so a title wrapped across source lines fails the 75-character limit even when its text is short.
- **Product markup is never hand-written.** Cards come from `renderProductGrid` in `products.js`, which is what guarantees `rel="sponsored nofollow noopener"` and the `billsworkshop-20` tag on all 15 links.
- **15 items, five groups of three, contiguous by `category`.** Anchors land on items 1, 4, 7, 10, 13.
- **Editorial rule for every item: it fits in one bag and needs nobody's permission.** No bench-mounted tools, no hardwired fixtures, no plumbing that must be replaced rather than cleared.
- **Commit at the end of every task.** Never `git add -A`; name the files.
- **Do not merge to `main`.** Pushing to `main` deploys to production. Open the PR and stop.

---

### Task 1: Guide data, registration, and the build check (red)

This task deliberately ends with a **failing** build. The data and its registration land first; the page that renders it lands in Task 2. `closeBundle` in `vite.config.js` throws when a registered collection is never injected, which is the failure that proves the wiring is real.

**Files:**
- Create: `guides/first-apartment-tools.js`
- Modify: `products.js:6` (import) and `products.js:13` (registration)
- Modify: `scripts/verify-build.mjs:36` (new `GUIDES` entry)

**Interfaces:**
- Consumes: nothing.
- Produces: `export const firstApartmentTools` — an array of 15 objects, each `{ category: string, name: string, query: string, reason: string, tip: string }`. Task 2's page renders it through the collection key `"first-apartment-tools"`.

- [ ] **Step 1: Create the guide data file**

Create `guides/first-apartment-tools.js` with exactly this content:

```js
export const firstApartmentTools = [
  {
    category: "flat-pack day",
    name: "Ratcheting screwdriver with bit set",
    query: "ratcheting screwdriver bit set",
    reason:
      "Flat-pack furniture arrives with a stamped steel key and a hundred screws. A ratcheting driver turns an evening of wrist pain into twenty minutes, and it stays the most-used tool in the place long after the boxes are gone.",
    tip: "Do not reach for a drill on flat-pack. A powered driver strips particleboard cam screws and chews out the threads before you feel it happen, where the ratchet gives you the feel to stop at snug. Get a set carrying both Phillips and hex bits, because most furniture uses both."
  },
  {
    category: "flat-pack day",
    name: "Rubber mallet",
    query: "rubber mallet non-marking",
    reason:
      "Dowels, cam locks and drawer bottoms all have to be tapped home, and a claw hammer marks the finish where a mallet does not. It is also what seats the bed frame pins that never quite line up.",
    tip: "White or non-marking rubber, not black. Black rubber leaves scuff marks on light furniture and on painted walls, which is exactly where this gets swung."
  },
  {
    category: "flat-pack day",
    name: "Folding hex-key set",
    query: "folding hex key set metric SAE",
    reason:
      "The L-shaped key in the box is soft steel that rounds off the first time a bolt is genuinely tight. A folding set gives you leverage and does not vanish into the carpet halfway through.",
    tip: "Buy metric and SAE together. Flat-pack furniture is metric, but anything bought secondhand in the US may not be, and finding that out mid-assembly is the version of this problem you cannot solve at 9pm."
  },
  {
    category: "hanging things",
    name: "Compact cordless drill/driver",
    query: "compact cordless drill driver 12V kit",
    reason:
      "The line between hanging a picture and hanging a shelf is a drill. A 12-volt compact model fits an apartment closet, has the torque for drywall and softwood, and is the one item on this list worth spending real money on.",
    tip: "12V is right for a first place. 18V and 20V tools are heavier, pricier and aimed at framing lumber. Buy a bare tool only if you already own batteries — otherwise the kit with two batteries and a charger costs less than assembling the same thing later."
  },
  {
    category: "hanging things",
    name: "Stud finder",
    query: "stud finder wall scanner AC detection",
    reason:
      "Anything heavy hangs from a stud or from a properly rated anchor, and studs are not where you guess they are. Ten seconds with this decides whether a TV mount is safe or a story.",
    tip: "Get one with AC wiring detection — drilling into a live cable is the failure mode that actually matters, and the feature costs a few dollars. Calibrate it on a blank stretch of wall every time you use it; skipping that step is why cheap ones get blamed for being wrong."
  },
  {
    category: "hanging things",
    name: "Drywall anchor assortment",
    query: "drywall anchor assortment kit toggle bolts",
    reason:
      "Drywall on its own holds nothing. The right anchor turns half an inch of compressed chalk into a fixing that carries a loaded floating shelf.",
    tip: "Anchors carry a printed weight rating and it is not a suggestion. Match the anchor to the load and to the wall type, and halve the number on the packet for anything that swings or gets pulled on. Self-drilling anchors suit light work; toggle bolts are what hold shelves and mirrors."
  },
  {
    category: "water where it shouldn't be",
    name: "Flange plunger",
    query: "flange plunger toilet",
    reason:
      "The first plumbing emergency in a new place is almost always a toilet, almost always at the worst possible hour, and this clears it in a minute without involving anyone else.",
    tip: "A flange plunger is the one with the soft rubber sleeve that folds out of the cup, and it is for toilets. The flat cup plunger is for sinks and tubs. Most households own only the cup version and wonder why it does nothing on a toilet."
  },
  {
    category: "water where it shouldn't be",
    name: "Hair-clog drain tool",
    query: "drain snake hair clog remover tool",
    reason:
      "A slow bathroom drain is hair caught in the trap, not a blockage deep in the building's pipes, and a barbed plastic strip pulls the whole thing out in one pass.",
    tip: "Try this before any chemical drain cleaner. Caustic cleaner sits in the trap, degrades older pipes and seals, and converts a two-dollar job into a plumber's invoice — which in a rental becomes an argument about who pays for it."
  },
  {
    category: "water where it shouldn't be",
    name: "8-inch adjustable wrench",
    query: "8 inch adjustable wrench",
    reason:
      "Supply-line nuts, a showerhead, the compression fitting behind the toilet: a first apartment's plumbing is all standard sizes reachable with one adjustable jaw.",
    tip: "Eight inches is the size that fits both your hand and the space under a sink. A 6-inch runs out of jaw on supply nuts and a 12-inch will not fit behind a toilet. Wrap the jaws in a cloth before touching chrome fittings, which scar permanently."
  },
  {
    category: "power problems",
    name: "Rechargeable headlamp",
    query: "rechargeable LED headlamp dimmable",
    reason:
      "Every job that needs light needs both hands as well: the breaker panel in a dark closet, the back of a desk, the cupboard under the sink. A phone flashlight held in your teeth is not a plan.",
    tip: "USB-rechargeable beats disposable batteries for something used a few times a month, because alkalines corrode inside a lamp that sits unused for a year. A model that dims beats a brighter one — full output inside a cupboard just blinds you."
  },
  {
    category: "power problems",
    name: "Non-contact voltage tester",
    query: "non-contact voltage tester pen",
    reason:
      "Before touching a switch, an outlet or a light fixture, this tells you whether the circuit is genuinely dead. Breaker panels are mislabeled constantly, and older buildings are worse.",
    tip: "This is the twenty-dollar item most likely to be dismissed as optional and the one most likely to keep you out of an emergency room. Test it against a known live outlet before every use, so you find out the tester has died before you trust it on something else."
  },
  {
    category: "power problems",
    name: "12-gauge extension cord",
    query: "12 gauge extension cord 25 ft",
    reason:
      "One good cord replaces the three thin ones that otherwise get daisy-chained across a room, which is the arrangement that starts fires.",
    tip: "Gauge numbers run backwards: 12 AWG is thicker than 16 AWG. A 16-gauge cord is fine under a lamp and genuinely dangerous under a space heater or a window air conditioner. Buy 12-gauge once and stop thinking about it, and never plug one extension cord into another."
  },
  {
    category: "what lives in the bag",
    name: "Small tool tote",
    query: "tool bag tote 14 inch",
    reason:
      "Tools kept in a kitchen drawer scatter and go missing; tools kept in a bag arrive at the job together. A soft 14-inch tote also stores in a closet, which a rigid toolbox does not.",
    tip: "An open-top tote beats a zipped box for a starter kit — you can see everything and lift it out one-handed. Check that the base is reinforced, because the bottom seam under the weight of a drill is where cheap bags fail."
  },
  {
    category: "what lives in the bag",
    name: "25-foot tape measure",
    query: "25 foot tape measure wide blade",
    reason:
      "Will the sofa fit through the door, is the shelf centered, how far apart are those studs. It answers the question that comes before every other tool on this list.",
    tip: "Twenty-five feet with a one-inch-wide blade is the combination that works. The wide blade stays rigid unsupported for several feet, which is what lets you measure a wall on your own; pocket 12-foot tapes fold over and cannot span a room."
  },
  {
    category: "what lives in the bag",
    name: "9-inch torpedo level",
    query: "magnetic torpedo level 9 inch",
    reason:
      "A shelf that sits a degree off is visible from across the room, and a phone's level app is not accurate enough to trust on something that stays on the wall for years.",
    tip: "Get a magnetic edge so it clings to a bracket and frees both hands. Nine inches fits the tote and spans a standard shelf bracket; a 48-inch level is more accurate over a long run but it lives in a garage, not a closet."
  }
];
```

- [ ] **Step 2: Register the collection**

In `products.js`, add the import after the `studentPilotGifts` line (currently line 6):

```js
import { firstApartmentTools } from "./guides/first-apartment-tools.js";
```

and add the registration to `collections`, after the `"student-pilot-gifts"` entry — note the comma that must be added to the line above it:

```js
export const collections = {
  "travel-essentials": travelEssentials,
  "flight-attendant-dog-gifts": dogGifts,
  "elementary-classroom-essentials": classroomEssentials,
  "dog-lover-gifts": dogLoverGifts,
  "student-pilot-gifts": studentPilotGifts,
  "first-apartment-tools": firstApartmentTools
};
```

Change nothing else in this file. `escapeHtml`, `amazonUrl`, and `renderProductGrid` all stay as they are.

- [ ] **Step 3: Add the verify-build entry**

In `scripts/verify-build.mjs`, add a sixth entry to the `GUIDES` array, after the `student-pilot-gifts` object (line 36) — again, the object above it needs a trailing comma:

```js
  {
    file: "dist/first-apartment-tools.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Flange plunger"
  }
```

`contains` must match the `name` field of item 7 character for character.

- [ ] **Step 4: Run the build and verify it FAILS**

Run: `npm run build`

Expected: the build throws

```
prerender-products: collection "first-apartment-tools" was never injected — no page carries data-product-grid="first-apartment-tools".
```

This failure is the point of the task. It proves the collection is registered and that the build genuinely enforces wiring. If the build **passes** here, something is wrong — most likely the collection was not added to `collections` — and Task 2 will paper over it. Stop and fix before continuing.

- [ ] **Step 5: Commit**

```bash
git add guides/first-apartment-tools.js products.js scripts/verify-build.mjs
git commit -m "Add first apartment tools collection and its build check"
```

---

### Task 2: The guide page (green)

**Files:**
- Create: `first-apartment-tools.html`
- Modify: `vite.config.js:56` (add to `rollupOptions.input`)

**Interfaces:**
- Consumes: the collection key `"first-apartment-tools"` registered in Task 1.
- Produces: a page at `/first-apartment-tools` carrying `id="item-1"` through `id="item-15"`, which Task 4's TOC cross-link and Task 5's sitemap entry both point at.

- [ ] **Step 1: Create the page**

Create `first-apartment-tools.html` with exactly this content. The header, footer, and nav are copied verbatim from `student-pilot-gifts.html` — they are duplicated by design across all pages (see `partials-note.txt`), so they must match the other pages character for character rather than being reformatted.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>15 First Home Tool Kit Essentials | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen tools for a first apartment, grouped by what just went wrong — flat-pack day, hanging things, a clogged drain, a dead outlet — with what to check before buying each one."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/first-apartment-tools"
    />
    <meta
      property="og:title"
      content="15 Tools for a First Apartment, Sorted by What Just Went Wrong"
    />
    <meta
      property="og:description"
      content="A starter kit that fits in one bag and needs nobody's permission, with the gauge, weight-rating and plunger-shape checks that decide whether it works."
    />
    <link rel="stylesheet" href="/styles.css" />
    <script type="module" src="/main.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <nav class="nav-shell" aria-label="Main navigation">
        <a class="brand" href="/"
          ><span class="brand-mark">BW</span
          ><span class="brand-text"
            >Bill's Workshop <small>Finds</small></span
          ></a
        ><button
          class="menu-button"
          type="button"
          data-menu-button
          aria-expanded="false"
          aria-controls="main-menu"
        >
          Menu
        </button>
        <div class="nav-links" data-menu id="main-menu">
          <a href="/#guides">Guides</a><a href="/#categories">Categories</a
          ><a href="/about">About</a
          ><a href="/affiliate-disclosure">Disclosure</a>
        </div>
      </nav>
    </header>

    <main id="main">
      <header class="page-hero">
        <div class="shell">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>Everyday workshop</span>
          </nav>
          <p class="eyebrow">Everyday workshop</p>
          <h1>
            15 Tools for a First Apartment, Sorted by What Just Went Wrong
          </h1>
          <p class="lede">
            Nobody buys their first tools on a calm afternoon. They buy them
            because a drain backed up, or a shelf came in eleven pieces, or the
            light in the hall stopped working on a Sunday. This list is grouped
            by which of those just happened.
          </p>
          <div class="disclosure-note">
            <strong>Affiliate disclosure:</strong> This guide contains paid
            affiliate links. As an Amazon Associate I earn from qualifying
            purchases, at no additional cost to you. Recommendations are
            selected independently.
          </div>
        </div>
      </header>

      <section class="section" style="padding-top: 2rem">
        <div class="shell guide-layout">
          <article>
            <div class="guide-intro">
              <p>
                A first tool kit gets assembled the expensive way: one emergency
                trip at a time, at whatever the hardware store two blocks away
                happens to stock. The alternative is knowing which five problems
                are coming, because they are the same five problems in every
                first place — furniture that arrives flat, things that need to go
                on a wall, water where it should not be, something electrical,
                and the question of where any of it lives afterwards.
              </p>
              <p>
                One rule applies to all fifteen—
                <strong
                  >everything here fits in one bag and needs nobody's
                  permission</strong
                >. Nothing bolts to a bench, nothing gets wired in, and nothing
                assumes a garage. If you are buying this as a housewarming or
                graduation gift, that constraint is why the list works: it suits
                a fourth-floor walk-up as well as a first house.
              </p>
            </div>
            <div
              class="product-grid"
              data-product-grid="first-apartment-tools"
            ></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original workshop designs</h2>
              <p>
                Bill's Workshop Company creates designs for people who would
                rather own something with a bit of character than another
                generic novelty mug.
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
            ><a href="#item-1">Flat-pack day</a
            ><a href="#item-4">Hanging things</a
            ><a href="#item-7">Water problems</a
            ><a href="#item-10">Power problems</a
            ><a href="#item-13">What lives in the bag</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
            ><a href="/#guides">All guides</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
          </aside>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="shell">
        <div class="footer-grid">
          <div>
            <a class="brand" href="/"
              ><span class="brand-mark">BW</span
              ><span>Bill's Workshop Finds</span></a
            >
            <p class="footer-note">
              Practical, clearly explained finds for travel, work, pets and
              everyday life.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="/#guides">All guides</a
            ><a href="/#categories">Categories</a
            ><a href="/about">About</a>
          </div>
          <div>
            <h3>Workshop</h3>
            <a
              href="https://www.etsy.com/shop/BillsWorkshopCompany"
              data-etsy-link
              target="_blank"
              rel="noopener"
              >Etsy shop</a
            ><a
              href="https://billsworkshopcompany.com"
              data-tools-link
              target="_blank"
              rel="noopener"
              >Digital tools</a
            >
          </div>
          <div>
            <h3>Information</h3>
            <a href="/affiliate-disclosure">Affiliate disclosure</a
            ><a href="/privacy">Privacy policy</a>
          </div>
        </div>
        <p class="copyright">
          © <span data-year></span> Bill's Workshop Company. As an Amazon
          Associate I earn from qualifying purchases.
        </p>
      </div>
    </footer>
  </body>
</html>
```

Note the `<div class="product-grid" data-product-grid="first-apartment-tools"></div>` must stay an empty element with no whitespace-only children beyond what is shown — the injection pattern in `vite.config.js:6` matches an open tag, optional whitespace, and a close tag.

- [ ] **Step 2: Add the page to the Vite input map**

In `vite.config.js`, add to `rollupOptions.input` after the `studentPilots` line (line 56):

```js
        firstApartment: "first-apartment-tools.html",
```

The full map should then read `home`, `guide`, `dogGifts`, `classroom`, `dogLovers`, `studentPilots`, `firstApartment`, `about`, `disclosure`, `privacy` — ten entries.

- [ ] **Step 3: Run the build and verify it now PASSES**

Run: `npm run build`

Expected: exit 0, and `dist/first-apartment-tools.html` appears in the output listing. The `closeBundle` error from Task 1 is gone, which means the collection was injected exactly once.

- [ ] **Step 4: Run the full check**

Run: `npm run verify`

Expected: `lint:html` clean, then

```
verify-build OK: 6 guide(s), 90 cards, all anchor targets present
```

If `lint:html` reports `long-title`, the `<title>` has been wrapped across source lines — put it back on one line.

- [ ] **Step 5: Confirm real content shipped, not an empty container**

Run:

```bash
grep -c 'class="product-card"' dist/first-apartment-tools.html
grep -c 'tag=billsworkshop-20' dist/first-apartment-tools.html
grep -c 'rel="sponsored nofollow noopener"' dist/first-apartment-tools.html
grep -o 'Flange plunger' dist/first-apartment-tools.html
```

Expected: `15`, `15`, `15`, and `Flange plunger`.

- [ ] **Step 6: Check dev/prod parity**

Run `npm run dev`, open `http://localhost:5173/first-apartment-tools.html`, and confirm the grid renders 15 cards with tips and buttons. The dev server serves the `.html` path; the extensionless URL is a Vercel rewrite that only exists in production.

Stop the dev server before continuing.

- [ ] **Step 7: Commit**

```bash
git add first-apartment-tools.html vite.config.js
git commit -m "Add the first apartment tools guide"
```

---

### Task 3: Home page card and the three-up grid

**Files:**
- Modify: `index.html:172` (new card at the end of `.guide-card-grid`)
- Modify: `styles.css:246` (grid columns)
- Modify: `styles.css:369-375` (the `@media (max-width: 860px)` block)

**Interfaces:**
- Consumes: the page published in Task 2, linked at `/first-apartment-tools`.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Add the guide card**

In `index.html`, inside `.guide-card-grid`, add a fifth `<article>` after the dog lover gifts card (which closes at line 172) and before the closing `</div>` at line 173:

```html
            <article class="guide-card">
              <p class="eyebrow">Everyday workshop</p>
              <h3>15 Tools for a First Apartment</h3>
              <p>
                Grouped by what just went wrong—flat-pack day, hanging things,
                a clogged drain, a dead outlet, and where it all lives.
              </p>
              <a class="button button-secondary" href="/first-apartment-tools"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
```

Do not touch the featured guide `<article class="featured-guide">` above the grid. The classroom guide keeps that slot.

- [ ] **Step 2: Widen the grid to three columns at desktop**

In `styles.css`, line 246 currently reads:

```css
.guide-card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1.5rem; }
```

Change `repeat(2, 1fr)` to `repeat(3, 1fr)`:

```css
.guide-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; }
```

- [ ] **Step 3: Keep two columns at tablet width**

In the `@media (max-width: 860px)` block, line 372 currently reads:

```css
  .category-grid, .values-grid { grid-template-columns: repeat(2, 1fr); }
```

Add `.guide-card-grid` to that selector list:

```css
  .category-grid, .values-grid, .guide-card-grid { grid-template-columns: repeat(2, 1fr); }
```

The `@media (max-width: 680px)` block already collapses `.guide-card-grid` to `1fr` (line 400). Do not change it.

- [ ] **Step 4: Verify the grid at all three widths**

Run `npm run dev` and open `http://localhost:5173/`. Using the browser's responsive mode, check:

| Viewport width | Expected |
|---|---|
| 1200px | five cards as 3 + 2 |
| 800px | five cards as 2 + 2 + 1 |
| 500px | five cards stacked, one per row |

Also confirm at 1200px that the featured guide above the grid is still the classroom guide, and that no card in the grid duplicates it — the grid should read: travel essentials, crew dog gifts, student pilots, dog lovers, first apartment tools.

Stop the dev server before continuing.

- [ ] **Step 5: Build and verify**

Run: `npm run build && npm run verify`

Expected: exit 0 and `verify-build OK: 6 guide(s), 90 cards, all anchor targets present`.

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css
git commit -m "Add the first apartment tools card and widen the guide grid"
```

---

### Task 4: TOC cross-link swap on the classroom guide

The new guide links out to two neighbours (done in Task 2). This task gives it one link back in. Every guide's TOC keeps exactly two cross-links plus "All guides".

**Files:**
- Modify: `elementary-classroom-essentials.html:127`

**Interfaces:**
- Consumes: the page published in Task 2.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Swap the travel essentials link for the new guide**

In `elementary-classroom-essentials.html`, the TOC aside currently ends:

```html
            ><a href="#item-13">Worth the splurge</a
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
            ><a href="/#guides">All guides</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
```

Replace the travel essentials line so it reads:

```html
            ><a href="#item-13">Worth the splurge</a
            ><a href="/first-apartment-tools">First apartment tools guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
            ><a href="/#guides">All guides</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
```

The `><a` line-break style is deliberate throughout these files: it prevents whitespace between inline anchors. Keep it exactly.

- [ ] **Step 2: Verify every guide TOC still has exactly two cross-links plus All guides**

Anchor text varies between guides ("Dog gifts for flight crew" carries no "guide" in it), so counting on the word "guide" gives a different number per page and proves nothing. Check the structure instead.

First, the "All guides" link — every guide page carries two (one in the TOC, one in the footer), every other page carries one:

```bash
grep -c 'href="/#guides">All guides' *.html
```

Expected: `2` for each of the six guide pages; `1` for `index.html`, `about.html`, `affiliate-disclosure.html` and `privacy.html`.

Then print each TOC block and read it:

```bash
grep -A11 'aside class="toc"' *.html
```

Expected, for each of the six guide pages, in order: five `#item-` anchors, then exactly **two** links to other guides, then `/#guides`, then `/affiliate-disclosure`. Nine anchors, no more. A guide with three cross-links means an earlier trim was missed; a guide with one means this task's swap overwrote a link instead of replacing the right one.

- [ ] **Step 3: Confirm the new guide has an inbound link**

Run:

```bash
grep -rln 'href="/first-apartment-tools"' *.html
```

Expected: `elementary-classroom-essentials.html` and `index.html`. Two inbound internal links plus `/#guides`.

- [ ] **Step 4: Build, lint and verify**

Run: `npm run build && npm run verify`

Expected: exit 0, `lint:html` clean, `verify-build OK: 6 guide(s), 90 cards, all anchor targets present`.

- [ ] **Step 5: Commit**

```bash
git add elementary-classroom-essentials.html
git commit -m "Point the classroom guide TOC at the first apartment tools guide"
```

---

### Task 5: Sitemap, README, and final verification

**Files:**
- Modify: `public/sitemap.xml:9`
- Modify: `README.md:12`

**Interfaces:**
- Consumes: everything above.
- Produces: the shippable branch.

- [ ] **Step 1: Add the page to the sitemap**

In `public/sitemap.xml`, add after the `student-pilot-gifts` line:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/first-apartment-tools</loc></url>
```

- [ ] **Step 2: Add the page to the README Pages list**

In `README.md`, add after the student pilot gifts line:

```markdown
- 15 Tools for a First Apartment, Sorted by What Just Went Wrong guide
```

- [ ] **Step 3: Full verification sweep**

Run: `npm run build && npm run verify`

Expected: `lint:html` clean across all ten pages, then `verify-build OK: 6 guide(s), 90 cards, all anchor targets present`.

- [ ] **Step 4: Confirm no extension-ful internal links slipped in**

Run: `grep -rn 'href="/[a-z-]*\.html"' *.html`

Expected: no output. Every internal link is extensionless.

- [ ] **Step 5: Confirm the sitemap covers every built page**

Run:

```bash
ls dist/*.html | wc -l
grep -c '<loc>' public/sitemap.xml
```

Expected: `10` and `10`.

- [ ] **Step 6: Confirm all six guides render distinct products**

Run: `node scripts/verify-build.mjs`

Expected: the signature check passes silently — it fails loudly if any two guides render the same Amazon queries. This is the check that would catch the new guide accidentally reusing another collection's key.

- [ ] **Step 7: Commit, push, and open the PR**

```bash
git add public/sitemap.xml README.md
git commit -m "Link the first apartment tools guide into the site"
git push -u origin first-apartment-tools
```

Then open a PR against `main` summarizing: the new guide, the home page card, the three-up grid change, and the classroom TOC swap. Include the verification output. **Do NOT merge** — merging deploys to production and is the user's call.

---

## Spec coverage check

| Spec section | Task |
|---|---|
| `guides/first-apartment-tools.js` | 1 |
| `products.js` | 1 |
| `scripts/verify-build.mjs` | 1 |
| `first-apartment-tools.html` | 2 |
| `vite.config.js` | 2 |
| `index.html` and `styles.css` — home page card and 3-up grid | 3 |
| TOC cross-links | 2 (new page's outbound), 4 (classroom's inbound swap) |
| `public/sitemap.xml`, `README.md` | 5 |
| Verification steps 1–8 | 2 (1–5), 3 (6, 7), 4 (8, TOC half), 5 (full sweep) |
| Editorial constraint stated in the lede | 2 |
| Six safety and specification tips | 1 |
