# Adventure Travel Essentials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/adventure-travel-essentials` — a fifteen-item Amazon affiliate packing guide for active trips — wired into the build, home page, sitemap and cross-link graph, taking the home page card grid from eight cards to a full nine.

**Architecture:** The guide is a plain data module in `guides/adventure-travel-essentials.js` exporting an array of `{category, name, query, reason, tip}` objects, registered in the `collections` map in `products.js`. A static HTML page carries a `<div class="product-grid" data-product-grid="adventure-travel-essentials"></div>` marker, and the Vite plugin in `vite.config.js` replaces that marker with rendered cards at build time. No client-side rendering.

**Tech Stack:** Vite 7 (multi-page app mode), vanilla ES modules, `html-validate` for markup linting, and `scripts/verify-build.mjs` which asserts card counts, affiliate tagging, anchor targets and cross-links against the built `dist/` output.

**Spec:** `docs/superpowers/specs/2026-08-19-adventure-travel-essentials-design.md`

## Global Constraints

- **Item count:** exactly 15, in 5 contiguous `category` runs of 3, so anchors land on items 1, 4, 7, 10 and 13.
- **Item shape:** every object has exactly `category`, `name`, `query`, `reason`, `tip`. No extra keys.
- **Affiliate tag:** `billsworkshop-20`, applied by `amazonUrl()` in `products.js`. Never hand-write an Amazon URL in HTML.
- **Link rel:** `rel="sponsored nofollow noopener"` on every product link, emitted by `renderProductGrid`. Never hand-write a product link.
- **Internal links are extensionless** (`/adventure-travel-essentials`, not `.html`). `vercel.json` sets `cleanUrls: true`.
- **`<title>` must sit on ONE line and stay under 75 characters.** The `long-title` rule counts whitespace inside the element.
- **This guide is for active trips, not backcountry.** No stoves, sleep systems, trekking poles or tents. The reader sleeps indoors.
- **This guide is not airline or hotel gear.** No packing cubes, garment steamers, crew luggage, compression socks or sleep masks — `guides/travel-essentials.js` owns those.
- **The rugged power bank (item 6) is a deliberate near-collision** with that guide's "Compact portable charger". It stays, specified as IP67 and waterproof. Do not remove it and do not soften the specification.
- **Header and footer markup is intentionally duplicated** across pages (`partials-note.txt`). Copy it verbatim; do not extract a partial.
- **Verification:** `npm run build && npm run verify`. There is no unit-test framework — `verify-build.mjs` is the test suite, and it reads `dist/`, so a build must precede it.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `guides/adventure-travel-essentials.js` | create | 15 adventure items, data only |
| `adventure-travel-essentials.html` | create | Page shell + grid marker + TOC |
| `products.js` | modify | Register the collection |
| `vite.config.js` | modify | Register the page as a build input |
| `scripts/verify-build.mjs` | modify | Assert the new guide, and the travel-essentials cross-link swap |
| `index.html` | modify | Ninth guide card |
| `flight-attendant-travel-essentials.html` | modify | TOC cross-link swap |
| `public/sitemap.xml` | modify | One new URL |
| `README.md` | modify | One new Pages entry |

Two tasks. Task 1 builds and registers the guide; Task 2 makes it reachable. Each ends with an independently verifiable `npm run verify` gate.

---

### Task 1: The adventure travel essentials guide

**Files:**
- Create: `guides/adventure-travel-essentials.js`
- Create: `adventure-travel-essentials.html`
- Modify: `products.js` (imports at top; `collections` object)
- Modify: `vite.config.js` (`build.rollupOptions.input`)
- Modify: `scripts/verify-build.mjs` (`GUIDES` array)
- Test: `scripts/verify-build.mjs`, run via `npm run verify`

**Interfaces:**
- Consumes: `renderProductGrid(key)` and the `collections` map from `products.js`. `amazonUrl(query)` is applied internally by `renderProductGrid` and is never called directly.
- Produces: named export `adventureTravelEssentials` (an `Array<{category: string, name: string, query: string, reason: string, tip: string}>` of length 15), and the collection key `"adventure-travel-essentials"`.

- [ ] **Step 1: Write the failing test**

