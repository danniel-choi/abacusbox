import { error, getD1Binding, getPagination, json, readJson, requireAdmin, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

const EXISTING_CALCULATORS = [
  "최저임금", "임금체불", "실업급여", "퇴직금", "주휴수당", "시급", "연차", "육아휴직",
  "실수령액", "대출 이자", "DSR", "APR", "종합소득세", "근로소득세", "연말정산", "상속세",
  "복리", "물가상승률", "ROI", "현재가치", "BMI", "칼로리", "일일 섭취", "반려동물 나이",
  "한국 나이", "단위변환", "취득세", "자동차 유지비", "교통 과태료", "이사비", "요금제",
  "판매 수익", "애드센스", "유튜브 광고", "전역일", "예금", "손익분기점", "전세 월세",
  "학점", "환율", "부가세", "할인율", "거리", "날짜 차이", "디데이", "날짜 더하기",
  "스톱워치", "인터넷 속도", "평 변환", "랜덤 숫자", "뽑기 확률", "글자수", "팁",
  "포커 승률", "소비 습관", "월급 소진", "은퇴", "비밀번호", "표준편차", "기초대사량",
  "표준체중", "중도상환", "대환대출", "카드 상환", "노후자금", "임대수익률", "퍼센트",
  "원리금", "청년도약계좌", "ISA", "할부", "퇴직소득세", "적금", "주식 수익률",
  "주식 물타기", "주식 가치", "암호화폐", "CBM", "구독 수익", "중개보수", "재산세",
  "그래프", "공학", "행렬", "미분", "적분", "근의 공식", "인수분해", "로그", "부등식", "기하"
];

const CATEGORY_RULES = [
  { category: "세금", terms: ["세금", "소득세", "부가세", "상속", "증여", "취득세", "재산세", "양도", "환급", "공제"] },
  { category: "금융", terms: ["대출", "이자", "금리", "투자", "주식", "ETF", "코인", "암호화폐", "연금", "적금", "예금", "수익률"] },
  { category: "노무", terms: ["임금", "급여", "연봉", "퇴직", "실업", "수당", "근로", "휴가", "노무"] },
  { category: "수학", terms: ["방정식", "함수", "그래프", "확률", "통계", "미분", "적분", "행렬"] }
];

const SEARCH_MODIFIERS = [
  "계산기", "모의계산기", "환급액 계산기", "세금 계산기", "수수료 계산기", "이자 계산기",
  "수익률 계산기", "비용 계산기", "기간 계산기", "비교 계산기"
];

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeTitle(value) {
  const title = normalizeWhitespace(value)
    .replace(/[|:：·•]+$/g, "")
    .replace(/^(무료|온라인|간편)\s+/g, "")
    .slice(0, 42);

  if (!title) return "";
  if (/(계산기|시뮬레이터|모의계산기)$/.test(title)) return title;
  return `${title} 계산기`;
}

function hashText(value) {
  let hash = 5381;
  for (const char of String(value || "")) {
    hash = ((hash << 5) + hash) + char.charCodeAt(0);
    hash >>>= 0;
  }
  return hash.toString(36).slice(0, 7);
}

function slugifyIdea(title) {
  const dictionary = [
    ["연말정산", "year-end-tax"], ["소득세", "income-tax"], ["세금", "tax"], ["환급", "refund"],
    ["대출", "loan"], ["이자", "interest"], ["금리", "rate"], ["주식", "stock"], ["수익률", "return"],
    ["암호화폐", "crypto"], ["코인", "crypto"], ["임금", "wage"], ["급여", "salary"], ["연봉", "salary"],
    ["퇴직", "retirement"], ["보험", "insurance"], ["자동차", "car"], ["부동산", "real-estate"],
    ["수수료", "fee"], ["확률", "probability"], ["칼로리", "calorie"], ["계산기", "calculator"]
  ];
  const parts = [];
  for (const [term, word] of dictionary) {
    if (title.includes(term) && !parts.includes(word)) parts.push(word);
  }
  if (parts.length === 0) parts.push("idea", hashText(title));
  if (!parts.includes("calculator")) parts.push("calculator");
  return parts.join("-").replace(/-+/g, "-").slice(0, 64);
}

function inferCategory(title) {
  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((term) => title.includes(term))) return rule.category;
  }
  return "생활";
}

