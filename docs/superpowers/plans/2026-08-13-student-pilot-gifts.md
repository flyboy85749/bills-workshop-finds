# Student Pilot Gifts Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/student-pilot-gifts`, a 15-item Amazon-first gift guide grouped by flight-training stage, and collapse the site's per-guide footer links and TOC cross-links so neither grows with the guide count.

**Architecture:** Guide content is data, not markup. A `guides/<slug>.js` module exports an array of item objects; `products.js` registers it in `collections`; a Vite plugin (`prerenderProducts`) injects the rendered cards into the `data-product-grid` container at build time. No item HTML is hand-written, so affiliate attributes and tags come from one shared render path. The build fails if a registered collection is never injected, and `scripts/verify-build.mjs` fails if the guide is not also registered for checking.

**Tech Stack:** Vite 7 (MPA mode), vanilla ES modules, static HTML, html-validate 11, Node scripts. No test framework — the test cycle is `npm run build && npm run verify` plus targeted `grep` assertions on `dist/`.

**Spec:** `docs/superpowers/specs/2026-08-13-student-pilot-gifts-design.md`

## Global Constraints

- Slug is `student-pilot-gifts` everywhere: file name, collection key, `data-product-grid` value, URL path.
- All internal links are extensionless (`/student-pilot-gifts`, never `/student-pilot-gifts.html`). Vercel maps clean paths to the `.html` files at request time.
- `<title>` must be on ONE line and ≤75 characters including whitespace inside the element. The `long-title` rule counts indentation and newlines, so a wrapped title fails even when its text is short.
- Page `<title>`: `15 Gifts for Student Pilots | Bill's Workshop Finds` (51 chars).
- `<h1>` and `og:title`: `15 Gifts for Student Pilots, Sorted by Where They Are in Training` (65 chars).
- Exactly 15 items, in 5 contiguous `category` runs of 3, so TOC anchors land on items 1, 4, 7, 10, 13.
- Never hand-write a product card, an Amazon URL, or a `rel` attribute. `renderProductGrid` emits all three.
- Editorial rule for every item: nothing that installs in the aircraft. Renters cannot modify aircraft and installed avionics need an A&P sign-off.
- Three `tip` fields are safety- or compatibility-critical and must survive editing verbatim in substance: non-polarized lenses, non-sedating motion sickness remedies, headset connector types.
- The footer is hand-duplicated across all 9 HTML pages (`partials-note.txt`). Any footer edit lands identically on all 9.
- Commit after each task. Do not push or open a PR until the final task.

---

### Task 1: Guide data and registration (red)

Creates the content and registers it, without the page that renders it. This is the failing test: the build now knows about a collection that no page carries.

**Files:**
- Create: `guides/student-pilot-gifts.js`
- Modify: `products.js:1-12`
- Modify: `scripts/verify-build.mjs:25-31`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: named export `studentPilotGifts` — `Array<{category: string, name: string, query: string, reason: string, tip: string}>`, length 15. Task 2's page renders it via the collection key `"student-pilot-gifts"`.

- [ ] **Step 1: Create the guide data file**

Create `guides/student-pilot-gifts.js`:

