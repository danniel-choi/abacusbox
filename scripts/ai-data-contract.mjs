import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "components", "CalculatorClient.tsx"), "utf8");
const reportPath = path.join(root, "docs", "ai-data-contract.md");
const requiredEvents = ["calculator_start", "calculator_complete", "share_click"];
const eventResults = requiredEvents.map((eventName) => ({ eventName, present: source.includes(`trackAnalyticsEvent(\"${eventName}\"`) }));
const forbiddenParameterNames = ["input", "input_value", "result", "result_value", "salary", "birth_date", "email", "phone"];
const eventCalls = [...source.matchAll(/trackAnalyticsEvent\("[^"]+",\s*\{([^}]*)\}/g)].map((match) => match[1]);
const forbiddenMatches = forbiddenParameterNames.filter((name) => eventCalls.some((call) => new RegExp(`(?:^|[,\\s])${name}\\s*:`, "i").test(call)));
const missingEvents = eventResults.filter((event) => !event.present).map((event) => event.eventName);
const status = missingEvents.length === 0 && forbiddenMatches.length === 0 ? "PASS" : "REVIEW_REQUIRED";

const report = `# 분석 데이터 계약 점검

- 생성 시각: ${new Date().toISOString()}
- 상태: ${status}
- 외부 API 호출: 수행하지 않음

## GA4 이벤트

| 이벤트 | 소스 계측 | 허용 매개변수 |
| --- | --- | --- |
${eventResults.map(({ eventName, present }) => `| \`${eventName}\` | ${present ? "확인됨" : "누락"} | calculator_slug, completion_method, share_method |`).join("\n")}

## 개인정보 보호 검사

- 계산 입력값과 결과값: GA4 전송 금지
- 급여, 생년월일, 이메일, 전화번호: GA4 전송 금지
- 허용 이벤트 매개변수: 계산기 식별자와 동작 방식만 사용
- 현재 발견된 금지 매개변수: ${forbiddenMatches.length ? forbiddenMatches.join(", ") : "없음"}

## 외부 데이터 연결 상태

실제 Search Console·GA4 Data API·AdSense API 수집은 인증값이 준비된 뒤 별도 승인하여 실행합니다. 인증값은 이 보고서에 기록하지 않습니다.
`;

fs.writeFileSync(reportPath, report);
console.log(`AI 데이터 계약 점검: ${status}`);
console.log(`보고서 생성: ${path.relative(root, reportPath)}`);
if (status !== "PASS") process.exit(1);