Add this entry to the `GUIDES` array in `scripts/verify-build.mjs`, immediately after the `dist/pen-pal-starter-kit.html` entry and before the closing `];`. Add a trailing comma to the entry above it.

```js
  {
    file: "dist/adventure-travel-essentials.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Roll-top dry bag",
    links: ["/flight-attendant-travel-essentials", "/student-pilot-gifts"]
  }
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && npm run verify`

Expected: FAIL. `verify-build` exits 1 before reading any file, with:

```
verify-build FAILED:
  - GUIDES has 10 entries but collections has 9 — a guide is registered but not checked, or checked but not registered.
```

- [ ] **Step 3: Create the data module**

Create `guides/adventure-travel-essentials.js`:

```js
export const adventureTravelEssentials = [
  {
    category: "keeping gear dry",
    name: "Roll-top dry bag",
    query: "roll top dry bag waterproof 10l 20l",
    reason: "Everything on an active day ends up in a boat, under a waterfall, or in the bottom of a bag with a wet swimsuit, and one dry bag is what separates a working phone and passport from a ruined pair of both.",
    tip: "Roll the top down three times before clipping it, not once. A single fold looks closed and is not, and it is the most common reason a dry bag leaks. A 10 litre covers a day out; 20 litres carries clothes through a boat transfer."
  },
  {
    category: "keeping gear dry",
    name: "Waterproof phone pouch",
    query: "waterproof phone pouch case ipx8 lanyard",
    reason: "The phone is the camera, the map and the boarding pass, and on this kind of trip it spends the day somewhere it should not be — a kayak, a canyon, a pocket full of seawater.",
    tip: "Look for a stated IPX8 rating, then test it before you travel with a folded tissue inside, held under water in a sink for a few minutes. A pouch that fails does so the first time it is used, and you want that to happen over a sink rather than over a reef."
  },
  {
    category: "keeping gear dry",
    name: "Quick-dry microfiber towel",
    query: "microfiber quick dry travel towel compact",
    reason: "A hotel towel does not leave the hotel, and a cotton beach towel packed wet turns the rest of the bag sour by evening.",
    tip: "Check that it ships with its own carry pouch and that the listing mentions an antimicrobial finish. Microfiber packed damp without one develops a smell within a couple of days that does not wash out easily."
  },
  {
    category: "the day pack",
    name: "Packable daypack",
    query: "packable daypack 20l water resistant lightweight",
    reason: "The main luggage stays where you sleep, and everything needed for a twelve-hour day out has to ride on your back without you having brought a second bag to hold it.",
    tip: "Check for padded shoulder straps and a sternum strap. The lightest packable models use flat webbing that cuts in once there is water in the bag, which is exactly the point in the day when you are still hours from putting it down."
  },
  {
    category: "the day pack",
    name: "Filtered water bottle",
    query: "water filter bottle travel filtration",
    reason: "Buying bottled water for a week costs more than the bottle and leaves a bin bag of plastic behind, and on an active day you drink more than you planned to carry.",
    tip: "A filter is not a purifier. Filters remove bacteria and protozoa; viruses need a purifier, and that distinction matters across much of Asia, Africa and Latin America. The two look identical on a listing page, so read the specification rather than the product name."
  },
  {
    category: "the day pack",
    name: "Rugged waterproof power bank",
    query: "rugged waterproof power bank ip67",
    reason: "A phone running navigation, photos and translation in the heat is flat by mid-afternoon, and on this kind of day the bank is in the same wet, dusty, dropped bag as everything else.",
    tip: "Airlines cap power banks at 100 watt-hours in carry-on and prohibit them in checked baggage entirely. Listings advertise milliamp-hours, so convert: a 20,000 mAh bank at 3.7V is about 74Wh and is fine. Look for a stated IP67 rating rather than the word rugged in the title."
  },
  {
    category: "what you wear",
    name: "Quick-dry water shoes",
    query: "quick dry water shoes drainage men women",
    reason: "Volcanic rock, boat ladders, river crossings and wet tile all punish bare feet and ruin trainers, and a shoe that drains is the one thing that handles all four.",
    tip: "Check that the sole has actual drainage ports rather than just a mesh upper. A shoe that holds water is heavier for the rest of the afternoon and produces exactly the blisters it was bought to prevent."
  },
  {
    category: "what you wear",
    name: "Packable rain shell",
    query: "packable rain jacket lightweight waterproof",
    reason: "Tropical and mountain weather arrives without warning and a booked tour does not stop for it, so the choice is a shell in the daypack or a wet afternoon.",
    tip: "Waterproof and water-resistant are different products. Look for a hydrostatic head stated in millimetres — around 10,000mm holds up to sustained rain, while water-resistant means a shower. Taped seams matter as much as the fabric rating."
  },
  {
    category: "what you wear",
    name: "Blister prevention tape",
    query: "blister prevention tape hiking leukotape",
    reason: "The most common thing that ends an active day early is a blister, and it costs almost nothing to prevent and most of a day to recover from.",
    tip: "Apply it before the walk, on the spots that always go, rather than after something starts hurting. Rigid zinc-oxide tape stays put through water and sweat; moleskin and fabric plasters slide off once wet, which is precisely when they are needed."
  },
  {
    category: "skin, bugs & scrapes",
    name: "Reef-safe mineral sunscreen stick",
    query: "reef safe mineral sunscreen stick zinc",
    reason: "Sun coming off water is relentless, and a stick goes on over wet skin one-handed on a moving boat, which a lotion does not.",
    tip: "In some places this is an entry requirement rather than a preference. Hawaii and Palau restrict oxybenzone and octinoxate, and snorkel and dive operators turn people away over it. Look for non-nano zinc oxide in the ingredient list rather than the words reef safe on the front."
  },
  {
    category: "skin, bugs & scrapes",
    name: "Picaridin insect repellent",
    query: "picaridin insect repellent 20 percent lotion",
    reason: "Mosquito-borne illness is the realistic health risk on most of these trips, and dusk is when it happens, which is the one time of day people stop applying anything.",
    tip: "Picaridin rather than DEET on this particular packing list. It works about as well, and DEET degrades synthetics — sunglasses frames, watch straps, technical fabric and dry-bag coatings, which is most of what else is in this guide. Look for 20 percent."
  },
  {
    category: "skin, bugs & scrapes",
    name: "Compact travel first-aid kit",
    query: "compact travel first aid kit waterproof",
    reason: "Scrapes, reef cuts and small burns are routine on an active trip, and a pharmacy is rarely anywhere near the thing that caused them.",
    tip: "Buy the kit for its case and restock it yourself. The bundled contents are usually plasters and little else, so add blister tape, antiseptic, rehydration salts and anything you personally take. Check the case actually seals if it is going into a wet bag."
  },
  {
    category: "the small things that save a day",
    name: "Rechargeable headlamp",
    query: "rechargeable headlamp red light lightweight",
    reason: "Sunrise starts, cave floors, power cuts and finding your things in a shared room all want light, and every one of them wants both your hands free.",
    tip: "Get one with a red-light mode. It preserves night vision on a pre-dawn hike, and in a dorm or a shared tent it is the difference between finding your bag and waking everyone in the room."
  },
  {
    category: "the small things that save a day",
    name: "Universal travel adapter",
    query: "universal travel adapter international plug",
    reason: "Every device in this guide charges, and the wrong plug shape on arrival makes all of them decorative until you find a shop that sells the right one.",
    tip: "An adapter changes the plug shape. It does not convert voltage. A 110V appliance — most often a hair dryer or straightener — plugged into a 240V socket is destroyed immediately, and the adapter usually gets blamed for something it never claimed to do. Check the device itself reads 100-240V before it goes in the bag."
  },
  {
    category: "the small things that save a day",
    name: "Floating camera wrist strap",
    query: "floating wrist strap action camera phone",
    reason: "The photographs from this kind of trip get taken over water, and a camera that goes in without one is simply gone.",
    tip: "Check the stated buoyancy against what you are actually attaching. Many floating straps are rated for a light action camera and will not hold a phone inside a heavy waterproof case, which is the exact combination most people are carrying."
  }
];
```

