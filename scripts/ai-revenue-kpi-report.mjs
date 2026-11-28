import fs from "node:fs";
import path from "node:path";

const reportDir = path.join(process.cwd(), ".ai-reports");
const snapshotPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : fs.readdirSync(reportDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^google-data-\d{4}-\d{2}-\d{2}\.json$/.test(entry.name))
    .map((entry) => path.join(reportDir, entry.name))
    .sort()
    .at(-1);

if (!snapshotPath || !fs.existsSync(snapshotPath)) {
  throw new Error("Google 데이터 스냅샷을 찾을 수 없습니다.");
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const dateCode = new Date(snapshot.generatedAt || Date.now()).toISOString().slice(0, 10);
const outputPath = path.join(reportDir, `revenue-kpi-${dateCode}.md`);

function value(value, suffix = "") {
  return value === null || value === undefined || value === "" ? "미확인" : `${value}${suffix}`;
}

function number(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function list(items, render) {
  return items?.length ? items.map(render).join("\n") : "- 미확인";
}

const search = snapshot.searchConsole;
const ga4 = snapshot.ga4;
const adsense = snapshot.adsense;
const adsenseReport = adsense?.report;
const inspection = snapshot.urlInspection?.items || [];
const indexIssues = inspection.filter((item) => item.verdict !== "PASS");

const markdown = `# AbacusBox 수익화 KPI 자동 보고서

- 생성 시각: ${value(snapshot.generatedAt)}
- 검색·분석 기간: ${value(snapshot.dateRange?.startDate)} ~ ${value(snapshot.dateRange?.endDate)}
- 원본: 읽기 전용 Google 데이터 스냅샷

## 핵심 지표

| 영역 | 실제 확인값 |
| --- | ---: |
| Search Console 클릭 | ${value(search?.totals?.clicks !== undefined ? number(search.totals.clicks) : null)} |
| Search Console 노출 | ${value(search?.totals?.impressions !== undefined ? number(search.totals.impressions) : null)} |
| GA4 세션 | ${value(ga4?.totals?.sessions !== undefined ? number(ga4.totals.sessions) : null)} |
| GA4 활성 사용자 | ${value(ga4?.totals?.activeUsers !== undefined ? number(ga4.totals.activeUsers) : null)} |
| GA4 페이지 조회 | ${value(ga4?.totals?.screenPageViews !== undefined ? number(ga4.totals.screenPageViews) : null)} |
| AdSense 계정 응답 | ${value(adsense?.accounts !== undefined ? number(adsense.accounts) : null)}개 |
| AdSense 보고서 상태 | ${value(adsenseReport?.status)} |
| AdSense 예상 수입 | ${value(adsenseReport?.totals?.ESTIMATED_EARNINGS, " KRW")} |
| AdSense 페이지 RPM | ${value(adsenseReport?.totals?.PAGE_VIEWS_RPM, " KRW")} |

## GA4 주요 랜딩 페이지

${list(ga4?.top?.slice(0, 10), (item) => `- \`${item.landingPage}\`: 세션 ${number(item.sessions)}, 활성 사용자 ${number(item.activeUsers)}, 페이지 조회 ${number(item.screenPageViews)}`)}

## 이벤트 발생량

${list(ga4?.events?.filter((item) => ["calculator_view", "calculator_start", "calculator_result_view", "calculator_complete", "share_click", "template_download", "business_lead_submit", "ad_slot_view"].includes(item.eventName)), (item) => `- \`${item.eventName}\`: ${number(item.eventCount)}`)}

## 이벤트별 페이지 경로

${list(ga4?.eventPages?.slice?.(0, 20), (item) => `- \`${item.eventName}\` · \`${item.pagePath || "/"}\`: ${number(item.eventCount)}`)}

## 색인 점검

- 정상 색인 판정 URL: ${number(inspection.filter((item) => item.verdict === "PASS").length)}개
- 추가 확인 필요 URL: ${number(indexIssues.length)}개

${list(indexIssues, (item) => `- \`${item.url}\`: ${item.coverageState || item.verdict || "상태 미확인"}${item.googleCanonical && item.userCanonical && item.googleCanonical !== item.userCanonical ? ` (Google 표준: ${item.googleCanonical})` : ""}`)}

## 운영 해석 규칙

- 이 보고서는 실제 API 응답만 기록하며 수익·RPM·전환율을 추정하지 않습니다.
- 이벤트가 없으면 수요가 없다고 단정하지 않고 측정·노출·사용 흐름을 먼저 점검합니다.
- 목표 매출은 실제 순매출과 환불·수수료를 확인한 뒤 별도로 계산합니다.
`;

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(outputPath, markdown);
console.log(`수익화 KPI 보고서 생성: ${path.relative(process.cwd(), outputPath)}`);
