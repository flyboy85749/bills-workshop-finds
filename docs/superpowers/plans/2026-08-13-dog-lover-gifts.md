# Dog Lover Gifts Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/dog-lover-gifts`, a 15-item Amazon-first gift guide for people buying for a dog owner, grouped by what the recipient's dog is like.

**Architecture:** This is a static multi-page site built by Vite. Guide content lives in `guides/<slug>.js` as an array of plain objects; `products.js` registers those arrays in a `collections` map and renders them to HTML strings; a Vite plugin (`vite.config.js`) injects the rendered grid into any `<div data-product-grid="<slug>"></div>` at build time. There is no client-side rendering and no runtime data fetch. Adding a guide is therefore: one data file, one registry line, one HTML page, one Vite input, one verification entry.

**Tech Stack:** Vite 7 (MPA mode), vanilla HTML/CSS/JS, no framework, no test runner. `scripts/verify-build.mjs` is the test harness — it asserts against the built `dist/` HTML.

**Spec:** `docs/superpowers/specs/2026-08-13-dog-lover-gifts-design.md`

## Global Constraints

- **Node scripts only.** No new npm dependencies. The project has exactly one devDependency (`vite`).
- **Amazon tag is `billsworkshop-20`.** Never hand-write an Amazon URL. `renderProductGrid()` builds every product link, applies the tag, and applies `rel="sponsored nofollow noopener"`. Hand-written product links will fail verification.
- **Extensionless internal links.** Vercel serves pages without `.html`. Every internal `href`, every `<link rel="canonical">`, and every `sitemap.xml` entry uses the clean path (`/dog-lover-gifts`, never `/dog-lover-gifts.html`). Files in `dist/` keep their `.html` names; Vercel maps the clean path at request time.
- **Header and footer are duplicated in every HTML page on purpose** (see `partials-note.txt`) so pages stay deployable on plain static hosting. A footer change means editing every page.
- **Item shape is fixed:** `{ category, name, query, reason, tip }`. All five fields are required on every item. `renderProductGrid()` emits all of them.
- **The ramp weight-rating-and-grip caveat in item 5 must ship verbatim.** A ramp that slips is worse than no ramp for the arthritic dog it was bought for. Do not shorten or soften it.
- **No item may duplicate one in `guides/flight-attendant-dog-gifts.js`.** The two dog guides must not cannibalize each other. Nothing in the build enforces this — it is a content constraint. The already-taken items are: treat-tossing pet camera, custom pet photo blanket, dog-photo luggage tag, programmable automatic feeder, GPS dog tracker, calming donut dog bed, reusable pet-hair remover, dog-design insulated tumbler, dog-print compression socks, dog-breed enamel pin set, dog-breed silhouette necklace, dog-print lounge set, heartbeat comfort toy, aviation-print dog bandana, collapsible travel bowl and bottle.
- **The slug is `dog-lover-gifts`** everywhere: data file name, `collections` key, `data-product-grid` value, HTML filename, canonical path, sitemap entry.
- **The home page featured slot does not change.** The classroom guide keeps it. This guide gets a normal card. Do not touch `<article class="featured-guide">` or the hero button.
- **Verification commands** are `npm run build` then `npm run verify`. `npm run verify` reads `dist/`, so the build must run first.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `guides/dog-lover-gifts.js` | Create | The 15 items. Content only — no logic, no imports. |
| `products.js` | Modify | Add one import and one `collections` entry. |
| `dog-lover-gifts.html` | Create | Page shell + grid marker + TOC. No product markup. |
| `vite.config.js` | Modify | Add the page to `rollupOptions.input`. |
| `scripts/verify-build.mjs` | Modify | Add one `GUIDES` entry. |
| `index.html` | Modify | Fourth guide card, footer. |
| `flight-attendant-travel-essentials.html` | Modify | TOC cross-link, footer. |
| `flight-attendant-dog-gifts.html` | Modify | TOC cross-link, footer. |
| `elementary-classroom-essentials.html` | Modify | TOC cross-link, footer. |
| `about.html`, `affiliate-disclosure.html`, `privacy.html` | Modify | Footer only. |
| `public/sitemap.xml` | Modify | One `<url>` entry. |
| `README.md` | Modify | Pages list. |

