import { defineConfig } from "vite";
import { renderProductGrid } from "./products.js";

// The lookarounds matter: a plain \b would still match "data-product-grid-BROKEN"
// (a hyphen satisfies a word boundary), so a renamed or typo'd marker would slip
// through the closeBundle guard below — the exact failure it exists to catch.
const GRID_PATTERN = /(<div[^>]*(?<![-\w])data-product-grid(?![-\w])[^>]*>)(\s*)(<\/div>)/;

function prerenderProducts() {
  let injections = 0;

  return {
    name: "prerender-products",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (!GRID_PATTERN.test(html)) return html;
        injections += 1;
        return html.replace(
          GRID_PATTERN,
          (_match, open, _whitespace, close) => open + renderProductGrid() + close
        );
      }
    },
    closeBundle() {
      if (injections === 0) {
        throw new Error(
          "prerender-products: no [data-product-grid] container was found in any page. " +
          "The product grid would have shipped empty."
        );
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
        about: "about.html",
        disclosure: "affiliate-disclosure.html",
        privacy: "privacy.html"
      }
    }
  }
});