- [ ] **Step 4: Register the collection**

In `products.js`, add this import after the existing `penPalStarterKit` import:

```js
import { adventureTravelEssentials } from "./guides/adventure-travel-essentials.js";
```

and add this key to the `collections` object, after `"pen-pal-starter-kit": penPalStarterKit` (add a comma to that line):

```js
  "adventure-travel-essentials": adventureTravelEssentials
```

- [ ] **Step 5: Create the page**

Create `adventure-travel-essentials.html`. Copy lines 27–50 of `elementary-classroom-essentials.html` verbatim for the skip link and site header, and lines 136–182 verbatim for the footer. The full file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>15 Adventure Travel Essentials | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen adventure travel essentials for active trips—dry bags, a filtered bottle, reef-safe sunscreen and gear that survives a wet day."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/adventure-travel-essentials"
    />
    <meta
      property="og:title"
      content="15 Adventure Travel Essentials Worth Packing"
    />
    <meta
      property="og:description"
      content="Packing for a trip where the gear gets wet, dropped and carried all day, and what to check before buying each piece."
    />
    <link rel="stylesheet" href="/styles.css" />
    <script type="module" src="/main.js" defer></script>
  </head>
  <body>
    <!-- lines 27-50 of elementary-classroom-essentials.html, verbatim:
         the skip link and the entire <header class="site-header"> block -->

    <main id="main">
      <header class="page-hero">
        <div class="shell">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>Travel</span>
          </nav>
          <p class="eyebrow">Travel</p>
          <h1>15 Adventure Travel Essentials Worth Packing</h1>
          <p class="lede">
            This is a packing list for the kind of trip where you sleep indoors
            and spend the day doing something daring—canyoning, diving, a
            volcano at sunrise. Everything here is chosen for what the day does
            to it rather than for how it looks on arrival.
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
                Most adventure packing lists are backcountry lists in
                disguise—stoves, sleep systems, trekking poles. That is a
                different trip. This one assumes a bed at the end of the day and
                a bag that has been wet since ten in the morning.
              </p>
              <p>
                So the list is organized by what the trip does to your things.
                <strong>Nothing here is airline or hotel gear</strong>—packing
                cubes, a garment steamer and crew luggage live in the flight
                attendant travel guide. Check the voltage rating on anything
                that charges before it goes in the bag.
              </p>
            </div>
            <div
              class="product-grid"
              data-product-grid="adventure-travel-essentials"
            ></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original designs for people who go</h2>
              <p>
                Bill's Workshop Company creates designs for the people who do
                the work, including the ones whose idea of a holiday involves a
                harness.
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
            ><a href="#item-1">Keeping gear dry</a
            ><a href="#item-4">The day pack</a
            ><a href="#item-7">What you wear</a
            ><a href="#item-10">Skin, bugs &amp; scrapes</a
            ><a href="#item-13">The small things</a
            ><a href="/flight-attendant-travel-essentials"
              >Flight attendant travel guide</a
            ><a href="/student-pilot-gifts">Student pilot gifts guide</a
            ><a href="/#guides">All guides</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
          </aside>
        </div>
      </section>
    </main>

    <!-- lines 136-182 of elementary-classroom-essentials.html, verbatim:
         the entire <footer class="site-footer"> block -->
  </body>
