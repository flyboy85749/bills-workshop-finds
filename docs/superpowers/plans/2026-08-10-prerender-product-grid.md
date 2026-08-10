# Build-Time Product Grid Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the fifteen product cards into `flight-attendant-travel-essentials.html` at build time so crawlers receive the content in the initial HTML response.

**Architecture:** Product data moves out of `main.js` into a Node-importable module. A Vite plugin using the `transformIndexHtml` hook injects the rendered markup into the empty `[data-product-grid]` container during both `vite build` and `vite dev`. The client bundle stops shipping the product data entirely.

**Tech Stack:** Vite 7 (static MPA), Node 22, plain ES modules. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-10-prerender-product-grid-design.md`

## Global Constraints

- Working directory: `D:\Development\Projects\finds.billsworkshopcompany`. All paths relative to it.
- **No new dependencies.** `package.json` gains one script, no packages.
- The project has no test framework. Task 1 builds the verification harness first, and it is the red/green signal for Tasks 2 and 3.
- Amazon tracking ID is `billsworkshop-20`. It must appear in all fifteen product URLs.
- Card markup must stay byte-identical in structure to what `renderProducts()` currently emits — same classes, same `id="item-N"`, same `data-category`, same `rel="sponsored nofollow noopener"`. The CSS in `styles.css:314-331` targets these classes and must keep working untouched.
- Do not change product copy, styling, or page structure.
- Deploys are automatic on push to `main`. Do not push until Task 4.
- Shell is PowerShell on Windows; commands below are written for the Bash tool.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `scripts/verify-build.mjs` | Create | Assert the built HTML actually contains product content |
| `package.json` | Modify | Add `verify` script |
| `site.js` | Create | Shared config (`amazonTag`, `etsyShop`, `digitalTools`) — the one thing both build and client need |
| `products.js` | Create | Product data + HTML string generation. Build-time only; never imported by client code |
| `vite.config.js` | Modify | Register the injection plugin |
| `main.js` | Modify | Drop product data and rendering; keep genuine client behaviour |
| `flight-attendant-travel-essentials.html` | Modify | Remove now-meaningless `aria-live` |

Task 1 must run first — it is the failing test. Tasks 2 and 3 are ordered (3 depends on 2's injection working). Task 4 deploys.

---

### Task 1: Build the verification harness (this is the failing test)

**Files:**
- Create: `scripts/verify-build.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run verify`, which reads `dist/flight-attendant-travel-essentials.html` and exits non-zero with specific messages when product content is missing. Tasks 2 and 3 use it as their pass/fail gate.

- [ ] **Step 1: Create `scripts/verify-build.mjs`**

```js
import { readFileSync } from "node:fs";

const FILE = "dist/flight-attendant-travel-essentials.html";
const EXPECTED_CARDS = 15;
const AMAZON_TAG = "billsworkshop-20";
const ANCHOR_TARGETS = [1, 3, 4, 6, 8, 11];

let html;
try {
  html = readFileSync(FILE, "utf8");
} catch {
  console.error(`verify-build: cannot read ${FILE}. Run "npm run build" first.`);
  process.exit(1);
}

const count = needle => html.split(needle).length - 1;
const failures = [];

const cards = count('class="product-card"');
if (cards !== EXPECTED_CARDS) {
  failures.push(`expected ${EXPECTED_CARDS} product cards, found ${cards}`);
}

const tagged = count(`tag=${AMAZON_TAG}`);
if (tagged !== EXPECTED_CARDS) {
  failures.push(`expected ${EXPECTED_CARDS} URLs tagged ${AMAZON_TAG}, found ${tagged}`);
}

const sponsored = count('rel="sponsored nofollow noopener"');
if (sponsored !== EXPECTED_CARDS) {
  failures.push(`expected ${EXPECTED_CARDS} sponsored/nofollow links, found ${sponsored}`);
}

for (const n of ANCHOR_TARGETS) {
  if (!html.includes(`id="item-${n}"`)) {
    failures.push(`jump nav targets #item-${n} but no element has that id`);
  }
}

if (/data-product-grid[^>]*>\s*<\/div>/.test(html)) {
  failures.push("the [data-product-grid] container shipped empty");
}

