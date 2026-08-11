# Flight Attendant Dog Gifts Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/flight-attendant-dog-gifts`, a 15-item Amazon-first gift guide, and generalize the data/build/verify layers so a third guide costs one data file plus one registry line.

**Architecture:** Guide content moves out of `products.js` into `guides/*.js`, registered in a keyed `collections` map. The Vite `transformIndexHtml` plugin reads the key from `data-product-grid="<key>"` and renders that collection only. `closeBundle` asserts every registered collection was injected exactly once. `scripts/verify-build.mjs` becomes a config table iterated per guide.

**Tech Stack:** Vite 7 (MPA mode), vanilla ES modules, plain HTML/CSS. No test framework — `scripts/verify-build.mjs` is the test harness and `npm run verify` is the gate.

## Global Constraints

- Every product link must carry `rel="sponsored nofollow noopener"` and the Amazon tag `billsworkshop-20`. Both come from shared render code in `products.js`, never hand-written markup.
- Internal links, canonical tags, and `public/sitemap.xml` use **extensionless** paths (`/flight-attendant-dog-gifts`, not `.html`). Vercel serves clean URLs; files in `dist/` keep `.html` names.
- No new runtime or build dependencies. `package.json` `devDependencies` stays at `vite` only.
- `products.js` and `guides/*.js` are build-time only. They must never be imported by `main.js` or any client module — that is what keeps product data out of the browser bundle.
- Product copy is informational, not medical or safety advice. Keep the existing guide's hedged voice ("many travelers like", "seek medical advice if needed").
- Item objects have exactly these keys: `category`, `name`, `query`, `reason`, `tip`.

---

### Task 1: Generalize the product pipeline to keyed collections

No new content. When this task is done the site builds and verifies exactly as it does today, but on an architecture that can hold more than one guide.

**Files:**
- Create: `guides/travel-essentials.js`
- Modify: `products.js` (remove data, add registry, key the render function)
- Modify: `vite.config.js:7-34` (keyed pattern, stronger `closeBundle`)
- Modify: `flight-attendant-travel-essentials.html:95-98` (key the marker)
- Modify: `scripts/verify-build.mjs` (config table, still one guide)

**Interfaces:**
- Produces: `guides/travel-essentials.js` exports `travelEssentials` (array of item objects).
- Produces: `products.js` exports `collections` (object keyed by guide slug → item array), `amazonUrl(query) → string`, and `renderProductGrid(key) → string`. `renderProductGrid` throws on an unregistered key.
- Produces: the build marker contract `<div class="product-grid" data-product-grid="<collection-key>"></div>`.

- [ ] **Step 1: Create the data file**

Create `guides/travel-essentials.js`. Move the `essentials` array from `products.js` **verbatim** — no copy edits, no reordering. Only the declaration line changes:

```js
export const travelEssentials = [
  {
    category: "organization",
    name: "Compression packing cubes",
    query: "compression packing cubes travel set",
    reason: "They separate uniforms, layover clothes and undergarments while compressing bulky pieces into less space.",
    tip: "Choose mesh panels, sturdy double zippers and at least three useful sizes."
  },
  // ...all 15 items, copied exactly as they appear in products.js today
];
```

Verify the count is 15 and the last item is "Foldable extra tote".

- [ ] **Step 2: Rewrite `products.js`**

Replace the whole file. The data is gone; `escapeHtml` and the card template are unchanged.

