import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
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
