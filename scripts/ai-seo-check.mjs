import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "out", "calculators");
const reportPath = path.join(root, "docs", "ai-seo-check.md");
const siteUrl = "https://www.abacusbox.com";

if (!fs.existsSync(outputDir)) {
  console.error("out/calculators가 없습니다. 먼저 npm run build를 실행하세요.");
  process.exit(1);
}

const files = fs.readdirSync(outputDir)
  .filter((file) => file.endsWith(".html") && file !== "index.html")
  .sort();

function getAttribute(html, tag, attribute) {
  const match = html.match(new RegExp(`<${tag}[^>]*${attribute}="([^"]*)"`, "i"));
  return match?.[1] || "";
}

const results = files.map((file) => {
  const html = fs.readFileSync(path.join(outputDir, file), "utf8");
  const slug = file.replace(/\.html$/, "");
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || "";
  const description = getAttribute(html, "meta", 'name="description"[^>]*content');
  const canonical = getAttribute(html, "link", 'rel="canonical"[^>]*href');
  const hasH1 = /<h1(?:\s|>)/i.test(html);
  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
  const expectedCanonical = `${siteUrl}/calculators/${slug}`;
  const checks = {
    title: Boolean(title),
    description: description.length >= 40,
    canonical: canonical === expectedCanonical,
    h1: hasH1,
    indexable: !noindex
  };
  return { slug, checks, title, canonical, descriptionLength: description.length };
});

const failures = results.flatMap(({ slug, checks }) => Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([check]) => `${slug}: ${check}`));
const passed = results.reduce((total, result) => total + Object.values(result.checks).filter(Boolean).length, 0);

const report = `# 계산기 SEO 정적 검사

- 생성 시각: ${new Date().toISOString()}
- 검사 대상: \`out/calculators/*.html\` 실제 정적 빌드 결과
- 계산기 HTML 수: ${results.length}
- 결과: ${passed} PASS / ${failures.length} FAIL

## 검사 항목

- 고유 title 존재
- meta description 존재 및 40자 이상
- canonical이 \`${siteUrl}/calculators/{slug}\`와 일치
- H1 존재
- robots noindex 미설정

## 실패 항목

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "없음"}

## 참고

이 검사는 정적 HTML로 생성된 계산기만 대상으로 합니다. 외부 검색엔진의 실제 색인 여부, 검색 순위, CTR은 Search Console에서 별도로 확인해야 합니다.
`;

fs.writeFileSync(reportPath, report);
console.log(`계산기 SEO 검사: ${passed} PASS / ${failures.length} FAIL`);
console.log(`보고서 생성: ${path.relative(root, reportPath)}`);
if (failures.length > 0) process.exit(1);
