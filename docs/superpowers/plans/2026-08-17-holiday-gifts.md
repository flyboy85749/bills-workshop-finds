# Holiday Gifts Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/holiday-gifts`, 15 gifts in five trios — one per audience the site already serves — each trio routing to that audience's deeper guide.

**Architecture:** Guide content is data, not markup. A new `guides/holiday-gifts.js` exports an array of 15 item objects; `products.js` registers it under the key `holiday-gifts`; a Vite plugin (`vite.config.js`) replaces the empty `<div data-product-grid="holiday-gifts">` on the new page with rendered cards at build time. This is the seventh guide and the first whose page body carries inline links into other guides — that routing is the page's purpose, not decoration. No CSS changes: six grid cards is exactly 3 + 3 under rules already in the stylesheet.

**Tech Stack:** Vite 7 (multi-page app), vanilla ES modules, hand-written HTML/CSS, `html-validate` 11, a custom `scripts/verify-build.mjs` post-build checker. No framework, no test runner — `npm run verify` is the test suite.

**Spec:** `docs/superpowers/specs/2026-08-17-holiday-gifts-design.md`

## Global Constraints

- **Slug is `holiday-gifts`** everywhere — file name, collection key, `data-product-grid` value, canonical URL, sitemap entry, home card link.
- **No year anywhere.** Not in the title, the copy, the URL, or the meta tags. The page is deliberately undated so it never needs an annual rewrite.
- **Internal links are extensionless.** `/holiday-gifts`, never `/holiday-gifts.html`.
- **Every `<title>` stays on one line.** The `long-title` rule counts whitespace inside the element, so a title wrapped across source lines fails the 75-character limit even when its text is short.
- **Product markup is never hand-written.** Cards come from `renderProductGrid` in `products.js`, which guarantees `rel="sponsored nofollow noopener"` and the `billsworkshop-20` tag on all 15 links.
- **15 items, five groups of three, contiguous by `category`.** Anchors land on items 1, 4, 7, 10, 13.
- **Editorial rule for every item: no size, no measurement, no knowledge of what they already own.** This is not a price ceiling — do not introduce one.
- **The five inline routing links in the guide intro are load-bearing.** Nothing in the build asserts they exist. Do not remove, consolidate, or move them to the TOC.
- **Do not change any CSS.** `styles.css` must not appear in any commit in this plan.
- **Commit at the end of every task.** Never `git add -A`; name the files.
- **Do not merge to `main`.** Pushing to `main` deploys to production. Open the PR and stop.

---

### Task 1: Guide data, registration, and the build check (red)

This task deliberately ends with a **failing** build. The data and its registration land first; the page that renders it lands in Task 2. `closeBundle` in `vite.config.js` throws when a registered collection is never injected, which is the failure that proves the wiring is real.

**Files:**
- Create: `guides/holiday-gifts.js`
- Modify: `products.js` (import after the `firstApartmentTools` line, registration after the `"first-apartment-tools"` entry)
- Modify: `scripts/verify-build.mjs` (a seventh `GUIDES` entry, after the `first-apartment-tools` object)

**Interfaces:**
- Consumes: nothing.
- Produces: `export const holidayGifts` — an array of 15 objects, each `{ category: string, name: string, query: string, reason: string, tip: string }`. Task 2's page renders it through the collection key `"holiday-gifts"`.

- [ ] **Step 1: Create the guide data file**

Create `guides/holiday-gifts.js` with exactly this content:

