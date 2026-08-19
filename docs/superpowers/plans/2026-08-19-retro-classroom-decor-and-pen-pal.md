# Retro Classroom Decor & Pen Pal Starter Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish two new fifteen-item Amazon affiliate guides — `/retro-classroom-decor` and `/pen-pal-starter-kit` — fully wired into the build, the home page, the sitemap and the cross-link graph.

**Architecture:** Each guide is a plain data module in `guides/<slug>.js` exporting an array of `{category, name, query, reason, tip}` objects, registered in the `collections` map in `products.js`. A static HTML page carries a `<div class="product-grid" data-product-grid="<slug>"></div>` marker, and the Vite plugin in `vite.config.js` replaces that marker with rendered cards at build time. No client-side rendering, no runtime data fetching.

**Tech Stack:** Vite 7 (multi-page app mode), vanilla ES modules, `html-validate` for markup linting, and a bespoke `scripts/verify-build.mjs` that asserts card counts, affiliate tagging, anchor targets and cross-links against the built `dist/` output.

**Spec:** `docs/superpowers/specs/2026-08-19-retro-classroom-decor-and-pen-pal-design.md`

## Global Constraints

- **Item count:** exactly 15 per guide, in 5 contiguous `category` runs of 3, so anchors land on items 1, 4, 7, 10 and 13.
- **Item shape:** every object has exactly `category`, `name`, `query`, `reason`, `tip`. No extra keys — `renderProductGrid` reads only these.
- **Affiliate tag:** `billsworkshop-20`, applied by `amazonUrl()` in `products.js`. Never hand-write an Amazon URL in HTML.
- **Link rel:** `rel="sponsored nofollow noopener"` on every product link, emitted by `renderProductGrid`. Never hand-write a product link.
- **Internal links are extensionless** (`/retro-classroom-decor`, not `/retro-classroom-decor.html`). `vercel.json` sets `cleanUrls: true`.
- **`<title>` must sit on ONE line and stay under 75 characters.** The `long-title` rule counts whitespace inside the element, so a wrapped title fails even when its text is short.
- **Do not add lighting to the decor guide.** `guides/elementary-classroom-essentials.js` already owns "Warm plug-in lamps" and its fire-code caveat. This is the one collision the build cannot catch.
- **Header and footer markup is intentionally duplicated** across pages (`partials-note.txt`). Copy it verbatim; do not extract a partial.
- **Verification command:** `npm run build && npm run verify`. There is no unit-test framework in this repo — `verify-build.mjs` is the test suite, and it reads `dist/`, so a build must precede it.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `guides/retro-classroom-decor.js` | create | 15 decor items, data only |
| `guides/pen-pal-starter-kit.js` | create | 15 letter-writing items, data only |
| `retro-classroom-decor.html` | create | Page shell + grid marker + TOC for the decor guide |
| `pen-pal-starter-kit.html` | create | Page shell + grid marker + TOC for the pen pal guide |
| `products.js` | modify | Register both collections |
| `vite.config.js` | modify | Register both pages as build inputs |
| `scripts/verify-build.mjs` | modify | Assert both new guides, and the two TOC swaps |
| `index.html` | modify | Hero button label, meta description, two new grid cards |
| `elementary-classroom-essentials.html` | modify | TOC cross-link swap |
| `holiday-gifts.html` | modify | TOC cross-link swap |
| `public/sitemap.xml` | modify | Two new URLs |
| `README.md` | modify | Two new Pages entries |

**Known intermediate state:** Task 1 ships the decor page with a TOC link to `/pen-pal-starter-kit`, which does not exist until Task 2. That link 404s between the two commits. This is deliberate — the two tasks ship as one PR — but a reviewer looking at Task 1 in isolation should expect it.

---

### Task 1: Retro classroom decor guide

**Files:**
- Create: `guides/retro-classroom-decor.js`
- Create: `retro-classroom-decor.html`
- Modify: `products.js` (imports at top; `collections` object)
- Modify: `vite.config.js` (`build.rollupOptions.input`)
- Modify: `scripts/verify-build.mjs` (`GUIDES` array)
- Test: `scripts/verify-build.mjs` is the test — run via `npm run verify`

**Interfaces:**
- Consumes: `renderProductGrid(key)` and the `collections` map from `products.js`; `amazonUrl(query)` is applied internally by `renderProductGrid` and is not called directly here.
- Produces: named export `retroClassroomDecor` (an `Array<{category: string, name: string, query: string, reason: string, tip: string}>` of length 15), and the collection key `"retro-classroom-decor"`.

- [ ] **Step 1: Write the failing test**

Add this entry to the `GUIDES` array in `scripts/verify-build.mjs`, immediately after the `dist/holiday-gifts.html` entry and before the closing `];`:

```js
  {
    file: "dist/retro-classroom-decor.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Vintage pull-down map reproduction",
    links: ["/elementary-classroom-essentials", "/pen-pal-starter-kit"]
  }
```

