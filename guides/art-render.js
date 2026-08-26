import { guideArt, homeArt, categoryArt } from "./art.js";

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
//
// "slice" rather than "meet" because the home page's .featured-visual gives
// this scene a fixed-height panel to fill. On a guide page the box is sized
// from the viewBox's own 8:5 ratio, so the two behave identically there;
// object-fit could not do the cropping, since an inline SVG is not a
// replaced element.
export function renderGuideScene(slug) {
  const art = lookup(slug);
  return `<div class="guide-art" role="img" aria-label="${art.label}" style="--accent: ${art.accent}; --accent-soft: ${art.accentSoft}"><svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid slice">${art.scene}</svg></div>`;
}

// Home-page card art. Decorative: the card's own heading and link already name
// the guide, so labelling the art would make a screen reader say it twice.
export function renderGuideBadge(slug) {
  const art = lookup(slug);
  return `<div class="guide-badge" aria-hidden="true" style="--accent: ${art.accent}; --accent-soft: ${art.accentSoft}"><svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet">${art.badge}</svg></div>`;
}

// The home hero. Decorative: the <h1> beside it already carries the message.
export function renderHomeArt() {
  return `<div class="home-art" aria-hidden="true"><svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet">${homeArt}</svg></div>`;
}

// Category icons. Decorative — each sits above an <h3> that names its category.
export function renderCategoryIcon(name) {
  const icon = categoryArt[name];
  if (!icon) {
    throw new Error(
      `art-render: unknown category "${name}". Registered: ${Object.keys(categoryArt).join(", ")}.`
    );
  }
  return `<svg class="category-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${icon}</svg>`;
}