```js
export const holidayGifts = [
  {
    category: "for the dog lover",
    name: "Paw-print ornament kit",
    query: "dog paw print ornament kit clay",
    reason:
      "The first Christmas with a dog, and every Christmas after it, gets one object that is unmistakably theirs. The print takes a minute to make and the ornament outlasts the dog by decades.",
    tip: "Get the air-dry clay type rather than the bake-in-the-oven kind, because a print pressed into oven clay distorts as it cures. Take the print early in the day: the clay needs several undisturbed hours lying flat before it goes anywhere near a tree."
  },
  {
    category: "for the dog lover",
    name: "Dog treat advent calendar",
    query: "dog treat advent calendar",
    reason:
      "Twenty-four days of a dog losing its mind at a cardboard door. It entertains the owner more than the dog, which is exactly what you want out of December.",
    tip: "Most calendars are filled for medium dogs, and a treat sized for a labrador is a choking hazard for a chihuahua — if you do not know the dog, the small-breed version is the safe default. Order by late November: a calendar that arrives on the 6th has lost a quarter of its point."
  },
  {
    category: "for the dog lover",
    name: "Personalized dog stocking",
    query: "personalized dog Christmas stocking",
    reason:
      "Every other stocking on the mantel has a name on it. This is the one that says the dog counts as family, in embroidery, permanently.",
    tip: "Embroidered names run on a lead time that gets worse every week after Halloween, so order by late November. If you are not certain how they spell the dog's name, a breed silhouette without a name is the safer buy."
  },
  {
    category: "for the flight attendant",
    name: "Scratch-off world map",
    query: "scratch off world map poster",
    reason:
      "Someone who has worked in sixty countries has no record of it beyond an expired passport and a roster nobody keeps. This turns the job into something that looks like a life.",
    tip: "Buy the version with country or US-state detail rather than continents only — crew fill a coarse map inside a year and then it is finished. Order a frame at the same time, because these ship rolled and a poster taped to a wall reads as a cheap gift."
  },
  {
    category: "for the flight attendant",
    name: "Home-base coordinates keychain",
    query: "engraved coordinates keychain",
    reason:
      "Crew measure their lives in three-letter codes. This puts the coordinates of the place they actually consider home on the thing that opens a hotel room door every night.",
    tip: "Coordinates read better than the airport code on something this small — the code is the job, the coordinates are the place. Ask which base they mean before ordering, because the one on their roster is not always the one they would choose."
  },
  {
    category: "for the flight attendant",
    name: "Portable white noise machine",
    query: "portable white noise machine travel",
    reason:
      "Hotel sleep gets broken by housekeeping carts, corridor doors and whoever is in the room above. A machine running all night covers all three, which matters when the van leaves at four.",
    tip: "Get one built on a real fan or a long mechanical loop rather than a short digital sample — the loop point is audible in a quiet room and it is what wakes people. USB-powered models travel best; anything with a wall plug loses to foreign outlets."
  },
  {
    category: "for the student pilot",
    name: "First-solo shirttail display frame",
    query: "first solo shirt tail display frame",
    reason:
      "After a first solo the instructor cuts the back out of the student's shirt, writes the date and tail number on it, and pins it to the school wall. Most students take it home in a folder and never do anything with it.",
    tip: "This only works for someone who has already soloed. Given before, it is a countdown clock they did not ask for. Ask the question, or hold the gift until after the day — which is a day they will certainly tell you about."
  },
  {
    category: "for the student pilot",
    name: "Etched airport-diagram glassware",
    query: "airport diagram etched whiskey glass",
    reason:
      "The runway layout of the field somebody learned to fly at, on a glass. Every pilot recognizes their own airport from the diagram alone, which is the whole trick.",
    tip: "Use the field they trained at rather than a famous one — a JFK diagram is a poster, their own field is a memory. Check the airport is actually offered before ordering, because sellers stock the big fields and cut the small ones to order."
  },
  {
    category: "for the student pilot",
    name: "Stick and Rudder",
    query: "Stick and Rudder Langewiesche book",
    reason:
      "The 1944 book on flying by feel that instructors still hand to students who can pass the written exam and cannot land. It explains what the airplane is doing in language no regulation has ever managed.",
    tip: "Any edition works — the aerodynamics have not changed since 1944, which is rather the point. This is not a study guide and will not help anyone pass a checkride; it is the book pilots reread for thirty years."
  },
  {
    category: "for the teacher",
    name: "Desk mug warmer",
    query: "coffee mug warmer desk auto shut off",
    reason:
      "A teacher's coffee goes cold at 7:40am and gets microwaved four times before lunch. This is the small daily indignity that a twenty-dollar plate quietly ends.",
    tip: "Get one with auto shut-off, because a classroom is a room people leave in a hurry. Make sure it heats by contact plate rather than induction: an induction warmer only works with its own mug, and the point is the mug they already love."
  },
  {
    category: "for the teacher",
    name: "Felt-tip grading pen set",
    query: "felt tip pens fine point set",
    reason:
      "Teachers are startlingly specific about pens, and the ones they like get stolen by students, colleagues and their own children. A large set of good ones gets used up, which is the highest compliment a consumable can earn.",
    tip: "Buy the big multi-colour set rather than a small premium one — grading, planning and display each want a different colour, and quantity is what makes it feel generous. Skip gel pens for grading: they smear under a hand and bleed through worksheet paper."
  },
  {
    category: "for the teacher",
    name: "Hand cream set",
    query: "hand cream gift set unscented",
    reason:
      "Whiteboard markers, constant sanitizer and a room of thirty children wreck a teacher's hands by December. This is the gift that reads as \"you noticed\", which no mug has ever managed.",
    tip: "Unscented or very lightly scented: classrooms hold children with sensitivities, and a strong fragrance means the tube stays in a drawer. A cream that absorbs fast beats a luxurious one, because nobody can grade papers with greasy hands."
  },
  {
    category: "for the first place",
    name: "Kitchen fire extinguisher",
    query: "kitchen fire extinguisher ABC rated",
    reason:
      "The least romantic object on this list and the one most first apartments do not have. It costs about what a scented candle costs and does rather more.",
    tip: "It needs an ABC rating, which covers the grease, wood and electrical fires a kitchen produces — water on a grease fire spreads it. Mount it near the kitchen exit rather than under the sink, so you reach it standing between the fire and the door instead of past it."
  },
  {
    category: "for the first place",
    name: "Pre-seasoned cast-iron skillet",
    query: "pre-seasoned cast iron skillet 10 inch",
    reason:
      "The first pan someone owns that will outlive them. It costs less than the nonstick pan it replaces and does not need replacing in two years when the coating gives up.",
    tip: "Ten inches does everything for one or two people; a 12-inch is heavy enough that it stays in the cupboard. It arrives pre-seasoned and stays that way through ordinary cooking — the elaborate re-seasoning ritual online is what puts people off owning one, and it is not required."
  },
  {
    category: "for the first place",
    name: "Smart plug set",
    query: "smart plug set 2.4GHz",
    reason:
      "Tree lights on a schedule, a lamp that comes on before you walk into a dark apartment, and certainty about whether something is off. Two of those are seasonal and the third matters all year.",
    tip: "Setup pairs over 2.4GHz Wi-Fi, which is where these trip people up on a modern dual-band router — it is a five-minute settings change rather than a fault, and it is the single most common reason one of these ends up back in its box in January. Never put a space heater on one: the plug is rated well below what a heater pulls."
  }
];
```