Mind the comma: the entry before it needs a trailing comma after its closing `}`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && npm run verify`

Expected: FAIL. `verify-build` exits 1 before reading any file, with:

```
verify-build FAILED:
  - GUIDES has 8 entries but collections has 7 — a guide is registered but not checked, or checked but not registered.
```

- [ ] **Step 3: Create the data module**

Create `guides/retro-classroom-decor.js`:

```js
export const retroClassroomDecor = [
  {
    category: "walls & charts",
    name: "Vintage pull-down map reproduction",
    query: "vintage pull down world map wall hanging",
    reason: "One large map does more for a bare cinderblock wall than a dozen small posters, and it is the rare decorative object children will actually walk up to and study.",
    tip: "Genuine mid-century maps still show the USSR, Yugoslavia and Rhodesia. That is charming above a bookshelf and confusing above a reading table, so buy a reproduction for a wall children read from and save an original for a wall they only look at."
  },
  {
    category: "walls & charts",
    name: "Retro science and botanical charts",
    query: "vintage science chart poster set botanical anatomy",
    reason: "Reproduction pull-down charts carry the warmth of an old schoolroom while still being about something, which is what separates them from generic wall filler.",
    tip: "Check whether the set ships rolled or folded. Folded prints arrive with creases across the middle that never fully flatten, and a creased chart looks cheap on a wall it is meant to anchor."
  },
  {
    category: "walls & charts",
    name: "Cursive penmanship alphabet strip",
    query: "cursive alphabet wall strip classroom penmanship",
    reason: "The alphabet line above the board is the most recognizably schoolhouse object in the room, and traditional letterforms read as deliberate where a cartoon set reads as whatever the supply catalog had.",
    tip: "Match the letterform to what your district teaches. D'Nealian, Zaner-Bloser and Handwriting Without Tears shape letters differently, and a strip in the wrong style contradicts the handwriting instruction happening underneath it."
  },
  {
    category: "signage & letters",
    name: "Felt letter board",
    query: "felt letter board with letters 10x10",
    reason: "One board handles the daily message, the schedule change and the class joke without printing anything, and it looks like it belongs in a building put up in 1955.",
    tip: "Count the letters in the kit before buying. Most include a single set, which runs out of Es and Ss partway through the first long sentence, so look for a kit with duplicates or add a supplemental letter pack."
  },
  {
    category: "signage & letters",
    name: "Wooden schoolhouse-style sign",
    query: "wooden schoolhouse sign vintage classroom wall decor",
    reason: "A single wooden sign by the door names the room and does the same job as a laminated printout, without looking like a laminated printout.",
    tip: "Check the weight against the hanging hardware. Classroom walls are usually cinderblock or tile over plaster, so a heavy sign needs adhesive strips rated well above its weight, or a hook the custodian installs. Screws are rarely yours to place."
  },
  {
    category: "signage & letters",
    name: "Library pockets and date-due cards",
    query: "library card pockets due date cards set",
    reason: "Pockets glued inside the class library books turn checkout into a routine children run themselves, and the cards fill up over the year into a visible record of what got read.",
    tip: "Buy self-adhesive pockets rather than plain ones. Gluing two hundred pockets by hand is a weekend of work, and school glue sticks release from book board within a term."
  },
  {
    category: "the reading corner",
    name: "Washable low-pile area rug",
    query: "washable low pile area rug classroom reading nook",
    reason: "The rug is what makes a corner a reading corner rather than a piece of floor, and it is the only decorative item in the room that also decides where children sit.",
    tip: "Machine-washable and low pile, with either a non-slip backing or a separate rug pad underneath. A rug that slides on tile is a fall, and a thick pile one cannot be cleaned after the first spilled water bottle."
  },
  {
    category: "the reading corner",
    name: "Wooden crate book display",
    query: "wooden crate book display shelf",
    reason: "Stacked crates show covers instead of spines, which is how children this age actually choose what to read, and they look like something from a general store rather than a supply catalog.",
    tip: "Check that the crates arrive sanded, or sand the inside edges before they go in the room. Rough pine splinters, and the first child to reach into an unsanded crate is the one who finds out."
  },
  {
    category: "the reading corner",
    name: "Silent-sweep schoolhouse clock",
    query: "schoolhouse wall clock silent non ticking",
    reason: "The round black-rimmed schoolroom clock reads as period without any effort, and unlike the district-issued one it is legible from the back tables.",
    tip: "Confirm the movement is silent sweep rather than a stepping second hand. A tick is inaudible in a shop and unbearable in a quiet room during testing, and it is the most common complaint on every clock listing."
  },
  {
    category: "boards & display",
    name: "Kraft bulletin board paper roll",
    query: "kraft bulletin board paper roll 48 inch",
    reason: "Kraft or black backing makes everything pinned on top of it look intentional, and unlike colored paper it does not fade to a different shade by March under fluorescent light.",
    tip: "Check your building's wall-covering policy before buying by the roll. Many districts cap the percentage of wall area that may be covered with paper or fabric and prohibit hanging anything from the ceiling, and it is the fire marshal who enforces that rather than your principal."
  },
  {
    category: "boards & display",
    name: "Scalloped border trim",
    query: "scalloped bulletin board border trim",
    reason: "The scalloped edge is the detail that dates a bulletin board to the era the room is reaching for, and it covers the ragged paper edge that otherwise leaves a board looking unfinished.",
    tip: "Measure the perimeter of every board and add a third before ordering. Border comes in fixed pack lengths, running short mid-board is the usual outcome, and dye lots vary enough that a later pack may not match."
  },
  {
    category: "boards & display",
    name: "Clothespin and twine photo line",
    query: "mini wooden clothespins twine photo display",
    reason: "A strung line of photographs and student work costs almost nothing, changes weekly without new supplies, and fills the awkward wall space no poster fits.",
    tip: "Run it along a wall rather than across the room. This is one of the items the wall-coverage and ceiling rules cover, and anything strung overhead is the first thing a fire inspection flags."
  },
  {
    category: "objects with mileage",
    name: "Clamp-mount hand-crank pencil sharpener",
    query: "hand crank pencil sharpener clamp mount metal",
    reason: "The cast-metal crank sharpener is the loudest piece of nostalgia available and it genuinely outlasts the several electric sharpeners a classroom would otherwise go through.",
    tip: "Buy the clamp-mount version, not the wall-mount one. Wall units must be drilled into a solid surface, and most buildings will not let a teacher put holes in a wall without custodial approval, which leaves an unmountable object sitting in its box."
  },
  {
    category: "objects with mileage",
    name: "Vintage-style desk globe",
    query: "vintage style desk globe antique ocean",
    reason: "A globe with sepia oceans sits on a shelf as an object rather than a teaching tool, and it gives a corner a center that a flat poster cannot.",
    tip: "Decorative antique-style globes often keep mid-century borders to match the look. If it will be referenced in a lesson rather than only looked at, check the listing for a current political map instead."
  },
  {
    category: "objects with mileage",
    name: "Decorative metal storage tins",
    query: "vintage style metal storage tins set decorative",
    reason: "Open shelving reads as clutter until the small things live in matching containers, and lidded tins do that job while looking like part of the room rather than like supply storage.",
    tip: "Check the lids before committing to a set. A press-on lid a child cannot remove is the point in some cases and a daily frustration in others, so match the closure to whether children or only adults will be opening them."
  }
];
```

- [ ] **Step 4: Register the collection**

In `products.js`, add this import after the existing `holidayGifts` import:

```js
import { retroClassroomDecor } from "./guides/retro-classroom-decor.js";
```

and add this key to the `collections` object, after `"holiday-gifts": holidayGifts` (add a comma to that line):

```js
  "retro-classroom-decor": retroClassroomDecor