</html>
```

Replace both HTML comments with the actual copied blocks. Do not leave the comments in the file.

- [ ] **Step 6: Register the build input**

In `vite.config.js`, add this line to `build.rollupOptions.input`, after `penPal: "pen-pal-starter-kit.html",`:

```js
        adventure: "adventure-travel-essentials.html",
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run build && npm run verify`

Expected: PASS, ending with:

```
verify-build OK: 10 guide(s), 150 cards, all anchor targets present
```

If `closeBundle` throws `collection "adventure-travel-essentials" was never injected`, the `data-product-grid` attribute or the `vite.config.js` input line is wrong.

- [ ] **Step 8: Confirm no query collides with the existing travel guide**

Run:

```bash
node -e "import('./guides/adventure-travel-essentials.js').then(async a => { const b = await import('./guides/travel-essentials.js'); const set = new Set(b.travelEssentials.map(i => i.query)); const hits = a.adventureTravelEssentials.filter(i => set.has(i.query)); console.log(hits.length ? 'COLLISION: ' + hits.map(i => i.name).join(', ') : 'no query collisions'); })"
```

Expected: `no query collisions`. `verify-build` only catches a wholesale collection collision, so this check is manual and required. The rugged power bank sitting near that guide's compact charger is a recorded, deliberate near-collision — it must NOT be removed.

- [ ] **Step 9: Commit**

```bash
git add guides/adventure-travel-essentials.js adventure-travel-essentials.html products.js vite.config.js scripts/verify-build.mjs
git commit -m "Add the adventure travel essentials guide"
```

---

### Task 2: Link the guide into the site

**Files:**
- Modify: `scripts/verify-build.mjs` (add `links` to the existing travel essentials entry)
- Modify: `flight-attendant-travel-essentials.html` (TOC aside)
- Modify: `index.html` (guide card grid)
- Modify: `public/sitemap.xml`
- Modify: `README.md` (Pages list)
- Test: `scripts/verify-build.mjs`, run via `npm run verify`

**Interfaces:**
- Consumes: the route `/adventure-travel-essentials`, which Task 1 created.
- Produces: nothing consumed by later tasks. This is the final task.

A guide that builds and verifies is still not reachable. This task pays the reachability checklist in `README.md`.

- [ ] **Step 1: Write the failing test**

In `scripts/verify-build.mjs`, add a `links` array to the **flight attendant travel essentials** entry, so it reads:

```js
  {
    file: "dist/flight-attendant-travel-essentials.html",
    cards: 15,
    anchors: [1, 3, 4, 6, 8, 11],
    contains: "Compression packing cubes",
    links: ["/adventure-travel-essentials", "/student-pilot-gifts"]
  },
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && npm run verify`

Expected: FAIL, exiting 1 with exactly this one line:

```
verify-build FAILED:
  - dist/flight-attendant-travel-essentials.html: expected an inline link to /adventure-travel-essentials but it is missing
