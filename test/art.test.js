import { test } from "node:test";
import assert from "node:assert/strict";
import { guideArt } from "../guides/art.js";
import { renderGuideScene, renderGuideBadge } from "../guides/art-render.js";
import { collections } from "../products.js";

const SLUG = "cozy-fall-finds";

test("every registry entry has the five required fields", () => {
  for (const [slug, art] of Object.entries(guideArt)) {
    for (const field of ["accent", "accentSoft", "label", "scene", "badge"]) {
      assert.ok(art[field], `${slug} is missing "${field}"`);
    }
  }
});

test("accents are six-digit hex", () => {
  for (const [slug, art] of Object.entries(guideArt)) {
    assert.match(art.accent, /^#[0-9a-f]{6}$/, `${slug}.accent`);
    assert.match(art.accentSoft, /^#[0-9a-f]{6}$/, `${slug}.accentSoft`);
  }
});

test("every registry key is a real guide", () => {
  for (const slug of Object.keys(guideArt)) {
    assert.ok(collections[slug], `"${slug}" has art but no product collection`);
  }
});

test("scene carries its accessible name and accent custom properties", () => {
  const html = renderGuideScene(SLUG);
  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="[^"]+"/);
  assert.ok(html.includes(guideArt[SLUG].accent), "accent not emitted");
  assert.ok(html.includes(guideArt[SLUG].accentSoft), "accentSoft not emitted");
});

test("badge is decorative, never labelled", () => {
  const html = renderGuideBadge(SLUG);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /focusable="false"/);
  assert.doesNotMatch(html, /role="img"/);
  assert.doesNotMatch(html, /aria-label=/);
});

test("labels are quote-safe, since they land in an HTML attribute", () => {
  for (const [slug, art] of Object.entries(guideArt)) {
    assert.doesNotMatch(art.label, /["<>&]/, `${slug}.label needs escaping`);
  }
});

test("an unknown slug throws rather than rendering nothing", () => {
  assert.throws(() => renderGuideScene("no-such-guide"), /no-such-guide/);
  assert.throws(() => renderGuideBadge("no-such-guide"), /no-such-guide/);
});