```

- [ ] **Step 5: Create the page**

Create `retro-classroom-decor.html`. Copy lines 27–50 of `elementary-classroom-essentials.html` verbatim for the skip link and site header, and lines 136–182 verbatim for the footer. The full file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>15 Retro Classroom Decor Ideas | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen retro classroom decor finds, from pull-down maps and schoolhouse clocks to bulletin board trim and a crank pencil sharpener."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/retro-classroom-decor"
    />
    <meta
      property="og:title"
      content="15 Retro Classroom Decor Finds That Warm Up a Cold Room"
    />
    <meta
      property="og:description"
      content="Walls, signage, the reading corner and display—the decor that gives a cinderblock room some character, and what to check first."
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
            <a href="/">Home</a><span>/</span><span>Teachers</span>
          </nav>
          <p class="eyebrow">Teachers</p>
          <h1>15 Retro Classroom Decor Finds That Warm Up a Cold Room</h1>
          <p class="lede">
            Most classrooms are a cinderblock box with a whiteboard bolted to
            one wall. This guide is about how the room feels rather than what it
            needs to function—the warmth the building does not supply and the
            supply catalog does not sell.
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
                A retro classroom is not a theme. It is a room that looks like
                someone chose the things in it—warm paper instead of bright
                plastic, a clock you can read from the back row, a map big
                enough to walk up to.
              </p>
              <p>
                So this list stays on the decorative side of the line.
                <strong
                  >Nothing here is storage, a timer or a laminator</strong
                >—those live in the classroom essentials guide, which also
                covers classroom lighting and the fire-code rules that govern
                it. Check your building's wall-covering policy before buying
                anything by the roll.
              </p>
            </div>
            <div
              class="product-grid"
              data-product-grid="retro-classroom-decor"
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
            ><a href="#item-1">Walls &amp; charts</a
            ><a href="#item-4">Signage &amp; letters</a
            ><a href="#item-7">The reading corner</a
            ><a href="#item-10">Boards &amp; display</a
            ><a href="#item-13">Objects with mileage</a
            ><a href="/elementary-classroom-essentials"
              >Classroom essentials guide</a
            ><a href="/pen-pal-starter-kit">Pen pal starter kit</a
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

In `vite.config.js`, add this line to `build.rollupOptions.input`, after `holiday: "holiday-gifts.html",`:

```js
        retroClassroom: "retro-classroom-decor.html",
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run build && npm run verify`

Expected: PASS, ending with:

```
verify-build OK: 8 guide(s), 120 cards, all anchor targets present
```

If `closeBundle` throws `collection "retro-classroom-decor" was never injected`, the `data-product-grid` attribute or the `vite.config.js` input line is wrong.

- [ ] **Step 8: Confirm no product collides with the classroom essentials guide**

Run:

```bash
node -e "import('./guides/retro-classroom-decor.js').then(async a => { const b = await import('./guides/elementary-classroom-essentials.js'); const set = new Set(b.classroomEssentials.map(i => i.query)); const hits = a.retroClassroomDecor.filter(i => set.has(i.query)); console.log(hits.length ? 'COLLISION: ' + hits.map(i => i.name).join(', ') : 'no query collisions'); })"
```

Expected: `no query collisions`. `verify-build` only catches a wholesale collection collision, so this check is manual and required.

- [ ] **Step 9: Commit**

```bash
git add guides/retro-classroom-decor.js retro-classroom-decor.html products.js vite.config.js scripts/verify-build.mjs
git commit -m "Add the retro classroom decor guide"
```

---

### Task 2: Pen pal starter kit guide

**Files:**
- Create: `guides/pen-pal-starter-kit.js`
- Create: `pen-pal-starter-kit.html`
- Modify: `products.js` (imports at top; `collections` object)
- Modify: `vite.config.js` (`build.rollupOptions.input`)
- Modify: `scripts/verify-build.mjs` (`GUIDES` array)
- Test: `scripts/verify-build.mjs` is the test — run via `npm run verify`

**Interfaces:**
- Consumes: `renderProductGrid(key)` and the `collections` map from `products.js`. Independent of Task 1 except that Task 1's decor page already links to `/pen-pal-starter-kit`, so this task resolves that link.
- Produces: named export `penPalStarterKit` (an `Array<{category: string, name: string, query: string, reason: string, tip: string}>` of length 15), and the collection key `"pen-pal-starter-kit"`.

- [ ] **Step 1: Write the failing test**

Add this entry to the `GUIDES` array in `scripts/verify-build.mjs`, after the `dist/retro-classroom-decor.html` entry added in Task 1 (add a trailing comma to that entry):

```js
  {
    file: "dist/pen-pal-starter-kit.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Starter fountain pen",
    links: ["/retro-classroom-decor", "/holiday-gifts"]
  }
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && npm run verify`

Expected: FAIL, exiting 1 with:

```
verify-build FAILED:
  - GUIDES has 9 entries but collections has 8 — a guide is registered but not checked, or checked but not registered.