- [ ] **Step 2: Register the collection**

In `products.js`, add the import immediately after the `firstApartmentTools` import:

```js
import { holidayGifts } from "./guides/holiday-gifts.js";
```

and add the registration to `collections` after the `"first-apartment-tools"` entry — note the comma that must be added to the line above it:

```js
  "first-apartment-tools": firstApartmentTools,
  "holiday-gifts": holidayGifts
};
```

Change nothing else in this file. `escapeHtml`, `amazonUrl`, and `renderProductGrid` stay as they are.

- [ ] **Step 3: Add the verify-build entry**

In `scripts/verify-build.mjs`, add a seventh entry to the `GUIDES` array, after the `first-apartment-tools` object — the object above it needs a trailing comma:

```js
  {
    file: "dist/holiday-gifts.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "First-solo shirttail display frame"
  }
```

`contains` must match the `name` field of item 7 character for character.

- [ ] **Step 4: Run the build and verify it FAILS**

Run: `npm run build`

Expected: the build throws

```
prerender-products: collection "holiday-gifts" was never injected — no page carries data-product-grid="holiday-gifts".
```

This failure is the point of the task. If the build **passes** here, the collection was not registered and Task 2 will paper over it. Stop and fix before continuing.

- [ ] **Step 5: Commit**

```bash
git add guides/holiday-gifts.js products.js scripts/verify-build.mjs
git commit -m "Add holiday gifts collection and its build check"
```

---

### Task 2: The guide page (green)

**Files:**
- Create: `holiday-gifts.html`
- Modify: `vite.config.js` (add to `rollupOptions.input` after the `firstApartment` line)

**Interfaces:**
- Consumes: the collection key `"holiday-gifts"` registered in Task 1.
- Produces: a page at `/holiday-gifts` carrying `id="item-1"` through `id="item-15"`, which Task 4's TOC cross-link and Task 5's sitemap entry point at.

- [ ] **Step 1: Create the page**

Create `holiday-gifts.html` with exactly this content. The header, footer, and nav are copied verbatim from `first-apartment-tools.html` — they are duplicated by design across all pages (see `partials-note.txt`), so they must match the other pages character for character rather than being reformatted.

