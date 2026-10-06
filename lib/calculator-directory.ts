import { calculators, type CalculatorConfig, type CalculatorSlug } from "@/lib/calculators";

export type CalculatorGroup = "labor" | "loan" | "tax" | "investment" | "health" | "life" | "business" | "math";

export const CALCULATOR_GROUP_META: Record<
  CalculatorGroup,
  { label: string; description: string; icon: string; accentClass: string; softClass: string }
> = {
  labor: {
    label: "급여·노무",
    description: "급여, 퇴직, 휴가, 육아휴직, 연령·복무 관련 계산기",
    icon: "💼",
    accentClass: "text-[#0f766e]",
    softClass: "bg-[#dff7f1]"
  },
  loan: {
    label: "대출·부동산",
    description: "대출, 상환, 주거비, 취득세, 환율·금융비용 계산기",
    icon: "🏦",
    accentClass: "text-[#1d4ed8]",
    softClass: "bg-[#e3efff]"
  },
  tax: {
    label: "절세·저축",
    description: "세금, 연금, ISA, 적금, 예금 계산기",
    icon: "📊",
    accentClass: "text-[#7c3aed]",
    softClass: "bg-[#efe7ff]"
  },
  investment: {
    label: "투자·주식",
    description: "주식 수익률, 암호화폐 투자 성장, 물타기, PER/PBR 가치평가 계산기",
    icon: "↗",
    accentClass: "text-[#047857]",
    softClass: "bg-[#dcfce7]"
  },
  health: {
    label: "건강·운동",
    description: "BMI, 칼로리, 기초대사량, 수면, 러닝, 운동 중량 계산기",
    icon: "＋",
    accentClass: "text-[#be123c]",
    softClass: "bg-[#ffe4e6]"
  },
  life: {
    label: "생활·도구",
    description: "날짜, 단위변환, 퍼센트, 할인율, 거리 같은 실용 계산기",
    icon: "🧰",
    accentClass: "text-[#c2410c]",
    softClass: "bg-[#fff0e3]"
  },
  business: {
    label: "사업·판매",
    description: "판매 수익, 원가율, 손익분기점, 운영비 비교 계산기",
    icon: "📈",
    accentClass: "text-[#b42318]",
    softClass: "bg-[#fde7e4]"
  },
  math: {
    label: "수학 도구",
    description: "그래핑, 공학용, 행렬, 기하, 3D, 웹 계산 도구",
    icon: "∑",
    accentClass: "text-[#0369a1]",
    softClass: "bg-[#e0f2fe]"
  }
};