```

- [ ] **Step 3: Create the data module**

Create `guides/pen-pal-starter-kit.js`:

```js
export const penPalStarterKit = [
  {
    category: "what you write on",
    name: "Fountain-pen-friendly writing pad",
    query: "fountain pen friendly writing pad a5 smooth paper",
    reason: "Ordinary copy paper feathers and bleeds under fountain ink, and a letter written on it looks worse than one written with a ballpoint — which is why paper comes first in this kit rather than the pen.",
    tip: "Look for smooth 80 to 100 gsm paper and a listing that mentions fountain pen use by name. This one choice decides whether the pen feels like an upgrade or a mistake, and pairing a good pen with copy paper is the usual reason beginners give up on them."
  },
  {
    category: "what you write on",
    name: "Airmail-style letter set",
    query: "airmail letter writing set stationery envelopes",
    reason: "The red-and-blue bordered airmail sheet is the format the whole hobby is built around, and the lightweight paper is the practical reason it exists — more pages fit inside one stamp's worth of weight.",
    tip: "Airmail paper is thin enough to show writing from the other side. Either write on one side only, or check the gsm and accept the show-through as part of the look."
  },
  {
    category: "what you write on",
    name: "Blank correspondence cards and envelopes",
    query: "blank correspondence cards envelopes flat note",
    reason: "Not every letter is four pages. A flat card carries a thank-you or a short note without the padding a full sheet demands, and it is what keeps a correspondence alive between the long letters.",
    tip: "Check the card and envelope dimensions against USPS minimums. Anything smaller than three and a half by five inches is undeliverable, and small note cards sit closer to that line than people expect."
  },
  {
    category: "what you write with",
    name: "Starter fountain pen",
    query: "beginner fountain pen fine nib converter",
    reason: "A fountain pen is the reason most people start writing letters instead of emails, and an entry-level steel nib writes well enough that there is no argument for spending more at the start.",
    tip: "Get a fine nib, and make sure the pen takes a converter rather than proprietary cartridges only. The converter is what lets it use bottled ink, and a cartridge-only pen strands you on whichever refills that brand keeps making."
  },
  {
    category: "what you write with",
    name: "Bottled fountain pen ink",
    query: "fountain pen bottled ink",
    reason: "Bottled ink is where the hobby opens up. It costs less per page than cartridges, and it is the only way to write in a color that is recognizably yours.",
    tip: "Only ink sold as fountain pen ink goes in a fountain pen. India ink, pigmented ink and calligraphy ink dry inside the feed and the pen is finished — this is not a difference in performance, it destroys the pen."
  },
  {
    category: "what you write with",
    name: "Archival fine-tip rollerballs",
    query: "archival ink fine tip rollerball pens black",
    reason: "Not every surface takes fountain ink. Envelopes, card stock and anything travelling through weather need a pen that will not smear, and archival ink is what keeps an address legible on arrival.",
    tip: "Look for pigment-based archival ink described as waterproof and fade-resistant. Standard gel ink runs if the envelope gets wet, which is exactly the moment the address matters most."
  },
  {
    category: "sealing & sending",
    name: "Wax seal kit",
    query: "wax seal stamp kit sealing wax beads spoon",
    reason: "The seal is the part of a letter the recipient remembers, and a kit with a stamp, a melting spoon and loose wax beads is the entire setup for the price of a few greeting cards.",
    tip: "A rigid seal makes the envelope non-machinable, so it needs the USPS non-machinable surcharge and hand-cancelling at the counter rather than a mailbox drop. Flexible glue-gun sealing wax survives sorting better than traditional brittle wax if you would rather not pay that every time."
  },
  {
    category: "sealing & sending",
    name: "Digital postal scale",
    query: "digital postal scale letter shipping",
    reason: "A letter with the wrong postage comes back, and by the time it does, the thing you wrote about has already happened. A scale removes the guessing for less than the cost of a few returned envelopes.",
    tip: "Look for a scale that reads in tenths of an ounce and holds the reading for a few seconds after you lift the letter off. One that reads only whole ounces cannot tell you which side of a rate boundary you are on, which is the entire job."
  },
  {
    category: "sealing & sending",
    name: "Self-inking return address stamp",
    query: "custom self inking return address stamp",
    reason: "The return address is the one thing written on every single envelope, and a stamp puts it there in a second in a form the post office can always read.",
    tip: "Proof the text yourself, character by character, before ordering. These are made to order and a typo is not returnable, and the abbreviations a vendor's template suggests are not always the ones USPS prefers."
  },
  {
    category: "what goes in the envelope",
    name: "Washi tape set",
    query: "washi tape set thin decorative",
    reason: "Washi tape is how a plain sheet becomes a decorated one with no craft skill involved, and it lifts off paper cleanly, which ordinary tape does not.",
    tip: "Thin rolls are more useful than wide ones for letters, since a wide tape eats the writing space on a page you are trying to fill. Check that it is genuine washi rather than printed plastic, which will not tear by hand."
  },
  {
    category: "what goes in the envelope",
    name: "Vintage ephemera and sticker pack",
    query: "vintage ephemera pack journaling stickers",
    reason: "The small things tucked inside the envelope are half of what makes a letter better than a message, and one ephemera pack supplies a year of them for the price of a single gift.",
    tip: "Watch the thickness of whatever goes in. Anything bulky or lumpy pushes the envelope past the flat-mail limit and into the non-machinable surcharge, which is the same rule that applies to wax seals."
  },
  {
    category: "what goes in the envelope",
    name: "Portable phone photo printer",
    query: "portable photo printer phone sticky back paper",
    reason: "A photograph in an envelope is the one enclosure no digital equivalent replaces, and a pocket printer produces one without a trip to a kiosk.",
    tip: "Check the cost per print and whether the paper is proprietary before buying the printer. The device price is rarely the real price, and some models take only sticky-back paper, which adds thickness to a letter you are trying to keep flat."
  },
  {
    category: "keeping it going",
    name: "Acid-free archival letter box",
    query: "archival letter storage box acid free lignin free",
    reason: "The letters accumulate, and the box they go into decides whether they are still readable in twenty years. This is the item people buy last and wish they had bought first.",
    tip: "The listing must say acid-free and lignin-free, not merely archival, which is unregulated as a marketing word. Ordinary cardboard yellows and embrittles the paper stored in it over years, which is the exact failure the box is meant to prevent."
  },
  {
    category: "keeping it going",
    name: "Hardcover address book",
    query: "hardcover address book alphabetical tabs",
    reason: "Correspondents move, and a written address book survives the phone upgrade that quietly loses a contact list — which is the failure that ends most pen pal relationships.",
    tip: "If you are writing to someone met through an online pen pal exchange rather than someone you already know, use a PO box or a mail forwarding address rather than your home address. A return address goes on every envelope you send, so it is worth deciding once rather than per letter."
  },
  {
    category: "keeping it going",
    name: "Portable lap desk",
    query: "lap desk portable writing surface",
    reason: "Letters get written in the chair, not at a desk, and having a hard surface within reach is the difference between writing one and meaning to.",
    tip: "Look for a rigid flat top rather than a cushioned one with a raised lip. Padding that conforms to your legs bends the writing surface, and a bent surface is what makes handwriting wander down the page."
  }
];
```

- [ ] **Step 4: Register the collection**

In `products.js`, add this import after the `retroClassroomDecor` import:

```js
import { penPalStarterKit } from "./guides/pen-pal-starter-kit.js";
```

and add this key to `collections`, after `"retro-classroom-decor": retroClassroomDecor` (add a comma to that line):

```js
  "pen-pal-starter-kit": penPalStarterKit
