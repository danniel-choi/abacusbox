import { calculators, type CalculatorConfig, type CalculatorSlug } from "@/lib/calculators";

export type CalculatorGroup = "labor" | "loan" | "tax" | "investment" | "life" | "business" | "math";

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
  life: {
    label: "생활·도구",
    description: "BMI, 날짜, 단위변환, 퍼센트, 할인율 같은 실용 계산기",
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
  "real-estate-acquisition-tax": "loan",
  "jeonse-vs-monthly-rent": "loan",
  "exchange-rate": "loan",
  "card-installment": "loan",
  savings: "tax",
  "lump-sum-deposit": "tax",
  "compound-interest": "tax",
  "pension-tax": "tax",
  "comprehensive-income-tax": "tax",
  "earned-income-tax": "tax",
  "year-end-tax-settlement": "tax",
  "inheritance-tax": "tax",
  "isa-tax": "tax",
  "youth-leap-account": "tax",
  "retirement-income-tax": "tax",
  "stock-return": "investment",
  "stock-average-price": "investment",
  "stock-valuation": "investment",
  "crypto-investment-growth": "investment",
  bmi: "life",
  "korean-age": "life",
  "unit-converter": "life",
  "date-diff": "life",
  dday: "life",
  "date-add": "life",
  stopwatch: "life",
  "internet-speed-test": "life",
  "pyeong-converter": "life",
  "random-number": "life",
  percent: "life",
  "discount-rate": "life",
  "distance-calculator": "life",
  "lotto-generator": "life",
  vat: "business",
  "car-maintenance": "business",
  "moving-cost": "business",
  "mobile-plan": "business",
  "seller-profit": "business",
  "break-even": "business",
  "subscription-revenue": "business",
  "cbm-freight": "business",
  "real-estate-brokerage-fee": "loan",
  "property-tax": "loan",
  "loan-prepayment": "loan",
  "refinance-calculator": "loan",
  gpa: "life",
  "graphing-calculator": "math",
  "scientific-calculator": "math",
  "four-function-calculator": "math",
  "math-notes": "math",
  "matrix-calculator": "math",
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
    "year-end-tax-settlement",
    "earned-income-tax",
    "inheritance-tax",
    "unemployment",
    "loan-dsr",
    "pension-tax",
    "crypto-investment-growth",
    "stock-return",
    "seller-profit",
    "date-diff",
    "vat"
  ];

  return featuredSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter(Boolean) as CalculatorConfig[];
}

export function getPopularCalculators() {
  const popularSlugs: CalculatorSlug[] = [
    "unemployment",
    "severance",
    "loan-dsr",
    "vat",
    "exchange-rate",
    "crypto-investment-growth",
    "stock-average-price",
    "seller-profit"
  ];

  return popularSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter(Boolean) as CalculatorConfig[];
}

export function getRecentCalculators() {
  const recentSlugs: CalculatorSlug[] = [
    "distance-calculator",
    "year-end-tax-settlement",
    "inheritance-tax",
    "earned-income-tax",
    "loan-amortization",
    "youth-leap-account",
    "isa-tax",
    "card-installment",
    "retirement-income-tax",
    "stock-return",
    "crypto-investment-growth",
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
