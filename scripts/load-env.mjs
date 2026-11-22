import fs from "node:fs";
import path from "node:path";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, name, rawValue] = match;
    if (process.env[name] !== undefined) continue;
    let combinedValue = rawValue;
    if (name === "GOOGLE_SERVICE_ACCOUNT_JSON" && combinedValue.trimStart().startsWith("{") && !combinedValue.trimEnd().endsWith("}")) {
      while (index + 1 < lines.length) {
        index += 1;
        combinedValue += `\n${lines[index]}`;
        if (lines[index].trimEnd().endsWith("}")) break;
      }
    }
    const value = combinedValue.replace(/^(['"])(.*)\1$/, "$2");
    process.env[name] = value;
  }
}

export function loadLocalEnv(root = process.cwd()) {
  parseEnvFile(path.join(root, ".env"));
  parseEnvFile(path.join(root, ".env.local"));
  parseEnvFile(path.join(root, ".dev.vars"));
}