```

- [ ] **Step 5: Create the page**

Create `pen-pal-starter-kit.html`, using the same boilerplate sources as Task 1 — lines 27–50 and 136–182 of `elementary-classroom-essentials.html`, verbatim:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Ultimate Pen Pal Starter Kit | Bill's Workshop Finds</title>
    <meta
      name="description"
      content="Fifteen things worth owning to start writing letters—paper that takes fountain ink, a starter pen, a wax seal kit and archival storage."
    />
    <link
      rel="canonical"
      href="https://finds.billsworkshopcompany.com/pen-pal-starter-kit"
    />
    <meta
      property="og:title"
      content="The Ultimate Pen Pal Starter Kit: 15 Things Worth Owning"
    />
    <meta
      property="og:description"
      content="What to write on, what to write with, how to seal and send it, and how to keep the letters readable in twenty years."
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
            <a href="/">Home</a><span>/</span
            ><span>Writing &amp; stationery</span>
          </nav>
          <p class="eyebrow">Writing &amp; stationery</p>
          <h1>The Ultimate Pen Pal Starter Kit: 15 Things Worth Owning</h1>
          <p class="lede">
            Writing to someone you may never meet is a slow hobby with a
            surprisingly short list of requirements. Buy these roughly in
            order—paper first, pen second—and most of it lasts for years.
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
                Most pen pal kits sold as a bundle are a pen, some paper and a
                lot of packaging. The things that actually decide whether the
                habit survives are less obvious: paper that does not bleed, ink
                that will not destroy the pen, and enough postage on the
                envelope.
              </p>
              <p>
                So this list is ordered the way it should be bought.
                <strong>Paper comes before the pen</strong>, because a good pen
                on copy paper writes worse than a ballpoint—and sealing and
                sending gets its own group because a letter that comes back for
                postage is a letter that did not arrive.
              </p>
            </div>
            <div
              class="product-grid"
              data-product-grid="pen-pal-starter-kit"
            ></div>
            <aside class="related-callout" aria-label="Related Etsy gifts">
              <p class="eyebrow">Made for exactly this person</p>
              <h2>Original designs for people who write</h2>
              <p>
                Bill's Workshop Company creates designs for the people who do
                the work, including the ones who would rather send a letter than
                a message.
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
            ><a href="#item-1">What you write on</a
            ><a href="#item-4">What you write with</a
            ><a href="#item-7">Sealing &amp; sending</a
            ><a href="#item-10">What goes in the envelope</a
            ><a href="#item-13">Keeping it going</a
            ><a href="/retro-classroom-decor">Retro classroom decor guide</a
            ><a href="/holiday-gifts">Holiday gifts guide</a
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

In `vite.config.js`, add this line to `build.rollupOptions.input`, after `retroClassroom: "retro-classroom-decor.html",`:

```js
        penPal: "pen-pal-starter-kit.html",
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run build && npm run verify`

Expected: PASS, ending with:

```
verify-build OK: 9 guide(s), 135 cards, all anchor targets present
```

- [ ] **Step 8: Commit**

```bash
git add guides/pen-pal-starter-kit.js pen-pal-starter-kit.html products.js vite.config.js scripts/verify-build.mjs
git commit -m "Add the pen pal starter kit guide"
```

---

### Task 3: Link both guides into the site

**Files:**
- Modify: `scripts/verify-build.mjs` (add `links` to two existing `GUIDES` entries)
- Modify: `elementary-classroom-essentials.html` (TOC aside)
- Modify: `holiday-gifts.html` (TOC aside)
- Modify: `index.html:8` (meta description), `index.html:57` (hero button label), `index.html:128`–`196` (card grid)
- Modify: `public/sitemap.xml`
- Modify: `README.md` (Pages list)
- Test: `scripts/verify-build.mjs` is the test — run via `npm run verify`

**Interfaces:**
- Consumes: the routes `/retro-classroom-decor` and `/pen-pal-starter-kit`, which Tasks 1 and 2 created.
- Produces: nothing consumed by later tasks. This is the final task.

A guide that builds and verifies is still not reachable. This task pays the reachability checklist in `README.md`.

- [ ] **Step 1: Write the failing test**

In `scripts/verify-build.mjs`, add a `links` array to the **classroom essentials** entry, so it reads:

```js
  {
    file: "dist/elementary-classroom-essentials.html",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Rolling 10-drawer cart",
    links: ["/retro-classroom-decor", "/dog-lover-gifts"]
  },
