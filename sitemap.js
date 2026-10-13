/*
  sitemap.xml, generated at build time from the pages the build produces.

  It used to be a hand-edited file in public/, and it fell behind: three
  aviation guides (first-solo-flight-gifts, checkride-prep-gifts,
  new-private-pilot-gifts) were built and deployed but never listed. Deriving
  it from vite.config.js's rollupOptions.input means a page cannot be built
  without being listed.

  No <lastmod>. The only dates available at build time are the build's own
  clock or file mtimes from a fresh clone, and both say "everything changed
  just now" on every deploy. Search engines learn to ignore a lastmod that is
  always new, and an absent one is honest. Add real dates per page here if
  pages ever carry an updated date of their own.
*/

/** The clean, extensionless URL path for a built HTML file. */
export function pagePath(file) {
  const name = file.replace(/^\.?\/*/, "").replace(/\.html$/, "");
  if (name.includes("/")) {
    throw new Error(`sitemap: "${file}" is in a subdirectory; pagePath only handles top-level pages`);
  }
  return name === "index" ? "/" : `/${name}`;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** The absolute URL a page is listed under — and must declare as its canonical. */
export function pageUrl(base, file) {
  return `${base.replace(/\/+$/, "")}${pagePath(file)}`;
}

/** sitemap.xml for these HTML files, in the order given, without duplicates. */
export function buildSitemapXml(base, files) {
  const urls = [...new Set(files.map(file => pageUrl(base, file)))];
  const entries = urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}
