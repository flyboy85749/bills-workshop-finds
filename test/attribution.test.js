import { test } from "node:test";
import assert from "node:assert/strict";
import { SITE, TRACKING_IDS, PER_GUIDE_TRACKING, amazonTagFor } from "../site.js";
import { collections, amazonUrl, renderProductGrid } from "../products.js";
import { clickProperties, guideFromPath, trackAmazonClicks, CLICK_EVENT } from "../clicks.js";
import { buildSitemapXml, pagePath, pageUrl } from "../sitemap.js";

// --- tracking IDs -----------------------------------------------------------

test("every guide has a proposed tracking ID, and no ID names a missing guide", () => {
  assert.deepEqual(Object.keys(TRACKING_IDS).sort(), Object.keys(collections).sort());
});

test("tracking IDs are well-formed and unique", () => {
  const ids = Object.values(TRACKING_IDS);
  for (const id of ids) assert.match(id, /^[a-z0-9]+-20$/, id);
  assert.equal(new Set(ids).size, ids.length, "two guides share a tracking ID");
  assert.ok(!ids.includes(SITE.amazonTag), "a guide reuses the site-wide tag");
});

test("with per-guide tracking off, every guide uses the site-wide tag", () => {
  for (const key of Object.keys(collections)) {
    assert.equal(amazonTagFor(key, { perGuide: false }), SITE.amazonTag);
  }
});

test("with per-guide tracking on, each guide uses its own ID", () => {
  for (const [key, id] of Object.entries(TRACKING_IDS)) {
    assert.equal(amazonTagFor(key, { perGuide: true }), id);
  }
});

test("an unknown guide falls back to the site-wide tag rather than an empty one", () => {
  assert.equal(amazonTagFor("not-a-guide", { perGuide: true }), SITE.amazonTag);
});

test("rendered product links carry the live tag and click attributes", () => {
  const html = renderProductGrid("student-pilot-gifts");
  const tag = amazonTagFor("student-pilot-gifts");
  const cards = collections["student-pilot-gifts"].length;
  assert.equal(html.split(`tag=${tag}"`).length - 1, cards);
  assert.equal(html.split("data-amazon-item=").length - 1, cards);
  assert.match(html, /data-amazon-position="1"/);
  assert.match(html, new RegExp(`data-amazon-position="${cards}"`));
  // The flag is part of the contract this test documents.
  assert.equal(typeof PER_GUIDE_TRACKING, "boolean");
});

test("amazonUrl leaves the tag off entirely when given none", () => {
  assert.ok(!amazonUrl("pilot logbook").includes("tag="));
  assert.ok(amazonUrl("pilot logbook", undefined, "x-20").endsWith("tag=x-20"));
});

// --- click events -------------------------------------------------------------

test("guideFromPath reads clean and .html paths", () => {
  assert.equal(guideFromPath("/student-pilot-gifts"), "student-pilot-gifts");
  assert.equal(guideFromPath("/student-pilot-gifts.html"), "student-pilot-gifts");
  assert.equal(guideFromPath("/student-pilot-gifts/"), "student-pilot-gifts");
  assert.equal(guideFromPath("/"), "home");
});

test("a product button reports its item and position", () => {
  const props = clickProperties(
    "https://www.amazon.com/s?k=pilot+logbook&tag=billsworkshop-20",
    "/student-pilot-gifts",
    { amazonItem: "Paper pilot logbook", amazonPosition: "2" }
  );
  assert.deepEqual(props, {
    guide: "student-pilot-gifts",
    kind: "product",
    item: "Paper pilot logbook",
    position: 2
  });
});

test("a Shop-my-list shortlink reports as a list click named by its code", () => {
  assert.deepEqual(clickProperties("https://amzn.to/4iUUMF1", "/flight-attendant-travel-essentials"), {
    guide: "flight-attendant-travel-essentials",
    kind: "list",
    item: "4iUUMF1",
    position: null
  });
});

test("non-Amazon links and junk hrefs send nothing", () => {
  assert.equal(clickProperties("https://www.etsy.com/shop/BillsWorkshopCompany", "/"), null);
  assert.equal(clickProperties("https://billsworkshopcompany.com", "/"), null);
  assert.equal(clickProperties("https://amazon.com.evil.example/", "/"), null);
  assert.equal(clickProperties("not a url", "/"), null);
});

/** Just enough of the DOM for the delegated listener. */
function fakeDocument(pathname) {
  globalThis.Element ??= class Element {};
  const listeners = {};
  return {
    location: { pathname },
    addEventListener: (type, fn) => (listeners[type] = fn),
    fire(type, link, extra = {}) {
      const target = Object.assign(new globalThis.Element(), { closest: () => link });
      listeners[type]({ type, target, button: 0, ...extra });
    }
  };
}

test("trackAmazonClicks sends one event per Amazon click, including middle-clicks", () => {
  const sent = [];
  const doc = fakeDocument("/holiday-gifts");
  trackAmazonClicks(doc, (name, props) => sent.push([name, props]));

  const product = { href: "https://www.amazon.com/s?k=x", dataset: { amazonItem: "X", amazonPosition: "3" } };
  doc.fire("click", product);
  doc.fire("auxclick", product, { button: 1 });
  doc.fire("auxclick", product, { button: 2 }); // right-click: context menu, not a visit
  doc.fire("click", { href: "https://www.etsy.com/", dataset: {} });
  doc.fire("click", null); // clicked something that is not inside a link

  assert.equal(sent.length, 2);
  for (const [name, props] of sent) {
    assert.equal(name, CLICK_EVENT);
    assert.deepEqual(props, { guide: "holiday-gifts", kind: "product", item: "X", position: 3 });
  }
});

// --- sitemap ------------------------------------------------------------------

test("pagePath maps built files to clean URLs", () => {
  assert.equal(pagePath("index.html"), "/");
  assert.equal(pagePath("about.html"), "/about");
  assert.equal(pagePath("./checkride-prep-gifts.html"), "/checkride-prep-gifts");
  assert.throws(() => pagePath("guides/x.html"), /subdirectory/);
});

test("pageUrl tolerates a trailing slash on the base", () => {
  assert.equal(pageUrl("https://e.com/", "about.html"), "https://e.com/about");
  assert.equal(pageUrl("https://e.com", "index.html"), "https://e.com/");
});

test("buildSitemapXml lists each page once, in order, with no lastmod", () => {
  const xml = buildSitemapXml("https://e.com", ["index.html", "a.html", "b.html", "a.html"]);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(locs, ["https://e.com/", "https://e.com/a", "https://e.com/b"]);
  assert.ok(!xml.includes("<lastmod>"));
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
});

test("buildSitemapXml escapes XML special characters", () => {
  assert.match(buildSitemapXml("https://e.com", ["a&b.html"]), /<loc>https:\/\/e.com\/a&amp;b<\/loc>/);
});