```

and add `"/pen-pal-starter-kit"` to the existing `links` array on the **holiday gifts** entry, so that array reads:

```js
    links: [
      "/dog-lover-gifts",
      "/flight-attendant-travel-essentials",
      "/student-pilot-gifts",
      "/elementary-classroom-essentials",
      "/first-apartment-tools",
      "/pen-pal-starter-kit"
    ]
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && npm run verify`

Expected: FAIL, exiting 1 with exactly these two lines:

```
verify-build FAILED:
  - dist/elementary-classroom-essentials.html: expected an inline link to /retro-classroom-decor but it is missing
  - dist/holiday-gifts.html: expected an inline link to /pen-pal-starter-kit but it is missing
```

- [ ] **Step 3: Swap the classroom essentials TOC cross-link**

In `elementary-classroom-essentials.html`, inside the `<aside class="toc">` block, replace this line:

```html
            ><a href="/first-apartment-tools">First apartment tools guide</a
```

with:

```html
            ><a href="/retro-classroom-decor">Retro classroom decor guide</a
```

The `/dog-lover-gifts` line below it stays. This keeps the TOC at two cross-links plus "All guides". `/first-apartment-tools` keeps its inbound link from the first apartment guide's own TOC, so nothing is orphaned.

- [ ] **Step 4: Swap the holiday gifts TOC cross-link**

In `holiday-gifts.html`, inside the `<aside class="toc">` block, replace this line:

```html
            ><a href="/student-pilot-gifts">Student pilot gifts guide</a