**Why Task 1 is one task and not five:** `vite.config.js`'s `closeBundle` hook asserts that every key in `collections` was injected into exactly one page. Registering the collection without shipping a page that carries its marker **fails the build**. The data file, the registry line, the page, and the Vite input are therefore a single atomic change — there is no intermediate state that builds.

---

### Task 1: Ship the guide page

**Files:**
- Create: `guides/dog-lover-gifts.js`
- Create: `dog-lover-gifts.html`
- Modify: `products.js:1-10`
- Modify: `vite.config.js:49-58`
- Modify: `scripts/verify-build.mjs:6-25`

**Interfaces:**
- Consumes: `renderProductGrid(key)` from `products.js`, invoked by the Vite plugin — not called directly by this task. `SITE.amazonTag` from `site.js`.
- Produces: the collection key `"dog-lover-gifts"`, and the exported binding `dogLoverGifts` from `guides/dog-lover-gifts.js`. Tasks 2 and 3 rely on the page existing at the clean path `/dog-lover-gifts`.

- [ ] **Step 1: Write the failing check**

In `scripts/verify-build.mjs`, add a fourth entry to the `GUIDES` array, after the `elementary-classroom-essentials` entry:

```js
  {
    file: "dist/elementary-classroom-essentials.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Rolling 10-drawer cart"
  },
  {
    file: "dist/dog-lover-gifts.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Snuffle mat"
  }
```

- [ ] **Step 2: Run the check to verify it fails**

```bash
npm run build && npm run verify
```

Expected: the build succeeds (nothing is wired yet) and `verify` FAILS with
`GUIDES has 4 entries but collections has 3 — a guide is registered but not checked, or checked but not registered.`

- [ ] **Step 3: Create the content file**

Create `guides/dog-lover-gifts.js`:

