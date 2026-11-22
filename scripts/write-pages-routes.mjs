import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "out");
const target = path.join(outputDir, "_routes.json");
const staleAdvancedWorker = path.join(outputDir, "_worker.js");
const sitemap = path.join(outputDir, "sitemap.xml");
const staticSitemap = path.join(outputDir, "static-sitemap.xml");
const textSitemap = path.join(outputDir, "sitemap.txt");

const routes = {
  version: 1,
  include: ["/api/*", "/admin/*", "/blog/*", "/sitemap.xml", "/naverae46c8baa59bdc23ffed2d8151b1cdef.html"],
  exclude: []
};

await mkdir(outputDir, { recursive: true });
await rm(staleAdvancedWorker, { force: true });
await writeFile(target, `${JSON.stringify(routes, null, 2)}\n`, "utf8");
await copyFile(sitemap, staticSitemap);
const sitemapXml = await readFile(sitemap, "utf8");
const sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
await writeFile(textSitemap, `${sitemapUrls.join("\n")}\n`, "utf8");

const staticBlogUrls = sitemapUrls.filter((url) => {
  try {
    const parsed = new URL(url);
    return parsed.pathname.startsWith("/blog/") && parsed.pathname !== "/blog/";
  } catch {
    return false;
  }
});

const missingBlogAssets = staticBlogUrls.filter((url) => {
  const slug = decodeURIComponent(new URL(url).pathname.replace(/^\/blog\//, "").replace(/\/$/, ""));
  return !slug || !existsSync(path.join(outputDir, "blog", `${slug}.html`));
});

if (missingBlogAssets.length > 0) {
  throw new Error(`정적 사이트맵에 HTML이 없는 블로그 URL이 있습니다: ${missingBlogAssets.join(", ")}`);
}

console.log(`Wrote ${target}`);
console.log(`Wrote ${staticSitemap}`);
console.log(`Wrote ${textSitemap}`);