```js
import { SITE } from "./site.js";
import { travelEssentials } from "./guides/travel-essentials.js";

export const collections = {
  "travel-essentials": travelEssentials
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function amazonUrl(query) {
  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", query);
  if (SITE.amazonTag) url.searchParams.set("tag", SITE.amazonTag);
  return url.toString();
}

export function renderProductGrid(key) {
  const items = collections[key];
  if (!items) {
    throw new Error(
      `renderProductGrid: unknown collection "${key}". Registered keys: ${Object.keys(collections).join(", ")}.`
    );
  }
  return items.map((item, index) => `
    <article class="product-card" id="item-${index + 1}" data-category="${escapeHtml(item.category)}">
      <span class="product-number" aria-hidden="true">${index + 1}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.reason)}</p>
      <p class="product-tip"><strong>What to look for:</strong> ${escapeHtml(item.tip)}</p>
      <a class="button button-primary" href="${escapeHtml(amazonUrl(item.query))}" target="_blank" rel="sponsored nofollow noopener" aria-label="See ${escapeHtml(item.name)} options on Amazon">See options on Amazon <span aria-hidden="true">↗</span></a>
    </article>
  `).join("");
}
```

- [ ] **Step 3: Key the marker in the existing guide**

In `flight-attendant-travel-essentials.html`, replace the grid container:

```html
            <div
              class="product-grid"
              data-product-grid="travel-essentials"
            ></div>
```

- [ ] **Step 4: Update the Vite plugin**

Replace lines 1–34 of `vite.config.js` (imports through the end of `prerenderProducts`):

```js
import { defineConfig } from "vite";
import { collections, renderProductGrid } from "./products.js";

// The lookarounds matter: a plain \b would still match "data-product-grid-BROKEN"
// (a hyphen satisfies a word boundary), so a renamed or typo'd marker would slip
// through the closeBundle guard below — the exact failure it exists to catch.
const GRID_PATTERN = /(<div[^>]*(?<![-\w])data-product-grid="([\w-]+)"[^>]*>)(\s*)(<\/div>)/g;

function prerenderProducts() {
  const injected = new Map();

  return {
    name: "prerender-products",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        // No .test() guard: GRID_PATTERN is global, so .test() would advance
        // lastIndex and desync the next page. .replace() is a no-op when nothing
        // matches, which is the same guard for free.
        return html.replace(GRID_PATTERN, (_match, open, key, _whitespace, close) => {
          injected.set(key, (injected.get(key) ?? 0) + 1);
          return open + renderProductGrid(key) + close;
        });
      }
    },
    closeBundle() {
      const problems = Object.keys(collections)
        .map(key => [key, injected.get(key) ?? 0])
        .filter(([, count]) => count !== 1)
        .map(([key, count]) =>
          count === 0
            ? `collection "${key}" was never injected — no page carries data-product-grid="${key}"`
            : `collection "${key}" was injected ${count} times, expected exactly 1`
        );

      if (problems.length > 0) {
        throw new Error(`prerender-products: ${problems.join("; ")}.`);
      }
    }
  };
}
```

Leave the `defineConfig` block below it unchanged for now.

- [ ] **Step 5: Convert verify-build to a config table**

Replace `scripts/verify-build.mjs` entirely. Still one guide — the second entry arrives in Task 2. All five original assertions are preserved, now scoped per file.

```js
import { readFileSync } from "node:fs";

const AMAZON_TAG = "billsworkshop-20";

const GUIDES = [
  {
    file: "dist/flight-attendant-travel-essentials.html",
    cards: 15,
    anchors: [1, 3, 4, 6, 8, 11]
  }
];

const failures = [];
let totalCards = 0;

for (const guide of GUIDES) {
  let html;
  try {
    html = readFileSync(guide.file, "utf8");
  } catch {
    failures.push(`${guide.file}: cannot read. Run "npm run build" first.`);
    continue;
  }

  const count = needle => html.split(needle).length - 1;
  const fail = message => failures.push(`${guide.file}: ${message}`);

  const cards = count('class="product-card"');
  if (cards !== guide.cards) fail(`expected ${guide.cards} product cards, found ${cards}`);
  totalCards += cards;

  const tagged = count(`tag=${AMAZON_TAG}`);
  if (tagged !== guide.cards) fail(`expected ${guide.cards} URLs tagged ${AMAZON_TAG}, found ${tagged}`);

  const sponsored = count('rel="sponsored nofollow noopener"');
  if (sponsored !== guide.cards) fail(`expected ${guide.cards} sponsored/nofollow links, found ${sponsored}`);

  for (const n of guide.anchors) {
    if (!html.includes(`id="item-${n}"`)) {
      fail(`jump nav targets #item-${n} but no element has that id`);
    }
  }

  if (/data-product-grid[^>]*>\s*<\/div>/.test(html)) {
    fail("the [data-product-grid] container shipped empty");
  }
}