Note the five inline `<a>` links in the second intro paragraph. They are the page's whole purpose. Do not move them to the TOC, do not consolidate them, do not drop any.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>15 Holiday Gifts With Personality | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen holiday gifts grouped by who you're buying for — the dog lover, the flight attendant, the student pilot, the teacher and the first apartment."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/holiday-gifts"
    />
    <meta
      property="og:title"
      content="15 Holiday Gifts, Grouped by Who You're Buying For"
    />
    <meta
      property="og:description"
      content="Five trios, one for each person this site is written for, with the lead times and specification checks that decide whether the gift lands."
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
            <a href="/">Home</a><span>/</span><span>Seasonal finds</span>
          </nav>
          <p class="eyebrow">Seasonal finds</p>
          <h1>15 Holiday Gifts, Grouped by Who You're Buying For</h1>
          <p class="lede">
            The hard part of buying for someone in December is not generosity.
            It is that you know roughly what they do and almost nothing about
            what they already own. This list is grouped by the person, not the
            product.
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
                The rest of this site is written for people who already know
                what they are looking for—a flight attendant who lives out of a
                bag, somebody learning to fly, a teacher setting up a room. In
                December the question turns around. You are buying for one of
                those people, you know what they do, and you have no idea what
                is already in the cupboard.
              </p>
              <p>
                So this runs in five trios, one for each of them: the
                <a href="/dog-lover-gifts">dog lover</a>, the
                <a href="/flight-attendant-travel-essentials"
                  >flight attendant</a
                >, the <a href="/student-pilot-gifts">student pilot</a>, the
                <a href="/elementary-classroom-essentials">teacher</a>, and
                somebody in a
                <a href="/first-apartment-tools">first place of their own</a>.
                Each of those goes to the full guide for that person if you want
                the deeper list. One rule applies to all fifteen—<strong
                  >nothing here needs a size, a measurement, or any knowledge of
                  what they already own</strong
                >. That is the difference between a gift you can buy and a gift
                you have to interrogate somebody about first.
              </p>
            </div>
            <div class="product-grid" data-product-grid="holiday-gifts"></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original workshop designs</h2>
              <p>
                Bill's Workshop Company creates designs for people who would
                rather give something with a bit of character than another
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
            ><a href="#item-1">For the dog lover</a
            ><a href="#item-4">For the flight attendant</a
            ><a href="#item-7">For the student pilot</a
            ><a href="#item-10">For the teacher</a
            ><a href="#item-13">For the first place</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
            ><a href="/student-pilot-gifts">Student pilot gifts guide</a
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

The `<div class="product-grid" data-product-grid="holiday-gifts"></div>` must stay an empty element — the injection pattern in `vite.config.js:6` matches an open tag, optional whitespace, and a close tag.

- [ ] **Step 2: Add the page to the Vite input map**

In `vite.config.js`, add to `rollupOptions.input` immediately after the `firstApartment` line:

```js
        holiday: "holiday-gifts.html",
```

The map should then hold eleven entries: `home`, `guide`, `dogGifts`, `classroom`, `dogLovers`, `studentPilots`, `firstApartment`, `holiday`, `about`, `disclosure`, `privacy`.

- [ ] **Step 3: Run the build and verify it now PASSES**

Run: `npm run build`

Expected: exit 0, and `dist/holiday-gifts.html` appears in the output listing. The `closeBundle` error from Task 1 is gone.

- [ ] **Step 4: Run the full check**

Run: `npm run verify`

Expected: `lint:html` clean across eleven pages, then

```
verify-build OK: 7 guide(s), 105 cards, all anchor targets present
```

If `lint:html` reports `long-title`, the `<title>` has been wrapped across source lines — put it back on one line.

- [ ] **Step 5: Confirm real content shipped, not an empty container**

Run:

```bash
grep -c 'class="product-card"' dist/holiday-gifts.html
grep -c 'tag=billsworkshop-20' dist/holiday-gifts.html
grep -c 'rel="sponsored nofollow noopener"' dist/holiday-gifts.html
grep -o 'First-solo shirttail display frame' dist/holiday-gifts.html
```

Expected: `15`, `15`, `15`, and `First-solo shirttail display frame`.

- [ ] **Step 6: Confirm the five routing links survived the build**

Run:

```bash
grep -o 'href="/dog-lover-gifts"\|href="/flight-attendant-travel-essentials"\|href="/student-pilot-gifts"\|href="/elementary-classroom-essentials"\|href="/first-apartment-tools"' dist/holiday-gifts.html | sort | uniq -c
```

