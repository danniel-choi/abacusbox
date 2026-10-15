const SITE_URL = "https://abacusbox.com";

const CATEGORY_THEMES = [
  { test: /(사주|만세력|타로|운세|띠|삼재|오행)/, label: "사주 가이드", bg: "#151221", accent: "#b9fbc0", sub: "#f8d7ff" },
  { test: /(게임|뽑기|가챠|승률|로벅스|공속|감도)/, label: "게임 가이드", bg: "#111827", accent: "#7dd3fc", sub: "#fef08a" },
  { test: /(세금|소득세|부가세|퇴직소득세|환급)/, label: "세금 가이드", bg: "#14213d", accent: "#fca311", sub: "#e5e5e5" },
  { test: /(마케팅|광고|예산|ROAS|CAC|LTV)/i, label: "마케팅 가이드", bg: "#0f172a", accent: "#34d399", sub: "#c4b5fd" }
];

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getD1Binding(env) {
  return env.calcrule || env.CONTENT_DB || null;
}

function stripSvgSuffix(value) {
  return String(value || "").replace(/\.svg$/i, "");
}

function normalizeTitle(value) {
  return String(value || "계산의정석 블로그")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 70);
}

function splitTitle(title) {
  const words = normalizeTitle(title).split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 18 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function pickTheme(title, excerpt) {
  const text = `${title} ${excerpt}`;
  return CATEGORY_THEMES.find((theme) => theme.test.test(text)) || {
    label: "계산 가이드",
    bg: "#10231f",
    accent: "#02b585",
    sub: "#d9f99d"
  };
}

function buildViralCopy(title, excerpt) {
  if (/(게임|뽑기|가챠|승률)/.test(`${title} ${excerpt}`)) return "뽑기 전에 저장";
  if (/(사주|만세력|타로|운세)/.test(`${title} ${excerpt}`)) return "입력 전에 체크";
  if (/(마케팅|광고|예산)/.test(`${title} ${excerpt}`)) return "집행 전에 확인";
  return "계산 전에 저장";
}

async function getPost(env, slug) {
  const db = getD1Binding(env);
  if (!db) return null;

  try {
    return await db.prepare(`
      SELECT slug, title, excerpt, published_at
      FROM posts
      WHERE slug = ?
        AND type = 'blog'
        AND status = 'published'
      LIMIT 1
    `).bind(slug).first();
  } catch {
    return null;
  }
}

function renderSvg({ slug, title, excerpt, publishedAt }) {
  const theme = pickTheme(title, excerpt);
  const lines = splitTitle(title);
  const viralCopy = buildViralCopy(title, excerpt);
  const date = String(publishedAt || "").slice(0, 10) || "계산의정석";
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(excerpt || title)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${theme.bg}"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.8"/>
  <circle cx="1020" cy="90" r="210" fill="${theme.accent}" opacity="0.18"/>
  <circle cx="1060" cy="520" r="170" fill="${theme.sub}" opacity="0.12"/>
  <rect x="72" y="72" width="1056" height="486" rx="36" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" filter="url(#shadow)"/>
  <text x="112" y="136" fill="${theme.accent}" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="30" font-weight="900">${escapeXml(theme.label)}</text>
  <rect x="892" y="98" width="196" height="54" rx="27" fill="${theme.accent}"/>
  <text x="990" y="134" text-anchor="middle" fill="#06130f" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="24" font-weight="900">${escapeXml(viralCopy)}</text>
  ${lines.map((line, index) => `<text x="112" y="${236 + index * 72}" fill="#fff" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="58" font-weight="950" letter-spacing="0">${escapeXml(line)}</text>`).join("")}
  <text x="112" y="486" fill="rgba(255,255,255,0.74)" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="28" font-weight="750">${escapeXml(date)} · 계산의정석</text>
  <text x="112" y="526" fill="rgba(255,255,255,0.48)" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="20" font-weight="650">${escapeXml(canonical)}</text>
  <path d="M930 270h112v112H930z" fill="none" stroke="${theme.accent}" stroke-width="10" rx="16"/>
  <path d="M954 326l24 24 50-62" fill="none" stroke="${theme.sub}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

export async function onRequestGet(context) {
  const slug = stripSvgSuffix(context.params?.slug);
  const post = await getPost(context.env, slug);
  const title = post?.title || "계산 전에 저장해두는 핵심 가이드";
  const excerpt = post?.excerpt || "숫자를 넣기 전에 기준을 먼저 정리해 두면 결과 해석이 쉬워집니다.";
  const svg = renderSvg({
    slug,
    title,
    excerpt,
    publishedAt: post?.published_at
  });

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