if (failures.length > 0) {
  console.error("verify-build FAILED:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`verify-build OK: ${cards} cards, ${tagged} tagged links, all anchor targets present`);
```

- [ ] **Step 2: Add the `verify` script to `package.json`**

Change the `scripts` block to:

```json
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0",
    "verify": "node scripts/verify-build.mjs"
  },
```

- [ ] **Step 3: Run it against the current build to confirm it FAILS**

```bash
npm run build && npm run verify
```

Expected: **exit code 1**, with output naming every missing piece:

```
verify-build FAILED:
  - expected 15 product cards, found 0
  - expected 15 URLs tagged billsworkshop-20, found 0
  - expected 15 sponsored/nofollow links, found 0
  - jump nav targets #item-1 but no element has that id
  ... (all six anchors)
  - the [data-product-grid] container shipped empty
```

If it passes here, the check is not actually testing anything — stop and fix it before continuing.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-build.mjs package.json
git commit -m "Add build verification for product grid content

Currently fails: the built guide page ships an empty grid container.
This is the red test for build-time product rendering.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Extract product data and inject it at build time

**Files:**
- Create: `site.js`
- Create: `products.js`
- Modify: `vite.config.js`

**Interfaces:**
- Consumes: `npm run verify` from Task 1.
- Produces:
  - `site.js` exports `SITE` — `{ amazonTag: string, etsyShop: string, digitalTools: string }`. Task 3's `main.js` imports this.
  - `products.js` exports `essentials` (array), `amazonUrl(query: string): string`, and `renderProductGrid(): string`.
  - `vite.config.js` exports the config with the `prerender-products` plugin registered.

- [ ] **Step 1: Create `site.js`**

```js
export const SITE = {
  amazonTag: "billsworkshop-20",
  etsyShop: "https://www.etsy.com/shop/BillsWorkshopCompany",
  digitalTools: "https://billsworkshopcompany.com"
};
```

- [ ] **Step 2: Create `products.js` with the data moved from `main.js`**

**Move the `essentials` array from `main.js` verbatim — cut and paste it, do not retype it.** The declaration spans lines 7–113; the fifteen product objects inside it are lines 8–112. It is over 100 lines of product copy that ships to users, so retyping risks silent transcription errors. The array begins:

```js
const essentials = [
  {
    category: "organization",
    name: "Compression packing cubes",
```

and ends:

```js
    tip: "A zip top and luggage sleeve make it more useful in busy terminals."
  }
];
```

The complete `products.js`:

```js
import { SITE } from "./site.js";

export const essentials = [
  // the 15 product objects, moved verbatim from main.js lines 8-112
];

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

export function renderProductGrid() {
  return essentials.map((item, index) => `
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

Note `escapeHtml(amazonUrl(...))` turns the `&` separating query parameters into `&amp;`, which is the correct form inside an HTML attribute. Browsers decode it back to `&`.

- [ ] **Step 3: Confirm the module renders correctly before wiring it in**

```bash
node -e "
import('./products.js').then(m => {
  const html = m.renderProductGrid();
  const n = s => html.split(s).length - 1;
  console.log('cards:      ', n('class=\"product-card\"'));
  console.log('tagged:     ', n('tag=billsworkshop-20'));
  console.log('sponsored:  ', n('rel=\"sponsored nofollow noopener\"'));
  console.log('item-11 id: ', html.includes('id=\"item-11\"'));
  console.log('sample url: ', html.match(/href=\"[^\"]*\"/)[0]);
});
"
```

Expected:
```
cards:       15
tagged:      15
sponsored:   15
item-11 id:  true
sample url:  href="https://www.amazon.com/s?k=compression+packing+cubes+travel+set&amp;tag=billsworkshop-20"
```

- [ ] **Step 4: Register the plugin in `vite.config.js`**

Replace the whole file:

```js
import { defineConfig } from "vite";
import { renderProductGrid } from "./products.js";

const GRID_PATTERN = /(<div[^>]*\bdata-product-grid\b[^>]*>)(\s*)(<\/div>)/;

function prerenderProducts() {
  let injections = 0;

  return {
    name: "prerender-products",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (!GRID_PATTERN.test(html)) return html;
        injections += 1;
        return html.replace(
          GRID_PATTERN,
          (_match, open, _whitespace, close) => open + renderProductGrid() + close
        );
      }
    },
    closeBundle() {
      if (injections === 0) {
        throw new Error(
          "prerender-products: no [data-product-grid] container was found in any page. " +
          "The product grid would have shipped empty."
        );
      }
    }
  };
}

export default defineConfig({
  appType: "mpa",
  plugins: [prerenderProducts()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        guide: "flight-attendant-travel-essentials.html",
        about: "about.html",
        disclosure: "affiliate-disclosure.html",
        privacy: "privacy.html"
      }
    }
  }
});
```

Two design points worth understanding rather than just copying:

The plugin **does not filter by filename**. It injects wherever the marker appears, which removes any dependence on path formatting (a real hazard on Windows, where `ctx.filename` uses backslashes). The guide page is the only page carrying the marker.

`closeBundle` is the safety net. It runs only during `vite build`, not `vite dev`, so the dev server never hard-fails — but a production build that injected nothing throws instead of silently shipping an empty div. Character class `[^>]*` matches newlines in JavaScript regex, so the container's multi-line attributes are handled.

- [ ] **Step 5: Build and run the verification — it must now PASS**

```bash
npm run build && npm run verify
```

Expected: exit code 0 and
```
verify-build OK: 15 cards, 15 tagged links, all anchor targets present
```

- [ ] **Step 6: Confirm the content is genuinely in the HTML**

```bash
grep -c 'Compression packing cubes' dist/flight-attendant-travel-essentials.html
grep -o 'id="item-1"' dist/flight-attendant-travel-essentials.html
ls -l dist/flight-attendant-travel-essentials.html
```

Expected: the product name appears, `id="item-1"` exists, and the file is substantially larger than its previous ~6.7 KB.

- [ ] **Step 7: Commit**

```bash
git add site.js products.js vite.config.js
git commit -m "Render the product grid at build time

Moves product data into a Node-importable module and injects the
rendered cards via a Vite transformIndexHtml plugin, so crawlers get
the content in the initial HTML. The build now fails if the grid
marker is missing rather than shipping an empty container.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Remove product rendering from the client bundle

**Files:**
- Modify: `main.js`
- Modify: `flight-attendant-travel-essentials.html`

**Interfaces:**
- Consumes: `SITE` from `site.js` (Task 2).
- Produces: a `main.js` containing only `hydrateLinks()`, `setupNavigation()`, and `setYear()`.

Until this task, `renderProducts()` still overwrites the prerendered markup with identical markup on page load — harmless, but it means the data is shipped twice. This task removes the duplication.

- [ ] **Step 1: Record the current bundle size for comparison**

```bash
ls -l dist/assets/main-*.js
```

Save the byte count.

- [ ] **Step 2: Replace `main.js` entirely**

```js
import { SITE } from "./site.js";

function hydrateLinks() {
  document.querySelectorAll("[data-etsy-link]").forEach(link => link.href = SITE.etsyShop);
  document.querySelectorAll("[data-tools-link]").forEach(link => link.href = SITE.digitalTools);
}

function setupNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");
  if (!button || !menu) return;
  button.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
}

hydrateLinks();
setupNavigation();
setYear();
```

The `essentials` array, `amazonUrl()`, `renderProducts()`, its call, and the local `SITE` literal are all gone. `products.js` is not imported here — that is the point.

- [ ] **Step 3: Remove the stale `aria-live` attribute**

In `flight-attendant-travel-essentials.html` lines 95–99, change:

```html
            <div
              class="product-grid"
              data-product-grid
              aria-live="polite"
            ></div>
```

to:

```html
            <div
              class="product-grid"
              data-product-grid
            ></div>
```

`aria-live="polite"` tells screen readers to announce updates to this region. The content is now static, so there are no updates to announce and the attribute is misleading. `data-product-grid` stays — it is the injection marker.

- [ ] **Step 4: Rebuild and re-verify**

```bash
npm run build && npm run verify
```

Expected: still `verify-build OK: 15 cards, ...`. If the marker match broke because of the attribute change, this is where it surfaces.

- [ ] **Step 5: Confirm the bundle shrank and no longer contains product data**

```bash
ls -l dist/assets/main-*.js
grep -c 'Compression packing cubes' dist/assets/main-*.js || echo "0 - product data no longer in client bundle"
```

Expected: smaller than the Step 1 figure, and the product name absent from the JS.

- [ ] **Step 6: Confirm dev and production agree**

```bash
npm run dev &
sleep 4
curl -s http://localhost:5173/flight-attendant-travel-essentials.html | grep -c 'class="product-card"'
kill %1
```

Expected: `15`. `transformIndexHtml` runs in the dev server too, so dev must match production. If dev shows 0, the plugin is build-only and the parity claim in the spec is wrong.

- [ ] **Step 7: Commit**

```bash
git add main.js flight-attendant-travel-essentials.html
git commit -m "Drop product rendering from the client bundle

The grid is now prerendered, so shipping the product data to the
browser and re-rendering it on load is pure duplication. Also removes
aria-live from the now-static grid container.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Prove the guard, then deploy

**Files:** none modified permanently.

**Interfaces:**
- Consumes: everything above.
- Produces: the live site serving product content in its raw HTML.

- [ ] **Step 1: Prove the build fails when the marker is missing**

Temporarily rename the attribute in `flight-attendant-travel-essentials.html`:

```bash
sed -i 's/data-product-grid/data-product-grid-BROKEN/' flight-attendant-travel-essentials.html
npm run build; echo "exit code: $?"
```

Expected: the build **fails** with `prerender-products: no [data-product-grid] container was found in any page.` and a non-zero exit code.

This is the single most important check in the plan. If the build succeeds here, the guard does not work and an empty grid can ship silently — the exact bug being fixed.

- [ ] **Step 2: Restore and confirm green**

```bash
sed -i 's/data-product-grid-BROKEN/data-product-grid/' flight-attendant-travel-essentials.html
git diff --stat flight-attendant-travel-essentials.html
npm run build && npm run verify
```

Expected: `git diff --stat` shows **no changes** (the file is byte-identical to the commit), and verify passes.

- [ ] **Step 3: Push**

```bash
git status --short
git push origin main
```

Expected: clean working tree before pushing; push succeeds.

- [ ] **Step 4: Wait for the deployment to go green**

```bash
vercel ls bills-workshop-finds
```

Expected: newest deployment `● Ready` in Production. If `● Error`, read the build log before doing anything else.

- [ ] **Step 5: Verify product content in the live raw HTML**

```bash
BASE=https://finds.billsworkshopcompany.com
HTML=$(curl -s "$BASE/flight-attendant-travel-essentials")
echo "bytes:            $(echo "$HTML" | wc -c)"
echo "product cards:    $(echo "$HTML" | grep -c 'class=\"product-card\"')"
echo "named product:    $(echo "$HTML" | grep -c 'Compression packing cubes')"
echo "tagged links:     $(echo "$HTML" | grep -c 'tag=billsworkshop-20')"
echo "page status:      $(curl -s -o /dev/null -w '%{http_code}' "$BASE/flight-attendant-travel-essentials")"
```

Expected: byte count far above the previous 6679; 15 product cards; the product name present; tagged links present; status 200.

- [ ] **Step 6: Confirm the anchor links now resolve**

```bash
BASE=https://finds.billsworkshopcompany.com
HTML=$(curl -s "$BASE/flight-attendant-travel-essentials")
for n in 1 3 4 6 8 11; do
  printf "#item-%-3s %s\n" "$n" "$(echo "$HTML" | grep -c "id=\"item-$n\"")"
done
```

Expected: `1` for each of the six anchors.

- [ ] **Step 7: Report**

Report each check with its actual output. If any failed, say so with the output rather than describing the work as complete.

---

## Follow-up worth mentioning to the user, not doing here

Once this is live, request re-indexing of the guide page in Search Console (URL Inspection → Test Live URL → Request Indexing). Google's cached impression of the page is currently the near-empty version; re-indexing replaces it rather than waiting for the next natural crawl.