function isExistingCalculator(title) {
  return EXISTING_CALCULATORS.some((term) => title.includes(term));
}

function scoreIdea(title, seedKeyword, sourceText) {
  let score = 45;
  if (title.includes("계산기")) score += 15;
  if (seedKeyword && title.includes(seedKeyword.replace(/\s+/g, ""))) score += 10;
  if (/(세금|환급|수수료|대출|임금|급여|수익률|비교)/.test(title)) score += 10;
  const count = (sourceText.match(new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  score += Math.min(count * 3, 15);
  if (isExistingCalculator(title)) score -= 35;
  return Math.max(1, Math.min(100, score));
}

function buildReason(title, seedKeyword, sourceUrl, isDuplicate) {
  const reason = [];
  if (seedKeyword) reason.push(`검색어 '${seedKeyword}'에서 확장`);
  if (sourceUrl) reason.push("참고 URL 내용에서 수요 신호 확인");
  if (/(세금|환급|대출|수수료|임금|수익률)/.test(title)) reason.push("광고 단가와 검색 의도가 비교적 명확한 주제");
  if (isDuplicate) reason.push("이미 유사 계산기가 있어 보강/통합 검토 필요");
  return reason.join(" · ") || "운영자가 입력한 키워드 기반 후보";
}

function extractIdeaTerms(seedKeyword, sourceText) {
  const terms = new Set();
  const seed = normalizeWhitespace(seedKeyword);
  if (seed) {
    terms.add(seed);
    for (const modifier of SEARCH_MODIFIERS) {
      terms.add(`${seed} ${modifier}`);
    }
  }

  const text = normalizeWhitespace(sourceText).slice(0, 12000);
  const patterns = [
    /([가-힣A-Za-z0-9%·/\-\s]{2,32}(?:계산기|모의계산기|시뮬레이터))/g,
    /([가-힣A-Za-z0-9%·/\-\s]{2,24}(?:세금|환급액|수수료|이자|수익률|보험료|급여|연봉|비용))/g
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const term = normalizeWhitespace(match[1]).replace(/^[^가-힣A-Za-z0-9]+/, "");
      if (term.length >= 3 && term.length <= 36) terms.add(term);
    }
  }

  return Array.from(terms)
    .map(normalizeTitle)
    .filter(Boolean)
    .filter((title, index, list) => list.indexOf(title) === index)
    .slice(0, 12);
}

function toVariableName(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part, index) => index === 0 ? part : `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join("")
    .replace(/[^A-Za-z0-9_$]/g, "") || "calculatorIdea";
}

function buildFieldSet(title, category) {
  if (category === "세금") {
    return [
      { name: "taxableAmount", label: "과세 기준 금액", type: "number", unit: "원", min: 0, max: 10000000000, step: 10000, defaultValue: 50000000 },
      { name: "deductionAmount", label: "공제 금액", type: "number", unit: "원", min: 0, max: 10000000000, step: 10000, defaultValue: 0 },
      { name: "taxRate", label: "예상 세율", type: "number", unit: "%", min: 0, max: 100, step: 0.1, defaultValue: 10 }
    ];
  }

  if (category === "금융") {
    return [
      { name: "principal", label: "기준 금액", type: "number", unit: "원", min: 0, max: 10000000000, step: 10000, defaultValue: 10000000 },
      { name: "annualRate", label: "연 비율", type: "number", unit: "%", min: -100, max: 100, step: 0.1, defaultValue: 5 },
      { name: "months", label: "기간", type: "number", unit: "개월", min: 1, max: 600, step: 1, defaultValue: 12 }
    ];
  }

  if (category === "노무") {
    return [
      { name: "monthlyPay", label: "월 기준 금액", type: "number", unit: "원", min: 0, max: 100000000, step: 10000, defaultValue: 2500000 },
      { name: "workMonths", label: "근무 기간", type: "number", unit: "개월", min: 1, max: 600, step: 1, defaultValue: 12 },
      { name: "rate", label: "적용 비율", type: "number", unit: "%", min: 0, max: 300, step: 0.1, defaultValue: 100 }
    ];
  }

  if (category === "수학") {
    return [
      { name: "valueA", label: "값 A", type: "number", min: -1000000, max: 1000000, step: 1, defaultValue: 10 },
      { name: "valueB", label: "값 B", type: "number", min: -1000000, max: 1000000, step: 1, defaultValue: 5 },
      { name: "precision", label: "소수점 자리", type: "number", min: 0, max: 10, step: 1, defaultValue: 2 }
    ];
  }

  return [
    { name: "baseAmount", label: "기준 금액", type: "number", unit: "원", min: 0, max: 1000000000, step: 1000, defaultValue: 100000 },
    { name: "rate", label: "비율", type: "number", unit: "%", min: 0, max: 100, step: 0.1, defaultValue: 10 },
    { name: "quantity", label: "수량", type: "number", min: 1, max: 100000, step: 1, defaultValue: 1 }
  ];
}

function buildFormula(category) {
  if (category === "세금") return "const base = Math.max(values.taxableAmount - values.deductionAmount, 0);\n      const resultAmount = base * (values.taxRate / 100);";
  if (category === "금융") return "const monthlyRate = values.annualRate / 100 / 12;\n      const resultAmount = values.principal * Math.pow(1 + monthlyRate, values.months) - values.principal;";
  if (category === "노무") return "const resultAmount = values.monthlyPay * values.workMonths * (values.rate / 100);";
  if (category === "수학") return "const resultAmount = values.valueA + values.valueB;\n      const rounded = Number(resultAmount.toFixed(values.precision));";
  return "const resultAmount = values.baseAmount * (values.rate / 100) * values.quantity;";
}

function buildCodeSnippet({ title, slug, category, fields }) {
  const variableName = toVariableName(slug);
  const formula = buildFormula(category);
  const fieldText = JSON.stringify(fields, null, 6)
    .replace(/\n/g, "\n    ")
    .replace(/"type": "number"/g, 'type: "number"')
    .replace(/"name":/g, "name:")
    .replace(/"label":/g, "label:")
    .replace(/"unit":/g, "unit:")
    .replace(/"min":/g, "min:")
    .replace(/"max":/g, "max:")
    .replace(/"step":/g, "step:")
    .replace(/"defaultValue":/g, "defaultValue:");

  return `const ${variableName}: CalculatorConfig = {
  slug: "${slug}" as CalculatorSlug,
  title: "${title}",
  description: "${title}의 기준 금액, 적용 비율, 기간 조건을 입력해 예상 결과를 빠르게 확인합니다.",
  category: "${category}",
  keywords: ["${title}", "${title.replace(/\s*계산기$/, "")}", "${category} 계산기"],
  badge: "자동 발굴 후보",
  audience: "${title}가 필요한 사용자",
  fields: ${fieldText},
  guideTitle: "${title} 사용 전 확인할 점",
  guide: [
    "이 초안은 자동 발굴 후보를 빠르게 구현하기 위한 출발점입니다.",
    "공식 기준, 예외 조건, 최신 법령 또는 약관을 확인한 뒤 계산식을 확정하세요.",
    "결과값은 참고용으로 안내하고 실제 신고, 계약, 납부 전 원자료 확인 문구를 유지하세요."
  ],
  checkpoints: [
    "입력 단위가 원, %, 개월 중 무엇인지 확인",
    "최소/최대값과 기본값이 실제 사용자 사례에 맞는지 조정",
    "공식 출처가 있는 계산식인지 검증",
    "모바일에서 결과 카드 문구가 넘치지 않는지 확인"
  ],
  faqs: [
    {
      question: "${title} 결과를 그대로 사용해도 되나요?",
      answer: "자동 계산 결과는 참고값입니다. 실제 신고, 계약, 납부, 정산 전에는 공식 안내와 원자료를 함께 확인해야 합니다."
    },
    {
      question: "어떤 값을 먼저 입력해야 하나요?",
      answer: "기준 금액과 적용 비율을 먼저 맞춘 뒤 기간, 공제, 추가 조건을 순서대로 조정하는 방식이 좋습니다."
    }
  ],
  calculate: (values) => {
      ${formula}
      const displayAmount = ${category === "수학" ? "rounded" : "resultAmount"};

    return {
      headline: formatWon(displayAmount),
      subline: "입력한 조건을 기준으로 계산한 예상 결과입니다.",
      rows: [
        { label: "예상 결과", value: formatWon(displayAmount), tone: "strong" },
        { label: "검증 상태", value: "공식 계산식 확인 필요", tone: "muted" }
      ],
      chart: [
        { name: "예상 결과", value: displayAmount }
      ]
    };
  }
};`;
}

function buildImplementationDraft(title, slug, category) {
  const fields = buildFieldSet(title, category);
  return {
    codeSnippet: buildCodeSnippet({ title, slug, category, fields }),
    insertionChecklist: [
      "lib/calculators.ts의 CalculatorSlug union에 slug 추가",
      "calculators 배열에 코드 스니펫 추가",
      "lib/calculator-directory.ts의 GROUP_BY_SLUG에 카테고리 매핑 추가",
      "필요하면 lib/calculator-seo.ts에 SEO 본문 추가",
      "npm run lint와 npm run build로 타입과 정적 경로 생성 확인"
    ],
    validationChecklist: [
      "공식 출처 또는 신뢰 가능한 계산 기준 확보",
      "경계값 테스트: 0, 음수, 매우 큰 값, 소수점",
      "모바일 결과 카드 줄바꿈 확인",
      "관련 계산기와 내부 링크 연결",
      "면책/참고용 안내 문구 확인"
    ]
  };
}

function buildSpec(title, category, slug = slugifyIdea(title)) {
  const fields = buildFieldSet(title, category);
  return {
    title,
    slug,
    category,
    fields,
    result: "입력값을 기준으로 예상 금액, 월 환산액, 체크포인트를 보여주는 계산기 초안",
    notes: ["공식 기준이 필요한 영역은 출처 확인 후 계산식을 확정하세요.", "후보 저장 후 실제 계산식 검증 단계가 필요합니다."],
    implementation: buildImplementationDraft(title, slug, category)
  };
}

function buildIdeas({ seedKeyword, sourceUrl, sourceText }) {
  const titles = extractIdeaTerms(seedKeyword, sourceText);
  return titles.map((title) => {
    const category = inferCategory(title);
    const duplicate = isExistingCalculator(title);
    const slug = slugifyIdea(title);
    return {
      title,
      slug,
      category,
      seedKeyword: seedKeyword || null,
      sourceUrl: sourceUrl || null,
      reason: buildReason(title, seedKeyword, sourceUrl, duplicate),
      priority: scoreIdea(title, seedKeyword, sourceText),
      status: duplicate ? "rejected" : "candidate",
      generatedSpec: buildSpec(title, category, slug)
    };
  }).sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title, "ko"));
}

async function fetchSourceText(sourceUrl) {
  if (!sourceUrl) return "";
  const url = new URL(sourceUrl);
  if (!["http:", "https:"].includes(url.protocol)) return "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        "user-agent": "AbacusboxCalculatorIdeaBot/1.0"
      }
    });
    if (!response.ok) return "";
    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&#160;/g, " ")
      .replace(/&amp;/g, "&")
      .slice(0, 20000);
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

async function upsertIdeas(db, ideas) {
  const saved = [];
  for (const idea of ideas) {
    const specJson = JSON.stringify(idea.generatedSpec);
    await db.prepare(`
      INSERT INTO calculator_ideas (
        title, slug, category, seed_keyword, source_url, reason, priority, status, generated_spec_json, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        seed_keyword = excluded.seed_keyword,
        source_url = excluded.source_url,
        reason = excluded.reason,
        priority = MAX(calculator_ideas.priority, excluded.priority),
        generated_spec_json = excluded.generated_spec_json,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      idea.title,
      idea.slug,
      idea.category,
      idea.seedKeyword,
      idea.sourceUrl,
      idea.reason,
      idea.priority,
      idea.status,
      specJson
    ).run();
    saved.push(idea);
  }
  return saved;
}

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const url = new URL(context.request.url);
  const status = url.searchParams.get("status") || "";
  const query = normalizeWhitespace(url.searchParams.get("q") || "");
  const { limit, offset } = getPagination(context.request.url, 20, 100);
  const clauses = ["1 = 1"];
  const params = [];

  if (status) {
    clauses.push("status = ?");
    params.push(status);
  }
  if (query) {
    clauses.push("(title LIKE ? OR slug LIKE ? OR seed_keyword LIKE ?)");
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const result = await db.prepare(`
      SELECT *
      FROM calculator_ideas
      WHERE ${clauses.join(" AND ")}
      ORDER BY priority DESC, datetime(updated_at) DESC, id DESC
      LIMIT ?
      OFFSET ?
    `).bind(...params, limit, offset).all();

    return json({ items: result.results || [] });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Calculator idea API is unavailable until D1 migrations are applied.");
  }
}

