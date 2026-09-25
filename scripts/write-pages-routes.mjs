import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "out");
const target = path.join(outputDir, "_routes.json");
const sitemap = path.join(outputDir, "sitemap.xml");
const staticSitemap = path.join(outputDir, "static-sitemap.xml");
const textSitemap = path.join(outputDir, "sitemap.txt");

const routes = {
  version: 1,
  include: ["/api/*", "/admin/*"],
  exclude: []
};

await mkdir(outputDir, { recursive: true });
await writeFile(target, `${JSON.stringify(routes, null, 2)}\n`, "utf8");
await copyFile(sitemap, staticSitemap);
const sitemapXml = await readFile(sitemap, "utf8");
const sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
await writeFile(textSitemap, `${sitemapUrls.join("\n")}\n`, "utf8");
console.log(`Wrote ${target}`);
console.log(`Wrote ${staticSitemap}`);
console.log(`Wrote ${textSitemap}`);
