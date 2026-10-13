/*
  Outbound Amazon click events.

  Pageviews say which guides get read. Clicks say which guides send people to
  Amazon, and that ratio is what separates "this guide needs traffic" from
  "this guide gets traffic and nobody acts on it". Amazon's own reports can
  only show what happened after the click.

  Sent as one Vercel Web Analytics custom event, "Amazon click", so the
  dashboard can break it down by any property below.
*/

export const CLICK_EVENT = "Amazon click";

const AMAZON_HOSTS = new Set(["amazon.com", "www.amazon.com", "amzn.to", "www.amzn.to"]);
const SHORTLINK_HOSTS = new Set(["amzn.to", "www.amzn.to"]);

/**
 * The guide a page belongs to, from its clean URL path.
 * "/student-pilot-gifts" → "student-pilot-gifts", "/" → "home".
 */
export function guideFromPath(pathname) {
  const slug = pathname.replace(/\.html$/, "").replace(/^\/+|\/+$/g, "");
  return slug || "home";
}

/**
 * Event properties for a click on `href`, or null when it is not an Amazon
 * link and nothing should be sent.
 *
 * `dataset` is the link's data-* attributes. Product buttons carry
 * data-amazon-item and data-amazon-position (set in renderProductGrid); the
 * hand-written "Shop my list" shortlinks carry neither and are recorded as
 * a list click.
 */
export function clickProperties(href, pathname, dataset = {}) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!AMAZON_HOSTS.has(url.hostname)) return null;

  const guide = guideFromPath(pathname);

  if (dataset.amazonItem !== undefined) {
    const position = Number(dataset.amazonPosition);
    return {
      guide,
      kind: "product",
      item: dataset.amazonItem,
      position: Number.isInteger(position) ? position : null
    };
  }

  // A shortlink's code is the only stable name a list has, and it is what
  // Amazon's link reports show too.
  const item = SHORTLINK_HOSTS.has(url.hostname) ? url.pathname.slice(1) : "other";
  return { guide, kind: "list", item, position: null };
}

/**
 * Wire one delegated listener to the document.
 *
 * `auxclick` covers a middle-click into a new tab, which a plain `click`
 * listener never sees; that is a common way to open a product from a list.
 * Each link opens in a new tab already, so this page is still alive to send
 * the event and nothing needs to delay navigation.
 */
export function trackAmazonClicks(doc, track) {
  const handler = event => {
    if (event.type === "auxclick" && event.button !== 1) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link) return;
    const properties = clickProperties(link.href, doc.location.pathname, link.dataset);
    if (properties) track(CLICK_EVENT, properties);
  };
  doc.addEventListener("click", handler);
  doc.addEventListener("auxclick", handler);
}