```js
export const studentPilotGifts = [
  {
    category: "first lessons",
    name: "Entry-level ANR aviation headset",
    query: "ANR aviation headset general aviation",
    reason:
      "The single biggest change to a student's first hour. Training aircraft are loud enough that instruction gets lost under the engine, and active noise reduction turns a shouted lesson into a conversation.",
    tip: "Check the connectors before buying anything. Standard fixed-wing aircraft use twin GA plugs, helicopters use a single plug, and some newer aircraft use LEMO panel power. They are not interchangeable, so ask which aircraft they train in."
  },
  {
    category: "first lessons",
    name: "Paper pilot logbook",
    query: "pilot logbook",
    reason:
      "Every flight has to be logged, and the instructor endorsements before solo and checkride get signed into the book itself. It is also the one object from training a pilot keeps for the rest of their life.",
    tip: "Get the standard-size book rather than the pocket version. The columns are easier to fill in accurately and there is room for endorsements. Logging digitally as well is fine, but signatures still land on paper."
  },
  {
    category: "first lessons",
    name: "Non-drowsy motion sickness kit",
    query: "ginger chews motion sickness relief",
    reason:
      "Air sickness is common early in training, especially during steep turns and stalls, and it makes students quit. It usually fades after a few hours of exposure, so the job is getting through those hours.",
    tip: "Avoid the sedating antihistamines most motion-sickness pills contain. They impair a pilot and cannot be taken before flying, so the standard drugstore box is the wrong gift here. Ginger chews and acupressure wrist bands carry no such restriction."
  },
  {
    category: "pre-solo",
    name: "VFR kneeboard",
    query: "pilot kneeboard",
    reason:
      "There is nowhere in a small cockpit to put anything down. A kneeboard straps the clearance, the frequencies and the checklist to the pilot's leg, where they stay put in turbulence.",
    tip: "Ask whether they fly with paper or a tablet before ordering. A tri-fold paper kneeboard and a tablet strap kneeboard are different products, and someone who has moved to an app has no use for the paper version."
  },
  {
    category: "pre-solo",
    name: "Non-polarized aviation sunglasses",
    query: "non-polarized aviation sunglasses",
    reason:
      "Hours of unfiltered glare above the haze layer is real eye strain, and a student is scanning outside almost continuously.",
    tip: "They must not be polarized. Polarized lenses black out LCD glass-panel displays at certain angles and hide stress cracks in a windshield, which is exactly the damage a preflight is meant to find. Most aviator-styled sunglasses sold today are polarized, so check the listing explicitly."
  },
  {
    category: "pre-solo",
    name: "Filtered fuel tester jar",
    query: "GATS jar fuel tester aviation",
    reason:
      "Fuel is sampled from several drains before every flight, checking for water and the correct grade. A student does this more carefully than anyone on the field.",
    tip: "The filtered jar type lets the sampled fuel be poured back into the tank instead of dumped on the ramp. Cleaner, cheaper and better practice than the plain plastic tube most students start with."
  },
  {
    category: "cross-country",
    name: "Portable ADS-B receiver",
    query: "portable ADS-B receiver aviation",
    reason:
      "Feeds traffic and in-flight weather to the tablet app they already fly with. On a cross-country it turns weather from something guessed on the ground into something watched in the air.",
    tip: "Match the app they already use. Sentry units are built around ForeFlight and Garmin's receivers pair with Garmin Pilot. A receiver that does not talk to their app is an expensive paperweight, so ask what is on their tablet first."
  },
  {
    category: "cross-country",
    name: "Yoke or suction tablet mount",
    query: "iPad yoke mount aviation",
    reason:
      "A tablet loose on a lap slides off in turbulence, which is exactly when the chart on it is needed. A mount puts it in the scan and leaves both hands free.",
    tip: "Yoke mounts suit the trainers most students fly; suction mounts suit aircraft with a stick or a low panel. Measure the tablet with its case on — sizing to the bare tablet is the common mistake."
  },
  {
    category: "cross-country",
    name: "Manual E6B flight computer and plotter",
    query: "ASA E6B manual flight computer plotter",
    reason:
      "Wind correction, fuel burn, time en route and density altitude all run through it during cross-country planning, and it turns up again on the checkride.",
    tip: "Buy the manual slide-rule version, not the electronic one. It is what examiners expect to see used, it teaches the relationship behind the number, and it has no battery to go flat mid-checkride. The plotter is the cheap companion piece, so get both."
  },
  {
    category: "checkride prep",
    name: "Private pilot oral exam guide",
    query: "private pilot oral exam guide",
    reason:
      "The checkride opens with a long conversation on the ground, and it is the part students fear most. This is the question bank they rehearse against.",
    tip: "Check the edition year before buying. Regulations and the airman certification standards change, and an old edition quietly teaches outdated answers, which is worse than not studying."
  },
  {
    category: "checkride prep",
    name: "View-limiting foggles",
    query: "foggles view limiting device",
    reason:
      "The private certificate requires simulated instrument time, flown with the outside view blocked so only the panel is visible. Students borrow a scratched pair from the school until they own one.",
    tip: "If they wear prescription glasses, check the model fits over them, because several popular ones do not. The wraparound hood style is the safer buy when you are not sure what they wear."
  },
  {
    category: "checkride prep",
    name: "Red-lens headlamp",
    query: "red light headlamp aviation",
    reason:
      "Night training means preflighting a dark aircraft and reading charts in an unlit cockpit without destroying the night vision the rest of the flight depends on.",
    tip: "It needs a true red mode that comes on first. Many headlamps flash white before cycling to red, which undoes twenty minutes of dark adaptation every time it is switched on. Look for a dedicated red-first button."
  },
  {
    category: "newly certificated",
    name: "Pilot flight bag",
    query: "pilot flight bag",
    reason:
      "By the cross-country phase the gear has outgrown a backpack: headset, tablet, charts, fuel tester, spare batteries and logbook all travel to every lesson.",
    tip: "The headset compartment decides whether the bag works. It needs to be padded, dedicated, and sized against the headset case they actually own — bags that assume a bare headset will not close over a hard case."
  },
  {
    category: "newly certificated",
    name: "Second passenger headset",
    query: "passenger aviation headset",
    reason:
      "The first thing a newly certificated pilot does is take someone flying, and a passenger cannot hear a word without a headset. Flight schools charge to rent one, per flight.",
    tip: "A mid-range passive headset is the sane buy. Passenger headsets get handed around, dropped and left in the aircraft, so the money belongs in the pilot's own set instead."
  },
  {
    category: "newly certificated",
    name: "Tail-number commemorative piece",
    query: "personalized aviation wall art tail number",
    reason:
      "The aircraft someone learned in matters to them for decades. Of everything on this list, this is the item that gets kept.",
    tip: "Order weeks earlier than feels necessary, because personalized work runs on its own lead time and cannot be rushed near the holidays. If you do not know the tail number, the home airport identifier or the first-solo date works just as well."
  }
];
```

