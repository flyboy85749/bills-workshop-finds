import { inject, track } from '@vercel/analytics';
import { SITE } from "./site.js";
import { trackAmazonClicks } from "./clicks.js";

// Vercel Web Analytics. This only reports anything once Web Analytics is
// enabled on the bills-workshop-finds project in the Vercel dashboard;
// until then the beacon script 404s and every pageview and event is lost.
inject();
trackAmazonClicks(document, track);

function hydrateLinks() {
  document.querySelectorAll("[data-etsy-link]").forEach(link => link.href = SITE.etsyShop);
  document.querySelectorAll("[data-tools-link]").forEach(link => link.href = SITE.digitalTools);
}

function setupNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");
  if (!button || !menu) return;
  button.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
}

hydrateLinks();
setupNavigation();
setYear();