```js
export const dogLoverGifts = [
  {
    category: "new puppy",
    name: "Snuffle mat",
    query: "snuffle mat dog enrichment slow feeder washable",
    reason: "A puppy that inhales dinner in nine seconds spends the rest of the evening looking for a job, and usually finds one in the furniture. Scattering the same food through a fabric mat turns a nine-second meal into a fifteen-minute hunt.",
    tip: "Confirm the mat is machine washable and check what the backing tolerates. It holds food every single day, and one that cannot go in the machine stops being usable within a month."
  },
  {
    category: "new puppy",
    name: "Foldable indoor playpen",
    query: "dog playpen indoor foldable metal panels",
    reason: "A puppy that cannot yet be trusted alone in a room needs somewhere safe that is not a crate, and a pen buys the owner the thing they are shortest of in the first months: twenty minutes where nobody has to be watched.",
    tip: "Measure the panel height against the dog it will hold in six months, not the puppy it holds today. Check that the panels lock to each other, because a pen that only stands up as a circle is useless in a narrow room."
  },
  {
    category: "new puppy",
    name: "Freezable stuffable chew toy",
    query: "rubber stuffable dog chew toy freezer treat",
    reason: "A teething puppy is going to chew something. A hollow rubber toy packed with wet food and frozen redirects that at the one object in the house bought to be destroyed, and the cold helps with sore gums as well.",
    tip: "The size bands matter more than they look. A toy sized below the dog's weight range is a genuine choking risk, so buy the size up when the puppy is between bands."
  },
  {
    category: "senior dog",
    name: "Orthopedic memory-foam bed",
    query: "orthopedic memory foam dog bed removable washable cover",
    reason: "An older dog with stiff joints stops settling on a thin bed, and a dog that will not settle is a dog that wakes the house at three in the morning. Solid foam keeps its shape under the same pressure points night after night.",
    tip: "Look for a stated thickness of actual memory foam. A listing that says orthopedic over a layer of egg-crate on shredded polyfill is not orthopedic whatever the title claims, and a removable washable cover is not optional for a senior dog."
  },
  {
    category: "senior dog",
    name: "Folding pet ramp",
    query: "dog ramp for bed sofa folding non slip",
    reason: "The jump down off the sofa is where an arthritic dog gets hurt, and most owners only learn that after it happens. A ramp keeps the dog on the furniture it has slept on its whole life.",
    tip: "Check that the stated weight rating exceeds the dog's weight and that the surface is gripped carpet or rubber rather than smooth plastic. A ramp that slips underfoot is worse than no ramp for the dog it was bought for. Introduce it with treats — most dogs will not use one they have not been taught to use."
  },
  {
    category: "senior dog",
    name: "Adjustable elevated feeder",
    query: "elevated dog bowl stand adjustable height stainless",
    reason: "A dog that has to stoop to a floor bowl carries the strain in its neck and shoulders, and adjustable legs mean the same stand still fits after the next stiff year.",
    tip: "Height should roughly match the dog's chest rather than its head. Worth mentioning to the recipient that raised feeders are debated for large deep-chested breeds, so it is a question for their vet rather than for a product listing."
  },
  {
    category: "the dog that goes everywhere",
    name: "Hands-free bungee leash",
    query: "hands free dog leash waist belt bungee running",
    reason: "Running or hiking with a leash in one hand means every stride is a negotiation. A waist belt with a shock-absorbing bungee section takes the jolt out of a dog that spots a squirrel mid-stride.",
    tip: "Check the belt's adjustment range against the person wearing it over a winter coat, and look for a quick-release buckle within reach. A strong dog attached to your waist is a situation you want to be able to end in one second."
  },
  {
    category: "the dog that goes everywhere",
    name: "Waterproof back-seat hammock",
    query: "dog car seat cover hammock waterproof back seat",
    reason: "The hammock shape stops the dog sliding into the footwell at every junction, and it catches the mud, hair and water that otherwise settles permanently into the upholstery.",
    tip: "Confirm the anchor style suits the recipient's car and check whether the cover has seatbelt openings. A cover that blocks the buckle stops the dog being restrained, which trades one problem for a worse one."
  },
  {
    category: "the dog that goes everywhere",
    name: "Microfiber drying coat",
    query: "dog drying coat microfiber towel robe",
    reason: "A soaked dog after a beach walk is a twenty-minute towel fight in a car park. A coat the dog simply wears absorbs the water while everyone drives home.",
    tip: "Sizing goes by back length rather than weight, so the recipient needs to measure from collar to tail base. Check for a belly strap — a coat that only drapes over the back leaves the wettest part of the dog undried."
  },
  {
    category: "apartment dog",
    name: "Handheld pet grooming vacuum",
    query: "pet grooming vacuum kit dog hair attachments",
    reason: "In a small flat there is nowhere for shed hair to go. Brushing straight into a vacuum catches the coat before it reaches the sofa instead of chasing it around afterwards.",
    tip: "Check bin capacity and noise rating together. A small bin turns one grooming session into four trips to the bin, and a loud unit is one the dog will refuse to stand for a second time."
  },
  {
    category: "apartment dog",
    name: "Airtight rolling food bin",
    query: "airtight dog food storage container wheels lid",
    reason: "An open bag of kibble in a small kitchen goes stale, smells, and attracts things nobody wants to find behind the cupboard. A sealed bin on wheels also rolls out instead of being dragged.",
    tip: "Match the stated capacity in pounds to the bag size the recipient actually buys, and check the seal is a gasket rather than a snap-on lid. The wheels are what make a full bin usable; a 40-pound bin without them stays wherever it was first put."
  },
  {
    category: "apartment dog",
    name: "Odor-sealing waste pail",
    query: "dog waste odor sealing pail indoor",
    reason: "Anyone walking a dog from a flat carries the waste back through their own hallway. A sealing pail on the balcony or in the utility room ends the daily trip down to the outdoor bin.",
    tip: "Check what the refill liners cost and whether the pail accepts generic bags. Proprietary cartridge systems are cheap to buy and expensive to keep running."
  },
  {
    category: "for the person, not the dog",
    name: "Custom line-art portrait",
    query: "custom dog line art portrait print personalized",
    reason: "A single-line drawing of someone's dog reads as art rather than merchandise, which is the difference between hanging in the living room and living in a drawer.",
    tip: "Order early. Personalized work carries real production time and is almost never returnable, so a late-December order is a January gift. Check the photo resolution the seller asks for before sending a phone snap."
  },
  {
    category: "for the person, not the dog",
    name: "Personalized name doormat",
    query: "custom dog doormat personalized name",
    reason: "It puts the dog's name at the front door where every visitor is greeted by it, which is exactly the joke the recipient has been making for years anyway.",
    tip: "Check whether the mat is rated for outdoor use and whether the doorway is covered, because a printed coir mat in an exposed porch fades within a season. Confirm the spelling twice — a personalized mat cannot be returned."
  },
  {
    category: "for the person, not the dog",
    name: "Dog DNA test kit",
    query: "dog dna test kit breed identification health",
    reason: "For someone with a rescue, the breed question is one they have been guessing at for years, and the health screening that comes back is genuinely useful for knowing what to watch for.",
    tip: "Check the headline price against the real total. Some kits need an ongoing membership for the results to stay accessible. Confirm the kit ships to, and processes samples from, the recipient's country before buying."
  }
];
```

