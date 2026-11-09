import { getD1Binding } from "./_lib/http.js";

const SITE_URL = "https://www.abacusbox.com";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractStaticUrls(xml) {
  return Array.from(String(xml || "").matchAll(/<url>([\s\S]*?)<\/url>/g), (match) => {
    const block = match[1];
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim();
    return loc ? { loc, lastmod: lastmod || null } : null;
  }).filter(Boolean);
}

async function loadStaticEntries(context) {
  if (!context.env.ASSETS) return [{ loc: SITE_URL, lastmod: null }];

  const assetUrl = new URL("/static-sitemap.xml", context.request.url);
  const response = await context.env.ASSETS.fetch(new Request(assetUrl));
  if (!response.ok) return [{ loc: SITE_URL, lastmod: null }];

  return extractStaticUrls(await response.text());
}

async function loadDatabaseEntries(env) {
  const db = getD1Binding(env);
  if (!db) return [];

  const result = await db.prepare(`
    SELECT slug, published_at, updated_at
    FROM posts
    WHERE type = 'blog'
      AND status = 'published'
      AND slug IS NOT NULL
    ORDER BY datetime(COALESCE(updated_at, published_at)) DESC, id DESC
  `).all();

  return (result.results || []).map((post) => ({
    loc: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
    lastmod: post.updated_at || post.published_at || null
  }));
}

function renderSitemap(entries) {
  const unique = new Map();
  for (const entry of entries) {
    if (!unique.has(entry.loc)) unique.set(entry.loc, entry);
  }

  const urls = Array.from(unique.values()).map(({ loc, lastmod }) => [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
    "  </url>"
  ].filter(Boolean).join("\n"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls.join("\n"),
    "</urlset>",
    ""
  ].join("\n");
}

export async function onRequestGet(context) {
  const staticEntries = await loadStaticEntries(context);
  let databaseEntries = [];

  try {
    databaseEntries = await loadDatabaseEntries(context.env);
  } catch {
    // Keep the build-time sitemap available while D1 is unavailable or migrating.
  }

  return new Response(renderSitemap([...staticEntries, ...databaseEntries]), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600"
    }
  });
}