```

with:

```html
            ><a href="/pen-pal-starter-kit">Pen pal starter kit</a
```

The `/dog-lover-gifts` line above it stays. `/student-pilot-gifts` remains linked from the body of this same page and from the travel essentials TOC, so its `links` assertion still passes and nothing is orphaned.

- [ ] **Step 5: Update the home page meta description**

In `index.html`, replace the `content` value on line 9:

```html
      content="Practical, carefully explained finds for travel, aviation, dog lovers, teachers and everyday life from Bill's Workshop Company."
```

with:

```html
      content="Practical, carefully explained finds for travel, aviation, dog lovers, teachers, letter writers and everyday life from Bill's Workshop Company."
```

- [ ] **Step 6: Correct the stale hero button label**

In `index.html` around line 57, replace:

```html
                >Read the newest guide <span aria-hidden="true">→</span></a
```

with:

```html
                >Back-to-school favorite <span aria-hidden="true">→</span></a
```

The `href` stays `/elementary-classroom-essentials` — do not change it. The old label was inaccurate because that guide stopped being the newest two guides ago.

- [ ] **Step 7: Add the two home page cards**

In `index.html`, inside `<div class="guide-card-grid">`, after the closing `</article>` of the Holiday Gifts card (around line 195) and before the `</div>` that closes the grid, insert:

```html
            <article class="guide-card">
              <p class="eyebrow">Teachers</p>
              <h3>15 Retro Classroom Decor Finds</h3>
              <p>
                Walls, signage, the reading corner and display—the decor that
                gives a cinderblock room some character, and the fire-code rule
                to check first.
              </p>
              <a class="button button-secondary" href="/retro-classroom-decor"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
            <article class="guide-card">
              <p class="eyebrow">Writing &amp; stationery</p>
              <h3>The Ultimate Pen Pal Starter Kit</h3>
              <p>
                What to write on, what to write with, how to seal and send it,
                and the one kind of ink that will destroy a fountain pen.
              </p>
              <a class="button button-secondary" href="/pen-pal-starter-kit"
                >Read the guide <span aria-hidden="true">→</span></a
              >
            </article>
```

This takes the grid from six cards to eight. The featured classroom essentials guide is deliberately not repeated as a grid card.

- [ ] **Step 8: Add both URLs to the sitemap**

In `public/sitemap.xml`, after the `holiday-gifts` line, insert:

```xml
  <url><loc>https://finds.billsworkshopcompany.com/retro-classroom-decor</loc></url>
  <url><loc>https://finds.billsworkshopcompany.com/pen-pal-starter-kit</loc></url>
```

- [ ] **Step 9: Add both guides to the README Pages list**

In `README.md`, after the `15 Holiday Gifts, Grouped by Who You're Buying For guide` line, insert:

```markdown
- 15 Retro Classroom Decor Finds That Warm Up a Cold Room guide
- The Ultimate Pen Pal Starter Kit: 15 Things Worth Owning guide
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm run build && npm run verify`

Expected: PASS, ending with:

