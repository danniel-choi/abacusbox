import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

const root = process.cwd();
const reportPath = path.join(root, "docs", "ai-credentials-check.md");
const checks = [];

function add(name, status, detail) {
  checks.push({ name, status, detail });
}

const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!serviceAccount) {
  add("GOOGLE_SERVICE_ACCOUNT_JSON", "MISSING", "서비스 계정 JSON이 설정되지 않음");
} else {
  try {
    const parsed = JSON.parse(serviceAccount);
    const valid = parsed.type === "service_account" && typeof parsed.client_email === "string" && typeof parsed.private_key === "string";
    add("GOOGLE_SERVICE_ACCOUNT_JSON", valid ? "VALID" : "INVALID", valid ? "필수 구조 확인됨" : "type, client_email, private_key 확인 필요");
  } catch {
    add("GOOGLE_SERVICE_ACCOUNT_JSON", "INVALID", "JSON 형식이 아님");
  }
}

const searchConsoleUrl = process.env.SEARCH_CONSOLE_SITE_URL;
if (!searchConsoleUrl) {
  add("SEARCH_CONSOLE_SITE_URL", "MISSING", "Search Console 속성 URL이 설정되지 않음");
} else {
  try {
    const parsed = new URL(searchConsoleUrl);
    const valid = parsed.protocol === "https:" && parsed.hostname === "www.abacusbox.com";
    add("SEARCH_CONSOLE_SITE_URL", valid ? "VALID" : "INVALID", valid ? "abacusbox.com HTTPS 속성 확인됨" : "https://www.abacusbox.com/ 형식 필요");
  } catch {
    add("SEARCH_CONSOLE_SITE_URL", "INVALID", "URL 형식이 아님");
  }
}

const gaPropertyId = process.env.GA4_PROPERTY_ID;
add(
  "GA4_PROPERTY_ID",
  !gaPropertyId ? "MISSING" : /^\d+$/.test(gaPropertyId) ? "VALID" : "INVALID",
  !gaPropertyId ? "GA4 숫자 Property ID가 설정되지 않음" : /^\d+$/.test(gaPropertyId) ? "숫자 Property ID 확인됨" : "G- 측정 ID가 아닌 숫자 Property ID 필요"
);

const adsenseAccountId = process.env.ADSENSE_ACCOUNT_ID;
add(
  "ADSENSE_ACCOUNT_ID",
  !adsenseAccountId ? "MISSING" : /^(pub-)?\d+$/.test(adsenseAccountId) ? "VALID" : "INVALID",
  !adsenseAccountId ? "AdSense 계정 ID가 설정되지 않음" : /^(pub-)?\d+$/.test(adsenseAccountId) ? "계정 ID 형식 확인됨" : "pub-숫자 또는 숫자 형식 필요"
);

const invalid = checks.filter((check) => check.status === "INVALID");
const ready = checks.filter((check) => check.status === "VALID").length;
const report = `# AI 외부 계정 형식 검사

- 생성 시각: ${new Date().toISOString()}
- 준비된 항목: ${ready}/${checks.length}
- 상태: ${invalid.length ? "INVALID_CONFIGURATION" : "WAITING_FOR_SECRETS"}
- 보안: Secret 원문과 서비스 계정 값은 출력하지 않음

| 항목 | 상태 | 확인 결과 |
| --- | --- | --- |
${checks.map((check) => `| \`${check.name}\` | ${check.status} | ${check.detail} |`).join("\n")}

실제 Google API 호출은 네 가지 값이 모두 유효하고, 해당 서비스 계정에 Search Console·GA4·AdSense 조회 권한을 부여한 뒤 별도 승인하여 실행합니다.
`;

fs.writeFileSync(reportPath, report);
console.log(`AI 인증 설정 형식 검사: ${invalid.length ? "INVALID_CONFIGURATION" : "OK"}`);
console.log(`유효한 항목: ${ready}/${checks.length}`);
console.log(`보고서 생성: ${path.relative(root, reportPath)}`);
if (invalid.length > 0) process.exit(1);