- [ ] **Step 2: Register the collection**

In `products.js`, add the import after line 5 and the collection entry after line 11:

```js
import { studentPilotGifts } from "./guides/student-pilot-gifts.js";
```

```js
export const collections = {
  "travel-essentials": travelEssentials,
  "flight-attendant-dog-gifts": dogGifts,
  "elementary-classroom-essentials": classroomEssentials,
  "dog-lover-gifts": dogLoverGifts,
  "student-pilot-gifts": studentPilotGifts
};
```

- [ ] **Step 3: Add the verify-build entry**

In `scripts/verify-build.mjs`, add a fifth object to the `GUIDES` array (after the `dog-lover-gifts` entry, before the closing `]`):

```js
  {
    file: "dist/student-pilot-gifts.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Non-polarized aviation sunglasses"
  }
```

- [ ] **Step 4: Run the build to verify it FAILS**

Run: `npm run build`

Expected: FAIL. The `closeBundle` hook throws:
`prerender-products: collection "student-pilot-gifts" was never injected — no page carries data-product-grid="student-pilot-gifts".`

This is the red state. The collection exists and is registered, but nothing renders it. Task 2 turns this green.

- [ ] **Step 5: Commit**

```bash
git add guides/student-pilot-gifts.js products.js scripts/verify-build.mjs
git commit -m "Add student pilot gifts collection and its build check"
```

---

### Task 2: The guide page (green)

**Files:**
- Create: `student-pilot-gifts.html`
- Modify: `vite.config.js:50-59`

**Interfaces:**
- Consumes: collection key `"student-pilot-gifts"` registered in Task 1.
- Produces: `dist/student-pilot-gifts.html` with 15 `.product-card` elements carrying ids `item-1` through `item-15`.

- [ ] **Step 1: Create the page**

