import process from "node:process";

const requirements = [
  ["GOOGLE_SERVICE_ACCOUNT_JSON", "Google API 서비스 계정 JSON 또는 Secret 값"],
  ["SEARCH_CONSOLE_SITE_URL", "Search Console 속성 URL", "https://www.abacusbox.com/"],
  ["GA4_PROPERTY_ID", "GA4 숫자 Property ID"],
  ["ADSENSE_ACCOUNT_ID", "AdSense 계정 ID"]
];

const rows = requirements.map(([name, description, example]) => ({
  name,
  description,
  configured: Boolean(process.env[name]),
  example: example || ""
}));

console.log("AI 외부 데이터 연결 상태");
console.log("========================");
for (const row of rows) {
  console.log(`${row.configured ? "READY" : "MISSING"} ${row.name} - ${row.description}${row.example ? ` (예: ${row.example})` : ""}`);
}

const missing = rows.filter((row) => !row.configured);
console.log(`\n준비됨: ${rows.length - missing.length}/${rows.length}`);
if (missing.length > 0) {
  console.log("실제 API 호출은 인증값이 모두 준비된 뒤에만 허용해야 합니다.");
}