export async function onRequestPost(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const payload = await readJson(context.request);
  const seedKeyword = normalizeWhitespace(payload?.seedKeyword || "");
  const sourceUrl = normalizeWhitespace(payload?.sourceUrl || "");
  const memoText = normalizeWhitespace(payload?.memoText || "");

  if (!seedKeyword && !sourceUrl && !memoText) {
    return error("seedKeyword, sourceUrl, or memoText is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const fetchedText = await fetchSourceText(sourceUrl);
    const sourceText = [memoText, fetchedText].filter(Boolean).join(" ");
    const ideas = buildIdeas({ seedKeyword, sourceUrl, sourceText });
    const saved = await upsertIdeas(db, ideas);

    return json({ ok: true, items: saved }, { status: 201 });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Calculator idea API is unavailable until D1 migrations are applied.");
  }
}

export async function onRequestPatch(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const payload = await readJson(context.request);
  const id = Number(payload?.id || 0);
  const status = String(payload?.status || "");
  const action = String(payload?.action || "");
  const allowed = new Set(["candidate", "planned", "building", "launched", "rejected"]);

  if (!id) {
    return error("valid id is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    if (action === "generateDraft") {
      const idea = await db.prepare(`
        SELECT id, title, slug, category
        FROM calculator_ideas
        WHERE id = ?
        LIMIT 1
      `).bind(id).first();

      if (!idea?.id) return error("calculator idea not found", 404);

      const specJson = JSON.stringify(buildSpec(String(idea.title), String(idea.category), String(idea.slug)));
      await db.prepare(`
        UPDATE calculator_ideas
        SET generated_spec_json = ?,
            status = CASE WHEN status = 'candidate' THEN 'planned' ELSE status END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(specJson, id).run();

      const updated = await db.prepare(`
        SELECT *
        FROM calculator_ideas
        WHERE id = ?
        LIMIT 1
      `).bind(id).first();

      return json({ ok: true, item: updated });
    }

    if (!allowed.has(status)) {
      return error("valid status is required", 400);
    }

    await db.prepare(`
      UPDATE calculator_ideas
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, id).run();
    return json({ ok: true });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Calculator idea API is unavailable until D1 migrations are applied.");
  }
}