```

- [ ] **Step 3: Swap the travel essentials TOC cross-link**

In `flight-attendant-travel-essentials.html`, inside the `<aside class="toc">` block, replace this line:

```html
            ><a href="/flight-attendant-dog-gifts">Dog gifts guide</a
```

with:

```html
            ><a href="/adventure-travel-essentials">Adventure travel guide</a
```

The `/student-pilot-gifts` line above it stays. This keeps the TOC at two cross-links plus "All guides". `/flight-attendant-dog-gifts` currently has four inbound internal links, so losing this one leaves it comfortably linked and orphans nothing.

- [ ] **Step 4: Add the ninth home page card**

In `index.html`, inside `<div class="guide-card-grid">`, after the closing `</article>` of the pen pal card (the last card, whose button href is `/pen-pal-starter-kit` around line 216) and before the `</div>` that closes the grid, insert:

```html
            <article class="guide-card">
              <p class="eyebrow">Travel &amp; adventure</p>
              <h3>15 Adventure Travel Essentials</h3>
              <p>
                Packing for trips where the gear gets wet, dropped and carried
                all day—dry bags, a filtered bottle, and the voltage rule that
                saves a hair dryer.
              </p>
              <a
                class="button button-secondary"
                href="/adventure-travel-essentials"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
```

This takes the grid from eight cards to nine, which renders as a full 3 / 3 / 3 at desktop width. Do not touch the hero button or the featured-guide block — the classroom essentials guide keeps both.

- [ ] **Step 5: Add the URL to the sitemap**

In `public/sitemap.xml`, after the `pen-pal-starter-kit` line, insert:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/adventure-travel-essentials</loc></url>
```

- [ ] **Step 6: Add the guide to the README Pages list**

In `README.md`, after the `The Ultimate Pen Pal Starter Kit: 15 Things Worth Owning guide` line, insert:

```markdown
- 15 Adventure Travel Essentials Worth Packing guide
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run build && npm run verify`

Expected: PASS, ending with:

```
verify-build OK: 10 guide(s), 150 cards, all anchor targets present
```

`html-validate` must also report no errors across all fourteen HTML pages.

- [ ] **Step 8: Confirm every internal link resolves**

Run:

