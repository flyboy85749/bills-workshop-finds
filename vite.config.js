import { defineConfig } from "vite";
import { collections, renderProductGrid } from "./products.js";

// The lookarounds matter: a plain \b would still match "data-product-grid-BROKEN"
// (a hyphen satisfies a word boundary), so a renamed or typo'd marker would slip
// through the closeBundle guard below — the exact failure it exists to catch.
const GRID_PATTERN = /(<div[^>]*(?<![-\w])data-product-grid="([\w-]+)"[^>]*>)(\s*)(<\/div>)/g;

function prerenderProducts() {
  const injected = new Map();

  return {
    name: "prerender-products",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        // No .test() guard: GRID_PATTERN is global, so .test() would advance
        // lastIndex and desync the next page. .replace() is a no-op when nothing
        // matches, which is the same guard for free.
        return html.replace(GRID_PATTERN, (_match, open, key, _whitespace, close) => {
          injected.set(key, (injected.get(key) ?? 0) + 1);
          return open + renderProductGrid(key) + close;
        });
      }
    },
    closeBundle() {
      const problems = Object.keys(collections)
        .map(key => [key, injected.get(key) ?? 0])
        .filter(([, count]) => count !== 1)
        .map(([key, count]) =>
          count === 0
            ? `collection "${key}" was never injected — no page carries data-product-grid="${key}"`
            : `collection "${key}" was injected ${count} times, expected exactly 1`
        );

      if (problems.length > 0) {
        throw new Error(`prerender-products: ${problems.join("; ")}.`);
      }
    }
  };
}

export default defineConfig({
  appType: "mpa",
  plugins: [prerenderProducts()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        guide: "flight-attendant-travel-essentials.html",
        dogGifts: "flight-attendant-dog-gifts.html",
        about: "about.html",
        disclosure: "affiliate-disclosure.html",
        privacy: "privacy.html"
      }
    }
  }
});
