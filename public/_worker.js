const SITE_URL = "https://abacusbox.com";

const calculatorMeta = {
  "minimum-wage": {
    title: "최저임금 모의 계산기",
    category: "노무 가이드",
    audience: "아르바이트, 근로자, 급여 담당자",
    description: "월 지급액과 주 소정근로시간을 기준으로 환산 시급이 최저임금 이상인지 확인합니다.",
    tags: ["최저임금", "최저시급", "월급"]
  },
  "unpaid-wage": {
    title: "임금체불 계산기",
    category: "노무 가이드",
    audience: "급여를 제때 받지 못한 근로자, 퇴직 정산 확인 사용자",
    description: "미지급 월급, 주휴수당, 연차수당, 퇴직금, 연장·야간·휴일수당을 합산해 임금체불 추정액을 계산합니다.",
    tags: ["임금체불", "미지급임금", "노동청신고"]
  },
  "unemployment": {
    title: "실업급여 모의계산기",
    category: "노무 가이드",
    audience: "퇴사 예정자, 이직자",
    description: "평균임금, 연령, 고용보험 가입기간을 입력해 구직급여 1일액과 예상 총액을 계산합니다.",
    tags: ["실업급여", "고용보험", "퇴사"]
  },
  "severance": {
    title: "퇴직금 계산기",
    category: "노무 가이드",
    audience: "퇴직 예정 근로자, 인사 담당자",
    description: "최근 3개월 임금과 계속근로기간으로 법정 퇴직금 예상액을 계산합니다.",
    tags: ["퇴직금", "평균임금", "근속기간"]
  },
  "weekly-holiday": {
    title: "주휴수당 계산기",
    category: "노무 가이드",
    audience: "아르바이트, 단시간 근로자",
    description: "주 근무시간과 시급을 입력해 예상 주휴수당과 주급을 계산합니다.",
    tags: ["주휴수당", "아르바이트", "근로시간"]
  },
  "hourly-wage": {
    title: "시급 계산기",
    category: "노무 가이드",
    audience: "아르바이트, 단시간 근로자, 급여 비교 사용자",
    description: "시급을 기준으로 일급, 주급, 월급, 연봉과 수당 포함 예상 급여를 계산합니다.",
    tags: ["시급", "월급", "급여계산"]
  },
  "annual-leave": {
    title: "연차수당 계산기",
    category: "노무 가이드",
    audience: "퇴직 예정자, 인사 담당자, 급여 확인 사용자",
    description: "통상임금과 1일 근로시간, 미사용 연차일수를 기준으로 연차수당 예상액을 계산합니다.",
    tags: ["연차수당", "통상임금", "휴가"]
  },
  "annual-leave-grant": {
    title: "연차 발생일수 계산기",
    category: "노무 가이드",
    audience: "근로자, 인사 담당자, 휴가 정산 사용자",
    description: "근속연수, 출근율, 개근 개월 수를 기준으로 법정 연차 발생일수를 계산합니다.",
    tags: ["연차", "휴가", "근속연수"]
  },
  "parental-leave": {
    title: "육아휴직 급여 계산기",
    category: "노무 가이드",
    audience: "육아휴직 예정자, 인사 담당자",
    description: "월 통상임금과 육아휴직 사용 개월 수를 기준으로 육아휴직 급여 예상액을 계산합니다.",
    tags: ["육아휴직", "급여", "고용보험"]
  },
  "net-salary": {
    title: "4대 보험 실수령액 계산기",
    category: "노무 가이드",
    audience: "직장인, 급여 담당자",
    description: "월 급여에서 국민연금, 건강보험, 장기요양, 고용보험 근로자 부담분을 계산합니다.",
    tags: ["실수령액", "4대보험", "급여명세서"]
  },
  "military-discharge-date": {
    title: "군 전역일 계산기",
    category: "생활 가이드",
    audience: "입대 예정자, 군 복무자, 가족",
    description: "입대일과 복무 개월 수를 기준으로 예상 전역일을 계산합니다.",
    tags: ["전역일", "군복무", "날짜계산"]
  },
  "loan-interest": {
    title: "대출 이자 계산기",
    category: "금융 가이드",
    audience: "대출 검토자, 주담대·신용대출 사용자",
    description: "대출금액, 금리, 기간, 상환방식에 따라 월 상환액과 총 이자를 계산합니다.",
    tags: ["대출이자", "금리", "상환"]
  },
  "loan-dsr": {
    title: "대출 DSR/LTV 계산기",
    category: "금융 가이드",
    audience: "주택 구매 예정자, 대출 상담 전 사용자",
    description: "연소득, 주택가격, 금리, 만기로 대출 가능성과 원리금 균등상환액을 시뮬레이션합니다.",
    tags: ["DSR", "LTV", "대출한도"]
  },
  "loan-amortization": {
    title: "대출 상환 스케줄 계산기",
    category: "금융 가이드",
    audience: "대출 실행 전 사용자, 상환 계획 검토 사용자",
    description: "대출금액, 금리, 기간을 기준으로 월 상환액과 총 이자, 초반·후반 상환 구조를 계산합니다.",
    tags: ["대출상환", "상환스케줄", "총이자"]
  },
  "real-estate-acquisition-tax": {
    title: "부동산 취득세 계산기",
    category: "세금 가이드",
    audience: "주택 매수 예정자, 부동산 비용 확인 사용자",
    description: "주택 취득가액을 기준으로 취득세와 지방교육세를 계산합니다.",
    tags: ["취득세", "부동산", "주택"]
  },
  "jeonse-vs-monthly-rent": {
    title: "전세 vs 월세 비교 계산기",
    category: "생활 가이드",
    audience: "이사 예정자, 임대차 비교 사용자",
    description: "전세보증금과 월세 조건을 이자 기회비용 기준으로 비교합니다.",
    tags: ["전월세", "주거비", "이사"]
  },
  "card-installment": {
    title: "카드 할부 계산기",
    category: "금융 가이드",
    audience: "고액 결제 사용자, 카드 비용 비교 사용자",
    description: "결제금액, 개월 수, 할부 수수료율을 기준으로 월 납부액과 총 수수료를 계산합니다.",
    tags: ["카드할부", "수수료", "결제"]
  },
  "exchange-rate": {
    title: "환율 계산기",
    category: "금융 가이드",
    audience: "해외결제 사용자, 여행자, 해외구매 사용자",
    description: "환율과 금액을 입력해 원화와 외화 환산 금액을 계산합니다.",
    tags: ["환율", "해외결제", "여행"]
  },
  "savings": {
    title: "예금·적금 실수령액 계산기",
    category: "금융 가이드",
    audience: "저축 계획 사용자, 금융상품 비교 사용자",
    description: "납입액, 기간, 금리, 과세 유형을 입력해 만기 원리금과 세후 이자를 계산합니다.",
    tags: ["예금", "적금", "세후이자"]
  },
  "lump-sum-deposit": {
    title: "예금 단리 계산기",
    category: "금융 가이드",
    audience: "예금 가입 사용자, 자금 운용 비교 사용자",
    description: "목돈 예치금, 기간, 금리, 과세 유형을 기준으로 만기 원리금과 세후 이자를 계산합니다.",
    tags: ["예금", "단리", "만기수령액"]
  },
  "compound-interest": {
    title: "복리 투자 수익 계산기",
    category: "금융 가이드",
    audience: "장기 투자자, 적립식 투자 사용자",
    description: "초기 투자금, 월 추가 투자금, 수익률, 투자 기간을 기준으로 복리 수익을 계산합니다.",
    tags: ["복리", "투자", "장기수익률"]
  },
  "pension-tax": {
    title: "IRP·연금저축 절세액 계산기",
    category: "세금 가이드",
    audience: "직장인, 연말정산 준비 사용자",
    description: "연금계좌 납입액과 총급여 구간에 따라 세액공제 예상액을 계산합니다.",
    tags: ["IRP", "연금저축", "세액공제"]
  },
  "isa-tax": {
    title: "ISA 절세 계산기",
    category: "세금 가이드",
    audience: "투자자, 절세 상품 비교 사용자",
    description: "ISA 계좌 이익과 소득구간에 따라 비과세 한도와 분리과세 효과를 계산합니다.",
    tags: ["ISA", "절세", "비과세"]
  },
  "youth-leap-account": {
    title: "청년도약계좌 계산기",
    category: "금융 가이드",
    audience: "기존 청년도약계좌 가입자, 정책상품 비교 사용자",
    description: "월 납입액과 소득구간을 기준으로 정부기여금과 만기 누적 납입액을 계산합니다.",
    tags: ["청년도약계좌", "정책금융", "정부기여금"]
  },
  "comprehensive-income-tax": {
    title: "종합소득세 계산기",
    category: "세금 가이드",
    audience: "프리랜서, 사업자, 종합소득세 신고 전 사용자",
    description: "과세표준을 기준으로 종합소득세 산출세액과 지방소득세를 계산합니다.",
    tags: ["종합소득세", "과세표준", "신고"]
  },
  "retirement-income-tax": {
    title: "퇴직소득세 계산기",
    category: "세금 가이드",
    audience: "퇴직 예정자, 인사 담당자",
    description: "퇴직급여액과 근속연수를 기준으로 퇴직소득세 산출세액을 계산합니다.",
    tags: ["퇴직소득세", "퇴직급여", "근속연수"]
  },
  "vat": {
    title: "부가세 계산기",
    category: "세금 가이드",
    audience: "사업자, 프리랜서, 견적서 작성 사용자",
    description: "공급가액 또는 합계금액을 기준으로 부가세와 총액을 계산합니다.",
    tags: ["부가세", "공급가액", "사업자"]
  },
  "seller-profit": {
    title: "판매자 수익 계산기",
    category: "사업 가이드",
    audience: "온라인 셀러, 자사몰 운영자, 마켓 판매자",
    description: "판매가, 원가, 수수료율, 광고비, 배송비를 기준으로 판매 수익과 마진율을 계산합니다.",
    tags: ["판매수익", "마진율", "온라인셀러"]
  },
  "stock-profit": {
    title: "주식 수익률 계산기",
    category: "금융 가이드",
    audience: "주식 투자자, 매수·매도 수익 확인 사용자",
    description: "매수가, 매도가, 수량, 수수료와 세금을 반영해 주식 수익률과 손익을 계산합니다.",
    tags: ["주식", "수익률", "투자"]
  },
  "crypto-investment-growth": {
    title: "암호화폐 투자 성장 계산기",
    category: "금융 가이드",
    audience: "가상자산 투자자, 장기 투자 시뮬레이션 사용자",
    description: "초기 투자금과 추가 매수, 예상 수익률을 기준으로 암호화폐 투자 성장액을 계산합니다.",
    tags: ["암호화폐", "투자", "복리"]
  },
  "adsense-revenue": {
    title: "구글 애드센스 수익 계산기",
    category: "사업 가이드",
    audience: "블로그 운영자, 콘텐츠 사이트 운영자",
    description: "페이지뷰, 클릭률, 클릭당 단가를 기준으로 예상 애드센스 수익을 계산합니다.",
    tags: ["애드센스", "광고수익", "블로그"]
  },
  "youtube-ad-revenue": {
    title: "YouTube 광고 수익 계산기",
    category: "사업 가이드",
    audience: "유튜브 크리에이터, 채널 운영자",
    description: "조회수, RPM, 수익 배분 구조를 기준으로 예상 YouTube 광고 수익을 계산합니다.",
    tags: ["유튜브", "광고수익", "RPM"]
  },
  "lotto-tax": {
    title: "로또 세금 계산기",
    category: "세금 가이드",
    audience: "복권 당첨금 실수령액 확인 사용자",
    description: "당첨금 구간별 세율을 반영해 로또 세금과 실수령액을 계산합니다.",
    tags: ["로또", "세금", "실수령액"]
  },
  "recommended-daily-intake": {
    title: "일일 섭취 권장량 계산기",
    category: "생활 가이드",
    audience: "식단 관리 사용자, 영양 섭취 기준 확인 사용자",
    description: "나이, 성별, 활동량을 기준으로 일일 권장 섭취량을 계산합니다.",
    tags: ["영양", "섭취량", "건강"]
  },
  "calorie": {
    title: "칼로리 계산기",
    category: "생활 가이드",
    audience: "다이어트, 벌크업, 체중 유지 목표 사용자",
    description: "기초대사량과 활동량을 기준으로 목표별 일일 칼로리를 계산합니다.",
    tags: ["칼로리", "기초대사량", "식단"]
  },
  "poker-equity": {
    title: "포커 승률 계산기",
    category: "생활 가이드",
    audience: "포커 핸드 확률을 확인하려는 사용자",
    description: "핸드와 보드 카드 조건을 기준으로 포커 승률을 계산합니다.",
    tags: ["포커", "승률", "확률"]
  }
};

