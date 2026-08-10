const SITE = {
  amazonTag: "",
  etsyShop: "https://www.etsy.com/shop/BillsWorkshopCompany",
  digitalTools: "https://billsworkshopcompany.com"
};

const essentials = [
  {
    category: "organization",
    name: "Compression packing cubes",
    query: "compression packing cubes travel set",
    reason: "They separate uniforms, layover clothes and undergarments while compressing bulky pieces into less space.",
    tip: "Choose mesh panels, sturdy double zippers and at least three useful sizes."
  },
  {
    category: "organization",
    name: "Airline-friendly underseat backpack",
    query: "airline approved underseat travel backpack personal item",
    reason: "A structured personal-item bag keeps essentials accessible without opening a roller bag during a quick connection.",
    tip: "Measure before buying; personal-item limits vary by airline and aircraft."
  },
  {
    category: "food",
    name: "Insulated crew lunch bag",
    query: "insulated flight crew lunch bag travel",
    reason: "Multiple compartments make it easier to carry meals, snacks and cold packs through a long duty day.",
    tip: "Look for wipe-clean lining, leak-resistant zippers and a luggage-handle sleeve."
  },
  {
    category: "electronics",
    name: "Compact portable charger",
    query: "compact portable charger power bank travel",
    reason: "It keeps a phone, earbuds and other small electronics working when outlets are occupied or inconvenient.",
    tip: "Check current airline rules for battery capacity and carry-on placement before flying."
  },
  {
    category: "electronics",
    name: "Cord and electronics organizer",
    query: "travel cable organizer bag electronics",
    reason: "A dedicated pouch prevents charging cables, adapters and small accessories from disappearing into the bottom of a bag.",
    tip: "Elastic loops and a contrasting interior make small pieces easier to spot."
  },
  {
    category: "clothing",
    name: "Compact travel steamer",
    query: "compact travel garment steamer dual voltage",
    reason: "A small steamer can refresh a uniform or layover outfit after it has spent hours folded inside luggage.",
    tip: "Confirm voltage compatibility for international trips; not every steamer is dual voltage."
  },
  {
    category: "organization",
    name: "Leak-resistant travel bottle set",
    query: "leak proof travel bottles toiletry set tsa",
    reason: "Refillable containers reduce bulk while keeping everyday toiletries organized for shorter trips.",
    tip: "Use labels and still place liquids in a sealed pouch in case pressure changes cause leaks."
  },
  {
    category: "comfort",
    name: "Graduated compression socks",
    query: "graduated compression socks travel women men",
    reason: "Many travelers like the supportive feel during long periods of standing or sitting.",
    tip: "Sizing and compression level matter; follow the manufacturer’s chart and seek medical advice if needed."
  },
  {
    category: "comfort",
    name: "Contoured sleep mask",
    query: "contoured blackout sleep mask travel",
    reason: "A light-blocking mask makes it easier to rest in bright hotel rooms or during permitted passenger travel.",
    tip: "A contoured design avoids pressing directly against the eyelids."
  },
  {
    category: "food",
    name: "Leak-resistant insulated bottle",
    query: "leak proof insulated water bottle travel slim",
    reason: "A slim reusable bottle helps keep water close without taking over the side pocket of a crew bag.",
    tip: "Prioritize a locking lid and a shape that fits standard cup holders."
  },
  {
    category: "organization",
    name: "Luggage cup holder",
    query: "luggage travel cup holder sleeve",
    reason: "It secures a drink or small item to a suitcase handle, freeing both hands while moving through the terminal.",
    tip: "Check that its opening fits your usual tumbler and your luggage-handle width."
  },
  {
    category: "organization",
    name: "Bluetooth luggage tracker and holder",
    query: "bluetooth luggage tracker tag holder travel",
    reason: "A tracker can help locate a bag or confirm whether it traveled with you when luggage goes astray.",
    tip: "Choose a tracker compatible with your phone and keep identifying information private."
  },
  {
    category: "documents",
    name: "RFID passport and document wallet",
    query: "RFID passport holder travel document wallet",
    reason: "One slim organizer keeps a passport, IDs, cards and travel documents together and easier to retrieve.",
    tip: "Avoid oversized wallets that become inconvenient at security checkpoints."
  },
  {
    category: "clothing",
    name: "Portable stain-remover pen",
    query: "portable stain remover pen travel clothing",
    reason: "It offers a quick response to coffee, makeup or meal spills before a stain has time to set into a uniform.",
    tip: "Test on an inconspicuous area and follow the garment care label."
  },
  {
    category: "organization",
    name: "Foldable extra tote",
    query: "foldable travel tote bag luggage sleeve",
    reason: "A packable tote provides backup space for groceries, a layover outing or items that need to stay separate.",
    tip: "A zip top and luggage sleeve make it more useful in busy terminals."
  }
];

function amazonUrl(query) {
  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", query);
  if (SITE.amazonTag) url.searchParams.set("tag", SITE.amazonTag);
  return url.toString();
}

function renderProducts() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;
  grid.innerHTML = essentials.map((item, index) => `
    <article class="product-card" id="item-${index + 1}" data-category="${item.category}">
      <span class="product-number" aria-hidden="true">${index + 1}</span>
      <h3>${item.name}</h3>
      <p>${item.reason}</p>
      <p class="product-tip"><strong>What to look for:</strong> ${item.tip}</p>
      <a class="button button-primary" href="${amazonUrl(item.query)}" target="_blank" rel="sponsored nofollow noopener" aria-label="See ${item.name} options on Amazon">See options on Amazon <span aria-hidden="true">↗</span></a>
    </article>
  `).join("");
}

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

renderProducts();
hydrateLinks();
setupNavigation();
setYear();
