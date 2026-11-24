const SITE_URL = "https://www.abacusbox.com";

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

function buildImageBrief(title, excerpt, variant) {
  const text = `${title} ${excerpt}`;
  const topic = /(대출|금리|예금|적금|저축|투자|환율)/.test(text)
    ? { label: "금액 · 기간 · 금리", items: ["원금", "기간", "금리"] }
    : /(세금|소득|급여|연봉|퇴직|보험|수당)/.test(text)
      ? { label: "소득 · 공제 · 기준", items: ["소득", "공제", "세율"] }
      : /(게임|뽑기|가챠|승률|로벅스|공속|감도)/.test(text)
        ? { label: "확률 · 횟수 · 기대값", items: ["확률", "횟수", "기대값"] }
        : /(사주|만세력|타로|운세|띠|삼재|오행)/.test(text)
          ? { label: "날짜 · 기준 · 해석", items: ["생년월일", "기준", "해석"] }
          : { label: "입력 · 계산 · 확인", items: ["입력값", "계산식", "결과"] };

  const roles = {
    "0": { badge: "주제 한눈에 보기", caption: "이 글에서 다루는 핵심 주제" },
    "1": { badge: "핵심 입력값", caption: "계산 전에 맞춰야 할 기준" },
    "2": { badge: "비교 포인트", caption: "결과를 나눠서 읽는 방법" },
    "3": { badge: "실행 순서", caption: "본문 내용을 적용하는 흐름" }
  };
  return { ...topic, ...(roles[String(variant)] || roles["0"]) };
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

function renderSvg({ slug, title, excerpt, publishedAt, variant = "0" }) {
  const theme = pickTheme(title, excerpt);
  const lines = splitTitle(title);
  const normalizedVariant = ["0", "1", "2", "3"].includes(String(variant)) ? String(variant) : "0";
  const brief = buildImageBrief(title, excerpt, normalizedVariant);
  const viralCopy = normalizedVariant === "0" ? buildViralCopy(title, excerpt) : brief.badge;
  const date = String(publishedAt || "").slice(0, 10) || "계산의정석";
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(slug)}`;
  const titleSvg = lines.map((line, index) => `<text x="112" y="${236 + index * 72}" fill="#fff" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="58" font-weight="950" letter-spacing="0">${escapeXml(line)}</text>`).join("");
  const conceptSvg = normalizedVariant === "1"
    ? `<g transform="translate(820 235)">${brief.items.map((item, index) => `<rect x="${index * 100}" y="${index % 2 === 0 ? 0 : 52}" width="148" height="42" rx="21" fill="${theme.accent}" opacity="${0.95 - index * 0.12}"/><text x="${index * 100 + 74}" y="${index % 2 === 0 ? 27 : 79}" text-anchor="middle" fill="#06130f" font-family="system-ui" font-size="20" font-weight="900">${escapeXml(item)}</text>`).join("")}</g>`
    : normalizedVariant === "2"
      ? `<g transform="translate(820 220)"><rect width="270" height="190" rx="24" fill="#fff" opacity="0.95"/><text x="24" y="42" fill="#0f172a" font-family="system-ui" font-size="20" font-weight="900">비교 기준</text><path d="M28 78h210M28 118h166M28 158h202" stroke="${theme.accent}" stroke-width="18" stroke-linecap="round"/><circle cx="238" cy="78" r="10" fill="${theme.sub}"/><circle cx="194" cy="118" r="10" fill="${theme.sub}"/><circle cx="230" cy="158" r="10" fill="${theme.sub}"/></g>`
      : normalizedVariant === "3"
        ? `<g transform="translate(810 225)">${brief.items.map((item, index) => `<g transform="translate(0 ${index * 72})"><circle cx="30" cy="25" r="24" fill="${theme.accent}"/><text x="30" y="33" text-anchor="middle" fill="#06130f" font-family="system-ui" font-size="22" font-weight="950">${index + 1}</text><rect x="70" y="2" width="245" height="46" rx="23" fill="rgba(255,255,255,0.92)"/><text x="192" y="31" text-anchor="middle" fill="#0f172a" font-family="system-ui" font-size="20" font-weight="900">${escapeXml(item)} 확인</text></g>${index < brief.items.length - 1 ? `<path d="M30 ${index * 72 + 51}v18" stroke="${theme.sub}" stroke-width="6" stroke-linecap="round"/>` : ""}</g>`).join("")}</g>`
        : `<g transform="translate(840 245)"><circle cx="120" cy="120" r="108" fill="${theme.accent}" opacity="0.22"/><circle cx="120" cy="120" r="70" fill="none" stroke="${theme.accent}" stroke-width="12"/><path d="M120 50v70l48 38" fill="none" stroke="${theme.sub}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><text x="120" y="270" text-anchor="middle" fill="rgba(255,255,255,0.82)" font-family="system-ui" font-size="21" font-weight="850">${escapeXml(brief.label)}</text></g>`;

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
  ${titleSvg}
  ${conceptSvg}
  <text x="112" y="486" fill="rgba(255,255,255,0.74)" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="28" font-weight="750">${escapeXml(date)} · 계산의정석</text>
  <text x="112" y="526" fill="rgba(255,255,255,0.48)" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="20" font-weight="650">${escapeXml(brief.caption)} · ${escapeXml(canonical)}</text>
</svg>`;
}

export async function onRequestGet(context) {
  const slug = stripSvgSuffix(context.params?.slug);
  const post = await getPost(context.env, slug);
  const title = post?.title || "계산 전에 저장해두는 핵심 가이드";
  const excerpt = post?.excerpt || "숫자를 넣기 전에 기준을 먼저 정리해 두면 결과 해석이 쉬워집니다.";
  const variant = new URL(context.request.url).searchParams.get("variant") || "0";
  const svg = renderSvg({
    slug,
    title,
    excerpt,
    publishedAt: post?.published_at,
    variant
  });

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
