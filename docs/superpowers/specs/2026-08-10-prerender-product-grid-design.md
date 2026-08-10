# Build-time rendering of the product grid

Date: 2026-08-10
Status: Approved

## Problem

`https://finds.billsworkshopcompany.com/flight-attendant-travel-essentials` serves 6.7 KB of
HTML containing no product content. Verified against the live site: `product-card` appears 0
times, `Compression packing cubes` 0 times, `amazon.com` 0 times. All fifteen products —
names, reasons, buying tips, and affiliate links — are injected client-side by
`renderProducts()` in `main.js` into an empty container:

```html
<div class="product-grid" data-product-grid aria-live="polite"></div>
```

Three consequences:

1. **Deferred indexing.** Google renders JavaScript, but on a second pass that can lag days to
   weeks behind initial crawl and is the first thing dropped under crawl-budget pressure on a
   new site with no authority. The page is first indexed as a near-empty document for the
   query it is built to win.
2. **Non-rendering crawlers see nothing.** Pinterest — which the site owner plans to use for
   promotion, and which is being registered with Amazon Associates — does not execute
   JavaScript. Neither do most social preview bots.
3. **Broken in-page anchors.** The guide's jump nav links to `#item-1`, `#item-3`, `#item-4`,
   `#item-6`, `#item-8`, and `#item-11` (`flight-attendant-travel-essentials.html:120-124`).
   Those IDs exist only on JS-generated cards, so the links are dead on first paint and dead
   entirely without JS.

## Goal

Render the product grid into the HTML at build time, keeping a single source of truth for the
product data, without introducing a framework or new runtime dependency.

## Constraints discovered

- The product grid appears on exactly one page. `index.html` does not use it.
- There is no category filter UI anywhere in the site. The `data-category` attribute emitted
  on generated cards is unused.
- Nothing else on the page depends on client-side rendering.
- Therefore the rendering code can leave the client bundle entirely rather than being
  duplicated across build and runtime.

## Non-goals

No framework, no SSR runtime, no new dependencies. Product copy, styling, and page structure
are unchanged. The remaining client-side behaviour (menu toggle, link hydration, copyright
year) stays as it is.

## Approach

A Vite plugin using the `transformIndexHtml` hook, chosen over two alternatives:

- **Post-build script rewriting `dist/*.html`** — rejected. It operates on built output rather
  than source, and does not run in the dev server, so dev and production diverge. That
  divergence is the same class of bug being fixed here.
- **Hand-writing the fifteen cards into the HTML** — rejected. It destroys the single source
  of truth; every product edit becomes two edits in two languages, and they will drift.

`transformIndexHtml` runs during both `vite build` and `vite dev`, so the two environments
produce identical markup.

## Design

### `site.js` (new)

```js
export const SITE = {
  amazonTag: "billsworkshop-20",
  etsyShop: "https://www.etsy.com/shop/BillsWorkshopCompany",
  digitalTools: "https://billsworkshopcompany.com"
};
```

Shared because the build needs `amazonTag` to construct affiliate URLs and the client needs
the other two fields.

### `products.js` (new)

Holds the `essentials` array (moved verbatim from `main.js`), plus:

- `escapeHtml(str)` — escapes `&`, `<`, `>`, `"`, `'`
- `amazonUrl(query)` — moved from `main.js`, unchanged behaviour
- `renderProductGrid()` — returns the fifteen `<article class="product-card">` elements as an
  HTML string

Pure data and string building, no DOM access, so Node can import it at build time. **This
module is never imported by client code**, so its payload leaves the browser bundle.

Card markup is identical to what `renderProducts()` currently produces, including
`id="item-${index + 1}"`, `data-category`, the `product-number` span, and
`rel="sponsored nofollow noopener"` on the button.

`data-category` is retained even though nothing reads it today — it is inert, costs nothing,
and removing it would be an unrelated change.

### `vite.config.js` (modify)

Add a plugin that injects the grid into the guide page only:

- Matches on the guide page's filename; other pages pass through untouched.
- Locates the container by its `data-product-grid` attribute and inserts the rendered markup
  between the opening and closing tags.
- **Throws a build error if the marker is not found.** This is deliberate. The failure mode
  being fixed is "page looks fine, content silently missing", so a no-op injection must break
  the build rather than ship an empty div.

### `main.js` (modify)

Remove the `essentials` array, `renderProducts()`, `amazonUrl()`, and the local `SITE`
literal. Import `SITE` from `site.js`. Remove the `renderProducts()` call.

What remains is genuinely client-side: `hydrateLinks()`, `setupNavigation()`, `setYear()`.

### `flight-attendant-travel-essentials.html` (modify)

Remove `aria-live="polite"` from the grid container. It instructs screen readers to announce
dynamic updates; with static content there are no updates, so it is misleading. The
`data-product-grid` attribute stays — it is now the build-time injection marker.

### `scripts/verify-build.mjs` (new)

The project has no test framework. This script provides an automated check of the built
output, wired to `npm run verify`. It reads `dist/flight-attendant-travel-essentials.html` and
asserts:

1. Exactly 15 occurrences of `class="product-card"`
2. Every product button URL contains `tag=billsworkshop-20`
3. All six anchor targets referenced by the jump nav (`item-1`, `item-3`, `item-4`, `item-6`,
   `item-8`, `item-11`) exist as element IDs
4. 15 occurrences of `rel="sponsored nofollow noopener"`
5. The grid container is not empty

Exits non-zero with a specific message on any failure.

This guards precisely the regression a human eye will not catch: HTML that looks structurally
correct while missing its content.

## Verification

1. `npm run build` succeeds.
2. `npm run verify` passes all five assertions.
3. The built HTML contains product names, tips, and tagged Amazon URLs in its raw source.
4. The client bundle shrinks (the `essentials` array is no longer shipped).
5. `npm run dev` renders the same fifteen cards, confirming dev/prod parity.
6. Deliberately breaking the marker (temporarily renaming `data-product-grid`) fails the
   build rather than producing an empty grid.
7. After deploy, `curl` of the live page shows product content in the raw HTML response.

## Risks

- **Marker matching.** The container's attributes span multiple lines in the source HTML. The
  match must tolerate newlines within the opening tag. Covered by verification step 6.
- **Escaping.** Current product copy is clean (one curly apostrophe, no markup characters), so
  escaping changes nothing today. It exists so a future product name containing `&` or a
  quote cannot silently corrupt the markup.
