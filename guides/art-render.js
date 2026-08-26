import { guideArt } from "./art.js";

function lookup(slug) {
  const art = guideArt[slug];
  if (!art) {
    throw new Error(
      `art-render: unknown guide "${slug}". Registered keys: ${Object.keys(guideArt).join(", ")}.`
    );
  }
  return art;
}

// The hero. Named for screen readers, and the source of --accent for the page:
// CSS on .guide-art reads these custom properties and cascades them to the
// product-card badges, the TOC rule and the related callout.
export function renderGuideScene(slug) {
  const art = lookup(slug);
  return `<div class="guide-art" role="img" aria-label="${art.label}" style="--accent: ${art.accent}; --accent-soft: ${art.accentSoft}"><svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet">${art.scene}</svg></div>`;
}

// Home-page card art. Decorative: the card's own heading and link already name
// the guide, so labelling the art would make a screen reader say it twice.
export function renderGuideBadge(slug) {
  const art = lookup(slug);
  return `<div class="guide-badge" aria-hidden="true" style="--accent: ${art.accent}; --accent-soft: ${art.accentSoft}"><svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet">${art.badge}</svg></div>`;
}