if (failures.length > 0) {
  console.error("verify-build FAILED:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`verify-build OK: ${GUIDES.length} guide(s), ${totalCards} cards, all anchor targets present`);
```

- [ ] **Step 6: Run the build and verify**

```bash
npm run build && npm run verify
```

Expected: build succeeds, `verify-build OK: 1 guide(s), 15 cards, all anchor targets present`.

- [ ] **Step 7: Prove the new guard catches a broken marker (red test)**

Temporarily edit `flight-attendant-travel-essentials.html` to `data-product-grid="travel-essentialz"`, then:

```bash
npm run build
```

Expected: build FAILS during `transformIndexHtml` with `renderProductGrid: unknown collection "travel-essentialz". Registered keys: travel-essentials.`

Now temporarily change the attribute to bare `data-product-grid` (no value) and run `npm run build` again.

Expected: build FAILS at `closeBundle` with `collection "travel-essentials" was never injected — no page carries data-product-grid="travel-essentials"`.

**Revert both temporary edits** and re-run `npm run build && npm run verify` to confirm green.

- [ ] **Step 8: Commit**

```bash
git add guides/travel-essentials.js products.js vite.config.js flight-attendant-travel-essentials.html scripts/verify-build.mjs
git commit -m "Key the product pipeline by collection

renderProductGrid() rendered one shared array into every [data-product-grid]
on every page, so a second guide would have duplicated the first. Guide data
moves to guides/, the marker carries a collection key, and closeBundle now
asserts every registered collection was injected exactly once."
```

---

### Task 2: Add the dog gifts guide

**Files:**
- Create: `guides/flight-attendant-dog-gifts.js`
- Create: `flight-attendant-dog-gifts.html`
- Modify: `products.js` (register the collection)
- Modify: `vite.config.js` (rollup input)
- Modify: `scripts/verify-build.mjs` (second guide entry, distinct-content assertion)

**Interfaces:**
- Consumes: `renderProductGrid(key)` and the `collections` registry from Task 1; the `data-product-grid="<key>"` marker contract.
- Produces: `guides/flight-attendant-dog-gifts.js` exports `dogGifts` (15 item objects). Collection key: `flight-attendant-dog-gifts`. Page anchors `#item-1`, `#item-4`, `#item-7`, `#item-10`, `#item-13`.

- [ ] **Step 1: Add the failing verify entry first**

In `scripts/verify-build.mjs`, add the second entry to `GUIDES`:

```js
const GUIDES = [
  {
    file: "dist/flight-attendant-travel-essentials.html",
    cards: 15,
    anchors: [1, 3, 4, 6, 8, 11]
  },
  {
    file: "dist/flight-attendant-dog-gifts.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13]
  }
];
```

Add the distinct-content assertion. Inside the `for` loop, after the empty-grid check, collect each guide's Amazon search queries as a signature:

```js
  const queries = [...html.matchAll(/amazon\.com\/s\?k=([^&"]+)/g)].map(m => m[1]).sort().join("|");
  signatures.set(guide.file, queries);
```

Declare `const signatures = new Map();` next to `const failures = []`, and after the loop closes — before the `if (failures.length > 0)` block — add:

```js
const seenSignature = new Map();
for (const [file, signature] of signatures) {
  if (!signature) continue;
  const twin = seenSignature.get(signature);
  if (twin) {
    failures.push(`${file}: renders the same products as ${twin} — the collections are crossed`);
  } else {
    seenSignature.set(signature, file);
  }
}
```

- [ ] **Step 2: Run verify to watch it fail**

```bash
npm run build && npm run verify
```

Expected: verify FAILS with `dist/flight-attendant-dog-gifts.html: cannot read. Run "npm run build" first.` (The build itself still succeeds — the page does not exist yet.)

- [ ] **Step 3: Create the dog gifts data file**

Create `guides/flight-attendant-dog-gifts.js`. Order matters: category runs must stay contiguous so the table of contents can anchor to items 1, 4, 7, 10 and 13.

```js
export const dogGifts = [
  {
    category: "connection",
    name: "Treat-tossing pet camera",
    query: "treat dispensing pet camera dog two way audio",
    reason: "A camera that dispenses treats turns a layover hotel into a chance to check in, say something and hand out a reward from a thousand miles away.",
    tip: "Look for two-way audio, night vision and a treat hopper large enough to last a multi-day trip."
  },
  {
    category: "connection",
    name: "Custom pet photo blanket",
    query: "custom pet photo blanket dog picture",
    reason: "A printed photo blanket puts the dog in the room on nights spent in unfamiliar hotels.",
    tip: "Check the minimum photo resolution the printer asks for; low-resolution uploads come out soft and blotchy."
  },
  {
    category: "connection",
    name: "Dog-photo luggage tag",
    query: "custom photo luggage tag pet picture",
    reason: "A tag carrying the dog's photo makes a crew bag identifiable on a crowded belt and doubles as a small daily reminder.",
    tip: "Choose a covered contact panel so the home address is not readable at a glance."
  },
  {
    category: "care",
    name: "Programmable automatic feeder",
    query: "automatic dog feeder programmable portion control battery backup",
    reason: "Scheduled portions keep a dog on routine through a four-day trip whether or not the sitter arrives exactly on time.",
    tip: "Insist on battery backup. A power cut while the owner is away is the failure that actually matters."
  },
  {
    category: "care",
    name: "GPS dog tracker",
    query: "GPS dog tracker collar attachment",
    reason: "If a dog slips a sitter's leash while the owner is three time zones away, live location is the difference between a scare and a search.",
    tip: "Most GPS trackers need a paid monthly subscription on top of the hardware. Confirm the ongoing cost before gifting one."
  },
  {
    category: "care",
    name: "Calming donut dog bed",
    query: "calming donut dog bed washable",
    reason: "A raised-rim bed gives an anxious dog something to burrow against during the stretches when the house is quiet.",
    tip: "Measure the dog curled up rather than stretched out, and confirm the cover comes off for washing."
  },
  {
    category: "crew bag",
    name: "Reusable pet-hair remover",
    query: "reusable pet hair remover lint roller clothing",
    reason: "A dark uniform and a shedding dog is a problem that repeats before every single trip, and a reusable roller solves it without a stack of peel-off sheets in the crew bag.",
    tip: "Reusable rollers need no refills, but test one on your actual uniform fabric — some struggle on heavy wool."
  },
  {
    category: "crew bag",
    name: "Dog-design insulated tumbler",
    query: "dog design insulated tumbler travel lid",
    reason: "A tumbler gets used every duty day, which makes it one of the few themed gifts that earns daily rather than occasional use.",
    tip: "Prioritize a genuinely sealed lid and a base narrow enough for a standard cup holder."
  },
  {
    category: "crew bag",
    name: "Dog-print compression socks",
    query: "dog print compression socks travel",
    reason: "Compression socks already earn their place on long duty days, and a dog print makes a practical item feel personal.",
    tip: "Sizing and compression level matter more than the pattern; follow the manufacturer's chart and seek medical advice if needed."
  },
  {
    category: "wearable",
    name: "Dog-breed enamel pin set",
    query: "dog breed enamel pin set lapel",
    reason: "Pins ride on a crew bag or lanyard, where uniform rules usually leave no room for anything else personal.",
    tip: "Choose locking backs — butterfly clutches work loose in transit — and check the airline's uniform policy before pinning anything to the uniform itself."
  },
  {
    category: "wearable",
    name: "Dog-breed silhouette necklace",
    query: "dog breed silhouette necklace sterling silver",
    reason: "A small breed-specific pendant reads as jewelry rather than novelty, which is what keeps it wearable on duty.",
    tip: "Confirm the metal if the recipient has sensitive skin, and check that the breed is still recognizable at pendant size."
  },
  {
    category: "wearable",
    name: "Dog-print lounge set",
    query: "dog print pajama lounge set",
    reason: "Layover evenings happen in a hotel room, and comfortable loungewear is what actually gets worn there.",
    tip: "Pick a lightweight knit that packs flat; flannel is cozy but eats crew-bag space."
  },
  {
    category: "for the dog",
    name: "Heartbeat comfort toy",
    query: "heartbeat puppy toy separation anxiety dog",
    reason: "A plush toy with a heartbeat simulator aims squarely at the problem this job creates: a dog alone for days at a stretch.",
    tip: "Check that the heartbeat unit is removable so the toy can be washed, and supervise use with determined chewers."
  },
  {
    category: "for the dog",
    name: "Aviation-print dog bandana",
    query: "airplane print dog bandana",
    reason: "An inexpensive add-on that finally puts both halves of the gift in one place, and it photographs well for the owner who is away.",
    tip: "Slip-over-the-collar styles stay put better than tie-on bandanas on an active dog."
  },
  {
    category: "for the dog",
    name: "Collapsible travel bowl and bottle",
    query: "collapsible dog water bottle travel bowl",
    reason: "Useful for layover walks when the dog does come along, and for the long drives to and from crew parking.",
    tip: "A bottle-and-bowl combination beats a bare folding bowl — carrying the water is the harder half."
  }
];
```

- [ ] **Step 4: Register the collection**

In `products.js`, add the import and the registry entry:

```js
import { SITE } from "./site.js";
import { travelEssentials } from "./guides/travel-essentials.js";
import { dogGifts } from "./guides/flight-attendant-dog-gifts.js";

export const collections = {
  "travel-essentials": travelEssentials,
  "flight-attendant-dog-gifts": dogGifts
};
```

- [ ] **Step 5: Create the guide page**

Create `flight-attendant-dog-gifts.html`. Header, footer and nav are copied from `flight-attendant-travel-essentials.html` so the shell stays identical across guides.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>15 Gifts for Flight Attendants Who Love Dogs | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen gift ideas for flight attendants who love dogs, from remote pet cameras and automatic feeders to crew-bag and uniform-friendly picks."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/flight-attendant-dog-gifts"
    />
    <meta
      property="og:title"
      content="15 Gifts for Flight Attendants Who Love Dogs"
    />
    <meta
      property="og:description"
      content="Gift ideas for the crew member who spends four days a week missing their dog."
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
            <a href="/">Home</a><span>/</span><span>Gifts</span>
          </nav>
          <p class="eyebrow">Gifts &amp; dog lovers</p>
          <h1>15 Gifts for Flight Attendants Who Love Dogs</h1>
          <p class="lede">
            Gift ideas for the crew member whose two favorite identities pull in
            opposite directions—because the job means being away from the dog for
            days at a time.
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
                The hard part of this particular gift is not finding something
                with a dog on it. It is that the job creates a specific
                problem—four days away, a dog at home, and a sitter who is doing
                their best.
              </p>
              <p>
                So this list leads with
                <strong
                  >staying connected and keeping the dog cared for from a
                  distance</strong
                >, then covers crew-bag practicality, wearable pieces that pass
                uniform rules, and a few things for the dog. Check your airline's
                uniform policy before wearing anything on duty.
              </p>
            </div>
            <div
              class="product-grid"
              data-product-grid="flight-attendant-dog-gifts"
            ></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original flight-attendant-and-dog designs</h2>
              <p>
                Bill's Workshop Company creates profession-and-dog designs made
                for the person whose two favorite identities belong together.
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
            ><a href="#item-1">Staying connected</a
            ><a href="#item-4">Care while you're away</a
            ><a href="#item-7">Crew bag &amp; uniform</a
            ><a href="#item-10">Wearable</a><a href="#item-13">For the dog</a
            ><a href="/flight-attendant-travel-essentials">Travel essentials guide</a
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
            <a href="/flight-attendant-travel-essentials">Travel guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gift guide</a
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

- [ ] **Step 6: Add the rollup input**

In `vite.config.js`, add the page to `build.rollupOptions.input`:

```js
      input: {
        home: "index.html",
        guide: "flight-attendant-travel-essentials.html",
        dogGifts: "flight-attendant-dog-gifts.html",
        about: "about.html",
        disclosure: "affiliate-disclosure.html",
        privacy: "privacy.html"
      }
```

- [ ] **Step 7: Run the build and verify (green)**

```bash
npm run build && npm run verify
```

Expected: `verify-build OK: 2 guide(s), 30 cards, all anchor targets present`.

- [ ] **Step 8: Confirm the grids are genuinely different**

```bash
grep -c "product-card" dist/flight-attendant-dog-gifts.html
grep -o "Treat-tossing pet camera" dist/flight-attendant-dog-gifts.html
grep -c "Compression packing cubes" dist/flight-attendant-dog-gifts.html
```

Expected: `15`, one match for the pet camera, and `0` for the packing cubes. If the packing cubes appear on the dog gifts page, the collections are crossed.

- [ ] **Step 9: Commit**

```bash
git add guides/flight-attendant-dog-gifts.js flight-attendant-dog-gifts.html products.js vite.config.js scripts/verify-build.mjs
git commit -m "Add the flight attendant dog gifts guide

Fifteen gifts organized around the problem the job creates: days away from
the dog. verify-build gains the page and an assertion that two guides never
render an identical product set."
```

---

### Task 3: Site integration

**Files:**
- Modify: `index.html` (guides row, footer link)
- Modify: `styles.css` (append guide card rules, extend the 680px rule)
- Modify: `flight-attendant-travel-essentials.html` (cross-link aside, footer link)
- Modify: `about.html`, `affiliate-disclosure.html`, `privacy.html` (footer link)
- Modify: `public/sitemap.xml`
- Modify: `README.md`

**Interfaces:**
- Consumes: the published route `/flight-attendant-dog-gifts` from Task 2.

- [ ] **Step 1: Add the guide card styles**

Append to `styles.css`, immediately after the `.chip` rule on line 244 (keeping it near the other card rules):

```css
.guide-card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1.5rem; }
.guide-card {
  display: flex;
  flex-direction: column;
  padding: 1.7rem;
  border: 1px solid rgba(16, 42, 67, .12);
  border-radius: 20px;
  background: rgba(255,255,255,.66);
}
.guide-card p { color: var(--muted); }
.guide-card .button { margin-top: auto; align-self: flex-start; }
```

Then add `.guide-card-grid` to the single-column mobile rule (currently line 387):

```css
  .category-grid, .values-grid, .product-grid, .guide-card-grid, .footer-grid { grid-template-columns: 1fr; }
```

- [ ] **Step 2: Add the guides row to the home page**

In `index.html`, inside `<section class="section section-soft" id="guides">`, immediately after the closing `</article>` of `featured-guide` and before the closing `</div>` of `.shell`:

```html
          <div class="guide-card-grid">
            <article class="guide-card">
              <p class="eyebrow">Travel &amp; aviation</p>
              <h3>15 Flight Attendant Travel Essentials</h3>
              <p>
                Packing, comfort and organization finds for the problems that
                repeat on every trip.
              </p>
              <a class="button button-secondary" href="/flight-attendant-travel-essentials"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
            <article class="guide-card">
              <p class="eyebrow">Gifts &amp; dog lovers</p>
              <h3>15 Gifts for Flight Attendants Who Love Dogs</h3>
              <p>
                Remote pet care, crew-bag practicality and wearable picks for the
                crew member who spends the week missing their dog.
              </p>
              <a class="button button-secondary" href="/flight-attendant-dog-gifts"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
          </div>
```

- [ ] **Step 3: Cross-link from the travel guide**

In `flight-attendant-travel-essentials.html`, the `related-callout` aside currently asks "Shopping for a flight attendant who loves dogs?" and offers only the Etsy button. Add a link to the new guide directly after the Etsy anchor, inside the same aside:

```html
              <a
                class="button button-secondary"
                href="/flight-attendant-dog-gifts"
                >See the 15-gift guide <span aria-hidden="true">→</span></a
              >
```

- [ ] **Step 4: Add the footer link to every remaining page**

In `index.html`, `flight-attendant-travel-essentials.html`, `about.html`, `affiliate-disclosure.html` and `privacy.html`, find the footer "Explore" block and add the dog guide link after the travel guide link:

```html
            <a href="/flight-attendant-travel-essentials">Travel guide</a
            ><a href="/flight-attendant-dog-gifts">Dog gift guide</a
            ><a href="/#categories">Categories</a
            ><a href="/about">About</a>
```

The `><a` line-joining style is deliberate throughout this codebase — it suppresses whitespace between inline-block anchors. Match it exactly.

- [ ] **Step 5: Add the sitemap entry**

In `public/sitemap.xml`, after the travel essentials entry:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/flight-attendant-dog-gifts</loc></url>
```

- [ ] **Step 6: Update the README**

In `README.md`, under `## Pages`, add below the travel essentials line:

```markdown
- 15 Gifts for Flight Attendants Who Love Dogs guide
```

And append to the same file, after the affiliate-links section:

```markdown
## Adding a guide

Guide content lives in `guides/<slug>.js` as an array of `{ category, name, query, reason, tip }`
objects. Register the array in `collections` in `products.js`, mark the page's container with
`data-product-grid="<slug>"`, add the page to `rollupOptions.input` in `vite.config.js`, and add
an entry to `GUIDES` in `scripts/verify-build.mjs`. The build fails if a registered collection is
never injected, so a half-wired guide cannot ship.
```

- [ ] **Step 7: Build, verify and eyeball**

```bash
npm run build && npm run verify
```

Expected: `verify-build OK: 2 guide(s), 30 cards, all anchor targets present`.

Then check the internal links resolve extensionless and no `.html` crept in:

```bash
grep -rn 'href="/[a-z-]*\.html"' index.html flight-attendant-dog-gifts.html flight-attendant-travel-essentials.html about.html affiliate-disclosure.html privacy.html
```

Expected: no output.

- [ ] **Step 8: Check both pages in the dev server**

```bash
npm run dev
```

Visit `/`, `/flight-attendant-travel-essentials` and `/flight-attendant-dog-gifts`. Confirm: the home page shows two guide cards side by side that stack on a narrow window, each guide shows its own 15 products, the TOC anchors jump to the right cards, and the travel guide's dog aside links through to the new page. Stop the server.

- [ ] **Step 9: Commit**

```bash
git add index.html styles.css flight-attendant-travel-essentials.html about.html affiliate-disclosure.html privacy.html public/sitemap.xml README.md
git commit -m "Link the dog gifts guide into the site

Home page guides row, footer links on every page, sitemap entry, and a
cross-link from the travel guide's dog aside — which already posed the
question this page answers."
```

---

## Done when

- `npm run build && npm run verify` passes: 2 guides, 30 cards, all anchors present, no crossed collections.
- Breaking any marker fails the build with a specific message (proved in Task 1 Step 7).
- `/flight-attendant-dog-gifts` renders 15 distinct products in raw HTML with no JavaScript.
- Home page, footers and sitemap all reference the new guide extensionless.
- Branch `flight-attendant-dog-gifts` is ready for diff review. **Do not push** — pushing `main` is a production deploy, and the user reviews the diff first.
