import crypto from "node:crypto";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

if (process.env.AI_ALLOW_EXTERNAL_WRITE !== "1") {
  console.error("외부 쓰기 제출은 AI_ALLOW_EXTERNAL_WRITE=1일 때만 실행됩니다.");
  process.exit(1);
}

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;
const sitemapUrl = `${String(siteUrl || "").replace(/\/$/, "")}/sitemap.xml`;

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
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
  return (await response.json()).access_token;
}

async function submit() {
  if (!siteUrl || !credentials.client_email || !credentials.private_key) throw new Error("Google Search Console 제출 설정이 없습니다.");
  const token = await getAccessToken();
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetch(endpoint, { method: "PUT", headers: { authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`sitemap submit HTTP ${response.status}`);
  console.log(`Search Console 사이트맵 제출 완료: ${sitemapUrl}`);
}

submit().catch((error) => {
  console.error(`사이트맵 제출 실패: ${error.message}`);
  process.exitCode = 1;
});
