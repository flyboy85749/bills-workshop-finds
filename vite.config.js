import { defineConfig } from "vite";
import { collections, renderProductGrid } from "./products.js";
import { guideArt } from "./guides/art.js";
import {
  renderGuideScene,
  renderGuideBadge,
  renderHomeArt,
  renderCategoryIcon
} from "./guides/art-render.js";

// The leading lookbehind guards against a prefixed attribute such as
// data-x-data-product-grid="k" being mistaken for the real marker.
const markerPattern = attribute =>
  new RegExp(`(<div[^>]*(?<![-\\w])${attribute}="([\\w-]+)"[^>]*>)(\\s*)(<\\/div>)`, "g");

const GRID_PATTERN = markerPattern("data-product-grid");
const SCENE_PATTERN = markerPattern("data-guide-art");
const SCENE_DECORATIVE_PATTERN = markerPattern("data-guide-scene-decorative");
const BADGE_PATTERN = markerPattern("data-guide-badge");
const HOME_PATTERN = markerPattern("data-home-art");
const ICON_PATTERN = markerPattern("data-category-icon");

function prerenderProducts() {
  const injected = new Map();
  const scenes = new Map();
  const badges = new Map();

  const bump = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);

  return {
    name: "prerender-products",
    buildStart() {
      injected.clear();
      scenes.clear();
      badges.clear();
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        // No .test() guard: the patterns are global, so .test() would advance
        // lastIndex and desync the next page. .replace() is a no-op when
        // nothing matches, which is the same guard for free.
        return html
          .replace(GRID_PATTERN, (_m, open, key, _ws, close) => {
            bump(injected, key);
            return open + renderProductGrid(key) + close;
          })
          .replace(SCENE_PATTERN, (_m, open, key, _ws, close) => {
            bump(scenes, key);
            return open + renderGuideScene(key) + close;
          })
          .replace(SCENE_DECORATIVE_PATTERN, (_m, open, key, _ws, close) => {
            bump(scenes, key);
            return open + renderGuideScene(key, { decorative: true }) + close;
          })
          .replace(BADGE_PATTERN, (_m, open, key, _ws, close) => {
            bump(badges, key);
            return open + renderGuideBadge(key) + close;
          })
          .replace(HOME_PATTERN, (_m, open, _key, _ws, close) =>
            open + renderHomeArt() + close
          )
          .replace(ICON_PATTERN, (_m, open, key, _ws, close) =>
            open + renderCategoryIcon(key) + close
          );
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

      // Scenes are "at least once": the home page's featured block reuses one
      // guide's scene, so a scene can legitimately appear twice. Badges are
      // "at most once" for the mirror-image reason -- the guide that carries
      // that featured scene needs no card badge, while the same guide showing
      // as two cards is still a real bug.
      //
      // Neither bound proves a guide reached the home page, because this
      // plugin only counts injections and cannot see which page each landed
      // on. That completeness check lives in verify-build.mjs, which reads the
      // built dist/index.html and asks per slug whether it is represented.
      for (const key of Object.keys(guideArt)) {
        if ((scenes.get(key) ?? 0) < 1) {
          problems.push(
            `art "${key}" has a scene that was never injected — no page carries data-guide-art="${key}" or data-guide-scene-decorative="${key}"`
          );
        }
        const badgeCount = badges.get(key) ?? 0;
        if (badgeCount > 1) {
          problems.push(
            `art "${key}" was injected as a badge ${badgeCount} times, expected at most 1`
          );
        }
      }

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
        classroom: "elementary-classroom-essentials.html",
        dogLovers: "dog-lover-gifts.html",
        studentPilots: "student-pilot-gifts.html",
        firstApartment: "first-apartment-tools.html",
        holiday: "holiday-gifts.html",
        retroClassroom: "retro-classroom-decor.html",
        penPal: "pen-pal-starter-kit.html",
        adventure: "adventure-travel-essentials.html",
        cozyFall: "cozy-fall-finds.html",
        whimsicalKitchen: "whimsical-kitchen-finds.html",
        about: "about.html",
        disclosure: "affiliate-disclosure.html",
        privacy: "privacy.html"
      }
    }
  }
});