- [ ] **Step 4: Register the collection**

In `products.js`, add the import after the classroom import and the registry line after the classroom entry:

```js
import { SITE } from "./site.js";
import { travelEssentials } from "./guides/travel-essentials.js";
import { dogGifts } from "./guides/flight-attendant-dog-gifts.js";
import { classroomEssentials } from "./guides/elementary-classroom-essentials.js";
import { dogLoverGifts } from "./guides/dog-lover-gifts.js";

export const collections = {
  "travel-essentials": travelEssentials,
  "flight-attendant-dog-gifts": dogGifts,
  "elementary-classroom-essentials": classroomEssentials,
  "dog-lover-gifts": dogLoverGifts
};
```

Change nothing else in this file. `escapeHtml`, `amazonUrl`, and `renderProductGrid` stay exactly as they are.

- [ ] **Step 5: Create the page shell**

Copy the classroom page and then replace three regions:

```bash
cp elementary-classroom-essentials.html dog-lover-gifts.html
```

Replace the `<head>` contents (keeping `<meta charset>` and the viewport tag as they are):

```html
    <title>15 Gifts for Dog Lovers That Aren't Junk | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen gifts for dog lovers chosen by what the dog is actually like — new puppy, senior dog, adventure dog or apartment dog — with what to check before buying each one."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/dog-lover-gifts"
    />
    <meta
      property="og:title"
      content="15 Gifts for Dog Lovers That Aren't Junk"
    />
    <meta
      property="og:description"
      content="Gifts picked by the dog rather than the price tag, with the sizing, safety and lead-time checks that matter before you buy."
    />
```

- [ ] **Step 6: Replace the page hero**

Replace the contents of `<header class="page-hero">`:

```html
      <header class="page-hero">
        <div class="shell">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>Dog lovers</span>
          </nav>
          <p class="eyebrow">Dog lovers</p>
          <h1>15 Gifts for Dog Lovers That Aren't Junk</h1>
          <p class="lede">
            Most dog gifts are chosen by someone who does not have a dog, which
            is how so many of them end up in a cupboard. These are picked by the
            one thing the buyer usually does know—what the dog is like.
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

- [ ] **Step 7: Replace the intro, grid marker, Etsy callout and TOC**

Replace everything from `<div class="guide-intro">` through the closing `</aside>` of the table of contents:

```html
            <div class="guide-intro">
              <p>
                Most people arrive at a list like this in December, shopping for
                someone whose dog they have met twice. That is the hard version
                of the problem: you know the person, you have seen the dog, and
                you have no idea what they already own.
              </p>
              <p>
                So this list is organized by the dog rather than by the product—the
                new puppy, the stiff old one, the dog that goes everywhere, the
                dog in a small flat, and the owner who would quietly rather have
                something for themselves. Two cautions apply to the whole list
                if you are buying for the holidays:
                <strong
                  >anything personalized needs ordering weeks earlier than you
                  think</strong
                >, and anything sized to the dog should be bought somewhere the
                return window runs past the day itself.
              </p>
            </div>
            <div class="product-grid" data-product-grid="dog-lover-gifts"></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original dog-lover designs</h2>
              <p>
                Bill's Workshop Company creates designs for people who would
                rather carry something with a bit of personality than another
                paw-print mug.
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
            ><a href="#item-1">New puppy</a
            ><a href="#item-4">Senior dog</a
            ><a href="#item-7">The dog that goes everywhere</a
            ><a href="#item-10">Apartment dog</a
            ><a href="#item-13">For the person</a
            ><a href="/flight-attendant-dog-gifts">Dog gifts for flight crew</a
            ><a href="/elementary-classroom-essentials">Classroom essentials guide</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
          </aside>
```

Leave the site header, the nav, and the footer exactly as copied. Task 3 updates the footer on every page at once.

- [ ] **Step 8: Add the page to the build**

In `vite.config.js`, add the entry to `rollupOptions.input` after `classroom`:

```js
      input: {
        home: "index.html",
        guide: "flight-attendant-travel-essentials.html",
        dogGifts: "flight-attendant-dog-gifts.html",
        classroom: "elementary-classroom-essentials.html",
        dogLovers: "dog-lover-gifts.html",
        about: "about.html",
        disclosure: "affiliate-disclosure.html",
        privacy: "privacy.html"
      }
