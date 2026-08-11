import { SITE } from "./site.js";
import { travelEssentials } from "./guides/travel-essentials.js";

export const collections = {
  "travel-essentials": travelEssentials
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function amazonUrl(query) {
  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", query);
  if (SITE.amazonTag) url.searchParams.set("tag", SITE.amazonTag);
  return url.toString();
}

export function renderProductGrid(key) {
  const items = collections[key];
  if (!items) {
    throw new Error(
      `renderProductGrid: unknown collection "${key}". Registered keys: ${Object.keys(collections).join(", ")}.`
    );
  }
  return items.map((item, index) => `
    <article class="product-card" id="item-${index + 1}" data-category="${escapeHtml(item.category)}">
      <span class="product-number" aria-hidden="true">${index + 1}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.reason)}</p>
      <p class="product-tip"><strong>What to look for:</strong> ${escapeHtml(item.tip)}</p>
      <a class="button button-primary" href="${escapeHtml(amazonUrl(item.query))}" target="_blank" rel="sponsored nofollow noopener" aria-label="See ${escapeHtml(item.name)} options on Amazon">See options on Amazon <span aria-hidden="true">↗</span></a>
    </article>
  `).join("");
}
