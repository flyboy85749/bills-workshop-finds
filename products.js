import { SITE } from "./site.js";
import { travelEssentials } from "./guides/travel-essentials.js";
import { dogGifts } from "./guides/flight-attendant-dog-gifts.js";
import { classroomEssentials } from "./guides/elementary-classroom-essentials.js";
import { dogLoverGifts } from "./guides/dog-lover-gifts.js";
import { studentPilotGifts } from "./guides/student-pilot-gifts.js";
import { firstApartmentTools } from "./guides/first-apartment-tools.js";
import { holidayGifts } from "./guides/holiday-gifts.js";
import { retroClassroomDecor } from "./guides/retro-classroom-decor.js";
import { penPalStarterKit } from "./guides/pen-pal-starter-kit.js";
import { adventureTravelEssentials } from "./guides/adventure-travel-essentials.js";
import { cozyFallFinds } from "./guides/cozy-fall-finds.js";
import { whimsicalKitchenFinds } from "./guides/whimsical-kitchen-finds.js";
import { hotelRoomEssentials } from "./guides/hotel-room-essentials.js";
import { firstSoloFlightGifts } from "./guides/first-solo-flight-gifts.js";
import { checkridePrepGifts } from "./guides/checkride-prep-gifts.js";
import { newPrivatePilotGifts } from "./guides/new-private-pilot-gifts.js";

export const collections = {
  "travel-essentials": travelEssentials,
  "flight-attendant-dog-gifts": dogGifts,
  "elementary-classroom-essentials": classroomEssentials,
  "dog-lover-gifts": dogLoverGifts,
  "student-pilot-gifts": studentPilotGifts,
  "first-apartment-tools": firstApartmentTools,
  "holiday-gifts": holidayGifts,
  "retro-classroom-decor": retroClassroomDecor,
  "pen-pal-starter-kit": penPalStarterKit,
  "adventure-travel-essentials": adventureTravelEssentials,
  "cozy-fall-finds": cozyFallFinds,
  "whimsical-kitchen-finds": whimsicalKitchenFinds,
  "hotel-room-essentials": hotelRoomEssentials,
  "first-solo-flight-gifts": firstSoloFlightGifts,
  "checkride-prep-gifts": checkridePrepGifts,
  "new-private-pilot-gifts": newPrivatePilotGifts
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Amazon's price facet is expressed in cents on the rh (refinement) parameter:
// p_36:-4000 means "no lower bound, at most $40.00". Guides that make a price
// claim in their title set maxPrice per item so the link honors the claim.
export function amazonUrl(query, maxPrice) {
  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", query);
  if (maxPrice) url.searchParams.set("rh", `p_36:-${Math.round(maxPrice * 100)}`);
  if (SITE.amazonTag) url.searchParams.set("tag", SITE.amazonTag);
  return url.toString();
}

export function renderProductGrid(key) {
  const items = collections[key];
  if (!Array.isArray(items) || items.length === 0) {
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
      <a class="button button-primary" href="${escapeHtml(amazonUrl(item.query, item.maxPrice))}" target="_blank" rel="sponsored nofollow noopener" aria-label="See ${escapeHtml(item.name)} options on Amazon">See options on Amazon <span aria-hidden="true">↗</span></a>
    </article>
  `.trim()).join("");
}