Create `student-pilot-gifts.html`. This is the established page shell — nav, hero, intro, grid container, Etsy callout, TOC, footer — with this guide's copy. The TOC already carries the trimmed cross-link set from Task 4, so it does not need revisiting:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>15 Gifts for Student Pilots | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen gifts for student pilots grouped by training stage, from first lessons to checkride prep and first passenger — with what to check before buying each one."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/student-pilot-gifts"
    />
    <meta
      property="og:title"
      content="15 Gifts for Student Pilots, Sorted by Where They Are in Training"
    />
    <meta
      property="og:description"
      content="Gifts chosen by how far along the training is, with the connector, lens and lead-time checks that decide whether the gift gets used."
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
            <a href="/">Home</a><span>/</span><span>Student pilots</span>
          </nav>
          <p class="eyebrow">Student pilots</p>
          <h1>
            15 Gifts for Student Pilots, Sorted by Where They Are in Training
          </h1>
          <p class="lede">
            Flight training gear is bought by people who are still learning what
            they need, which makes it unusually easy to buy them the wrong
            thing. This list is grouped by how far along they are, so the only
            question you have to answer is one you probably can.
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
                A student pilot accumulates equipment in a fairly predictable
                order, because each stage of training introduces a problem the
                last one did not have. Someone on their third lesson has
                different gaps from someone booking a checkride, and buying
                ahead of where they are usually means buying something that sits
                in a cupboard until it is obsolete.
              </p>
              <p>
                So this list runs in stages: first lessons, pre-solo, the
                cross-country phase, checkride prep, and the first months after
                the certificate arrives. One rule applies to all fifteen—
                <strong>nothing here bolts to an airplane</strong>. Most students
                rent, a renter cannot legally modify the aircraft, and anything
                installed needs a mechanic's sign-off. Every item is portable and
                leaves in the flight bag.
              </p>
            </div>
            <div
              class="product-grid"
              data-product-grid="student-pilot-gifts"
            ></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original aviation designs</h2>
              <p>
                Bill's Workshop Company creates designs for people who would
                rather carry something with a bit of personality than another
                generic airplane mug.
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
            ><a href="#item-1">First lessons</a
            ><a href="#item-4">Pre-solo</a
            ><a href="#item-7">Cross-country</a
            ><a href="#item-10">Checkride prep</a
            ><a href="#item-13">Newly certificated</a
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gifts for flight crew</a
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

- [ ] **Step 2: Add the page to the Vite input map**

In `vite.config.js`, add to `rollupOptions.input` after the `dogLovers` line:

```js
        studentPilots: "student-pilot-gifts.html",
```

- [ ] **Step 3: Run the build and verify it now PASSES**

Run: `npm run build && npm run verify`

Expected: build succeeds and prints `dist/student-pilot-gifts.html` in the output list; verify prints:
`verify-build OK: 5 guide(s), 75 cards, all anchor targets present`

- [ ] **Step 4: Confirm real content shipped, not an empty container**

Run:
```bash
grep -c 'class="product-card"' dist/student-pilot-gifts.html
grep -c 'tag=billsworkshop-20' dist/student-pilot-gifts.html
grep -c 'rel="sponsored nofollow noopener"' dist/student-pilot-gifts.html
grep -c 'Non-polarized aviation sunglasses' dist/student-pilot-gifts.html
```

Expected: `15`, `15`, `15`, `1`.

- [ ] **Step 5: Check dev/prod parity**

Run: `npm run dev`, open `http://localhost:5173/student-pilot-gifts.html`, confirm 15 cards render with tips and working Amazon buttons, then stop the server.

Expected: the grid renders identically to the built page. A blank grid here means the plugin's dev-mode transform did not run.

- [ ] **Step 6: Commit**

```bash
git add student-pilot-gifts.html vite.config.js
git commit -m "Add the student pilot gifts guide"
```

---

### Task 3: Home page card swap

The classroom guide currently appears twice: featured, and again as a grid card. Its duplicate grid card is replaced by the pilot card, keeping `.guide-card-grid` at a full 2×2. The featured slot is NOT touched — the classroom guide keeps it.

**Files:**
- Modify: `index.html:151-161` (the classroom `.guide-card`)

- [ ] **Step 1: Replace the classroom grid card with the pilot card**

In `index.html`, replace this entire `<article>` (lines 151-161):

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

with:

```html
            <article class="guide-card">
              <p class="eyebrow">Student pilots</p>
              <h3>15 Gifts for Student Pilots</h3>
              <p>
                Grouped by how far along their training is—first lessons,
                pre-solo, cross-country, checkride and first passenger.
              </p>
              <a class="button button-secondary" href="/student-pilot-gifts"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
```