const templateMeta = {
  guide: { suffix: "핵심 정리", focus: "기준 구조와 입력 흐름" },
  checklist: { suffix: "입력 전 체크리스트", focus: "계산 전에 확인할 항목" },
  mistakes: { suffix: "자주 틀리는 포인트", focus: "반복되는 입력 실수와 해석 오류" },
  comparison: { suffix: "비교할 때 봐야 할 기준", focus: "여러 조건을 비교하는 기준" },
  scenario: { suffix: "상황별 활용 방법", focus: "실제 상황별 계산 흐름" }
};

const worker = {
  async fetch(request, env) {
    const assetResponse = env.ASSETS ? await env.ASSETS.fetch(request) : new Response(null, { status: 404 });
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    const url = new URL(request.url);
    const slug = decodeURIComponent(url.pathname.replace(/^\/blog\//, "").replace(/\/$/, ""));
    const post = buildAutoBlogPost(slug);

    if (!post) {
      return assetResponse;
    }

    return new Response(renderBlogHtml(post), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=3600"
      }
    });
  }
};

export default worker;

function buildAutoBlogPost(slug) {
  const match = slug.match(/^(.+)-(guide|checklist|mistakes|comparison|scenario)-(\d{8})-(\d{2})-hourly$/);
  if (!match) return null;

  const calculatorSlug = match[1];
  const templateKey = match[2];
  const dateCode = match[3];
  const hour = Number(match[4]);
  const meta = calculatorMeta[calculatorSlug];
  const template = templateMeta[templateKey];
  const date = parseDateCode(dateCode);

  if (!meta || !template || !date || hour < 0 || hour > 23) {
    return null;
  }

  const plainTitle = meta.title.replace(" 계산기", "");
  const title = `${plainTitle} ${template.suffix}`;

  return {
    slug,
    title,
    excerpt: `${meta.title}를 쓰기 전에 ${template.focus}을 정리해 실제 판단에 필요한 숫자를 놓치지 않도록 돕습니다.`,
    category: meta.category,
    publishedAt: date,
    tags: meta.tags,
    calculatorSlug,
    calculatorTitle: meta.title,
    calculatorDescription: meta.description,
    content: [
      `${meta.title}는 ${meta.audience}가 빠르게 기준값을 확인할 때 유용한 도구입니다. ${meta.description}`,
      "계산 전에는 입력값의 기준을 먼저 맞춰야 합니다. 세전과 세후, 월 단위와 연 단위, 총액과 일부 금액이 섞이면 같은 계산기라도 결과 해석이 달라질 수 있습니다.",
      `${template.focus}을 볼 때는 기준 시나리오 하나만 두지 말고 보수적인 경우와 여유 있는 경우를 함께 비교하는 편이 좋습니다. 작은 입력 차이가 월 비용이나 예상 금액에서는 크게 벌어질 수 있습니다.`,
      "계산 결과는 의사결정을 돕는 참고값입니다. 실제 계약, 신고, 구매, 급여 정산, 비용 집행 전에는 견적서, 명세서, 약정서, 공식 안내문처럼 원자료를 함께 확인해야 합니다.",
      `계산의정석의 ${meta.title}는 복잡한 표를 보기 전에 대략적인 범위를 잡는 데 맞춰져 있습니다. 결과가 예상과 다르면 입력 단위, 기간, 포함 항목을 다시 점검해 보세요.`,
      "마지막으로 결과값 하나보다 항목별 구조를 보는 습관이 중요합니다. 어떤 항목이 결과를 크게 움직이는지 알면 절감, 협상, 계획 수정의 우선순위를 더 쉽게 정할 수 있습니다."
    ]
  };
}