```

- [ ] **Step 9: Run the check to verify it passes**

```bash
npm run build && npm run verify
```

Expected: `verify-build OK: 4 guide(s), 60 cards, all anchor targets present`

- [ ] **Step 10: Confirm the grid actually rendered**

```bash
grep -o 'class="product-card"' dist/dog-lover-gifts.html | wc -l
grep -o 'tag=billsworkshop-20' dist/dog-lover-gifts.html | wc -l
grep -o 'worse than no ramp' dist/dog-lover-gifts.html | wc -l
```

Expected: `15`, `15`, `1`. The third confirms the ramp safety caveat survived into the built page.

Use `grep -o … | wc -l` rather than `grep -c` throughout this plan. `grep -c` counts matching *lines*, and the built HTML puts several of these on one line, so it undercounts.

- [ ] **Step 11: Confirm no item collides with the crew dog guide**

```bash
node -e "const a=require('fs').readFileSync('guides/flight-attendant-dog-gifts.js','utf8');const b=require('fs').readFileSync('guides/dog-lover-gifts.js','utf8');const q=s=>[...s.matchAll(/query: \"([^\"]+)\"/g)].map(m=>m[1]);const dup=q(a).filter(x=>q(b).includes(x));console.log(dup.length===0?'OK: no shared queries':'COLLISION: '+dup.join(', '))"
```

Expected: `OK: no shared queries`

- [ ] **Step 12: Commit**

```bash
git add guides/dog-lover-gifts.js dog-lover-gifts.html products.js vite.config.js scripts/verify-build.mjs
git commit -m "Add the dog lover gifts guide"
```

---

### Task 2: Add the guide card to the home page

**Files:**
- Modify: `index.html:128-162` (the `.guide-card-grid` block)

**Interfaces:**
- Consumes: the page published at `/dog-lover-gifts` by Task 1.
- Produces: nothing other tasks depend on.

The featured slot stays with the classroom guide — do not touch `<article class="featured-guide">` or the hero button. This task adds a fourth card only.

- [ ] **Step 1: Add the fourth card**

In `index.html`, inside `<div class="guide-card-grid">`, add a fourth `<article>` after the classroom card (the one linking to `/elementary-classroom-essentials`) and before the closing `</div>`:

```html
            <article class="guide-card">
              <p class="eyebrow">Dog lovers</p>
              <h3>15 Gifts for Dog Lovers That Aren't Junk</h3>
              <p>
                Picked by what the dog is actually like—the new puppy, the stiff
                old one, or the one that goes everywhere.
              </p>
              <a class="button button-secondary" href="/dog-lover-gifts"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
```

- [ ] **Step 2: Verify the card count and that the feature did not move**

```bash
npm run build
grep -o 'class="guide-card"' dist/index.html | wc -l
grep -o 'featured-copy' dist/index.html | wc -l
grep -o 'Classroom Essentials Elementary Teachers' dist/index.html | wc -l
```

Expected: `4`, `1`, `1`. The second and third confirm the featured block still exists and still holds the classroom guide.

- [ ] **Step 3: Check the grid visually**

```bash
npm run dev
```

Open `http://localhost:5173/` and confirm the guides section shows the classroom guide featured above a row of four cards, and that the fourth card's button opens `/dog-lover-gifts`. Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add the dog lover gifts card to the home page"
```

---

### Task 3: Make the guide reachable site-wide

**Files:**
- Modify: `index.html`, `about.html`, `affiliate-disclosure.html`, `privacy.html`, `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html`, `elementary-classroom-essentials.html`, `dog-lover-gifts.html` (footer in all eight)
- Modify: `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html`, `elementary-classroom-essentials.html` (TOC cross-link)
- Modify: `public/sitemap.xml`
- Modify: `README.md`

**Interfaces:**
- Consumes: the page published at `/dog-lover-gifts` by Task 1.
- Produces: nothing other tasks depend on.

Nothing in the build enforces any of this. A guide can build clean, verify clean, and still be reachable only by typing the URL. This task is the one that makes it a real page on the site.

- [ ] **Step 1: Add the footer link to all eight pages**

This block is byte-identical in all seven existing pages (verified during planning: `index.html:311`, `about.html:125`, `affiliate-disclosure.html:117`, `privacy.html:134`, `flight-attendant-travel-essentials.html:156`, `flight-attendant-dog-gifts.html:147`, `elementary-classroom-essentials.html:154`), and the eighth page inherits it from the Task 1 copy. The same replacement applies unchanged to every one.

Find:

```html
            ><a href="/elementary-classroom-essentials">Classroom guide</a
            ><a href="/#categories">Categories</a