- [ ] **Step 2: Verify the grid holds exactly four cards and no duplicate**

Run:
```bash
grep -c 'class="guide-card"' index.html
grep -c 'href="/elementary-classroom-essentials"' index.html
grep -c 'href="/student-pilot-gifts"' index.html
```

Expected: `4`, `1`, `1`. The classroom count of `1` is the featured-block link only — proving the duplicate card is gone.

- [ ] **Step 3: Confirm the featured slot is untouched**

Run: `grep -A 3 'class="featured-copy"' index.html`

Expected: still shows the `Teachers` eyebrow and the classroom headline. If it shows the pilot guide, the wrong block was edited — revert and redo Step 1.

- [ ] **Step 4: Build and verify**

Run: `npm run build && npm run verify`

Expected: build succeeds, verify prints `5 guide(s), 75 cards`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Swap the duplicate classroom card for the student pilot card"
```

---

### Task 4: Trim TOC cross-links on the four existing guides

Each guide's TOC lists every other guide, so the block grows with each new page. Each is capped at its two topically-nearest guides plus one "All guides" link. The new guide already ships with the trimmed set from Task 2.

**Files:**
- Modify: `flight-attendant-travel-essentials.html:131-133`
- Modify: `flight-attendant-dog-gifts.html:122-124`
- Modify: `elementary-classroom-essentials.html:127-129`
- Modify: `dog-lover-gifts.html:124-126`

- [ ] **Step 1: Trim the travel essentials TOC**

In `flight-attendant-travel-essentials.html`, replace lines 131-133:

```html
            ><a href="/flight-attendant-dog-gifts">Dog gifts guide</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
```

with:

```html
            ><a href="/student-pilot-gifts">Student pilot gifts guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gifts guide</a
            ><a href="/#guides">All guides</a
```

- [ ] **Step 2: Trim the crew dog gifts TOC**

In `flight-attendant-dog-gifts.html`, replace lines 122-124:

```html
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
```

with:

```html
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
            ><a href="/#guides">All guides</a
```

- [ ] **Step 3: Trim the classroom essentials TOC**

In `elementary-classroom-essentials.html`, replace lines 127-129:

```html
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gifts guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
```

with:

```html
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
            ><a href="/#guides">All guides</a
```

- [ ] **Step 4: Trim the dog lover gifts TOC**

In `dog-lover-gifts.html`, replace lines 124-126:

```html
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gifts for flight crew</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
```

with:

```html
            ><a href="/flight-attendant-dog-gifts">Dog gifts for flight crew</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
            ><a href="/#guides">All guides</a
```

- [ ] **Step 5: Verify every guide TOC has exactly three trailing links**

Run:
```bash
grep -c '"/#guides">All guides' *.html
```

Expected: `1` for `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html`, `elementary-classroom-essentials.html` and `dog-lover-gifts.html`; `2` for `student-pilot-gifts.html`, which already carries both a TOC link and a collapsed footer link from Task 2; `0` for `index.html`, `about.html`, `affiliate-disclosure.html` and `privacy.html`, whose footers are not collapsed until Task 5.

- [ ] **Step 6: Build, lint and verify**

Run: `npm run build && npm run verify`

Expected: `lint:html` reports no problems (a mangled `><a` chain is the likely mistake here and html-validate will catch unclosed tags), then `verify-build OK: 5 guide(s), 75 cards`.

- [ ] **Step 7: Commit**

```bash
git add flight-attendant-travel-essentials.html flight-attendant-dog-gifts.html elementary-classroom-essentials.html dog-lover-gifts.html
git commit -m "Cap each guide's TOC cross-links at two plus All guides"
```

---

### Task 5: Collapse the footer Explore column on the eight existing pages

The recorded debt from the dog-lover spec. Four per-guide links become one. The new guide already ships collapsed from Task 2.

**Files:**
- Modify: `index.html:319-326`
- Modify: `about.html:122-129`
- Modify: `affiliate-disclosure.html:114-121`
- Modify: `privacy.html:131-138`
- Modify: `flight-attendant-travel-essentials.html:154-161`
- Modify: `flight-attendant-dog-gifts.html:145-152`
- Modify: `elementary-classroom-essentials.html:150-157`
- Modify: `dog-lover-gifts.html:147-154`

- [ ] **Step 1: Apply the identical replacement to all eight pages**

In each file listed above, find this block (identical in all eight, only the line number differs):

```html
            <h3>Explore</h3>
            <a href="/flight-attendant-travel-essentials">Travel guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gift guide</a
            ><a href="/elementary-classroom-essentials">Classroom guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts</a
            ><a href="/#categories">Categories</a
            ><a href="/about">About</a>