```bash
node -e "const fs=require('fs');const files=fs.readdirSync('dist').filter(f=>f.endsWith('.html'));const pages=new Set(files.map(f=>'/'+f.replace(/\.html$/,'')));pages.add('/');const bad=[];for(const f of files){const html=fs.readFileSync('dist/'+f,'utf8');for(const m of html.matchAll(/href=\"(\/[^\"#?]*)/g)){const p=m[1].replace(/\/$/,'')||'/';if(!pages.has(p)&&!p.startsWith('/assets')&&p!=='/styles.css'&&p!=='/main.js'&&p!=='/sitemap.xml')bad.push(f+' -> '+m[1]);}}console.log(bad.length?'BROKEN:\n'+[...new Set(bad)].join('\n'):'all internal links resolve');"
```

Expected: `all internal links resolve`.

- [ ] **Step 9: Confirm the grid renders nine cards**

Run:

```bash
node -e "const h=require('fs').readFileSync('dist/index.html','utf8');console.log('guide cards:',h.split('class=\"guide-card\"').length-1);console.log('featured block intact:',h.includes('Open the complete guide'));console.log('hero unchanged:',h.includes('See the 15 classroom essentials'));"
```

Expected: `guide cards: 9`, `featured block intact: true`, `hero unchanged: true`.

- [ ] **Step 10: Check the page renders in dev**

Run `npm run dev`, then open `http://localhost:5173/adventure-travel-essentials`.

Confirm: fifteen numbered cards, five category runs, the TOC anchors jump to items 1/4/7/10/13, and an Amazon button opens a search URL containing `tag=billsworkshop-20`. On the home page at a desktop window width, confirm the card grid shows three full rows of three with no short row. Stop the dev server when done.

- [ ] **Step 11: Commit**

```bash
git add index.html flight-attendant-travel-essentials.html public/sitemap.xml README.md scripts/verify-build.mjs
git commit -m "Link the adventure travel guide into the site"
```

Stop here. Do not push and do not open a pull request — the repository owner opens and merges their own PRs.

---

## Self-Review

Checked against `docs/superpowers/specs/2026-08-19-adventure-travel-essentials-design.md`:

**Spec coverage.** Every "Design" subsection maps to a step. `guides/adventure-travel-essentials.js` → Task 1 Step 3. The HTML page → Task 1 Step 5, with the spec's exact title, h1 and eyebrow. `products.js` → Task 1 Step 4. `vite.config.js` → Task 1 Step 6. `verify-build.mjs` → Task 1 Step 1 and Task 2 Step 1. `index.html` → Task 2 Step 4, one card only, with the hero and featured slot explicitly protected. TOC cross-links → Task 1 Step 5 for the new guide, Task 2 Step 3 for the swap. Footer → correctly absent, recorded as a non-change. Sitemap and README → Task 2 Steps 5–6.

**Decision coverage.** Decision 1 (Darecations over the other rows) needs no task. Decision 2 (active trips, not backcountry) is enforced by the Global Constraints banning stoves and sleep systems, and by the item list itself. Decision 3 (15 items, 5×3) is a Global Constraint and is asserted by the `anchors` array. Decision 4 (grouped by what the trip does to gear) is the `category` values in Step 3. Decision 5 (power bank stays) appears as a Global Constraint and again as an explicit warning in Task 1 Step 8, where an implementer would otherwise be most tempted to "fix" it. Decision 6 (first-apartment-tools stays weakly linked) correctly produces no task.

**Placeholder scan.** No TBDs. Every code step carries the literal content to write. The two `<!-- lines 27-50 … -->` comments are the only indirection, and each names an exact file and line range plus an instruction to remove the comment.

**Type consistency.** Export name, collection key, file path and `data-product-grid` value are consistent across both tasks: `adventureTravelEssentials` / `"adventure-travel-essentials"` / `adventure-travel-essentials.html` / `adventure`. The `contains` string "Roll-top dry bag" matches item 1's `name` verbatim.

**Arithmetic.** 10 guides × 15 cards = 150, matching the expected output in Task 1 Step 7 and Task 2 Step 7. Fourteen HTML pages = 4 static + 9 existing guides + 1 new. Nine grid cards = 8 existing + 1, giving 3 / 3 / 3 at `repeat(3, 1fr)`.

**One thing the plan cannot verify.** The spec's claim that the grid renders as three clean rows depends on desktop viewport width above the 860px breakpoint. Task 2 Step 9 asserts the card count and Step 10 asks for a visual check, which together are the closest available substitute for a layout assertion — nothing in the toolchain measures rendered geometry.