```

Replace with:

```html
            ><a href="/elementary-classroom-essentials">Classroom guide</a
            ><a href="/dog-lover-gifts">Dog lover gifts</a
            ><a href="/#categories">Categories</a
```

- [ ] **Step 2: Add the TOC cross-link to the three existing guides**

In each of `flight-attendant-travel-essentials.html`, `flight-attendant-dog-gifts.html` and `elementary-classroom-essentials.html`, the TOC aside ends with the disclosure link. That line is byte-identical in all three (`flight-attendant-travel-essentials.html:133`, `flight-attendant-dog-gifts.html:124`, `elementary-classroom-essentials.html:131`).

Find, in each of the three:

```html
            ><a href="/affiliate-disclosure">How affiliate links work</a>
```

Replace with:

```html
            ><a href="/dog-lover-gifts">Dog lover gifts guide</a
            ><a href="/affiliate-disclosure">How affiliate links work</a>
```

Do **not** apply this to `dog-lover-gifts.html` — that page's TOC was written correctly in Task 1 and must not link to itself.

- [ ] **Step 3: Add the sitemap entry**

In `public/sitemap.xml`, add the entry after the classroom line:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/elementary-classroom-essentials</loc></url>
  <url><loc>https://finds.billsworkshopcompany.com/dog-lover-gifts</loc></url>
```

- [ ] **Step 4: Update the README pages list**

In `README.md`, add the guide to the Pages list after the classroom line:

```markdown
- 15 Classroom Essentials Elementary Teachers Actually Use All Year guide
- 15 Gifts for Dog Lovers That Aren't Junk guide
```

- [ ] **Step 5: Verify every page links to the new guide**

```bash
npm run build
for f in index about affiliate-disclosure privacy flight-attendant-travel-essentials flight-attendant-dog-gifts elementary-classroom-essentials dog-lover-gifts; do
  echo "$f: $(grep -o '/dog-lover-gifts' dist/$f.html | wc -l)"
done
```

Expected: `dog-lover-gifts` reports at least `2` (its own canonical plus its footer link). The three existing guides report `2` each (footer plus TOC cross-link). `index` reports `2` (card plus footer). `about`, `affiliate-disclosure` and `privacy` report `1` each (footer only).

- [ ] **Step 6: Verify no `.html` crept into an internal link**

```bash
grep -rn 'href="/[a-z-]*\.html"' *.html public/sitemap.xml
```

Expected: no output. Any hit is a broken link under Vercel's clean-URL rule.

- [ ] **Step 7: Run the full gate one more time**

```bash
npm run build && npm run verify
```

Expected: `verify-build OK: 4 guide(s), 60 cards, all anchor targets present`

- [ ] **Step 8: Commit**

```bash
git add index.html about.html affiliate-disclosure.html privacy.html flight-attendant-travel-essentials.html flight-attendant-dog-gifts.html elementary-classroom-essentials.html dog-lover-gifts.html public/sitemap.xml README.md
git commit -m "Link the dog lover gifts guide into the site"
```

---

## Final verification

Run after all three tasks are complete.

- [ ] `npm run build && npm run verify` reports `4 guide(s), 60 cards`.
- [ ] `npm run dev`, then walk the site: home page → fourth card → guide loads with 15 numbered cards and a working TOC; each of the three existing guides shows the cross-link in its sidebar; every footer offers "Dog lover gifts".
- [ ] Spot-check three product buttons on the new guide. Each opens an Amazon search in a new tab, carries `tag=billsworkshop-20`, and the search results are plausibly the product described.
- [ ] The classroom guide is still the featured guide on the home page.
- [ ] `git log --oneline` shows five commits on the `dog-lover-gifts` branch: the spec, the plan, and one per task.
- [ ] Open a pull request against `main`. Do not push to `main` directly — a push to `main` is a production deploy.