```

and replace it with:

```html
            <h3>Explore</h3>
            <a href="/#guides">All guides</a
            ><a href="/#categories">Categories</a
            ><a href="/about">About</a>
```

- [ ] **Step 2: Verify all nine pages carry the collapsed footer**

Run:
```bash
grep -c '"/#guides">All guides' *.html
grep -c '"/flight-attendant-travel-essentials">Travel guide' *.html
```

Expected: the first command reports `2` for the five guide pages (TOC + footer) and `1` for `index.html`, `about.html`, `affiliate-disclosure.html`, `privacy.html`. The second reports `0` for all nine — no page still carries a per-guide footer link.

- [ ] **Step 3: Build, lint and verify**

Run: `npm run build && npm run verify`

Expected: `lint:html` clean, `verify-build OK: 5 guide(s), 75 cards, all anchor targets present`.

- [ ] **Step 4: Commit**

```bash
git add index.html about.html affiliate-disclosure.html privacy.html flight-attendant-travel-essentials.html flight-attendant-dog-gifts.html elementary-classroom-essentials.html dog-lover-gifts.html
git commit -m "Collapse the footer guide links to a single All guides link"
```

---

### Task 6: Sitemap, README, and final verification

**Files:**
- Modify: `public/sitemap.xml:8`
- Modify: `README.md:11`

- [ ] **Step 1: Add the page to the sitemap**

In `public/sitemap.xml`, add after the `dog-lover-gifts` line:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/student-pilot-gifts</loc></url>
```

- [ ] **Step 2: Add the page to the README Pages list**

In `README.md`, add after the dog lover gifts line:

```markdown
- 15 Gifts for Student Pilots, Sorted by Where They Are in Training guide
```

- [ ] **Step 3: Full verification sweep**

Run: `npm run build && npm run verify`

Expected: `lint:html` clean across all nine pages, then `verify-build OK: 5 guide(s), 75 cards, all anchor targets present`.

- [ ] **Step 4: Confirm no extension-ful internal links slipped in**

Run: `grep -rn 'href="/[a-z-]*\.html"' *.html`

Expected: no output. Every internal link is extensionless.

- [ ] **Step 5: Confirm the sitemap covers every built page**

Run:
```bash
ls dist/*.html | wc -l
grep -c '<loc>' public/sitemap.xml
```

Expected: `9` and `9`.

- [ ] **Step 6: Commit, push, and open the PR**

```bash
git add public/sitemap.xml README.md
git commit -m "Link the student pilot gifts guide into the site"
git push -u origin student-pilot-gifts
```

Then open a PR against `main` summarizing: the new guide, the home page card swap, the TOC trim, and the footer collapse. Do NOT merge — merging deploys to production and is the user's call.

---

## Spec coverage check

| Spec section | Task |
|---|---|
| `guides/student-pilot-gifts.js` | 1 |
| `products.js` | 1 |
| `scripts/verify-build.mjs` | 1 |
| `student-pilot-gifts.html` | 2 |
| `vite.config.js` | 2 |
| Home page card swap, classroom keeps feature | 3 |
| TOC cross-link trim, all five guides | 2 (new page), 4 (existing four) |
| Footer collapse, all nine pages | 2 (new page), 5 (existing eight) |
| `public/sitemap.xml`, `README.md` | 6 |
| Verification steps 1–7 | 2 (1–5), 3 (6), 5 (7), 6 (full sweep) |