```
verify-build OK: 9 guide(s), 135 cards, all anchor targets present
```

`html-validate` must also report no errors across all thirteen HTML pages.

- [ ] **Step 11: Confirm every internal link resolves**

Run:

```bash
node -e "const fs=require('fs');const files=fs.readdirSync('dist').filter(f=>f.endsWith('.html'));const pages=new Set(files.map(f=>'/'+f.replace(/\.html$/,'')));pages.add('/');const bad=[];for(const f of files){const html=fs.readFileSync('dist/'+f,'utf8');for(const m of html.matchAll(/href=\"(\/[^\"#?]*)/g)){const p=m[1].replace(/\/$/,'')||'/';if(!pages.has(p)&&!p.startsWith('/assets')&&p!=='/styles.css'&&p!=='/main.js'&&p!=='/sitemap.xml')bad.push(f+' -> '+m[1]);}}console.log(bad.length?'BROKEN:\n'+[...new Set(bad)].join('\n'):'all internal links resolve');"
```

Expected: `all internal links resolve`. This is what catches the Task 1 forward reference to `/pen-pal-starter-kit` if Task 2 was skipped or its filename was misspelled.

- [ ] **Step 12: Check the pages render in dev**

Run `npm run dev`, then open `http://localhost:5173/retro-classroom-decor` and `http://localhost:5173/pen-pal-starter-kit`.

Confirm on each: fifteen numbered cards, five category runs, the TOC anchors jump to items 1/4/7/10/13, and an Amazon button opens a search URL containing `tag=billsworkshop-20`. On the home page confirm eight cards in the grid and the hero button reading "Back-to-school favorite". Stop the dev server when done.

- [ ] **Step 13: Commit**

```bash
git add index.html elementary-classroom-essentials.html holiday-gifts.html public/sitemap.xml README.md scripts/verify-build.mjs
git commit -m "Link the retro decor and pen pal guides into the site"
```

- [ ] **Step 14: Push the branch**

```bash
git push -u origin retro-classroom-and-pen-pal
```

Stop here. Do not open a pull request and do not merge — the repository owner opens and merges their own PRs.

---

## Self-Review

Checked against `docs/superpowers/specs/2026-08-19-retro-classroom-decor-and-pen-pal-design.md`:

**Spec coverage.** Every "Design" subsection maps to a task. `guides/retro-classroom-decor.js` → Task 1 Step 3. `guides/pen-pal-starter-kit.js` → Task 2 Step 3. Both HTML pages → Tasks 1/2 Step 5, with the spec's exact titles, h1s and eyebrows. `products.js` → Tasks 1/2 Step 4. `vite.config.js` → Tasks 1/2 Step 6. `verify-build.mjs` → Tasks 1/2 Step 1 and Task 3 Step 1. `index.html` → Task 3 Steps 5–7, matching the spec's "two changes plus one explicit non-change" (the featured slot is untouched). TOC cross-links → Tasks 1/2 Step 5 for the new guides, Task 3 Steps 3–4 for the swaps. Footer → correctly absent, since the spec records it as a non-change. Sitemap and README → Task 3 Steps 8–9.

**Decision coverage.** Decision 1 (pure decor) is enforced by Task 1 Step 8's collision check and the Global Constraint banning lighting. Decision 2 (adult audience) shows in the item list and lede. Decisions 3 and 4 (15 items, 5×3, anchors on 1/4/7/10/13) are Global Constraints and are asserted by every `anchors` array. Decision 5 (classroom keeps the featured slot) appears as an explicit "do not change" in Task 3 Step 6 and Step 7. Decision 6 (label only, href unchanged) is Task 3 Step 6. Decision 7 (no new category card) produces no task, correctly — nothing to do. Decision 8 (grid lands at eight) is Task 3 Step 7.

**Placeholder scan.** No TBDs. Every code step carries the literal content to write. No "similar to Task N" — Task 2's page markup is repeated in full rather than referenced, since an executor may read tasks out of order. The two `<!-- lines 27-50 ... -->` comments are the one indirection, and each names an exact file and line range plus an explicit instruction to remove the comment.

**Type consistency.** Export names, collection keys, file paths and `data-product-grid` values are consistent across all three tasks: `retroClassroomDecor` / `"retro-classroom-decor"` / `retro-classroom-decor.html` / `retroClassroom`, and `penPalStarterKit` / `"pen-pal-starter-kit"` / `pen-pal-starter-kit.html` / `penPal`. Both `contains` strings — "Vintage pull-down map reproduction" and "Starter fountain pen" — match a `name` field verbatim in the corresponding data module.

**Arithmetic.** 9 guides × 15 cards = 135, matching the expected `verify-build OK` output in Task 2 Step 7 and Task 3 Step 10. The intermediate 8 guides × 15 = 120 in Task 1 Step 7 is likewise correct. Thirteen HTML pages = 4 static + 7 existing guides + 2 new.
