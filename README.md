# Bill's Workshop Finds

A lightweight multi-page affiliate guide site intended for `finds.billsworkshopcompany.com`.

## Pages

- Home and category hub
- 15 Flight Attendant Travel Essentials guide
- 15 Gifts for Flight Attendants Who Love Dogs guide
- 15 Classroom Essentials Elementary Teachers Actually Use All Year guide
- 15 Gifts for Dog Lovers That Aren't Junk guide
- 15 Gifts for Student Pilots, Sorted by Where They Are in Training guide
- 15 Tools for a First Apartment, Sorted by What Just Went Wrong guide
- 15 Holiday Gifts, Grouped by Who You're Buying For guide
- 15 Retro Classroom Decor Finds That Warm Up a Cold Room guide
- The Ultimate Pen Pal Starter Kit: 15 Things Worth Owning guide
- 15 Adventure Travel Essentials Worth Packing guide
- 10 Cozy Amazon Fall Finds Under $40 guide
- 7 Whimsical Amazon Kitchen Finds guide
- About
- Affiliate disclosure
- Privacy policy

## Affiliate links

`SITE.amazonTag` in `site.js` is set to `billsworkshop-20`, and `finds.billsworkshopcompany.com` is registered as an approved website in Amazon Associates. Product buttons open tagged Amazon search results and carry `rel="sponsored nofollow noopener"`.

Remaining optional improvement: replace the search-based recommendations with specific reviewed products.

Add the Pinterest account to the Amazon Associates approved social profiles before promoting there.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production-ready static files will be in `dist/`.

## Checks

```bash
npm run verify
```

`verify` runs `html-validate` over every page, then the `node --test` unit tests in `test/`, then
the built-output checks in `scripts/verify-build.mjs`. Run `npm test` alone to check the art
registry without a build. Keep each `<title>` on one line: the `long-title` rule counts the
whitespace inside the element, so a title wrapped across lines fails the 75-character limit even
when its text is well under.

## Deployment

Hosted on Vercel as project `bills-workshop-finds` (team `billchristianwebs-projects`), live at https://finds.billsworkshopcompany.com.

Pushing to `main` deploys to production automatically; pull requests get preview URLs. Preview and `*.vercel.app` URLs sit behind team SSO — the custom domain is public.

`vercel.json` is the single source of truth for host config: clean (extensionless) URLs, four security headers, and a one-year immutable cache for Vite's content-hashed assets in `/assets/`. Build command and output directory come from Vercel's Vite framework preset.

Because pages are served without the `.html` extension, internal links, canonical tags, and `public/sitemap.xml` must all use extensionless paths. The files in `dist/` keep their `.html` names — Vercel maps the clean path to them at request time.

Design and implementation notes for the deployment live in `docs/superpowers/`.

## Adding a guide

Guide content lives in `guides/<slug>.js` as an array of `{ category, name, query, reason, tip }`
objects. Register the array in `collections` in `products.js`, mark the page's container with
`data-product-grid="<slug>"`, add the page to `rollupOptions.input` in `vite.config.js`, and add
an entry to `GUIDES` in `scripts/verify-build.mjs`. The build fails if a registered collection is
never injected, so a half-wired guide cannot ship. `verify-build.mjs` also fails the build if the
same product name appears in two guides, so a new guide's items need names that don't collide with
an existing guide's.

Guide art lives in `guides/art.js`, exported as `guideArt` (keyed by guide slug), plus `homeArt`
and `categoryArt` (not keyed by guide — the home-page hero and the six category icons are drawn
once and reused). Add an entry to `guideArt` with `accent` and `accentSoft` (six-digit lowercase
hex), `label` (the hero's accessible name — no quotes, angle brackets or ampersands, since it lands
in an HTML attribute), `scene` (800x500 SVG markup) and `badge` (480x320 SVG markup). Mark the
guide's hero with `data-guide-art="<slug>"`, add `<div data-guide-badge="<slug>"></div>` on the
home-page card directly above its `<a class="button">` (after the description paragraph, not as
the card's first child), and set `style="--accent: …; --accent-soft: …"` on the guide page's
`<body>`, matching the registry entry exactly. If the guide is the home page's featured guide
instead of a card, use `data-guide-scene-decorative="<slug>"` in place of `data-guide-badge`,
so the art (rendered via `renderGuideScene(slug, { decorative: true })`) isn't announced twice to
screen readers — the featured block's own heading already names the guide.

Scenes carry a brass hairline frame, since they sit alone on a guide page; badges carry no frame,
since they sit inside a `.guide-card` that already has its own border — a frame inside a frame
reads as boxy. Beyond that, motifs share one substrate — cream ground, a dashed navy route line,
flat 2px strokes, no gradients inside objects — and use `currentColor` for anything that should
pick up the accent.

Three checks make a half-arted guide's art impossible to ship. The Vite plugin's `closeBundle`
guard fails the build if a `guideArt` entry's scene is never injected (as either `data-guide-art`
or `data-guide-scene-decorative`) or if its badge is injected more than once. `verify-build.mjs`
fails if `collections`, `guideArt` and its own `GUIDES` table do not name exactly the same slugs.
`verify-build.mjs` also fails, separately, if a guide isn't represented on the built home page by
either a card badge or the featured scene. A new guide's art therefore has to be added consistently
across the registry, the build config and the home page, or the build refuses to finish.

A guide that builds and verifies is not yet reachable. Also link it in: add a card on the home
page (featured guide or guide-card grid), add its extensionless path to `public/sitemap.xml`, add it to the Pages list at the top of this
file, and
add TOC cross-links. The footer deliberately carries no per-guide links — it collapses to a single
"All guides" link so it does not grow with the guide count. Each guide's TOC aside is capped at two
cross-links plus "All guides", so adding a guide means swapping a link on the two nearest guides
rather than appending to every guide's TOC.