Expected: five distinct hrefs. `/dog-lover-gifts` and `/student-pilot-gifts` appear **twice** each (once in the intro, once in the TOC); the other three appear **once** each. A count of one for `/dog-lover-gifts` means an intro link was dropped.

- [ ] **Step 7: Check dev/prod parity**

Start `npm run dev`, fetch `http://localhost:5173/holiday-gifts.html` over HTTP, and confirm the response body contains 15 occurrences of `class="product-card"`. Stop the dev server before continuing.

- [ ] **Step 8: Commit**

```bash
git add holiday-gifts.html vite.config.js
git commit -m "Add the holiday gifts guide"
```

---

### Task 3: Home page card

**Files:**
- Modify: `index.html` (new `<article class="guide-card">` as the sixth and last card in `.guide-card-grid`, inserted before the grid's closing `</div>` at line 184)

**Interfaces:**
- Consumes: the page published in Task 2, linked at `/holiday-gifts`.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Add the guide card**

In `index.html`, inside `.guide-card-grid`, add a sixth `<article>` after the first apartment tools card (whose `</article>` is the last one before the grid closes) and before the closing `</div>`:

```html
            <article class="guide-card">
              <p class="eyebrow">Seasonal finds</p>
              <h3>15 Holiday Gifts With Personality</h3>
              <p>
                Five trios, one for each person this site is written for—the dog
                lover, the flight attendant, the student pilot, the teacher and
                the first apartment.
              </p>
              <a class="button button-secondary" href="/holiday-gifts"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
```

Do not touch `<article class="featured-guide">` above the grid. The classroom guide keeps the featured slot; the swap to this guide is an October change and is deliberately not part of this plan.

- [ ] **Step 2: Do NOT change any CSS**

`styles.css` needs no edit. `.guide-card-grid` is already `repeat(3, 1fr)` above 860px, `repeat(2, 1fr)` from 681 to 860px, and `1fr` below 680px. Six cards render 3 + 3, 2 + 2 + 2, and stacked.

Confirm by reading `styles.css:246` and the two media blocks that all three rules are present and unmodified. If you find yourself editing `styles.css`, stop — something is wrong with your understanding of the task.

- [ ] **Step 3: Verify the grid holds six cards in the intended order**

Run:

```bash
grep -c 'article class="guide-card"' index.html
grep -A7 'article class="guide-card"' index.html | grep -o 'href="/[a-z-]*"'
```

Expected: `6`, then exactly six hrefs in this order — `/flight-attendant-travel-essentials`, `/flight-attendant-dog-gifts`, `/student-pilot-gifts`, `/dog-lover-gifts`, `/first-apartment-tools`, `/holiday-gifts`. The second command scopes the search to the cards themselves, so nav and footer links cannot pollute the count.

Also confirm the featured guide above the grid is still the classroom guide and that no grid card duplicates it.

- [ ] **Step 4: Build and verify**

Run: `npm run build && npm run verify`

Expected: exit 0 and `verify-build OK: 7 guide(s), 105 cards, all anchor targets present`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add the holiday gifts card to the home page"
```

---

### Task 4: TOC cross-link swap on the dog lover guide

The new guide links out to two neighbours (done in Task 2). This task gives it one link back in. Every guide's TOC keeps exactly two cross-links plus "All guides".

**Files:**
- Modify: `dog-lover-gifts.html:125`

**Interfaces:**
- Consumes: the page published in Task 2.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Swap the classroom essentials link for the new guide**

In `dog-lover-gifts.html`, the TOC aside currently ends:

```html
            ><a href="#item-13">For the person</a
            ><a href="/flight-attendant-dog-gifts">Dog gifts for flight crew</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
            ><a href="/#guides">All guides</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
```

Replace the classroom essentials line so it reads:

```html
            ><a href="#item-13">For the person</a
            ><a href="/flight-attendant-dog-gifts">Dog gifts for flight crew</a
            ><a href="/holiday-gifts">Holiday gifts guide</a
            ><a href="/#guides">All guides</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
```

The `><a` line-break style is deliberate throughout these files: it prevents whitespace between inline anchors. Keep it exactly.

- [ ] **Step 2: Verify every guide TOC still has exactly two cross-links plus All guides**

Anchor text varies between guides, so counting on the word "guide" proves nothing. Check the structure instead.

```bash
grep -c 'href="/#guides">All guides' *.html
```

Expected: `2` for each of the seven guide pages (one in the TOC, one in the footer); `1` for `index.html`, `about.html`, `affiliate-disclosure.html` and `privacy.html`.

Then print each TOC block and read it:

```bash
grep -A11 'aside class="toc"' *.html
```

Expected, for each of the seven guide pages, in order: five `#item-` anchors, then exactly **two** links to other guides, then `/#guides`, then `/affiliate-disclosure`.

- [ ] **Step 3: Confirm classroom essentials still has an inbound link**

This swap takes away one of classroom essentials' inbound links. It must still have one.

```bash
grep -rln 'href="/elementary-classroom-essentials"' *.html
```

Expected: `first-apartment-tools.html`, `holiday-gifts.html`, and `index.html`. If `first-apartment-tools.html` is missing from that list, an earlier change was lost — stop and report.

- [ ] **Step 4: Confirm the new guide has an inbound link**

```bash
grep -rln 'href="/holiday-gifts"' *.html
```

Expected: `dog-lover-gifts.html` and `index.html`.

- [ ] **Step 5: Build, lint and verify**

Run: `npm run build && npm run verify`

Expected: exit 0, `lint:html` clean, `verify-build OK: 7 guide(s), 105 cards, all anchor targets present`.

- [ ] **Step 6: Commit**

```bash
git add dog-lover-gifts.html
git commit -m "Point the dog lover guide TOC at the holiday gifts guide"
```

---

### Task 5: Sitemap, README, and final verification

**Files:**
- Modify: `public/sitemap.xml` (after the `first-apartment-tools` line)
- Modify: `README.md` (after the first apartment tools line in the Pages list)

**Interfaces:**
- Consumes: everything above.
- Produces: the shippable branch.

- [ ] **Step 1: Add the page to the sitemap**

In `public/sitemap.xml`, add after the `first-apartment-tools` line:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/holiday-gifts</loc></url>
```

- [ ] **Step 2: Add the page to the README Pages list**

In `README.md`, add after the first apartment tools line:

```markdown
- 15 Holiday Gifts, Grouped by Who You're Buying For guide
```

- [ ] **Step 3: Full verification sweep**

Run: `npm run build && npm run verify`

Expected: `lint:html` clean across all eleven pages, then `verify-build OK: 7 guide(s), 105 cards, all anchor targets present`.

- [ ] **Step 4: Confirm no extension-ful internal links slipped in**

Run: `grep -rn 'href="/[a-z-]*\.html"' *.html`

Expected: no output.

- [ ] **Step 5: Confirm the sitemap covers every built page**

```bash
ls dist/*.html | wc -l
grep -c '<loc>' public/sitemap.xml
```

Expected: `11` and `11`.

- [ ] **Step 6: Confirm no year leaked into the page**

The guide is deliberately undated. Run:

```bash
grep -n '202[0-9]' holiday-gifts.html guides/holiday-gifts.js
```

Expected: **no output at all.** Any hit means a current-decade year leaked into the page or the data, which breaks the undated constraint — remove it.

Two things deliberately do not match this pattern and are correct as they stand: the 1944 references in item 9's `reason` and `tip` (a historical publication date, not a freshness signal), and `© <span data-year></span>` in the footer, which is script-filled and holds no literal year.

- [ ] **Step 7: Confirm all seven guides render distinct products**

Run: `node scripts/verify-build.mjs`

Expected: passes. The signature check fails loudly if any two guides render the same Amazon queries.

- [ ] **Step 8: Commit**

```bash
git add public/sitemap.xml README.md
git commit -m "Link the holiday gifts guide into the site"
```

Do NOT push and do NOT open a pull request. Publishing happens after a whole-branch review, at the user's explicit choice.

---

## Spec coverage check

| Spec section | Task |
|---|---|
| `guides/holiday-gifts.js` | 1 |
| `products.js` | 1 |
| `scripts/verify-build.mjs` | 1 |
| `holiday-gifts.html` | 2 |
| Five inline routing links (the new pattern) | 2 (created), 2 Step 6 (asserted) |
| `vite.config.js` | 2 |
| `index.html` home card, no CSS change | 3 |
| Featured slot — recorded intent only, not implemented | none, by design (spec "Featured slot") |
| TOC cross-links | 2 (new page's outbound), 4 (dog lover's inbound swap) |
| `public/sitemap.xml`, `README.md` | 5 |
| Undated constraint | 5 Step 6 |
| Verification steps 1–8 | 2 (1–5), 3 (6, 7), 4 (8 TOC half), 5 (full sweep) |
