import { SITE } from "./site.js";

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
