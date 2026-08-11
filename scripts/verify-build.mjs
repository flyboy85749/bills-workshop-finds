import { readFileSync } from "node:fs";

const AMAZON_TAG = "billsworkshop-20";

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

if (failures.length > 0) {
  console.error("verify-build FAILED:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`verify-build OK: ${GUIDES.length} guide(s), ${totalCards} cards, all anchor targets present`);
