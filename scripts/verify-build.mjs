import { readFileSync } from "node:fs";
import { collections } from "../products.js";
import { guideArt } from "../guides/art.js";

const AMAZON_TAG = "billsworkshop-20";

const GUIDES = [
  {
    file: "dist/flight-attendant-travel-essentials.html",
    slug: "travel-essentials",
    cards: 15,
    anchors: [1, 3, 4, 6, 8, 11],
    contains: "Compression packing cubes",
    links: ["/flight-attendant-hotel-room-essentials", "/student-pilot-gifts"]
  },
  {
    file: "dist/flight-attendant-dog-gifts.html",
    slug: "flight-attendant-dog-gifts",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Treat-tossing pet camera",
    links: ["/flight-attendant-hotel-room-essentials"]
  },
  {
    file: "dist/elementary-classroom-essentials.html",
    slug: "elementary-classroom-essentials",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Rolling 10-drawer cart",
    links: ["/retro-classroom-decor", "/dog-lover-gifts"]
  },
  {
    file: "dist/dog-lover-gifts.html",
    slug: "dog-lover-gifts",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Snuffle mat"
  },
  {
    file: "dist/student-pilot-gifts.html",
    slug: "student-pilot-gifts",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Non-polarized aviation sunglasses",
    links: [
      "/first-solo-flight-gifts",
      "/checkride-prep-gifts",
      "/new-private-pilot-gifts",
      "/flight-attendant-travel-essentials",
      "/adventure-travel-essentials"
    ]
  },
  {
    file: "dist/checkride-prep-gifts.html",
    slug: "checkride-prep-gifts",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Airman certification standards booklet",
    links: [
      "/student-pilot-gifts",
      "/first-solo-flight-gifts",
      "/new-private-pilot-gifts"
    ]
  },
  {
    file: "dist/new-private-pilot-gifts.html",
    slug: "new-private-pilot-gifts",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Aviation carbon monoxide detector",
    links: [
      "/checkride-prep-gifts",
      "/student-pilot-gifts",
      "/first-solo-flight-gifts"
    ]
  },
  {
    file: "dist/first-solo-flight-gifts.html",
    slug: "first-solo-flight-gifts",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Plain white shirt for the shirttail cut",
    links: [
      "/student-pilot-gifts",
      "/checkride-prep-gifts",
      "/new-private-pilot-gifts",
      "/holiday-gifts"
    ]
  },
  {
    file: "dist/first-apartment-tools.html",
    slug: "first-apartment-tools",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Flange plunger"
  },
  {
    file: "dist/holiday-gifts.html",
    slug: "holiday-gifts",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "First-solo shirttail display frame",
    links: [
      "/dog-lover-gifts",
      "/flight-attendant-travel-essentials",
      "/student-pilot-gifts",
      "/elementary-classroom-essentials",
      "/first-apartment-tools",
      "/pen-pal-starter-kit"
    ]
  },
  {
    file: "dist/retro-classroom-decor.html",
    slug: "retro-classroom-decor",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Vintage pull-down map reproduction",
    links: ["/elementary-classroom-essentials", "/pen-pal-starter-kit"]
  },
  {
    file: "dist/pen-pal-starter-kit.html",
    slug: "pen-pal-starter-kit",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Starter fountain pen",
    links: ["/retro-classroom-decor", "/holiday-gifts"]
  },
  {
    file: "dist/adventure-travel-essentials.html",
    slug: "adventure-travel-essentials",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Roll-top dry bag",
    links: ["/flight-attendant-travel-essentials", "/student-pilot-gifts"]
  },
  {
    file: "dist/cozy-fall-finds.html",
    slug: "cozy-fall-finds",
    cards: 10,
    anchors: [1, 4, 7, 9],
    contains: "Chunky knit throw blanket",
    links: ["/holiday-gifts", "/first-apartment-tools"],
    // The title promises "Under $40", so every link must carry Amazon's
    // price ceiling. Dropping a maxPrice would otherwise fail silently.
    pricedCards: { max: 40, count: 10 }
  },
  {
    file: "dist/whimsical-kitchen-finds.html",
    slug: "whimsical-kitchen-finds",
    cards: 7,
    anchors: [1, 4, 6],
    contains: "Nesting-doll measuring cups",
    links: ["/first-apartment-tools", "/cozy-fall-finds"]
  },
  {
    file: "dist/flight-attendant-hotel-room-essentials.html",
    slug: "hotel-room-essentials",
    cards: 15,
    anchors: [1, 4, 7, 10, 13],
    contains: "Travel door lock and alarm",
    links: ["/flight-attendant-travel-essentials", "/flight-attendant-dog-gifts"]
  }
];