function parseDateCode(dateCode) {
  const year = Number(dateCode.slice(0, 4));
  const month = Number(dateCode.slice(4, 6));
  const day = Number(dateCode.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }

  return `${dateCode.slice(0, 4)}-${dateCode.slice(4, 6)}-${dateCode.slice(6, 8)}`;
}

function renderBlogHtml(post) {
  const title = escapeHtml(`${post.title} | 계산의정석`);
  const description = escapeHtml(post.excerpt);
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const calculatorUrl = `/calculators/${encodeURIComponent(post.calculatorSlug)}`;
  const tagText = post.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("");
  const paragraphs = post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "계산의정석",
      url: SITE_URL
    },
    publisher: {
      "@type": "Organization",
      name: "계산의정석",
      url: SITE_URL
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`
  };

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <script type="application/ld+json">${safeJson(jsonLd)}</script>
  <style>
    :root { color-scheme: light; --ink:#111827; --muted:#64748b; --line:#e2e8f0; --paper:#f8fafc; --brand:#02b585; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--paper); color: var(--ink); font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.7; }
    header { background: #111827; color: #fff; }
    header div, main, footer { width: min(100% - 32px, 960px); margin: 0 auto; }
    header div { display: flex; align-items: center; justify-content: space-between; padding: 18px 0; gap: 16px; }
    a { color: inherit; text-decoration: none; }
    .brand { font-size: 20px; font-weight: 900; }
    .nav { color: #dbeafe; font-size: 14px; font-weight: 800; }
    main { padding: 36px 0 48px; }
    article, .related { background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: clamp(22px, 4vw, 34px); box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08); }
    .back { color: var(--brand); font-size: 14px; font-weight: 900; }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
    .meta span, .tags span { border-radius: 999px; background: var(--paper); color: var(--muted); display: inline-flex; font-size: 13px; font-weight: 800; padding: 6px 12px; }
    .meta span:first-child { background: rgba(2, 181, 133, 0.12); color: #018763; }
    h1 { margin: 22px 0 12px; font-size: clamp(30px, 5vw, 44px); line-height: 1.18; letter-spacing: 0; }
    .excerpt { color: var(--muted); font-size: 18px; font-weight: 650; }
    .cta { margin: 28px 0; border: 1px solid rgba(2, 181, 133, 0.32); border-radius: 20px; background: #f0fffa; padding: 22px; }
    .cta strong { display: block; font-size: 14px; color: #018763; }
    .cta h2 { margin: 8px 0 6px; font-size: 24px; line-height: 1.25; }
    .cta p { margin: 0 0 18px; color: var(--muted); }
    .button { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: var(--brand); color: #fff; font-weight: 900; padding: 12px 18px; }
    .content { display: grid; gap: 18px; margin-top: 28px; color: #334155; font-size: 17px; font-weight: 550; }
    .content p { margin: 0; }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
    footer { padding: 0 0 48px; color: var(--muted); font-size: 13px; }
    @media (max-width: 640px) { header div, main, footer { width: min(100% - 24px, 960px); } article, .related { border-radius: 18px; padding: 20px; } }
  </style>
</head>
<body>
  <header>
    <div>
      <a class="brand" href="/">계산의정석</a>
      <a class="nav" href="/calculators">계산기 전체 보기</a>
    </div>
  </header>
  <main>
    <article>
      <a class="back" href="/blog">← 블로그 목록</a>
      <div class="meta">
        <span>${escapeHtml(post.category)}</span>
        <span>${escapeHtml(post.publishedAt)}</span>
        <span>읽는 시간 5분</span>
        <span>계산의정석</span>
      </div>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="excerpt">${description}</p>
      <section class="cta">
        <strong>이 글과 연결된 계산기</strong>
        <h2>${escapeHtml(post.calculatorTitle)}</h2>
        <p>${escapeHtml(post.calculatorDescription)}</p>
        <a class="button" href="${calculatorUrl}">계산기로 바로가기</a>
      </section>
      <div class="content">${paragraphs}</div>
      <section class="cta">
        <strong>숫자로 바로 확인하기</strong>
        <p>위 내용을 읽은 뒤 실제 금액이나 기간을 확인하려면 ${escapeHtml(post.calculatorTitle)}에서 입력값을 바꿔가며 비교해 보세요.</p>
        <a class="button" href="${calculatorUrl}">${escapeHtml(post.calculatorTitle)} 열기</a>
      </section>
      <div class="tags">${tagText}</div>
    </article>
  </main>
  <footer>© 계산의정석. 계산 결과는 참고용이며 실제 계약, 신고, 정산 전에는 원자료와 공식 안내를 함께 확인하세요.</footer>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
