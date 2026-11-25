import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

if (process.env.AI_ALLOW_EXTERNAL_READ !== "1") {
  console.error("외부 읽기 수집은 AI_ALLOW_EXTERNAL_READ=1일 때만 실행됩니다.");
  process.exit(1);
}

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
const propertyId = process.env.GA4_PROPERTY_ID;
const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;
const reportDir = path.join(process.cwd(), ".ai-reports");
const reportPath = path.join(reportDir, `google-data-${new Date().toISOString().slice(0, 10)}.json`);

function base64Url(value) { return Buffer.from(value).toString("base64url"); }

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
  return (await response.json()).access_token;
}

async function request(url, token, options = {}) {
  const response = await fetch(url, { ...options, headers: { authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function inspectUrl(siteUrl, inspectionUrl, token) {
  return request("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", token, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ inspectionUrl, siteUrl, languageCode: "ko-KR" })
  });
}

function summarize(rows, keys) {
  return {
    rows: rows.length,
    totals: Object.fromEntries(keys.map((key) => [key, rows.reduce((total, row) => total + Number(row[key] || 0), 0)])),
    top: rows.slice(0, 20)
  };
}

async function run() {
  const token = await getAccessToken();
  const startDate = new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10);
  const endDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const report = { generatedAt: new Date().toISOString(), dateRange: { startDate, endDate }, privacy: "검색어와 개인 식별 데이터는 수집하지 않음", searchConsole: null, urlInspection: null, ga4: null, adsense: null };

  try {
    const target = new URL(siteUrl);
    const host = target.hostname.replace(/^www\./, "");
    const candidates = new Set([siteUrl, siteUrl.replace(/\/$/, ""), `https://${host}`, `https://${host}/`, `sc-domain:${host}`]);
    const sitesBody = await request("https://www.googleapis.com/webmasters/v3/sites", token);
    const matchedSite = (sitesBody.siteEntry || []).find((site) => candidates.has(site.siteUrl));
    if (!matchedSite) throw new Error("matching Search Console property not found");
    const body = await request(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(matchedSite.siteUrl)}/searchAnalytics/query`, token, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ startDate, endDate, dimensions: ["page"], rowLimit: 1000 })
    });
    const rows = (body.rows || []).map((row) => ({ page: row.keys?.[0] || "", clicks: row.clicks || 0, impressions: row.impressions || 0, ctr: row.ctr || 0, position: row.position || 0 })).sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
    report.searchConsole = { status: "PASS", ...summarize(rows, ["clicks", "impressions"]) };

    try {
      const sitemapBody = await request(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(matchedSite.siteUrl)}/sitemaps`, token);
      report.searchConsole.sitemaps = (sitemapBody.sitemap || []).map((sitemap) => ({
        path: sitemap.path,
        isPending: Boolean(sitemap.isPending),
        lastSubmitted: sitemap.lastSubmitted || null,
        lastDownloaded: sitemap.lastDownloaded || null,
        errors: Number(sitemap.errors || 0),
        warnings: Number(sitemap.warnings || 0)
      }));
    } catch (error) {
      report.searchConsole.sitemaps = { status: "FAIL", reason: error.message };
    }

    const inspectionTargets = [
      `${siteUrl.replace(/\/$/, "")}/`,
      `${siteUrl.replace(/\/$/, "")}/calculators/minimum-wage`,
      `${siteUrl.replace(/\/$/, "")}/calculators/severance`,
      `${siteUrl.replace(/\/$/, "")}/calculators/net-salary`,
      `${siteUrl.replace(/\/$/, "")}/calculators/loan-dsr`,
      `${siteUrl.replace(/\/$/, "")}/calculators/loan-interest`,
      `${siteUrl.replace(/\/$/, "")}/calculators/bmi`,
      `${siteUrl.replace(/\/$/, "")}/blog/loan-prepayment-before-refinance`,
      `${siteUrl.replace(/\/$/, "")}/resources/business-template`,
      `${siteUrl.replace(/\/$/, "")}/calculators/revenue-goal-planner`,
      `${siteUrl.replace(/\/$/, "")}/business/widget-demo`
    ];
    const inspectionResults = [];
    for (const inspectionUrl of inspectionTargets) {
      try {
        const inspection = await inspectUrl(matchedSite.siteUrl, inspectionUrl, token);
        const result = inspection.inspectionResult || {};
        const indexStatus = result.indexStatusResult || {};
        inspectionResults.push({
          url: inspectionUrl,
          verdict: indexStatus.verdict || null,
          coverageState: indexStatus.coverageState || null,
          robotsTxtState: indexStatus.robotsTxtState || null,
          indexingState: indexStatus.indexingState || null,
          pageFetchState: indexStatus.pageFetchState || null,
          googleCanonical: indexStatus.googleCanonical || null,
          userCanonical: indexStatus.userCanonical || null
        });
      } catch (error) {
        inspectionResults.push({ url: inspectionUrl, status: "FAIL", reason: error.message });
      }
    }
    report.urlInspection = { status: "PASS", items: inspectionResults };
  } catch (error) { report.searchConsole = { status: "FAIL", reason: error.message }; }

  try {
    const body = await request(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`, token, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }], dimensions: [{ name: "landingPagePlusQueryString" }], metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "screenPageViews" }], limit: "1000" })
    });
    const rows = (body.rows || []).map((row) => ({ landingPage: row.dimensionValues?.[0]?.value || "", sessions: Number(row.metricValues?.[0]?.value || 0), activeUsers: Number(row.metricValues?.[1]?.value || 0), screenPageViews: Number(row.metricValues?.[2]?.value || 0) })).sort((a, b) => b.sessions - a.sessions || b.screenPageViews - a.screenPageViews);
    let events = null;
    try {
      const eventBody = await request(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`, token, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }], dimensions: [{ name: "eventName" }], metrics: [{ name: "eventCount" }], limit: "100" })
      });
      events = (eventBody.rows || []).map((row) => ({ eventName: row.dimensionValues?.[0]?.value || "", eventCount: Number(row.metricValues?.[0]?.value || 0) })).sort((a, b) => b.eventCount - a.eventCount);
    } catch (error) {
      events = { status: "FAIL", reason: error.message };
    }
    report.ga4 = { status: "PASS", ...summarize(rows, ["sessions", "activeUsers", "screenPageViews"]), events };
  } catch (error) { report.ga4 = { status: "FAIL", reason: error.message }; }

  try {
    const body = await request("https://adsense.googleapis.com/v2/accounts?pageSize=10", token);
    report.adsense = { status: "PASS", accounts: (body.accounts || []).length };
  } catch (error) { report.adsense = { status: "FAIL", reason: error.message }; }

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Google 집계 데이터 스냅샷 생성: ${path.relative(process.cwd(), reportPath)}`);
  console.log(`Search Console: ${report.searchConsole.status}, GA4: ${report.ga4.status}, AdSense: ${report.adsense.status}`);
}

run().catch((error) => { console.error(`실행 실패: ${error.message}`); process.exitCode = 1; });