const GROUP_BY_SLUG: Record<CalculatorSlug, CalculatorGroup> = {
  "minimum-wage": "labor",
  "unpaid-wage": "labor",
  unemployment: "labor",
  severance: "labor",
  "weekly-holiday": "labor",
  "hourly-wage": "labor",
  "annual-leave": "labor",
  "annual-leave-grant": "labor",
  "parental-leave": "labor",
  "net-salary": "labor",
  "military-discharge-date": "labor",
  "loan-interest": "loan",
  "loan-dsr": "loan",
  "loan-amortization": "loan",
  "apr-calculator": "loan",
  "real-estate-acquisition-tax": "loan",
  "jeonse-vs-monthly-rent": "loan",
  "exchange-rate": "loan",
  "card-installment": "loan",
  "youth-future-savings": "tax",
  savings: "tax",
  "lump-sum-deposit": "tax",
  "compound-interest": "tax",
  "pension-tax": "tax",
  "survivor-pension": "tax",
  "comprehensive-income-tax": "tax",
  "earned-income-tax": "tax",
  "year-end-tax-settlement": "tax",
  "inheritance-tax": "tax",
  "isa-tax": "tax",
  "youth-leap-account": "tax",
  "earned-income-tax-credit": "tax",
  "retirement-income-tax": "tax",
  "stock-return": "investment",
  "coin-profit-calculator": "investment",
  "stock-average-price": "investment",
  "stock-valuation": "investment",
  "crypto-investment-growth": "investment",
  "gold-price-calculator": "investment",
  "silver-price-calculator": "investment",
  "inflation-calculator": "investment",
  "money-value-calculator": "investment",
  "roi-calculator": "investment",
  "present-value": "investment",
  bmi: "health",
  "bmr-calculator": "health",
  "ideal-weight": "health",
  "one-rep-max": "health",
  "sleep-calculator": "health",
  "running-pace": "health",
  "calorie-calculator": "health",
  "daily-intake": "health",
  "pet-age": "life",
  "korean-age": "life",
  "anniversary-calculator": "life",
  "milestone-birthday": "life",
  "lunar-solar-converter": "life",
  "zodiac-sign": "life",
  "unit-converter": "life",
  "date-diff": "life",
  dday: "life",
  "date-add": "life",
  stopwatch: "life",
  "internet-speed-test": "life",
  "pyeong-converter": "life",
  "random-number": "life",
  "draw-probability": "life",
  "text-counter": "life",
  "tip-calculator": "life",
  "poker-equity-calculator": "life",
  "spending-habit-score": "life",
  "salary-vanish-calculator": "life",
  "password-generator": "life",
  percent: "life",
  "discount-rate": "life",
  "distance-calculator": "life",
  "traffic-fine-penalty": "life",
  "fuel-cost": "life",
  "kpass-refund": "life",
  "childbirth-grant": "life",
  "lotto-generator": "tax",
  vat: "business",
  "car-maintenance": "business",
  "auto-installment": "business",
  "moving-cost": "business",
  "mobile-plan": "business",
  "seller-profit": "business",
  "adsense-revenue": "business",
  "youtube-ad-revenue": "business",
  "break-even": "business",
  "subscription-revenue": "business",
  "cbm-freight": "business",
  "real-estate-brokerage-fee": "loan",
  "property-tax": "loan",
  "loan-prepayment": "loan",
  "refinance-calculator": "loan",
  "credit-card-payoff": "loan",
  "retirement-savings": "investment",
  "rental-property-roi": "investment",
  "fire-retirement-age": "investment",
  gpa: "life",
  "graphing-calculator": "math",
  "scientific-calculator": "math",
  "four-function-calculator": "math",
  "math-notes": "math",
  "matrix-calculator": "math",
  "derivative-calculator": "math",
  "integral-calculator": "math",
  "quadratic-formula": "math",
  "factoring-calculator": "math",
  "logarithm-calculator": "math",
  "inequality-calculator": "math",
  "standard-deviation": "math",
  "geometry-tool": "math",
  "three-d-calculator": "math",
  "web-calculator": "math"
};

export function getCalculatorGroup(slug: CalculatorSlug): CalculatorGroup {
  return GROUP_BY_SLUG[slug];
}

export function getCalculatorsByGroup(group: CalculatorGroup) {
  return calculators.filter((calculator) => getCalculatorGroup(calculator.slug) === group);
}

export function getFeaturedCalculators() {
  const featuredSlugs: CalculatorSlug[] = [
    "minimum-wage",
    "unpaid-wage",
    "year-end-tax-settlement",
    "earned-income-tax",
    "inheritance-tax",
    "unemployment",
    "loan-dsr",
    "derivative-calculator",
    "integral-calculator",
    "quadratic-formula",
    "factoring-calculator",
    "logarithm-calculator",
    "inequality-calculator",
    "apr-calculator",
    "credit-card-payoff",
    "retirement-savings",
    "rental-property-roi",
    "inflation-calculator",
    "money-value-calculator",
    "roi-calculator",
    "pension-tax",
    "survivor-pension",
    "youth-future-savings",
    "earned-income-tax-credit",
    "kpass-refund",
    "childbirth-grant",
    "lotto-generator",
    "crypto-investment-growth",
    "gold-price-calculator",
    "silver-price-calculator",
    "coin-profit-calculator",
    "stock-return",
    "seller-profit",
    "adsense-revenue",
    "youtube-ad-revenue",
    "calorie-calculator",
    "bmr-calculator",
    "ideal-weight",
    "one-rep-max",
    "sleep-calculator",
    "running-pace",
    "daily-intake",
    "pet-age",
    "military-discharge-date",
    "anniversary-calculator",
    "milestone-birthday",
    "lunar-solar-converter",
    "zodiac-sign",
    "traffic-fine-penalty",
    "auto-installment",
    "fuel-cost",
    "kpass-refund",
    "childbirth-grant",
    "draw-probability",
    "text-counter",
    "tip-calculator",
    "poker-equity-calculator",
    "spending-habit-score",
    "salary-vanish-calculator",
    "fire-retirement-age",
    "password-generator",
    "date-diff",
    "vat"
  ];

  return featuredSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter(Boolean) as CalculatorConfig[];
}