const collectionKeys = Object.keys(collections).sort();
const artKeys = Object.keys(guideArt).sort();
const guideSlugs = GUIDES.map(g => g.slug).sort();

if (collectionKeys.join() !== artKeys.join()) {
  console.error(
    `verify-build FAILED:\n  - guideArt and collections disagree.\n    collections: ${collectionKeys.join(", ")}\n    guideArt:    ${artKeys.join(", ")}`
  );
  process.exit(1);
}

if (collectionKeys.join() !== guideSlugs.join()) {
  console.error(
    `verify-build FAILED:\n  - GUIDES slugs and collections disagree.\n    collections: ${collectionKeys.join(", ")}\n    GUIDES:      ${guideSlugs.join(", ")}`
  );
  process.exit(1);
}

const failures = [];
const signatures = new Map();
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

  if (guide.contains && !html.includes(guide.contains)) {
    fail(`expected to find "${guide.contains}" but it is missing`);
  }

  const art = guideArt[guide.slug];
  if (!html.includes(`aria-label="${art.label}"`)) {
    fail(`hero art is missing its aria-label "${art.label}"`);
  }
  const bodyTag = html.match(/<body[^>]*>/)?.[0] ?? "";
  if (!bodyTag.includes(`--accent: ${art.accent}`)) {
    fail(`<body> is missing "--accent: ${art.accent}" — the accent cannot cascade to the product badges, TOC rule or callout`);
  }
  if (!bodyTag.includes(`--accent-soft: ${art.accentSoft}`)) {
    fail(`<body> is missing "--accent-soft: ${art.accentSoft}"`);
  }
  if (count('class="guide-art"') !== 1) {
    fail(`expected exactly 1 hero art container, found ${count('class="guide-art"')}`);
  }

  if (guide.pricedCards) {
    const { max, count: expected } = guide.pricedCards;
    // renderProductGrid HTML-escapes the URL, so & arrives as &amp;.
    const priced = count(`rh=p_36%3A-${max * 100}&amp;`);
    if (priced !== expected) {
      fail(`expected ${expected} links capped at $${max}, found ${priced}`);
    }
  }

  for (const href of guide.links ?? []) {
    if (!html.includes(`href="${href}"`)) {
      fail(`expected an inline link to ${href} but it is missing`);
    }
  }

  if (/data-product-grid[^>]*>\s*<\/div>/.test(html)) {
    fail("the [data-product-grid] container shipped empty");
  }

  const queries = [...html.matchAll(/amazon\.com\/s\?k=([^&"]+)/g)].map(m => m[1]).sort().join("|");
  signatures.set(guide.file, queries);
}

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

const namesSeen = new Map();
for (const [key, items] of Object.entries(collections)) {
  for (const item of items) {
    if (!namesSeen.has(item.name)) namesSeen.set(item.name, []);
    namesSeen.get(item.name).push(key);
  }
}
for (const [name, keys] of namesSeen) {
  if (keys.length > 1) {
    failures.push(
      `product name "${name}" appears in ${keys.length} guides (${keys.join(", ")}) — rename one, or sanction the pair in its guide's spec and add it to an allowlist here`
    );
  }
}

// Every guide must reach the home page somehow -- as a card badge, or, for the
// featured guide, as the scene behind the featured block. A count of badges
// would miss a guide dropped from the page entirely whenever another gained a
// duplicate; asking per slug cannot. The marker attributes survive the build:
// the prerender plugin replaces element contents and keeps the opening tag.
let home;
try {
  home = readFileSync("dist/index.html", "utf8");
} catch {
  failures.push('dist/index.html: cannot read. Run "npm run build" first.');
  home = "";
}
if (home) {
  for (const guide of GUIDES) {
    const badged = home.includes(`data-guide-badge="${guide.slug}"`);
    const scened =
      home.includes(`data-guide-art="${guide.slug}"`) ||
      home.includes(`data-guide-scene-decorative="${guide.slug}"`);
    if (!badged && !scened) {
      failures.push(
        `dist/index.html: guide "${guide.slug}" is not represented on the home page — it needs either a card badge or the featured scene`
      );
    }
  }
}

if (failures.length > 0) {
  console.error("verify-build FAILED:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`verify-build OK: ${GUIDES.length} guide(s), ${totalCards} cards, all anchor targets present`);
