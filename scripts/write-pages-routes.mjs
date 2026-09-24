import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "out");
const target = path.join(outputDir, "_routes.json");

const routes = {
  version: 1,
  include: ["/api/*", "/admin/*"],
  exclude: []
};

await mkdir(outputDir, { recursive: true });
await writeFile(target, `${JSON.stringify(routes, null, 2)}\n`, "utf8");
console.log(`Wrote ${target}`);
