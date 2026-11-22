import crypto from "node:crypto";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

if (process.env.AI_ALLOW_EXTERNAL_READ !== "1") {
  console.error("외부 읽기 테스트는 AI_ALLOW_EXTERNAL_READ=1일 때만 실행됩니다.");
  process.exit(1);
}

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
const propertyId = process.env.GA4_PROPERTY_ID;
const searchConsoleSiteUrl = process.env.SEARCH_CONSOLE_SITE_URL;

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/adsense.readonly"
    ].join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(credentials.private_key, "base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  });
  if (!response.ok) throw new Error(`token HTTP ${response.status}`);
  const body = await response.json();
  if (!body.access_token) throw new Error("token response missing access_token");
  return body.access_token;
}

async function googleRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { authorization: `Bearer ${token}`, ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function run() {
  const token = await getAccessToken();
  const results = [];

  try {
    const body = await googleRequest("https://www.googleapis.com/webmasters/v3/sites", token);
    const sites = Array.isArray(body.siteEntry) ? body.siteEntry : [];
    const matched = sites.some((site) => site.siteUrl === searchConsoleSiteUrl || site.siteUrl === searchConsoleSiteUrl.replace(/\/$/, ""));
    results.push(["Search Console", matched ? "PASS" : "REVIEW", `접근 가능, 대상 속성 ${matched ? "확인" : "미확인"}`]);
  } catch (error) {
    results.push(["Search Console", "FAIL", error.message]);
  }

  try {
    const body = await googleRequest(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`, token, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }], metrics: [{ name: "activeUsers" }] })
    });
    results.push(["GA4", "PASS", `리포트 응답 확인, 행 ${Array.isArray(body.rows) ? body.rows.length : 0}개`]);
  } catch (error) {
    results.push(["GA4", "FAIL", error.message]);
  }

  try {
    const body = await googleRequest("https://adsense.googleapis.com/v2/accounts?pageSize=10", token);
    results.push(["AdSense", "PASS", `계정 API 응답 확인, 계정 ${Array.isArray(body.accounts) ? body.accounts.length : 0}개`]);
  } catch (error) {
    results.push(["AdSense", "FAIL", error.message]);
  }

  console.log("Google API 읽기 전용 연결 결과");
  for (const [name, status, detail] of results) console.log(`${status} ${name} - ${detail}`);
  if (results.some(([, status]) => status === "FAIL")) process.exitCode = 1;
}

run().catch((error) => {
  console.error(`실행 실패: ${error.message}`);
  process.exitCode = 1;
});