export function getPopularCalculators() {
  const popularSlugs: CalculatorSlug[] = [
    "minimum-wage",
    "unpaid-wage",
    "unemployment",
    "severance",
    "derivative-calculator",
    "integral-calculator",
    "factoring-calculator",
    "logarithm-calculator",
    "loan-dsr",
    "credit-card-payoff",
    "inflation-calculator",
    "money-value-calculator",
    "vat",
    "exchange-rate",
    "calorie-calculator",
    "bmr-calculator",
    "one-rep-max",
    "sleep-calculator",
    "running-pace",
    "daily-intake",
    "pet-age",
    "military-discharge-date",
    "anniversary-calculator",
    "milestone-birthday",
    "lunar-solar-converter",
    "zodiac-sign",
    "traffic-fine-penalty",
    "fuel-cost",
    "draw-probability",
    "text-counter",
    "tip-calculator",
    "poker-equity-calculator",
    "spending-habit-score",
    "salary-vanish-calculator",
    "fire-retirement-age",
    "password-generator",
    "lotto-generator",
    "crypto-investment-growth",
    "coin-profit-calculator",
    "youth-future-savings",
    "survivor-pension",
    "earned-income-tax-credit",
    "kpass-refund",
    "gold-price-calculator",
    "silver-price-calculator",
    "stock-average-price",
    "seller-profit"
  ];

  return popularSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter(Boolean) as CalculatorConfig[];
}

export function getRecentCalculators() {
  const recentSlugs: CalculatorSlug[] = [
    "minimum-wage",
    "unpaid-wage",
    "distance-calculator",
    "derivative-calculator",
    "integral-calculator",
    "quadratic-formula",
    "factoring-calculator",
    "logarithm-calculator",
    "inequality-calculator",
    "password-generator",
    "standard-deviation",
    "bmr-calculator",
    "ideal-weight",
    "one-rep-max",
    "sleep-calculator",
    "running-pace",
    "calorie-calculator",
    "daily-intake",
    "pet-age",
    "anniversary-calculator",
    "milestone-birthday",
    "lunar-solar-converter",
    "zodiac-sign",
    "traffic-fine-penalty",
    "auto-installment",
    "fuel-cost",
    "draw-probability",
    "text-counter",
    "tip-calculator",
    "poker-equity-calculator",
    "spending-habit-score",
    "salary-vanish-calculator",
    "fire-retirement-age",
    "credit-card-payoff",
    "retirement-savings",
    "rental-property-roi",
    "lotto-generator",
    "year-end-tax-settlement",
    "inheritance-tax",
    "earned-income-tax",
    "loan-amortization",
    "apr-calculator",
    "inflation-calculator",
    "money-value-calculator",
    "roi-calculator",
    "present-value",
    "survivor-pension",
    "youth-leap-account",
    "youth-future-savings",
    "earned-income-tax-credit",
    "kpass-refund",
    "childbirth-grant",
    "isa-tax",
    "card-installment",
    "retirement-income-tax",
    "stock-return",
    "coin-profit-calculator",
    "crypto-investment-growth",
    "gold-price-calculator",
    "silver-price-calculator",
    "adsense-revenue",
    "youtube-ad-revenue",
    "stock-average-price",
    "stock-valuation"
  ];

  return recentSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter(Boolean) as CalculatorConfig[];
}

export function searchCalculators(list: CalculatorConfig[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return list;

  return list.filter((calculator) => {
    const haystack = [
      calculator.title,
      calculator.description,
      calculator.audience,
      calculator.category,
      calculator.badge,
      ...calculator.keywords
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}

export function getRelatedCalculators(slug: CalculatorSlug, limit = 4) {
  const target = calculators.find((calculator) => calculator.slug === slug);
  if (!target) return [];

  const sameGroup = calculators.filter(
    (calculator) => calculator.slug !== slug && getCalculatorGroup(calculator.slug) === getCalculatorGroup(slug)
  );

  const scored = sameGroup
    .map((calculator) => {
      const keywordOverlap = calculator.keywords.filter((keyword) => target.keywords.includes(keyword)).length;
      const categoryBonus = calculator.category === target.category ? 1 : 0;
      return { calculator, score: keywordOverlap * 2 + categoryBonus };
    })
    .sort((a, b) => b.score - a.score || a.calculator.title.localeCompare(b.calculator.title, "ko"))
    .slice(0, limit)
    .map((item) => item.calculator);

  return scored;
}
