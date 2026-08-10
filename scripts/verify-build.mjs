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
