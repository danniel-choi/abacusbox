import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "docs", "ai-preflight.md");
const protectedPatterns = [
  /^lib\/calculators\.ts$/,
  /^functions\/_lib\/scheduler\.js$/,
  /^functions\/api\/admin\//,
  /^functions\/api\/(contact|comments|reactions|blog|community)\//,
  /(^|\/)(migrations|wrangler\.toml|wrangler\.jsonc)(\/|$)/,
  /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/
];

function command(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const baseRef = process.env.AI_BASE_REF || "HEAD~1";
const committed = command(["diff", "--name-only", `${baseRef}...HEAD`]);
const staged = command(["diff", "--cached", "--name-only"]);
const working = command(["diff", "--name-only"]);
const untracked = command(["ls-files", "--others", "--exclude-standard"]);
const changedFiles = [...new Set([committed, staged, working, untracked]
  .flatMap((value) => value.split("\n"))
  .map((file) => file.trim())
  .filter(Boolean))].sort();
const protectedFiles = changedFiles.filter((file) => protectedPatterns.some((pattern) => pattern.test(file)) || (!file.endsWith(".example") && /(^|\/)(\.env|\.dev\.vars)/.test(file)));
const secretLikeFiles = changedFiles.filter((file) => !file.endsWith(".example") && /(^|\/)(\.env|\.dev\.vars)/.test(file));
const status = protectedFiles.length === 0 && secretLikeFiles.length === 0 ? "READY" : "REVIEW_REQUIRED";

const report = `# AI Preview 사전 검증

- 생성 시각: ${new Date().toISOString()}
- 기준 ref: ${baseRef}
- 상태: ${status}

## 변경 파일

${changedFiles.length ? changedFiles.map((file) => `- ${file}`).join("\n") : "- 없음"}

## 보호 경로 변경

${protectedFiles.length ? protectedFiles.map((file) => `- ${file}`).join("\n") : "없음"}

## 운영 원칙

- 보호 경로가 변경되면 사람의 검토 후에만 Preview 또는 운영 배포를 진행합니다.
- 환경변수와 Secret 파일은 커밋하지 않습니다.
- 이 검사는 배포 권한을 부여하거나 외부 계정 설정을 변경하지 않습니다.

## 권장 검증 순서

1. \`npm run typecheck\`
2. \`npm run lint\`
3. \`npm run build\`
4. \`npm run ai:audit\`
5. \`npm run ai:seo-check\`
6. \`git diff --check\`
`;

fs.writeFileSync(reportPath, report);
console.log(`AI Preview 사전 검증: ${status}`);
console.log(`변경 파일: ${changedFiles.length}개`);
if (protectedFiles.length) console.log(`보호 경로 검토 필요: ${protectedFiles.join(", ")}`);
console.log(`보고서 생성: ${path.relative(root, reportPath)}`);
if (status !== "READY") process.exit(1);
