import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outputPath = path.join(root, "docs", "ai-site-audit.md");
const baseUrl = process.argv.find((value) => value.startsWith("--base-url="))?.split("=").slice(1).join("=") || "";

async function read(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}

function status(ok, label, detail) {
  return { ok, label, detail };
}

async function checkUrl(relativePath, label) {
  if (!baseUrl) return status(null, label, "외부 URL 미지정으로 미검증");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${relativePath}`, { signal: controller.signal, redirect: "follow" });
    return status(response.ok, label, `${response.status} ${response.url}`);
  } catch (error) {
    return status(null, label, `접속 확인 실패로 수동 확인 필요: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    clearTimeout(timer);
  }
}

const packageJson = JSON.parse(await read("package.json") || "{}");
const sitemapSource = await read("app/sitemap.ts");
const sitemapFunction = await read("functions/sitemap.xml.js");
const robotsSource = await read("app/robots.ts");
const layoutSource = await read("app/layout.tsx");
const homeSource = await read("app/page.tsx");
const generatedSitemap = await read("out/sitemap.xml");

const checks = [
  status(Boolean(packageJson.scripts?.build && packageJson.scripts?.typecheck && packageJson.scripts?.lint), "검증 명령", "build·typecheck·lint 스크립트 존재 여부"),
  status(sitemapSource.includes("export default function sitemap"), "정적 sitemap 소스", "app/sitemap.ts 확인"),
  status(sitemapSource && !sitemapSource.includes("lastModified"), "정적 sitemap 날짜", sitemapSource.includes("lastModified") ? "lastModified가 남아 있음" : "lastmod 자동 생성 없음"),
  status(sitemapFunction && !sitemapFunction.includes("lastmod"), "동적 sitemap 날짜", sitemapFunction.includes("lastmod") ? "동적 함수에 lastmod 참조가 남아 있음" : "동적 lastmod 출력 없음"),
  status(robotsSource.includes("/sitemap.xml"), "robots sitemap 연결", "robots.ts의 sitemap 경로 확인"),
  status(layoutSource.includes('index: true') && layoutSource.includes('follow: true'), "기본 robots 정책", "layout.tsx index/follow 확인"),
  status(/<h1[\s>]/.test(homeSource), "홈페이지 H1", "app/page.tsx의 H1 존재 여부"),
  status(homeSource.includes("/calculators") && homeSource.includes("/toolbox"), "홈페이지 내부 링크", "계산기·웹툴 링크 확인"),
  status(generatedSitemap ? !generatedSitemap.includes("<lastmod>") : null, "빌드 sitemap 결과", generatedSitemap ? "out/sitemap.xml 확인" : "빌드 산출물 없음")
];

const urlChecks = await Promise.all([
  checkUrl("/", "홈페이지 응답"),
  checkUrl("/robots.txt", "robots.txt 응답"),
  checkUrl("/sitemap.xml", "sitemap.xml 응답")
]);

const formatStatus = (value) => value === true ? "PASS" : value === false ? "FAIL" : "MANUAL";
const generatedAt = new Date().toISOString();
const passCount = checks.filter((item) => item.ok === true).length;
const failCount = checks.filter((item) => item.ok === false).length;

const report = `# AI 사이트 감사 보고서

- 생성 시각: ${generatedAt}
- 감사 방식: 로컬 소스·빌드 산출물 기반 읽기 전용 점검
- 외부 데이터: ${baseUrl ? `${baseUrl} 응답 점검 포함` : "Search Console·Analytics·AdSense API 권한 미연결로 미검증"}
- 결과: ${passCount} PASS / ${failCount} FAIL / ${checks.length - passCount - failCount} MANUAL

## 점검 결과

| 상태 | 항목 | 확인 내용 |
| --- | --- | --- |
${checks.map((item) => `| ${formatStatus(item.ok)} | ${item.label} | ${item.detail} |`).join("\n")}

## 외부 URL 점검

| 상태 | 항목 | 결과 |
| --- | --- | --- |
${urlChecks.map((item) => `| ${formatStatus(item.ok)} | ${item.label} | ${item.detail} |`).join("\n")}

## AI 에이전트 다음 작업 후보

1. Search Console API 권한 연결 후 색인 제외 URL과 검색 CTR을 실제 데이터로 수집합니다.
2. Analytics·AdSense API 권한 연결 후 랜딩 페이지, 계산 완료, 페이지 RPM을 분리합니다.
3. 영향 범위가 작은 title·description·내부 링크 개선안을 Git 브랜치로 생성합니다.
4. 계산 공식·법률 기준·광고 설정은 자동 배포 금지 목록으로 유지합니다.
5. typecheck·lint·build와 계산 회귀 테스트를 통과한 변경만 Preview 배포합니다.

## 안전 정책

- 이 보고서는 코드를 수정하거나 외부 계정 설정을 변경하지 않습니다.
- 외부 검색·수익 수치가 없으면 추정값을 생성하지 않습니다.
- 운영 배포는 사람이 승인한 변경 또는 명시적인 배포 작업만 허용합니다.
`;

await writeFile(outputPath, report, "utf8");
console.log(`Wrote ${path.relative(root, outputPath)}`);
console.log(`Result: ${passCount} PASS / ${failCount} FAIL / ${checks.length - passCount - failCount} MANUAL`);
