import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "out");
const target = path.join(outputDir, "_routes.json");
const sitemap = path.join(outputDir, "sitemap.xml");
const staticSitemap = path.join(outputDir, "static-sitemap.xml");

const routes = {
  version: 1,
  include: ["/api/*", "/admin/*"],
  exclude: []
};

await mkdir(outputDir, { recursive: true });
await writeFile(target, `${JSON.stringify(routes, null, 2)}\n`, "utf8");
await copyFile(sitemap, staticSitemap);
console.log(`Wrote ${target}`);
console.log(`Wrote ${staticSitemap}`);
