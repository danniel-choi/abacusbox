import Decimal from "decimal.js";
import { floorToTen, formatPercent, formatWon } from "@/lib/format";
import { legalStandards } from "@/lib/constants";

export type CalculatorSlug =
  | "minimum-wage"
  | "unpaid-wage"
  | "unemployment"
  | "severance"
  | "weekly-holiday"
  | "hourly-wage"
  | "annual-leave"
  | "annual-leave-grant"
  | "parental-leave"
  | "net-salary"
  | "loan-interest"
  | "loan-dsr"
  | "apr-calculator"
  | "comprehensive-income-tax"
  | "earned-income-tax"
  | "year-end-tax-settlement"
  | "inheritance-tax"
  | "compound-interest"
  | "inflation-calculator"
  | "roi-calculator"
  | "present-value"
  | "bmi"
  | "calorie-calculator"
  | "daily-intake"
  | "korean-age"
  | "unit-converter"
  | "real-estate-acquisition-tax"
  | "car-maintenance"
  | "moving-cost"
  | "mobile-plan"
  | "seller-profit"
  | "adsense-revenue"
  | "youtube-ad-revenue"
  | "military-discharge-date"
  | "lump-sum-deposit"
  | "break-even"
  | "jeonse-vs-monthly-rent"
  | "gpa"
  | "exchange-rate"
  | "vat"
  | "discount-rate"
  | "distance-calculator"
  | "date-diff"
  | "dday"
  | "date-add"
  | "stopwatch"
  | "internet-speed-test"
  | "pyeong-converter"
  | "random-number"
  | "text-counter"
  | "tip-calculator"
  | "poker-equity-calculator"
  | "spending-habit-score"
  | "salary-vanish-calculator"
  | "fire-retirement-age"
  | "password-generator"
  | "standard-deviation"
  | "bmr-calculator"
  | "ideal-weight"
  | "loan-prepayment"
  | "refinance-calculator"
  | "credit-card-payoff"
  | "retirement-savings"
  | "rental-property-roi"
  | "percent"
  | "loan-amortization"
  | "youth-leap-account"
  | "isa-tax"
  | "card-installment"
  | "retirement-income-tax"
  | "savings"
  | "pension-tax"
  | "stock-return"
  | "stock-average-price"
  | "stock-valuation"
  | "crypto-investment-growth"
  | "lotto-generator"
  | "cbm-freight"
  | "subscription-revenue"
  | "real-estate-brokerage-fee"
  | "property-tax"
  | "graphing-calculator"
  | "scientific-calculator"
  | "four-function-calculator"
  | "math-notes"
  | "matrix-calculator"
  | "derivative-calculator"
  | "integral-calculator"
  | "quadratic-formula"
  | "factoring-calculator"
  | "logarithm-calculator"
  | "inequality-calculator"
  | "geometry-tool"
  | "three-d-calculator"
  | "web-calculator";

export type CalculatorCategory = "노무" | "금융" | "세금" | "생활" | "수학";

export type InputField = {
  name: string;
  label: string;
  type: "number" | "select";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: number }[];
  defaultValue: number;
  help?: string;
};

export type ResultRow = {
  label: string;
  value: string;
  tone?: "strong" | "muted";
};

export type ChartPoint = {
  name: string;
  value: number;
};

export type CalculatorResult = {
  headline: string;
  subline: string;
  rows: ResultRow[];
  chart: ChartPoint[];
};

type CalculatorContext = {
  refreshKey?: number;
};

export type CalculatorConfig = {
  slug: CalculatorSlug;
  title: string;
  description: string;
  category: CalculatorCategory;
  keywords: string[];
  badge: string;
  audience: string;
  fields: InputField[];
  actionLabel?: string;
  guideTitle: string;
  guide: string[];
  checkpoints: string[];
  faqs: { question: string; answer: string }[];
  calculate: (values: Record<string, number>, context?: CalculatorContext) => CalculatorResult;
};

function d(value: number) {
  return new Decimal(Number.isFinite(value) ? value : 0);
}

function unemploymentDays(age: number, months: number) {
  const years = months / 12;
  if (years < 1) return 0;
  if (age >= 50) {
    if (years < 3) return 150;
    if (years < 5) return 180;
    if (years < 10) return 210;
    return 270;
  }
  if (years < 3) return 120;
  if (years < 5) return 150;
  if (years < 10) return 180;
  return 240;
}

function monthlyLoanPayment(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return principal * (monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
}

function equalPrincipalFirstPayment(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  const monthlyPrincipal = principal / months;
  const firstInterest = principal * (annualRate / 100 / 12);
  return monthlyPrincipal + firstInterest;
}

function equalPrincipalAveragePayment(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  return (equalPrincipalFirstPayment(principal, annualRate, years) + principal / months) / 2;
}

function estimateApr(principal: number, monthlyPayment: number, months: number, fees: number) {
  const netProceeds = Math.max(principal - fees, 0);
  if (netProceeds <= 0 || monthlyPayment <= 0 || months <= 0) return 0;

  let low = 0;
  let high = 1;
  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const presentValue = monthlyPayment * (1 - (1 + mid) ** -months) / mid;
    if (presentValue > netProceeds) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return ((low + high) / 2) * 12 * 100;
}

function compoundFutureValue(initial: number, monthlyContribution: number, annualRate: number, years: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return initial + monthlyContribution * months;
  }

  const initialFuture = initial * (1 + monthlyRate) ** months;
  const contributionFuture = monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
  return initialFuture + contributionFuture;
}

function parentalLeaveMonthlyBenefit(monthlyWage: number, monthIndex: number) {
  if (monthIndex <= 3) {
    return Math.min(Math.max(monthlyWage, 700000), 2500000);
  }
  if (monthIndex <= 6) {
    return Math.min(Math.max(monthlyWage, 700000), 2000000);
  }
  return Math.min(Math.max(monthlyWage * 0.8, 700000), 1600000);
}

function annualLeaveGrantedDays(yearsWorked: number, attendanceRate: number, fullMonthAttendanceDays: number) {
  if (yearsWorked < 1) {
    return Math.min(Math.max(Math.floor(fullMonthAttendanceDays), 0), 11);
  }

  if (attendanceRate < 80) {
    return Math.min(Math.max(Math.floor(fullMonthAttendanceDays), 0), 11);
  }

  const extra = Math.min(Math.floor((yearsWorked - 1) / 2), 10);
  return Math.min(15 + extra, 25);
}

function comprehensiveIncomeTax(taxBase: number) {
  if (taxBase <= 14000000) return taxBase * 0.06;
  if (taxBase <= 50000000) return 840000 + (taxBase - 14000000) * 0.15;
  if (taxBase <= 88000000) return 6240000 + (taxBase - 50000000) * 0.24;
  if (taxBase <= 150000000) return 15360000 + (taxBase - 88000000) * 0.35;
  if (taxBase <= 300000000) return 37060000 + (taxBase - 150000000) * 0.38;
  if (taxBase <= 500000000) return 94060000 + (taxBase - 300000000) * 0.4;
  if (taxBase <= 1000000000) return 174060000 + (taxBase - 500000000) * 0.42;
  return 384060000 + (taxBase - 1000000000) * 0.45;
}

function earnedIncomeDeduction(grossPay: number) {
  const deduction =
    grossPay <= 5000000
      ? grossPay * 0.7
      : grossPay <= 15000000
        ? 3500000 + (grossPay - 5000000) * 0.4
        : grossPay <= 45000000
          ? 7500000 + (grossPay - 15000000) * 0.15
          : grossPay <= 100000000
            ? 12000000 + (grossPay - 45000000) * 0.05
            : 14750000 + (grossPay - 100000000) * 0.02;

  return Math.min(deduction, 20000000);
}

function earnedIncomeTaxCredit(incomeTax: number, grossPay: number) {
  const baseCredit = incomeTax <= 1300000 ? incomeTax * 0.55 : 715000 + (incomeTax - 1300000) * 0.3;
  const cap =
    grossPay <= 33000000
      ? 740000
      : grossPay <= 70000000
        ? Math.max(740000 - (grossPay - 33000000) * 0.008, 660000)
        : grossPay <= 120000000
          ? Math.max(660000 - (grossPay - 70000000) * 0.5, 500000)
          : Math.max(500000 - (grossPay - 120000000) * 0.5, 200000);

  return Math.min(baseCredit, cap);
}

function creditCardIncomeDeduction(grossPay: number, creditCard: number, checkCash: number, marketTransit: number) {
  let threshold = grossPay * 0.25;
  const applyAfterThreshold = (amount: number, rate: number) => {
    const usedForThreshold = Math.min(amount, threshold);
    threshold -= usedForThreshold;
    return Math.max(amount - usedForThreshold, 0) * rate;
  };

  const rawDeduction =
    applyAfterThreshold(creditCard, 0.15) +
    applyAfterThreshold(checkCash, 0.3) +
    applyAfterThreshold(marketTransit, 0.4);
  const cap = grossPay <= 70000000 ? 3000000 : grossPay <= 120000000 ? 2500000 : 2000000;

  return Math.min(rawDeduction, cap);
}

function inheritanceTax(taxBase: number) {
  if (taxBase <= 100000000) return taxBase * 0.1;
  if (taxBase <= 500000000) return taxBase * 0.2 - 10000000;
  if (taxBase <= 1000000000) return taxBase * 0.3 - 60000000;
  if (taxBase <= 3000000000) return taxBase * 0.4 - 160000000;
  return taxBase * 0.5 - 460000000;
}

function realEstateAcquisitionRate(homePrice: number) {
  if (homePrice <= 600000000) return 0.01;
  if (homePrice <= 900000000) {
    return (((homePrice * 2) / 300000000) - 3) / 100;
  }
  return 0.03;
}

function addMonthsToDate(year: number, month: number, day: number, monthsToAdd: number) {
  const base = new Date(year, month - 1, day);
  base.setMonth(base.getMonth() + monthsToAdd);
  return base;
}

function daysBetweenDates(from: Date, to: Date) {
  const dayMs = 1000 * 60 * 60 * 24;
  return Math.round((to.getTime() - from.getTime()) / dayMs);
}

function youthLeapMonthlyContribution(monthlyDeposit: number, incomeBand: number) {
  const deposit = Math.min(Math.max(monthlyDeposit, 0), 700000);
  if (incomeBand === 0) {
    return Math.min(deposit, 400000) * 0.06 + Math.min(Math.max(deposit - 400000, 0), 300000) * 0.03;
  }
  if (incomeBand === 1) {
    return Math.min(deposit, 500000) * 0.046 + Math.min(Math.max(deposit - 500000, 0), 200000) * 0.03;
  }
  if (incomeBand === 2) {
    return Math.min(deposit, 600000) * 0.037 + Math.min(Math.max(deposit - 600000, 0), 100000) * 0.03;
  }
  if (incomeBand === 3) {
    return Math.min(deposit, 700000) * 0.03;
  }
  return 0;
}

function retirementServiceDeduction(years: number) {
  const serviceYears = Math.max(Math.floor(years), 1);
  if (serviceYears <= 5) return serviceYears * 1000000;
  if (serviceYears <= 10) return 5000000 + (serviceYears - 5) * 2000000;
  if (serviceYears <= 20) return 15000000 + (serviceYears - 10) * 2500000;
  return 40000000 + (serviceYears - 20) * 3000000;
}

function retirementConvertedSalaryDeduction(convertedSalary: number) {
  if (convertedSalary <= 8000000) return convertedSalary;
  if (convertedSalary <= 70000000) return 8000000 + (convertedSalary - 8000000) * 0.6;
  if (convertedSalary <= 100000000) return 45200000 + (convertedSalary - 70000000) * 0.55;
  if (convertedSalary <= 300000000) return 61700000 + (convertedSalary - 100000000) * 0.45;
  return 151700000 + (convertedSalary - 300000000) * 0.35;
}

function formatNumber(value: number, digits = 0) {
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function createSeededRandom(seed: number) {
  let state = Math.floor(Math.abs(seed)) % 2147483647;
  if (state <= 0) state = 1;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

function generateRandomIntegers(min: number, max: number, count: number, unique: boolean, seed: number) {
  const range = max - min + 1;
  if (range <= 0) return [];
  const random = createSeededRandom(seed);

  if (unique) {
    const pool = Array.from({ length: range }, (_, index) => min + index);
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }
    return pool.slice(0, count).sort((a, b) => a - b);
  }

  return Array.from({ length: count }, () => min + Math.floor(random() * range));
}

function generatePassword(length: number, includeUpper: boolean, includeLower: boolean, includeNumbers: boolean, includeSymbols: boolean, seed: number) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*_-+=?";
  const pools = [
    includeUpper ? upper : "",
    includeLower ? lower : "",
    includeNumbers ? numbers : "",
    includeSymbols ? symbols : ""
  ].filter(Boolean);
  const fallbackPools = pools.length ? pools : [upper, lower, numbers];
  const all = fallbackPools.join("");
  const random = createSeededRandom(seed);
  const chars: string[] = [];

  fallbackPools.forEach((pool) => {
    chars.push(pool[Math.floor(random() * pool.length)]);
  });

  while (chars.length < length) {
    chars.push(all[Math.floor(random() * all.length)]);
  }

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }

  return chars.slice(0, length).join("");
}

function progressiveTax(value: number, brackets: { limit: number; rate: number }[]) {
  let total = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const taxable = Math.min(value, bracket.limit) - previousLimit;
    if (taxable > 0) total += taxable * bracket.rate;
    if (value <= bracket.limit) break;
    previousLimit = bracket.limit;
  }

  return total;
}

function rentalTradeValue(deposit: number, monthlyRent: number) {
  const byHundred = deposit + monthlyRent * 100;
  return byHundred < 50000000 ? deposit + monthlyRent * 70 : byHundred;
}

function housingBrokerageTerms(transactionType: number, tradeValue: number) {
  if (transactionType === 0) {
    if (tradeValue < 50000000) return { rate: 0.006, cap: 250000, label: "5천만원 미만 매매 상한" };
    if (tradeValue < 200000000) return { rate: 0.005, cap: 800000, label: "5천만원 이상 2억원 미만 매매 상한" };
    if (tradeValue < 900000000) return { rate: 0.004, cap: null, label: "2억원 이상 9억원 미만 매매 상한" };
    if (tradeValue < 1200000000) return { rate: 0.005, cap: null, label: "9억원 이상 12억원 미만 매매 상한" };
    if (tradeValue < 1500000000) return { rate: 0.006, cap: null, label: "12억원 이상 15억원 미만 매매 상한" };
    return { rate: 0.007, cap: null, label: "15억원 이상 매매 상한" };
  }

  if (tradeValue < 50000000) return { rate: 0.005, cap: 200000, label: "5천만원 미만 임대차 상한" };
  if (tradeValue < 100000000) return { rate: 0.004, cap: 300000, label: "5천만원 이상 1억원 미만 임대차 상한" };
  if (tradeValue < 600000000) return { rate: 0.003, cap: null, label: "1억원 이상 6억원 미만 임대차 상한" };
  if (tradeValue < 1200000000) return { rate: 0.004, cap: null, label: "6억원 이상 12억원 미만 임대차 상한" };
  if (tradeValue < 1500000000) return { rate: 0.005, cap: null, label: "12억원 이상 15억원 미만 임대차 상한" };
  return { rate: 0.006, cap: null, label: "15억원 이상 임대차 상한" };
}

function calculateHousingPropertyTax(taxBase: number) {
  if (taxBase <= 60000000) return { tax: taxBase * 0.001 };
  if (taxBase <= 150000000) return { tax: taxBase * 0.0015 - 30000 };
  if (taxBase <= 300000000) return { tax: taxBase * 0.0025 - 180000 };
  return { tax: taxBase * 0.004 - 630000 };
}

function calculateComprehensiveRealEstateTax(taxBase: number, homeCount: number) {
  const rates =
    homeCount >= 3
      ? [
          { limit: 300000000, rate: 0.005 },
          { limit: 600000000, rate: 0.007 },
          { limit: 1200000000, rate: 0.01 },
          { limit: 2500000000, rate: 0.02 },
          { limit: 5000000000, rate: 0.03 },
          { limit: 9400000000, rate: 0.04 },
          { limit: Number.POSITIVE_INFINITY, rate: 0.05 }
        ]
      : [
          { limit: 300000000, rate: 0.005 },
          { limit: 600000000, rate: 0.007 },
          { limit: 1200000000, rate: 0.01 },
          { limit: 2500000000, rate: 0.013 },
          { limit: 5000000000, rate: 0.015 },
          { limit: 9400000000, rate: 0.02 },
          { limit: Number.POSITIVE_INFINITY, rate: 0.027 }
        ];

  return progressiveTax(taxBase, rates);
}

function lotteryTax(prizeAmount: number) {
  const prize = Math.max(prizeAmount, 0);
  if (prize <= 50000) {
    return {
      taxable: 0,
      lowBase: 0,
      highBase: 0,
      incomeTax: 0,
      localTax: 0,
      totalTax: 0,
      netPrize: prize
    };
  }

  const taxable = prize;
  const lowBase = Math.min(taxable, 300000000);
  const highBase = Math.max(taxable - 300000000, 0);
  const incomeTax = Math.floor(lowBase * 0.2 + highBase * 0.3);
  const localTax = Math.floor(incomeTax * 0.1);
  const totalTax = incomeTax + localTax;

  return {
    taxable,
    lowBase,
    highBase,
    incomeTax,
    localTax,
    totalTax,
    netPrize: Math.max(prize - totalTax, 0)
  };
}

function formatKcal(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")} kcal`;
}

function bmiStatus(bmi: number) {
  if (bmi < 18.5) return "저체중";
  if (bmi < 23) return "정상";
  if (bmi < 25) return "과체중";
  if (bmi < 30) return "비만";
  return "고도비만";
}

export const calculators: CalculatorConfig[] = [
  {
    slug: "graphing-calculator",
    title: "그래핑 계산기",
    description: "여러 개의 x 함수식을 직접 입력하고 좌표축 범위, 각도 단위, 값 추적을 조정해 그래프를 확인합니다.",
    category: "수학",
    keywords: ["그래핑 계산기", "함수 그래프", "그래프 계산기", "수식 그래프", "좌표 그래프"],
    badge: "수식 그래프",
    audience: "수학 학습자, 그래프 시각화 사용자",
    fields: [],
    guideTitle: "그래핑 계산기 사용 기준",
    guide: [
      "수식 입력칸에 x를 변수로 쓰는 함수식을 입력하면 같은 좌표평면에 여러 그래프를 함께 그립니다.",
      "x, y 범위를 직접 조정하고 값 추적 x를 움직여 각 함수의 y 값을 비교할 수 있습니다."
    ],
    checkpoints: [
      "예: x^2, sin(x), 0.5x+1처럼 입력할 수 있습니다.",
      "Rad/Deg 버튼으로 삼각함수 각도 단위를 바꿀 수 있습니다.",
      "정의역 밖의 값이나 계산 불가 구간은 그래프 선이 끊겨 보입니다."
    ],
    faqs: [
      { question: "임의의 수식을 직접 입력할 수 있나요?", answer: "네. x를 변수로 쓰고 사칙연산, 거듭제곱, 삼각함수, 로그, 제곱근 함수를 조합할 수 있습니다." },
      { question: "여러 그래프를 동시에 비교할 수 있나요?", answer: "네. 수식 추가 버튼이나 예시 버튼으로 여러 함수를 같은 좌표평면에 표시할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "수식 그래프",
        subline: "전용 그래프 패널에서 함수식을 입력하세요.",
        rows: [
          { label: "지원", value: "여러 수식, 좌표 범위 조정, 각도 단위, 값 추적", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "scientific-calculator",
    title: "공학용 계산기",
    description: "수식을 직접 입력하거나 버튼으로 조합해 삼각함수, 로그, 제곱근, 거듭제곱, 팩토리얼, 메모리 계산을 처리합니다.",
    category: "수학",
    keywords: ["공학용 계산기", "과학 계산기", "수식 계산기", "삼각함수", "로그", "제곱근"],
    badge: "수식 입력",
    audience: "공학 계산, 수학 과제, 과학 계산 사용자",
    fields: [],
    guideTitle: "공학용 계산기 사용 기준",
    guide: [
      "숫자와 연산자 버튼을 누르거나 키보드로 수식을 직접 입력한 뒤 Enter 또는 = 버튼으로 계산합니다.",
      "삼각함수, 역삼각함수, 로그, 제곱근, 세제곱근, 거듭제곱, 계승, 괄호, Ans, 메모리 값을 함께 사용할 수 있습니다."
    ],
    checkpoints: [
      "삼각함수 계산 전 Deg/Rad 단위를 확인하세요.",
      "예: sin(30)+sqrt(16)*2, log(1000), 2^8처럼 입력할 수 있습니다.",
      "계산 기록과 메모리 값은 이 브라우저에 저장됩니다."
    ],
    faqs: [
      { question: "수식을 통째로 입력할 수 있나요?", answer: "네. 괄호, 함수, 거듭제곱, 계승이 포함된 식을 한 번에 계산할 수 있습니다." },
      { question: "도와 라디안을 모두 지원하나요?", answer: "네. 계산기 상단의 Deg/Rad 버튼으로 삼각함수 각도 단위를 전환할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "수식 입력 계산기",
        subline: "전용 계산기 패널에서 수식을 입력하세요.",
        rows: [
          { label: "지원", value: "삼각함수, 역삼각함수, 로그, 제곱근, 거듭제곱, 계승, 메모리, 기록", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "four-function-calculator",
    title: "사칙 연산 계산기",
    description: "숫자 버튼과 연산자 버튼으로 덧셈, 뺄셈, 곱셈, 나눗셈, 퍼센트, 부호 전환을 처리하는 기본 계산기입니다.",
    category: "수학",
    keywords: ["사칙 연산 계산기", "기본 계산기", "간단 계산", "온라인 계산기", "퍼센트 계산"],
    badge: "버튼 계산",
    audience: "간단 계산, 학습용 기본 연산 사용자",
    fields: [],
    guideTitle: "사칙 연산 계산 기준",
    guide: [
      "숫자와 +, -, ×, ÷ 버튼을 눌러 계산식을 만들고 = 버튼 또는 Enter로 결과를 확인합니다.",
      "소수점, 부호 전환, 퍼센트 변환, 한 글자 지우기, 전체 지우기와 최근 계산 기록을 지원합니다."
    ],
    checkpoints: [
      "키보드 숫자와 +, -, *, /, Enter, Backspace도 사용할 수 있습니다.",
      "% 버튼은 마지막 숫자를 100으로 나눈 값으로 바꿉니다.",
      "0으로 나누면 계산 불가로 표시됩니다."
    ],
    faqs: [
      { question: "버튼으로 바로 계산할 수 있나요?", answer: "네. 숫자와 연산자 버튼을 눌러 식을 만들고 = 버튼으로 결과를 확인할 수 있습니다." },
      { question: "계산 기록이 저장되나요?", answer: "네. 최근 10건의 계산식과 결과가 이 브라우저에 저장됩니다." }
    ],
    calculate() {
      return {
        headline: "버튼식 기본 계산기",
        subline: "전용 계산기 패널에서 숫자와 연산자를 입력하세요.",
        rows: [
          { label: "지원", value: "덧셈, 뺄셈, 곱셈, 나눗셈, 소수점, 퍼센트, 부호 전환, 기록", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "math-notes",
    title: "노트",
    description: "텍스트, 수식, 슬라이더, 그래프, 표, 이미지, 폴더, 실행 버튼을 한 페이지에 쌓아 활동지를 만드는 수학 노트입니다.",
    category: "수학",
    keywords: ["수학 노트", "풀이 노트", "수식 노트", "그래프 노트", "수학 활동지", "Desmos 노트"],
    badge: "인터랙티브 노트",
    audience: "수식, 변수, 그래프, 활동지를 한 화면에 정리하는 학습자와 교사",
    fields: [],
    guideTitle: "수학 노트 사용 기준",
    guide: [
      "텍스트 줄에는 풀이 과정과 조건을 적고 변수 토큰을 넣어 계산값을 문장 안에 표시할 수 있습니다.",
      "수식 줄에는 일반 수식이나 a=5 같은 변수 지정을 입력하고, 그래프 줄에는 여러 식을 줄 단위로 입력해 같은 좌표평면에서 확인합니다.",
      "슬라이더, 좌표표, 이미지, 목차, 폴더, 버튼, 미리보기 모드를 이용해 문서형 수학 활동지를 구성할 수 있습니다.",
      "노트는 브라우저에 자동 저장되며 JSON 파일로 내보내거나 다시 불러올 수 있습니다."
    ],
    checkpoints: [
      "수식 줄에서 만든 변수와 슬라이더 변수는 텍스트 토큰, 수식, 그래프에서 다시 사용할 수 있습니다.",
      "그래프 범위는 x, y 최소·최대값으로 조정할 수 있고 y=식과 x=상수선을 함께 표시할 수 있습니다.",
      "줄 이동, 복제, 폴더 접기, 되돌리기, 다시 실행, 예제 노트, 파일 저장·불러오기를 지원합니다."
    ],
    faqs: [
      { question: "텍스트와 수식을 함께 적을 수 있나요?", answer: "네. 줄마다 텍스트, 계산, 그래프 유형을 바꿔 풀이 흐름을 정리할 수 있습니다." },
      { question: "변수 값을 저장해 다음 줄에서 쓸 수 있나요?", answer: "네. 예를 들어 a=5를 먼저 입력하면 아래 계산 줄에서 a^2처럼 사용할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "수학 노트",
        subline: "전용 노트 패널에서 텍스트, 수식, 슬라이더, 그래프, 표, 이미지, 폴더, 버튼을 추가하세요.",
        rows: [
          { label: "지원", value: "텍스트 토큰, 수식, 변수 지정, 슬라이더, 그래프, x=상수선, 좌표표, 이미지, 목차, 폴더, 버튼, undo/redo, 파일 저장", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "matrix-calculator",
    title: "행렬 계산기",
    description: "A, B, C 행렬을 직접 만들고 행렬식, 역행렬, 전치, RREF, 덧셈, 뺄셈, 곱셈, 스칼라 연산을 식으로 계산합니다.",
    category: "수학",
    keywords: ["행렬 계산기", "행렬 연산", "행렬식", "역행렬", "RREF", "전치행렬"],
    badge: "행렬 작업판",
    audience: "선형대수, 행렬 연산 사용자",
    fields: [],
    guideTitle: "행렬 계산기 사용 기준",
    guide: [
      "A, B, C 세 행렬의 크기를 1x1부터 5x5까지 바꾸고 각 원소를 직접 입력할 수 있습니다.",
      "식 입력칸에서 A+B, A*B, 2*A-B, det(A), inv(A), transpose(B), rref(C)처럼 계산합니다.",
      "결과가 행렬이면 다시 A, B, C 중 하나에 저장해 다음 계산에 이어 사용할 수 있습니다."
    ],
    checkpoints: [
      "덧셈과 뺄셈은 같은 크기의 행렬끼리만 가능합니다.",
      "행렬 곱셈은 왼쪽 열 개수와 오른쪽 행 개수가 같아야 합니다.",
      "det와 inv는 정사각행렬에서만 의미가 있습니다."
    ],
    faqs: [
      { question: "3x3 이상도 계산할 수 있나요?", answer: "네. A, B, C 행렬을 1x1부터 5x5까지 조정해 계산할 수 있습니다." },
      { question: "계산 결과를 다시 행렬로 사용할 수 있나요?", answer: "네. 결과가 행렬이면 A, B, C 중 하나에 저장해 다음 식에서 다시 사용할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "행렬 작업판",
        subline: "전용 행렬 패널에서 행렬을 만들고 식으로 계산하세요.",
        rows: [
          { label: "지원", value: "A/B/C 행렬 편집, 크기 변경, det, inv, transpose, rref, +, -, *, 스칼라 연산, 결과 저장", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "derivative-calculator",
    title: "도함수 계산기",
    description: "함수 f(x)와 x 값을 입력해 해당 지점의 수치 미분값과 접선 기울기를 계산합니다.",
    category: "수학",
    keywords: ["도함수 계산기", "미분 계산기", "접선 기울기", "수치 미분", "함수 미분"],
    badge: "미분·접선",
    audience: "미적분 학습자, 함수 변화율을 확인하는 사용자",
    fields: [],
    guideTitle: "도함수 계산 기준",
    guide: [
      "입력한 함수 f(x)를 중심차분 방식으로 계산해 x 지점의 기울기를 추정합니다.",
      "수식에는 x, pi, e, sin, cos, tan, log, ln, sqrt, abs 같은 기본 함수와 상수를 사용할 수 있습니다.",
      "심볼릭 전개식이 아니라 수치 미분값이므로 불연속점이나 뾰족점에서는 결과가 불안정할 수 있습니다."
    ],
    checkpoints: [
      "x^2, sin(x), log(x), sqrt(x)처럼 x를 포함한 식을 입력하세요.",
      "분모가 0이 되는 지점이나 정의역 밖에서는 계산이 실패할 수 있습니다.",
      "접선식은 계산 지점 근처에서만 근사적으로 의미가 있습니다."
    ],
    faqs: [
      { question: "단계별 풀이도 나오나요?", answer: "현재는 수치 미분값과 접선식을 빠르게 확인하는 계산기입니다." },
      { question: "삼각함수 각도는 어떤 단위인가요?", answer: "기본은 라디안이며 화면에서 도/라디안을 바꿀 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "함수 입력",
        subline: "전용 미분 패널에서 f(x), x 값, 각도 단위를 설정하세요.",
        rows: [{ label: "지원", value: "수치 미분, 접선 기울기, 접선식, 좌우 기울기 비교", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "integral-calculator",
    title: "정적분 계산기",
    description: "함수 f(x)와 구간 [a, b]를 입력해 Simpson 방식으로 정적분 면적을 근사 계산합니다.",
    category: "수학",
    keywords: ["정적분 계산기", "적분 계산기", "면적 계산", "수치 적분", "Simpson 적분"],
    badge: "정적분·면적",
    audience: "미적분 학습자, 함수 아래 면적을 빠르게 추정하는 사용자",
    fields: [],
    guideTitle: "정적분 계산 기준",
    guide: [
      "입력한 함수 f(x)를 구간 [a, b]에서 Simpson 규칙으로 근사 적분합니다.",
      "양의 면적과 음의 면적을 부호 포함 순면적으로 계산하며, 절대면적도 함께 보여줍니다.",
      "불연속점, 급격한 진동, 정의역 오류가 있는 구간에서는 실제 적분값과 차이가 커질 수 있습니다."
    ],
    checkpoints: [
      "구간 안에서 함수가 정의되는지 먼저 확인하세요.",
      "샘플 수가 많을수록 보통 정확도가 좋아지지만 계산이 조금 무거워질 수 있습니다.",
      "면적을 양수로만 보고 싶다면 절대면적 값을 함께 확인하세요."
    ],
    faqs: [
      { question: "부정적분 공식도 보여주나요?", answer: "아니요. 현재는 지정 구간의 수치 정적분 값을 계산합니다." },
      { question: "sin(x)는 라디안 기준인가요?", answer: "기본은 라디안이며 화면에서 도/라디안을 전환할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "구간 입력",
        subline: "전용 적분 패널에서 f(x), 시작값, 끝값, 샘플 수를 설정하세요.",
        rows: [{ label: "지원", value: "정적분, 절대면적, 평균값, Simpson 근사", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "quadratic-formula",
    title: "2차 방정식 계산기",
    description: "ax²+bx+c=0의 계수 a, b, c를 입력해 판별식, 실근 또는 복소근, 꼭짓점과 축을 계산합니다.",
    category: "수학",
    keywords: ["2차 방정식 계산기", "근의 공식", "판별식 계산기", "이차함수 꼭짓점", "quadratic formula"],
    badge: "근의 공식",
    audience: "대수, 방정식, 이차함수 학습자",
    fields: [
      { name: "a", label: "a 계수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: 1 },
      { name: "b", label: "b 계수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: -3 },
      { name: "c", label: "c 계수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: 2 }
    ],
    guideTitle: "2차 방정식 계산 기준",
    guide: [
      "판별식 D=b²-4ac를 계산하고 D의 부호에 따라 서로 다른 두 실근, 중근, 복소근을 구분합니다.",
      "a가 0이면 2차 방정식이 아니므로 bx+c=0의 1차 방정식으로 안내합니다.",
      "꼭짓점은 x=-b/2a, y=f(x) 기준으로 계산합니다."
    ],
    checkpoints: [
      "근의 공식은 a가 0이 아닌 ax²+bx+c=0 형태에서 사용합니다.",
      "D가 0보다 작으면 실수 범위에서 그래프가 x축과 만나지 않습니다.",
      "계수가 소수이면 표시값은 반올림되어 보일 수 있습니다."
    ],
    faqs: [
      { question: "복소근도 계산되나요?", answer: "네. 판별식이 음수일 때 실수부와 허수부 형태로 표시합니다." },
      { question: "이차함수 꼭짓점도 볼 수 있나요?", answer: "네. 축 x=-b/2a와 꼭짓점 좌표를 함께 보여줍니다." }
    ],
    calculate(values) {
      const a = values.a;
      const b = values.b;
      const c = values.c;
      if (Math.abs(a) < 1e-12) {
        if (Math.abs(b) < 1e-12) {
          const message = Math.abs(c) < 1e-12 ? "모든 x가 해" : "해 없음";
          return {
            headline: message,
            subline: "a와 b가 0이라 2차 방정식 또는 1차 방정식이 아닙니다.",
            rows: [
              { label: "방정식", value: `${formatNumber(c, 4)} = 0` },
              { label: "판정", value: message, tone: "strong" }
            ],
            chart: []
          };
        }
        const root = -c / b;
        return {
          headline: `x = ${formatNumber(root, 6)}`,
          subline: "a=0이라 1차 방정식 bx+c=0으로 계산했습니다.",
          rows: [
            { label: "1차 해", value: `x = ${formatNumber(root, 6)}`, tone: "strong" },
            { label: "계수 b", value: formatNumber(b, 4) },
            { label: "계수 c", value: formatNumber(c, 4) }
          ],
          chart: [
            { name: "b", value: Math.abs(b) },
            { name: "c", value: Math.abs(c) }
          ]
        };
      }

      const discriminant = b * b - 4 * a * c;
      const axis = -b / (2 * a);
      const vertexY = a * axis * axis + b * axis + c;
      let roots = "";
      if (discriminant > 0) {
        const sqrtD = Math.sqrt(discriminant);
        roots = `x₁=${formatNumber((-b + sqrtD) / (2 * a), 6)}, x₂=${formatNumber((-b - sqrtD) / (2 * a), 6)}`;
      } else if (Math.abs(discriminant) < 1e-12) {
        roots = `x=${formatNumber(axis, 6)} (중근)`;
      } else {
        const real = -b / (2 * a);
        const imag = Math.sqrt(Math.abs(discriminant)) / Math.abs(2 * a);
        roots = `x=${formatNumber(real, 6)} ± ${formatNumber(imag, 6)}i`;
      }

      return {
        headline: roots,
        subline: `판별식 D=${formatNumber(discriminant, 4)} · 꼭짓점 (${formatNumber(axis, 4)}, ${formatNumber(vertexY, 4)})`,
        rows: [
          { label: "판별식", value: formatNumber(discriminant, 6), tone: "strong" },
          { label: "근", value: roots, tone: "strong" },
          { label: "대칭축", value: `x=${formatNumber(axis, 6)}` },
          { label: "꼭짓점", value: `(${formatNumber(axis, 6)}, ${formatNumber(vertexY, 6)})` },
          { label: "그래프 방향", value: a > 0 ? "위로 열린 포물선" : "아래로 열린 포물선" }
        ],
        chart: [
          { name: "a", value: Math.abs(a) },
          { name: "b", value: Math.abs(b) },
          { name: "c", value: Math.abs(c) },
          { name: "D", value: Math.abs(discriminant) }
        ]
      };
    }
  },
  {
    slug: "factoring-calculator",
    title: "인수분해 계산기",
    description: "2차식 ax²+bx+c의 근과 판별식을 이용해 실수 범위 인수분해 형태를 계산합니다.",
    category: "수학",
    keywords: ["인수분해 계산기", "2차식 인수분해", "다항식 인수분해", "근과 계수", "이차식 분해"],
    badge: "대수 인수분해",
    audience: "대수식 전개와 인수분해를 학습하는 사용자",
    fields: [
      { name: "a", label: "a 계수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: 1 },
      { name: "b", label: "b 계수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: -5 },
      { name: "c", label: "c 계수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: 6 }
    ],
    guideTitle: "인수분해 계산 기준",
    guide: [
      "2차식 ax²+bx+c를 기준으로 판별식과 근을 계산해 a(x-r₁)(x-r₂) 형태로 표시합니다.",
      "판별식이 음수이면 실수 범위에서는 1차식 곱으로 인수분해되지 않는다고 안내합니다.",
      "계수가 소수이거나 근이 무리수이면 결과는 소수 근사값으로 표시됩니다."
    ],
    checkpoints: [
      "정확한 정수 인수분해가 필요한 경우 계수 a, b, c를 정수로 입력하세요.",
      "a가 0이면 2차식이 아니므로 bx+c 형태의 1차식으로 안내합니다.",
      "실수 범위 인수분해와 복소수 범위 인수분해는 결과가 다릅니다."
    ],
    faqs: [
      { question: "x²-5x+6도 계산되나요?", answer: "네. a=1, b=-5, c=6을 입력하면 (x-2)(x-3) 형태로 볼 수 있습니다." },
      { question: "무리수 근도 표시되나요?", answer: "네. 소수 근사값으로 a(x-r₁)(x-r₂) 형태를 보여줍니다." }
    ],
    calculate(values) {
      const a = values.a;
      const b = values.b;
      const c = values.c;
      if (Math.abs(a) < 1e-12) {
        if (Math.abs(b) < 1e-12) {
          return {
            headline: formatNumber(c, 6),
            subline: "상수식입니다. 인수분해할 x 항이 없습니다.",
            rows: [
              { label: "식", value: `${formatNumber(c, 6)}` },
              { label: "판정", value: "상수식", tone: "strong" }
            ],
            chart: []
          };
        }
        const root = -c / b;
        return {
          headline: `${formatNumber(b, 6)}(x ${root >= 0 ? "-" : "+"} ${formatNumber(Math.abs(root), 6)})`,
          subline: "a=0이라 1차식 기준으로 정리했습니다.",
          rows: [
            { label: "인수 형태", value: `${formatNumber(b, 6)}(x ${root >= 0 ? "-" : "+"} ${formatNumber(Math.abs(root), 6)})`, tone: "strong" },
            { label: "근", value: `x=${formatNumber(root, 6)}` }
          ],
          chart: [
            { name: "b", value: Math.abs(b) },
            { name: "c", value: Math.abs(c) }
          ]
        };
      }

      const discriminant = b * b - 4 * a * c;
      if (discriminant < 0) {
        return {
          headline: "실수 인수분해 불가",
          subline: `판별식 D=${formatNumber(discriminant, 6)} < 0`,
          rows: [
            { label: "판별식", value: formatNumber(discriminant, 6), tone: "strong" },
            { label: "실수 범위", value: "1차식 곱으로 분해되지 않음", tone: "strong" },
            { label: "복소근", value: "2차 방정식 계산기에서 확인하세요." }
          ],
          chart: [
            { name: "a", value: Math.abs(a) },
            { name: "b", value: Math.abs(b) },
            { name: "c", value: Math.abs(c) }
          ]
        };
      }

      const sqrtD = Math.sqrt(discriminant);
      const root1 = (-b + sqrtD) / (2 * a);
      const root2 = (-b - sqrtD) / (2 * a);
      const factor = `${formatNumber(a, 6)}(x ${root1 >= 0 ? "-" : "+"} ${formatNumber(Math.abs(root1), 6)})(x ${root2 >= 0 ? "-" : "+"} ${formatNumber(Math.abs(root2), 6)})`;
      return {
        headline: factor,
        subline: `근 x=${formatNumber(root1, 6)}, ${formatNumber(root2, 6)}`,
        rows: [
          { label: "인수분해", value: factor, tone: "strong" },
          { label: "판별식", value: formatNumber(discriminant, 6) },
          { label: "첫 번째 근", value: formatNumber(root1, 6) },
          { label: "두 번째 근", value: formatNumber(root2, 6) }
        ],
        chart: [
          { name: "a", value: Math.abs(a) },
          { name: "D", value: discriminant },
          { name: "r1", value: Math.abs(root1) },
          { name: "r2", value: Math.abs(root2) }
        ]
      };
    }
  },
  {
    slug: "logarithm-calculator",
    title: "로그 계산기",
    description: "진수와 밑을 입력해 logₐ(x), 자연로그, 상용로그, 지수식 검산 값을 계산합니다.",
    category: "수학",
    keywords: ["로그 계산기", "log 계산기", "자연로그", "상용로그", "로그 밑 변환"],
    badge: "로그·지수",
    audience: "로그 값과 밑 변환 공식을 확인하는 학습자",
    fields: [
      { name: "value", label: "진수 x", type: "number", min: 0.000001, max: 1000000000, step: 0.1, defaultValue: 100 },
      { name: "base", label: "밑 a", type: "number", min: 0.000001, max: 1000000, step: 0.1, defaultValue: 10 }
    ],
    guideTitle: "로그 계산 기준",
    guide: [
      "logₐ(x)는 ln(x)/ln(a) 밑 변환 공식으로 계산합니다.",
      "진수 x는 0보다 커야 하며, 밑 a는 0보다 크고 1이 아니어야 합니다.",
      "자연로그 ln(x), 상용로그 log₁₀(x), 지수식 aʸ 검산값을 함께 표시합니다."
    ],
    checkpoints: [
      "밑이 1에 가까우면 값이 매우 커지거나 불안정할 수 있습니다.",
      "로그는 곱셈을 덧셈으로 바꾸는 지수의 역연산입니다.",
      "공학용 계산기의 log는 보통 상용로그, ln은 자연로그입니다."
    ],
    faqs: [
      { question: "ln과 log는 무엇이 다른가요?", answer: "ln은 밑이 e인 자연로그이고, log는 문맥에 따라 보통 밑 10인 상용로그를 뜻합니다." },
      { question: "밑이 2인 로그도 계산되나요?", answer: "네. 밑 a에 2를 입력하면 log₂(x)를 계산합니다." }
    ],
    calculate(values) {
      const x = values.value;
      const base = values.base;
      if (x <= 0 || base <= 0 || Math.abs(base - 1) < 1e-12) {
        return {
          headline: "계산 불가",
          subline: "진수는 0보다 크고, 밑은 0보다 크며 1이 아니어야 합니다.",
          rows: [
            { label: "진수 조건", value: "x > 0" },
            { label: "밑 조건", value: "a > 0, a ≠ 1" }
          ],
          chart: []
        };
      }
      const result = Math.log(x) / Math.log(base);
      const natural = Math.log(x);
      const common = Math.log10(x);
      const check = Math.pow(base, result);
      return {
        headline: formatNumber(result, 8),
        subline: `log_${formatNumber(base, 4)}(${formatNumber(x, 4)}) = ${formatNumber(result, 8)}`,
        rows: [
          { label: "로그값", value: formatNumber(result, 8), tone: "strong" },
          { label: "자연로그 ln(x)", value: formatNumber(natural, 8) },
          { label: "상용로그 log10(x)", value: formatNumber(common, 8) },
          { label: "밑 변환식", value: `ln(${formatNumber(x, 4)}) / ln(${formatNumber(base, 4)})` },
          { label: "검산 a^y", value: formatNumber(check, 8) }
        ],
        chart: [
          { name: "log_a(x)", value: Math.abs(result) },
          { name: "ln(x)", value: Math.abs(natural) },
          { name: "log10(x)", value: Math.abs(common) }
        ]
      };
    }
  },
  {
    slug: "inequality-calculator",
    title: "부등식 계산기",
    description: "1차 부등식 ax+b ? c를 입력해 이항, 나눗셈, 부등호 방향을 반영한 해 범위를 계산합니다.",
    category: "수학",
    keywords: ["부등식 계산기", "일차부등식", "부등호 계산", "해 범위", "inequality calculator"],
    badge: "1차 부등식",
    audience: "부등식 풀이와 해 범위를 확인하는 학습자",
    fields: [
      { name: "a", label: "a 계수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: 2 },
      { name: "b", label: "b 상수", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: 3 },
      {
        name: "operator",
        label: "부등호",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "<", value: 0 },
          { label: "≤", value: 1 },
          { label: ">", value: 2 },
          { label: "≥", value: 3 }
        ]
      },
      { name: "c", label: "오른쪽 값 c", type: "number", min: -100000, max: 100000, step: 0.1, defaultValue: 11 }
    ],
    guideTitle: "부등식 계산 기준",
    guide: [
      "ax+b ? c 형태의 1차 부등식을 ax ? c-b로 이항한 뒤 a로 나누어 해를 구합니다.",
      "음수로 나눌 때는 부등호 방향이 반대로 바뀝니다.",
      "a가 0이면 x에 관계없는 참/거짓 명제로 판정합니다."
    ],
    checkpoints: [
      "현재 계산기는 1차 부등식 ax+b ? c 형태를 지원합니다.",
      "음수 계수로 나눌 때 부등호가 바뀌는지 확인하는 학습용으로 좋습니다.",
      "연립부등식이나 2차 부등식은 별도 확장이 필요합니다."
    ],
    faqs: [
      { question: "음수로 나누면 자동으로 부등호가 바뀌나요?", answer: "네. a가 음수이면 해 표시에서 부등호 방향을 반대로 바꿉니다." },
      { question: "항이 양쪽에 있는 부등식도 가능한가요?", answer: "현재는 ax+b ? c 형태입니다. 양쪽 x항은 한쪽으로 정리한 뒤 입력하세요." }
    ],
    calculate(values) {
      const labels = ["<", "≤", ">", "≥"];
      const operator = Math.max(0, Math.min(3, Math.round(values.operator)));
      const rhs = values.c - values.b;
      const original = `${formatNumber(values.a, 4)}x + ${formatNumber(values.b, 4)} ${labels[operator]} ${formatNumber(values.c, 4)}`;
      if (Math.abs(values.a) < 1e-12) {
        const left = values.b;
        const truth = operator === 0 ? left < values.c : operator === 1 ? left <= values.c : operator === 2 ? left > values.c : left >= values.c;
        return {
          headline: truth ? "모든 실수" : "해 없음",
          subline: `x항이 없어 ${formatNumber(left, 4)} ${labels[operator]} ${formatNumber(values.c, 4)}를 판정했습니다.`,
          rows: [
            { label: "원래 부등식", value: original },
            { label: "판정", value: truth ? "항상 참" : "항상 거짓", tone: "strong" }
          ],
          chart: []
        };
      }
      const boundary = rhs / values.a;
      const flips = values.a < 0;
      const solvedOperator = flips
        ? operator === 0 ? ">" : operator === 1 ? "≥" : operator === 2 ? "<" : "≤"
        : labels[operator];
      return {
        headline: `x ${solvedOperator} ${formatNumber(boundary, 6)}`,
        subline: flips ? "음수로 나누어 부등호 방향을 바꿨습니다." : "양수로 나누어 부등호 방향을 유지했습니다.",
        rows: [
          { label: "원래 부등식", value: original },
          { label: "이항 후", value: `${formatNumber(values.a, 4)}x ${labels[operator]} ${formatNumber(rhs, 4)}` },
          { label: "계수 a", value: formatNumber(values.a, 4) },
          { label: "부등호 변화", value: flips ? "반전" : "유지" },
          { label: "해", value: `x ${solvedOperator} ${formatNumber(boundary, 6)}`, tone: "strong" }
        ],
        chart: [
          { name: "경계값", value: Math.abs(boundary) },
          { name: "a", value: Math.abs(values.a) },
          { name: "c-b", value: Math.abs(rhs) }
        ]
      };
    }
  },
  {
    slug: "geometry-tool",
    title: "기하학 도구",
    description: "좌표평면 위에서 점, 선분, 직선, 반직선, 다각형, 원, 각도, 중점, 평행선, 수직선을 작도하고 길이와 면적을 측정합니다.",
    category: "수학",
    keywords: ["기하학 도구", "도형 작도", "좌표평면", "거리", "면적", "원 작도", "각도", "중점", "평행선", "수직선"],
    badge: "기하 작도",
    audience: "기하 학습자, 도형 시각화 사용자",
    fields: [],
    guideTitle: "기하학 도구 사용 기준",
    guide: [
      "이동, 점, 선분, 직선, 반직선, 다각형, 원, 각도, 중점, 수직선, 평행선 도구를 전환해 작도합니다.",
      "도구별 안내에 맞춰 점을 선택하면 작도 목록에 추가되고, 이동 도구에서는 점을 드래그해 전체 작도를 조정할 수 있습니다.",
      "격자 맞춤과 이름 표시를 켜고 끌 수 있으며 선분 길이, 다각형 면적, 원 둘레, 각도 값을 함께 확인합니다."
    ],
    checkpoints: [
      "좌표는 -10부터 10까지의 격자 안에서 움직입니다.",
      "다각형 면적은 선택한 점을 연결한 순서대로 계산됩니다.",
      "원은 첫 번째 점을 중심, 두 번째 점을 반지름 기준점으로 사용합니다.",
      "수직선과 평행선은 기준선 두 점과 선이 지나갈 점을 차례로 선택합니다."
    ],
    faqs: [
      { question: "직접 도형을 드래그할 수 있나요?", answer: "네. 좌표평면의 점을 드래그해 선분, 다각형, 원을 조정할 수 있습니다." },
      { question: "점 좌표를 숫자로도 입력할 수 있나요?", answer: "네. 왼쪽 점 목록에서 각 점의 x, y 좌표를 직접 수정할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "인터랙티브 작도판",
        subline: "전용 기하 도구에서 점과 도형을 직접 조정하세요.",
        rows: [
          { label: "지원", value: "점 추가, 드래그, 선분, 직선, 반직선, 다각형, 원, 각도, 중점, 평행선, 수직선, 좌표 입력, 길이·면적 측정", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "three-d-calculator",
    title: "3D 계산기",
    description: "z=f(x,y) 수식을 입력해 회전·확대 가능한 3D 곡면 그래프를 그리고 범위, 해상도, 높이 배율을 조정합니다.",
    category: "수학",
    keywords: ["3D 계산기", "3D 그래프", "공간 그래프", "3차원 함수", "곡면 그래프"],
    badge: "3D 그래프",
    audience: "공간 그래프와 3D 수학 시각화 사용자",
    fields: [],
    guideTitle: "3D 그래프 사용 기준",
    guide: [
      "수식 입력칸에 x, y를 변수로 쓰는 z=f(x,y) 형태의 식을 입력하면 3D 곡면을 그립니다.",
      "마우스나 터치로 그래프를 회전하고 휠로 확대·축소하며 범위, 해상도, 높이 배율을 조정할 수 있습니다."
    ],
    checkpoints: [
      "예: sin(sqrt(x^2+y^2)), cos(x)+sin(y), 0.08*(x^2-y^2)처럼 입력할 수 있습니다.",
      "해상도가 높을수록 곡면은 부드럽지만 렌더링 비용이 커집니다.",
      "정의되지 않는 값은 0으로 처리하고 그래프 범위 안에서 시각화합니다."
    ],
    faqs: [
      { question: "수식을 직접 입력할 수 있나요?", answer: "네. x와 y를 변수로 쓰는 함수식을 입력해 3D 곡면 그래프를 그릴 수 있습니다." },
      { question: "그래프를 회전할 수 있나요?", answer: "네. 그래프 영역을 드래그하면 회전하고, 휠 또는 트랙패드로 확대·축소할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "3D 곡면 그래프",
        subline: "전용 3D 그래프 패널에서 수식을 입력하세요.",
        rows: [
          { label: "지원", value: "z=f(x,y) 수식, 회전, 확대·축소, 범위, 해상도, 높이 배율, 와이어프레임", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "web-calculator",
    title: "웹 계산기",
    description: "긴 수식, 괄호, 삼각함수, 로그, 거듭제곱, 계승, 메모리, 계산 기록을 지원하는 웹 계산기입니다.",
    category: "수학",
    keywords: ["웹 계산기", "온라인 계산기", "공학용 계산기", "수식 계산", "계산 기록", "메모리 계산"],
    badge: "수식 입력",
    audience: "브라우저에서 빠르게 수식과 공학 계산을 처리하는 사용자",
    fields: [],
    guideTitle: "웹 계산기 사용 기준",
    guide: [
      "숫자와 연산자 버튼으로 수식을 만들거나 키보드로 직접 입력한 뒤 Enter 또는 = 버튼으로 계산합니다.",
      "삼각함수, 로그, 제곱근, 거듭제곱, 계승, 괄호, Ans, 메모리, 최근 10건 계산 기록을 브라우저 안에서 처리합니다."
    ],
    checkpoints: [
      "삼각함수 계산 전 Deg/Rad 단위를 확인하세요.",
      "M+, M-, MR로 메모리 값을 저장하고 다시 불러올 수 있습니다.",
      "계산 기록은 이 브라우저에 최근 10건까지 저장됩니다."
    ],
    faqs: [
      { question: "수식을 통째로 입력할 수 있나요?", answer: "네. 괄호, 거듭제곱, 함수가 포함된 식을 입력해 한 번에 계산할 수 있습니다." },
      { question: "입력 내용이 서버로 전송되나요?", answer: "아니요. 계산과 기록 저장은 브라우저 안에서 처리됩니다." }
    ],
    calculate() {
      return {
        headline: "수식 입력 계산기",
        subline: "전용 계산기 패널에서 수식을 입력하세요.",
        rows: [
          { label: "지원", value: "괄호, 삼각함수, 로그, 제곱근, 거듭제곱, 계승, 메모리, 기록", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "minimum-wage",
    title: "최저임금 모의 계산기",
    description: "월 지급액과 주 소정근로시간을 기준으로 환산 시급이 2026년 최저임금 이상인지 확인합니다.",
    category: "노무",
    keywords: ["최저임금 계산기", "최저시급 계산기", "최저임금 모의 계산기", "월급 최저임금"],
    badge: "2026년 최저시급 10,320원",
    audience: "아르바이트, 근로자, 급여 담당자",
    fields: [
      { name: "monthlyComparableWage", label: "월 최저임금 산입 대상 임금", type: "number", unit: "원", min: 0, max: 30000000, step: 100000, defaultValue: 2156880 },
      { name: "weeklyHours", label: "주 소정근로시간", type: "number", unit: "시간", min: 1, max: 40, step: 0.5, defaultValue: 40 },
      { name: "weeklyPaidHolidayHours", label: "주 유급주휴시간", type: "number", unit: "시간", min: 0, max: 8, step: 0.5, defaultValue: 8 },
      {
        name: "probationDiscount",
        label: "수습 90% 적용",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "적용 안 함", value: 0 },
          { label: "적용 가능", value: 1 }
        ],
        help: "1년 이상 계약, 수습 3개월 이내 등 요건을 충족할 때만 제한적으로 적용됩니다."
      }
    ],
    guideTitle: "최저임금 판정 기준",
    guide: [
      "2026년 적용 최저임금은 시간급 10,320원입니다. 주 40시간에 유급주휴 8시간을 포함한 월 환산 기준은 209시간, 월 2,156,880원입니다.",
      "월급제는 월 지급액 중 최저임금 산입 대상 임금을 월 유급시간으로 나누어 환산 시급을 계산한 뒤 최저임금과 비교합니다.",
      "수습 감액은 모든 근로자에게 적용되는 것이 아닙니다. 1년 이상 근로계약, 수습 3개월 이내 등 요건과 단순노무직 제외 여부를 함께 확인해야 합니다."
    ],
    checkpoints: [
      "상여금, 식대, 교통비 등은 지급 조건에 따라 최저임금 산입 여부가 달라질 수 있습니다.",
      "주휴수당을 포함해 월 유급시간을 계산해야 월급제 최저임금 판정이 가능합니다.",
      "계산 결과가 부족하면 근로계약서, 급여명세서, 출퇴근 기록을 함께 확인하세요."
    ],
    faqs: [
      { question: "월 209시간은 언제 쓰나요?", answer: "주 40시간 근무와 주휴 8시간을 포함한 통상적인 월 환산 시간입니다. 근무시간이 다르면 월 유급시간도 달라집니다." },
      { question: "세전 월급으로 입력하나요?", answer: "네. 최저임금 판정은 공제 전 임금 중 최저임금 산입 대상 임금을 기준으로 보는 것이 일반적입니다." }
    ],
    calculate(values) {
      const weeklyPaidHours = values.weeklyHours + values.weeklyPaidHolidayHours;
      const monthlyPaidHours = d(weeklyPaidHours).mul(365).div(7).div(12).toNumber();
      const standardHourlyWage = values.probationDiscount === 1 ? legalStandards.minimumWage * 0.9 : legalStandards.minimumWage;
      const requiredMonthlyWage = d(standardHourlyWage).mul(monthlyPaidHours).toNumber();
      const hourlyEquivalent = monthlyPaidHours > 0 ? values.monthlyComparableWage / monthlyPaidHours : 0;
      const shortage = Math.max(requiredMonthlyWage - values.monthlyComparableWage, 0);
      const surplus = Math.max(values.monthlyComparableWage - requiredMonthlyWage, 0);
      const isCompliant = shortage <= 0;

      return {
        headline: isCompliant ? "최저임금 충족" : `월 ${formatWon(shortage)} 부족`,
        subline: `환산 시급 ${formatWon(hourlyEquivalent)} · 기준 시급 ${formatWon(standardHourlyWage)}`,
        rows: [
          { label: "월 유급시간", value: `${monthlyPaidHours.toFixed(1)}시간` },
          { label: "환산 시급", value: formatWon(hourlyEquivalent), tone: isCompliant ? "strong" : undefined },
          { label: "적용 기준 시급", value: formatWon(standardHourlyWage) },
          { label: "필요 월 임금", value: formatWon(requiredMonthlyWage) },
          { label: isCompliant ? "월 기준 초과액" : "월 기준 부족액", value: formatWon(isCompliant ? surplus : shortage), tone: "strong" },
          { label: "판정", value: isCompliant ? "최저임금 이상" : "최저임금 미달 가능성", tone: isCompliant ? "strong" : "muted" }
        ],
        chart: [
          { name: "지급액", value: values.monthlyComparableWage },
          { name: "필요액", value: requiredMonthlyWage },
          { name: "차이", value: isCompliant ? surplus : shortage }
        ]
      };
    }
  },
  {
    slug: "unpaid-wage",
    title: "임금체불 계산기",
    description: "미지급 월급, 주휴수당, 연차수당, 퇴직금, 연장·야간·휴일수당을 합산해 임금체불 추정액을 계산합니다.",
    category: "노무",
    keywords: ["임금체불 계산기", "미지급 임금", "노동청 신고", "퇴직금 체불"],
    badge: "체불임금 항목별 합산",
    audience: "급여를 제때 받지 못한 근로자, 퇴직 정산 확인 사용자",
    fields: [
      { name: "monthlyUnpaidWage", label: "미지급 월급", type: "number", unit: "원", min: 0, max: 30000000, step: 100000, defaultValue: 2600000 },
      { name: "unpaidMonths", label: "미지급 개월 수", type: "number", unit: "개월", min: 0, max: 24, step: 0.5, defaultValue: 1 },
      { name: "hourlyWage", label: "통상 시급", type: "number", unit: "원", min: 10320, max: 100000, step: 100, defaultValue: legalStandards.minimumWage },
      { name: "weeklyHours", label: "주 소정근로시간", type: "number", unit: "시간", min: 1, max: 52, step: 0.5, defaultValue: 40 },
      { name: "unpaidWeeks", label: "주휴수당 미지급 주수", type: "number", unit: "주", min: 0, max: 104, step: 1, defaultValue: 4 },
      { name: "dailyHours", label: "1일 소정근로시간", type: "number", unit: "시간", min: 1, max: 12, step: 0.5, defaultValue: 8 },
      { name: "unusedAnnualLeaveDays", label: "미사용 연차일수", type: "number", unit: "일", min: 0, max: 50, step: 0.5, defaultValue: 0 },
      { name: "severanceMonthlyPay", label: "퇴직금 기준 월 평균임금", type: "number", unit: "원", min: 0, max: 30000000, step: 100000, defaultValue: 2600000 },
      { name: "serviceMonths", label: "계속근로기간", type: "number", unit: "개월", min: 0, max: 480, step: 1, defaultValue: 12 },
      { name: "overtimeHours", label: "미지급 연장근로시간", type: "number", unit: "시간", min: 0, max: 1000, step: 0.5, defaultValue: 0 },
      { name: "nightHours", label: "미지급 야간근로시간", type: "number", unit: "시간", min: 0, max: 1000, step: 0.5, defaultValue: 0 },
      { name: "holidayHours", label: "미지급 휴일근로시간", type: "number", unit: "시간", min: 0, max: 1000, step: 0.5, defaultValue: 0 }
    ],
    guideTitle: "임금체불 추정 기준",
    guide: [
      "임금체불은 정해진 지급일에 임금, 퇴직금, 각종 수당이 전부 또는 일부 지급되지 않은 상태를 말합니다. 이 계산기는 미지급 월급, 주휴수당, 연차수당, 퇴직금, 연장·야간·휴일근로수당을 항목별로 합산합니다.",
      "주휴수당은 주 소정근로시간이 15시간 이상인 경우를 전제로 추정하며, 주 40시간 이상은 8시간분을 한도로 계산합니다. 연차수당은 통상시급 × 1일 소정근로시간 × 미사용 연차일수로 계산합니다.",
      "퇴직금은 계속근로기간 1년 이상인 경우 월 평균임금 × 근속연수 방식으로 빠르게 추정합니다. 실제 금액은 퇴직 전 3개월 임금, 상여금, 연차수당 포함 여부, 휴직기간 등에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "급여명세서, 근로계약서, 통장 입금 내역, 출퇴근 기록을 함께 보관하세요.",
      "연장·야간·휴일수당은 이미 기본임금을 받았는지, 가산분만 못 받았는지에 따라 실제 청구액이 달라질 수 있습니다.",
      "노동청 진정 전에는 사업장명, 대표자, 소재지, 근무기간, 미지급 기간과 금액을 표로 정리해 두면 좋습니다."
    ],
    faqs: [
      { question: "계산된 금액을 그대로 청구하면 되나요?", answer: "참고용 추정액입니다. 실제 청구액은 임금명세서, 근로계약, 근무기록, 지급 내역을 기준으로 다시 확인해야 합니다." },
      { question: "퇴직금은 1년 미만도 포함되나요?", answer: "이 계산기는 계속근로기간이 12개월 미만이면 퇴직금 항목을 0원으로 처리합니다. 예외적 상황은 노무 전문가나 고용노동부 상담을 권합니다." }
    ],
    calculate(values) {
      const unpaidBaseWage = d(values.monthlyUnpaidWage).mul(values.unpaidMonths).toNumber();
      const weeklyHolidayHours = values.weeklyHours >= 15 ? Math.min(values.weeklyHours / 40 * 8, 8) : 0;
      const weeklyHolidayPay = d(values.hourlyWage).mul(weeklyHolidayHours).mul(values.unpaidWeeks).toNumber();
      const annualLeavePay = d(values.hourlyWage).mul(values.dailyHours).mul(values.unusedAnnualLeaveDays).toNumber();
      const severancePay = values.serviceMonths >= 12 ? d(values.severanceMonthlyPay).mul(values.serviceMonths).div(12).toNumber() : 0;
      const overtimePay = d(values.hourlyWage).mul(values.overtimeHours).mul(1.5).toNumber();
      const nightPay = d(values.hourlyWage).mul(values.nightHours).mul(0.5).toNumber();
      const holidayPay = d(values.hourlyWage).mul(values.holidayHours).mul(1.5).toNumber();
      const premiumPay = overtimePay + nightPay + holidayPay;
      const total = unpaidBaseWage + weeklyHolidayPay + annualLeavePay + severancePay + premiumPay;

      return {
        headline: formatWon(total),
        subline: `월급·수당·퇴직금 포함 ${formatWon(total)} 추정`,
        rows: [
          { label: "미지급 월급", value: formatWon(unpaidBaseWage), tone: "strong" },
          { label: "주휴수당", value: formatWon(weeklyHolidayPay) },
          { label: "연차수당", value: formatWon(annualLeavePay) },
          { label: "퇴직금", value: formatWon(severancePay), tone: values.serviceMonths >= 12 ? "strong" : "muted" },
          { label: "연장·야간·휴일수당", value: formatWon(premiumPay) },
          { label: "임금체불 추정 합계", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "월급", value: unpaidBaseWage },
          { name: "주휴", value: weeklyHolidayPay },
          { name: "연차", value: annualLeavePay },
          { name: "퇴직금", value: severancePay },
          { name: "가산수당", value: premiumPay }
        ]
      };
    }
  },
  {
    slug: "unemployment",
    title: "실업급여 모의계산기",
    description: "평균임금, 연령, 고용보험 가입기간을 입력해 구직급여 1일액과 예상 총액을 계산합니다.",
    category: "노무",
    keywords: ["실업급여 계산기", "구직급여", "고용보험 지급일수"],
    badge: "고용보험 기준 반영",
    audience: "퇴사 예정자, 이직자",
    fields: [
      { name: "age", label: "나이", type: "number", unit: "세", min: 18, max: 70, step: 1, defaultValue: 38 },
      { name: "months", label: "고용보험 가입기간", type: "number", unit: "개월", min: 1, max: 360, step: 1, defaultValue: 48 },
      { name: "avgDailyWage", label: "퇴직 전 평균 1일 임금", type: "number", unit: "원", min: 30000, max: 300000, step: 1000, defaultValue: 100000 }
    ],
    guideTitle: "실업급여 계산 기준",
    guide: [
      "구직급여는 퇴직 전 평균임금의 일정 비율에 소정급여일수를 곱해 산정합니다. 이 페이지는 2026년 기준 상한액과 최저임금 기반 하한액을 반영한 참고용 계산기입니다.",
      "소정급여일수는 이직일 당시 연령과 고용보험 피보험기간에 따라 달라집니다. 50세 미만은 120~240일, 50세 이상 또는 장애인은 120~270일 범위가 적용됩니다.",
      "자발적 퇴사, 중대한 귀책사유, 구직활동 인정 여부 등 수급자격 요건은 계산 결과와 별개로 심사됩니다. 실제 지급액은 고용센터 판단과 최근 법령 적용일에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "이직 사유와 피보험 단위기간 요건을 함께 확인하세요.",
      "상한액·하한액 적용 때문에 평균임금 대비 체감액이 달라질 수 있습니다.",
      "실제 지급 여부는 수급자격 인정 절차를 통과해야 확정됩니다."
    ],
    faqs: [
      { question: "가입기간이 1년 미만이면 받을 수 없나요?", answer: "일반적으로 이직 전 18개월 동안 피보험 단위기간 180일 이상 등 요건을 충족해야 합니다. 이 계산기는 지급일수 추정용입니다." },
      { question: "상한액과 하한액은 자동 반영되나요?", answer: "네. 평균임금 60%를 계산한 뒤 2026년 기준 상한액 66,000원과 최저임금 기반 하한액을 적용합니다." }
    ],
    calculate(values) {
      const days = unemploymentDays(values.age, values.months);
      const rawDaily = d(values.avgDailyWage).mul(0.6).toNumber();
      const daily = Math.min(Math.max(rawDaily, legalStandards.unemploymentDailyLowerByMinimumWage), legalStandards.unemploymentDailyUpper);
      const total = daily * days;
      return {
        headline: days ? formatWon(total) : "수급 가능 기간 확인 필요",
        subline: `${days.toLocaleString("ko-KR")}일 기준, 1일 구직급여 ${formatWon(daily)}`,
        rows: [
          { label: "소정급여일수", value: `${days}일`, tone: "strong" },
          { label: "평균임금 60%", value: formatWon(rawDaily) },
          { label: "적용 1일액", value: formatWon(daily) },
          { label: "예상 총 지급액", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "1일액", value: daily },
          { name: "상한액", value: legalStandards.unemploymentDailyUpper },
          { name: "하한액", value: legalStandards.unemploymentDailyLowerByMinimumWage }
        ]
      };
    }
  },
  {
    slug: "severance",
    title: "퇴직금 계산기",
    description: "최근 3개월 임금과 계속근로기간으로 법정 퇴직금 예상액을 계산합니다.",
    category: "노무",
    keywords: ["퇴직금 계산기", "평균임금", "퇴직급여"],
    badge: "평균임금 기반 추정",
    audience: "퇴직 예정 근로자, 인사 담당자",
    fields: [
      { name: "monthlyPay", label: "최근 월 평균 임금", type: "number", unit: "원", min: 1000000, max: 20000000, step: 100000, defaultValue: 3500000 },
      { name: "months", label: "계속근로기간", type: "number", unit: "개월", min: 1, max: 480, step: 1, defaultValue: 60 }
    ],
    guideTitle: "퇴직금 산정 공식",
    guide: [
      "퇴직금은 계속근로기간 1년에 대해 30일분 이상의 평균임금을 지급하는 구조입니다. 단순화하면 월 평균 임금에 근속연수를 곱한 값과 유사하지만, 실제로는 퇴직 전 3개월 임금 총액과 총 일수를 기준으로 평균임금을 산정합니다.",
      "1년 미만 근로자는 법정 퇴직금 대상이 아닐 수 있으며, 상여금·연차수당 포함 여부는 지급 성격과 산정 기간에 따라 달라집니다.",
      "이 계산기는 정기 월급 기준의 빠른 추정 도구입니다. 임금 항목이 복잡하거나 중간정산, 휴직 기간이 있는 경우 회사 규정과 근로복지공단 안내를 함께 확인해야 합니다."
    ],
    checkpoints: [
      "1년 미만 근속은 법정 지급 대상이 아닐 수 있습니다.",
      "상여금, 연차수당 포함 여부에 따라 평균임금이 달라질 수 있습니다.",
      "중간정산·휴직·임금변동 이력이 있으면 실제 지급액과 차이 날 수 있습니다."
    ],
    faqs: [
      { question: "세전 금액으로 입력하나요?", answer: "네. 퇴직금 산정은 세전 임금 기준으로 추정하는 것이 일반적입니다." },
      { question: "1년 미만도 계산되나요?", answer: "화면에는 비례액을 보여주지만, 법정 지급 대상 여부는 계속근로기간 1년 이상 등 요건을 확인해야 합니다." }
    ],
    calculate(values) {
      const years = d(values.months).div(12);
      const severance = d(values.monthlyPay).mul(years).toNumber();
      return {
        headline: formatWon(severance),
        subline: `${years.toFixed(2)}년 근속 기준 예상 퇴직금`,
        rows: [
          { label: "월 평균 임금", value: formatWon(values.monthlyPay) },
          { label: "근속연수", value: `${years.toFixed(2)}년` },
          { label: "월 환산 퇴직급여", value: formatWon(values.monthlyPay / 12) },
          { label: "예상 퇴직금", value: formatWon(severance), tone: "strong" }
        ],
        chart: [
          { name: "1년분", value: values.monthlyPay },
          { name: "누적", value: severance }
        ]
      };
    }
  },
  {
    slug: "weekly-holiday",
    title: "주휴수당 계산기",
    description: "주 근무시간과 시급을 입력해 예상 주휴수당과 주급을 계산합니다.",
    category: "노무",
    keywords: ["주휴수당 계산기", "최저시급", "아르바이트 급여"],
    badge: "주 15시간 요건 체크",
    audience: "아르바이트, 단시간 근로자",
    fields: [
      { name: "hourlyWage", label: "시급", type: "number", unit: "원", min: 9860, max: 100000, step: 100, defaultValue: legalStandards.minimumWage },
      { name: "weeklyHours", label: "주 근무시간", type: "number", unit: "시간", min: 1, max: 52, step: 0.5, defaultValue: 40 }
    ],
    guideTitle: "주휴수당 지급 요건",
    guide: [
      "주휴수당은 1주 소정근로시간이 15시간 이상이고 약정한 근로일을 개근한 근로자에게 발생하는 유급휴일 수당입니다.",
      "통상 계산식은 주 40시간 미만 근로자의 경우 시급 × 8시간 × 주 근무시간 ÷ 40입니다. 주 40시간 이상은 통상 8시간분을 한도로 추정합니다.",
      "2026년 최저임금은 시급 10,320원이며, 주 40시간 근무자의 월 환산액은 2,156,880원입니다. 근로계약서상 소정근로시간과 실제 출근 여부를 함께 확인해야 합니다."
    ],
    checkpoints: [
      "주 15시간 이상 근무 여부가 가장 먼저 확인할 기준입니다.",
      "개근 요건을 충족하지 못하면 실제 지급 대상에서 제외될 수 있습니다.",
      "월급제는 주휴분이 기본급에 포함되어 설계되는 경우가 많습니다."
    ],
    faqs: [
      { question: "주 15시간 미만이면 왜 0원인가요?", answer: "주휴수당은 일반적으로 1주 소정근로시간 15시간 이상인 경우를 전제로 합니다." },
      { question: "월급제도 주휴수당이 따로 나오나요?", answer: "월급제는 보통 월급 안에 유급주휴분이 포함되어 설계됩니다. 별도 지급 여부는 임금명세서를 확인하세요." }
    ],
    calculate(values) {
      const eligible = values.weeklyHours >= 15;
      const paidHours = eligible ? Math.min(values.weeklyHours / 40 * 8, 8) : 0;
      const allowance = d(values.hourlyWage).mul(paidHours).toNumber();
      const base = d(values.hourlyWage).mul(values.weeklyHours).toNumber();
      return {
        headline: formatWon(allowance),
        subline: eligible ? `${paidHours.toFixed(1)}시간분 주휴수당` : "주 15시간 미만은 일반적으로 주휴수당 대상이 아닙니다.",
        rows: [
          { label: "기본 주급", value: formatWon(base) },
          { label: "주휴 인정 시간", value: `${paidHours.toFixed(1)}시간` },
          { label: "주휴수당", value: formatWon(allowance), tone: "strong" },
          { label: "예상 주급 합계", value: formatWon(base + allowance), tone: "strong" }
        ],
        chart: [
          { name: "기본급", value: base },
          { name: "주휴", value: allowance }
        ]
      };
    }
  },
  {
    slug: "hourly-wage",
    title: "시급 계산기",
    description: "시급을 기준으로 일급, 주급, 월급, 연봉과 주휴수당·연장수당 포함 예상 급여를 계산합니다.",
    category: "노무",
    keywords: ["시급 계산기", "월급 환산", "연장수당 계산"],
    badge: "시급 환산",
    audience: "아르바이트, 단시간 근로자, 급여 비교 사용자",
    fields: [
      { name: "hourlyWage", label: "시급", type: "number", unit: "원", min: 10320, max: 100000, step: 100, defaultValue: legalStandards.minimumWage },
      { name: "dailyHours", label: "1일 근무시간", type: "number", unit: "시간", min: 1, max: 12, step: 0.5, defaultValue: 8 },
      { name: "weeklyHours", label: "주 근무시간", type: "number", unit: "시간", min: 1, max: 52, step: 0.5, defaultValue: 40 },
      { name: "weeklyOvertimeHours", label: "주 연장근무시간", type: "number", unit: "시간", min: 0, max: 20, step: 0.5, defaultValue: 2 }
    ],
    guideTitle: "시급 환산 기준",
    guide: [
      "시급 계산은 단순히 시간당 금액만 보는 것이 아니라 주 근무시간, 주휴수당, 연장근로수당 반영 여부에 따라 체감 월급이 달라집니다.",
      "연장근로수당은 통상임금의 50%를 가산해 계산하는 방식이 일반적이며, 이 계산기는 주 단위 연장근무시간을 기준으로 가산수당을 추정합니다.",
      "정확한 급여는 근로계약서상 소정근로시간, 휴게시간, 주휴 포함 여부, 야간·휴일근로 여부에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "주휴수당은 일반적으로 주 15시간 이상 근무를 전제로 계산합니다.",
      "연장근무는 통상 시급의 1.5배로 계산하지만 사업장 운영 방식에 따라 차이가 있을 수 있습니다.",
      "월 환산액은 주 기준 급여를 4.345주로 환산한 추정치입니다."
    ],
    faqs: [
      { question: "월급은 왜 정확히 4주가 아닌가요?", answer: "월 환산 시 평균 주수 4.345주를 사용해야 연간 기준과 더 가깝습니다." },
      { question: "주휴수당은 자동 반영되나요?", answer: "네. 주 15시간 이상일 때 인정 시간을 계산해 주급 합계에 포함합니다." }
    ],
    calculate(values) {
      const dailyPay = values.hourlyWage * values.dailyHours;
      const weeklyBase = values.hourlyWage * values.weeklyHours;
      const weeklyHolidayHours = values.weeklyHours >= 15 ? Math.min(values.weeklyHours / 40 * 8, 8) : 0;
      const weeklyHolidayPay = values.hourlyWage * weeklyHolidayHours;
      const weeklyOvertimePay = values.hourlyWage * values.weeklyOvertimeHours * 1.5;
      const weeklyTotal = weeklyBase + weeklyHolidayPay + weeklyOvertimePay;
      const monthlyTotal = weeklyTotal * 4.345;
      const yearlyTotal = monthlyTotal * 12;

      return {
        headline: formatWon(monthlyTotal),
        subline: `예상 연봉 ${formatWon(yearlyTotal)} · 주휴 ${formatWon(weeklyHolidayPay)}`,
        rows: [
          { label: "일급", value: formatWon(dailyPay) },
          { label: "기본 주급", value: formatWon(weeklyBase) },
          { label: "주휴수당", value: formatWon(weeklyHolidayPay) },
          { label: "연장수당", value: formatWon(weeklyOvertimePay) },
          { label: "예상 월급", value: formatWon(monthlyTotal), tone: "strong" }
        ],
        chart: [
          { name: "기본주급", value: weeklyBase },
          { name: "주휴", value: weeklyHolidayPay },
          { name: "연장", value: weeklyOvertimePay }
        ]
      };
    }
  },
  {
    slug: "annual-leave",
    title: "연차수당 계산기",
    description: "통상임금과 1일 근로시간, 미사용 연차일수를 기준으로 연차수당 예상액을 계산합니다.",
    category: "노무",
    keywords: ["연차수당 계산기", "미사용 연차", "통상임금"],
    badge: "미사용 연차수당 추정",
    audience: "퇴직 예정자, 인사 담당자, 급여 확인 사용자",
    fields: [
      { name: "hourlyWage", label: "통상 시급", type: "number", unit: "원", min: 10320, max: 100000, step: 100, defaultValue: 15000 },
      { name: "dailyHours", label: "1일 소정근로시간", type: "number", unit: "시간", min: 1, max: 12, step: 0.5, defaultValue: 8 },
      { name: "unusedDays", label: "미사용 연차일수", type: "number", unit: "일", min: 0, max: 30, step: 0.5, defaultValue: 5 }
    ],
    guideTitle: "연차수당 계산 기준",
    guide: [
      "연차수당은 미사용 연차휴가일수에 1일 통상임금을 곱해 계산하는 방식이 일반적입니다. 이 계산기는 통상 시급과 1일 소정근로시간을 기준으로 추정합니다.",
      "연차 발생일수 자체는 입사일, 출근율, 회계연도 운영 방식, 사업장 규모에 따라 달라질 수 있습니다. 현재 화면은 발생일수 계산이 아니라 미사용분 정산액 계산에 초점을 둡니다.",
      "상시근로자 5인 미만 사업장은 법정 연차유급휴가 제도 적용이 다를 수 있으므로, 취업규칙과 근로계약서를 함께 확인해야 합니다."
    ],
    checkpoints: [
      "연차수당 산정의 핵심은 발생일수보다 미사용 일수와 통상임금 기준입니다.",
      "퇴직 정산 시점에는 사용촉진 여부, 회계연도 운영 방식에 따라 실제 지급액이 달라질 수 있습니다.",
      "정확한 법 적용은 사업장 규모와 취업규칙을 함께 확인해야 합니다."
    ],
    faqs: [
      { question: "평균임금이 아니라 통상임금으로 계산하나요?", answer: "연차수당은 일반적으로 미사용 연차 1일당 통상임금을 기준으로 계산합니다." },
      { question: "미사용 연차일수는 어떻게 확인하나요?", answer: "급여명세서, 인사 시스템, 취업규칙, 회사 연차대장을 기준으로 확인하는 것이 가장 정확합니다." }
    ],
    calculate(values) {
      const dailyOrdinaryWage = values.hourlyWage * values.dailyHours;
      const allowance = dailyOrdinaryWage * values.unusedDays;
      return {
        headline: formatWon(allowance),
        subline: `1일 통상임금 ${formatWon(dailyOrdinaryWage)} × 미사용 ${values.unusedDays.toLocaleString("ko-KR")}일`,
        rows: [
          { label: "통상 시급", value: formatWon(values.hourlyWage) },
          { label: "1일 근로시간", value: `${values.dailyHours.toLocaleString("ko-KR")}시간` },
          { label: "1일 통상임금", value: formatWon(dailyOrdinaryWage) },
          { label: "미사용 연차일수", value: `${values.unusedDays.toLocaleString("ko-KR")}일` },
          { label: "예상 연차수당", value: formatWon(allowance), tone: "strong" }
        ],
        chart: [
          { name: "1일임금", value: dailyOrdinaryWage },
          { name: "미사용일수", value: values.unusedDays },
          { name: "수당", value: allowance }
        ]
      };
    }
  },
  {
    slug: "annual-leave-grant",
    title: "연차 발생일수 계산기",
    description: "근속연수, 출근율, 1년 미만 개근 개월 수를 기준으로 법정 연차 발생일수를 계산합니다.",
    category: "노무",
    keywords: ["연차 발생 계산기", "연차유급휴가", "출근율 80%"],
    badge: "근로기준법 제60조 기준",
    audience: "근로자, 인사 담당자, 휴가 정산 사용자",
    fields: [
      { name: "yearsWorked", label: "계속근로연수", type: "number", unit: "년", min: 0, max: 30, step: 0.5, defaultValue: 1 },
      { name: "attendanceRate", label: "연간 출근율", type: "number", unit: "%", min: 0, max: 100, step: 1, defaultValue: 100 },
      { name: "fullMonthAttendanceDays", label: "1년 미만 개근 개월 수", type: "number", unit: "개월", min: 0, max: 11, step: 1, defaultValue: 11 }
    ],
    guideTitle: "연차 발생일수 기준",
    guide: [
      "고용노동부 FAQ와 근로기준법 제60조 기준으로, 1년간 80% 이상 출근한 근로자에게는 15일의 유급휴가가 발생합니다.",
      "계속근로기간이 1년 미만이거나 1년간 출근율이 80% 미만인 경우에는 1개월 개근 시 1일의 유급휴가가 발생하는 구조로 봅니다.",
      "3년 이상 계속 근로한 경우에는 최초 1년을 초과하는 계속근로연수 매 2년에 대해 1일을 가산하며, 총 한도는 25일입니다."
    ],
    checkpoints: [
      "1년 미만과 1년 이상은 발생 구조가 다릅니다.",
      "출근율 80% 이상 여부가 15일 기본 발생의 핵심 기준입니다.",
      "회계연도 기준 운영, 사용촉진제, 취업규칙에 따라 실제 부여 방식은 회사마다 다를 수 있습니다."
    ],
    faqs: [
      { question: "입사 1년차도 15일이 바로 생기나요?", answer: "일반적으로 1년을 채우고 80% 이상 출근한 경우 15일 기준이 적용됩니다. 그 전에는 개근 월수 기준 1일씩 발생 구조를 봅니다." },
      { question: "가산연차는 언제부터 붙나요?", answer: "3년 이상 계속 근로한 경우 최초 1년을 초과하는 계속근로연수 매 2년에 대해 1일씩 가산되며 최대 25일까지입니다." }
    ],
    calculate(values) {
      const days = annualLeaveGrantedDays(values.yearsWorked, values.attendanceRate, values.fullMonthAttendanceDays);
      const extra = values.yearsWorked >= 3 && values.attendanceRate >= 80 ? Math.min(Math.floor((values.yearsWorked - 1) / 2), 10) : 0;
      return {
        headline: `${days.toLocaleString("ko-KR")}일`,
        subline: values.yearsWorked < 1 || values.attendanceRate < 80 ? "개근 월수 기준 발생 구조" : `기본 15일 + 가산 ${extra}일`,
        rows: [
          { label: "계속근로연수", value: `${values.yearsWorked.toLocaleString("ko-KR")}년` },
          { label: "연간 출근율", value: formatPercent(values.attendanceRate, 0) },
          { label: "개근 개월 수", value: `${Math.floor(values.fullMonthAttendanceDays)}개월` },
          { label: "가산 연차", value: `${extra}일` },
          { label: "예상 발생 연차", value: `${days}일`, tone: "strong" }
        ],
        chart: [
          { name: "기본", value: values.yearsWorked < 1 || values.attendanceRate < 80 ? Math.min(Math.floor(values.fullMonthAttendanceDays), 11) : 15 },
          { name: "가산", value: extra },
          { name: "총발생", value: days }
        ]
      };
    }
  },
  {
    slug: "parental-leave",
    title: "육아휴직 급여 계산기",
    description: "월 통상임금과 육아휴직 사용 개월 수를 기준으로 육아휴직 급여 예상액을 계산합니다.",
    category: "노무",
    keywords: ["육아휴직 급여 계산기", "고용보험", "육아휴직 수당"],
    badge: "2025년 이후 일반 육아휴직급여 기준",
    audience: "육아휴직 예정자, 인사 담당자",
    fields: [
      { name: "monthlyWage", label: "월 통상임금", type: "number", unit: "원", min: 700000, max: 8000000, step: 100000, defaultValue: 2800000 },
      { name: "leaveMonths", label: "육아휴직 사용 개월", type: "number", unit: "개월", min: 1, max: 18, step: 1, defaultValue: 12 }
    ],
    guideTitle: "육아휴직 급여 계산 기준",
    guide: [
      "고용노동부 안내 기준으로 2025년 1월 1일 이후 일반 육아휴직급여는 1~3개월은 월 통상임금 100%(상한 250만원), 4~6개월은 월 통상임금 100%(상한 200만원), 7개월 이후는 월 통상임금 80%(상한 160만원) 구조가 적용됩니다.",
      "급여 산정에는 월 하한액 70만원이 적용되며, 실제 지급을 받으려면 육아휴직 30일 이상, 피보험단위기간 180일 이상 등 별도 요건을 충족해야 합니다.",
      "부모 동시·순차 사용 시 적용되는 6+6 부모육아휴직제, 한부모 특례, 장애아동 부모 추가 사용기간 등은 별도 특례가 있으므로 일반 육아휴직급여와 분리해서 봐야 합니다."
    ],
    checkpoints: [
      "이 계산기는 일반 육아휴직급여 기준이며 6+6 부모육아휴직제 특례는 포함하지 않습니다.",
      "개월 수가 길수록 7개월차 이후 80% 구간 영향이 커집니다.",
      "실제 신청은 육아휴직 시작 후 1개월부터 가능하고, 종료 후 12개월 내 신청해야 합니다."
    ],
    faqs: [
      { question: "첫 6개월 모두 100%를 받나요?", answer: "네. 일반 육아휴직급여 기준으로 1~6개월은 월 통상임금 100%가 적용되지만, 1~3개월은 250만원, 4~6개월은 200만원 상한이 있습니다." },
      { question: "7개월차부터는 어떻게 계산하나요?", answer: "7개월차부터는 월 통상임금의 80%를 적용하고, 월 상한 160만원·하한 70만원 기준으로 추정합니다." }
    ],
    calculate(values) {
      const leaveMonths = Math.max(1, Math.floor(values.leaveMonths));
      let total = 0;
      let firstThree = 0;
      let secondThree = 0;
      let laterMonths = 0;

      for (let month = 1; month <= leaveMonths; month += 1) {
        const benefit = parentalLeaveMonthlyBenefit(values.monthlyWage, month);
        total += benefit;
        if (month <= 3) firstThree += benefit;
        else if (month <= 6) secondThree += benefit;
        else laterMonths += benefit;
      }

      const averageMonthly = total / leaveMonths;
      return {
        headline: formatWon(total),
        subline: `${leaveMonths}개월 기준 월평균 ${formatWon(averageMonthly)}`,
        rows: [
          { label: "1~3개월 합계", value: formatWon(firstThree) },
          { label: "4~6개월 합계", value: formatWon(secondThree) },
          { label: "7개월 이후 합계", value: formatWon(laterMonths) },
          { label: "예상 총 육아휴직 급여", value: formatWon(total), tone: "strong" },
          { label: "월평균 급여", value: formatWon(averageMonthly) }
        ],
        chart: [
          { name: "1~3개월", value: firstThree },
          { name: "4~6개월", value: secondThree },
          { name: "7개월+", value: laterMonths }
        ]
      };
    }
  },
  {
    slug: "net-salary",
    title: "4대 보험 실수령액 계산기",
    description: "월 급여에서 국민연금, 건강보험, 장기요양, 고용보험 근로자 부담분을 계산합니다.",
    category: "노무",
    keywords: ["4대보험 계산기", "실수령액 계산기", "월급 공제"],
    badge: "근로자 부담분 기준",
    audience: "직장인, 급여 담당자",
    fields: [
      { name: "monthlyPay", label: "월 과세 급여", type: "number", unit: "원", min: 500000, max: 30000000, step: 100000, defaultValue: 3500000 },
      { name: "taxFree", label: "월 비과세 금액", type: "number", unit: "원", min: 0, max: 1000000, step: 10000, defaultValue: 200000 }
    ],
    guideTitle: "2026년 4대 보험 공제 기준",
    guide: [
      "근로자 급여에서 주로 공제되는 사회보험은 국민연금, 건강보험, 장기요양보험, 고용보험입니다. 산재보험은 사업주가 부담하므로 근로자 실수령액 계산에서는 제외합니다.",
      "2026년 7월부터 국민연금 기준소득월액은 하한 41만원, 상한 659만원이 적용됩니다. 건강보험료율은 7.19%이며 근로자와 사업주가 각각 3.595%씩 부담합니다. 장기요양보험료는 건강보험료에 장기요양보험료율을 곱해 계산합니다.",
      "이 계산기는 소득세와 지방소득세를 제외한 4대 보험 기준 실수령액입니다. 연말정산, 부양가족, 비과세 항목에 따라 실제 급여명세서와 차이가 날 수 있습니다."
    ],
    checkpoints: [
      "소득세·지방소득세는 별도라 실제 실수령액보다 높게 보일 수 있습니다.",
      "비과세 항목을 분리 입력해야 보험료 기준 급여가 정확해집니다.",
      "국민연금은 하한·상한 기준소득월액이 적용됩니다."
    ],
    faqs: [
      { question: "소득세까지 계산하나요?", answer: "아니요. 이 페이지는 4대 보험 공제액 중심입니다. 소득세는 간이세액표, 부양가족 수, 비과세 항목에 따라 별도 계산해야 합니다." },
      { question: "비과세 식대는 어떻게 넣나요?", answer: "식대 등 비과세 항목을 월 비과세 금액에 입력하면 보험료 산정 기준 급여에서 제외합니다." }
    ],
    calculate(values) {
      const taxable = Math.max(values.monthlyPay - values.taxFree, 0);
      const pensionBase = Math.min(Math.max(taxable, legalStandards.nationalPensionMinMonthlyIncome), legalStandards.nationalPensionMaxMonthlyIncome);
      const pension = floorToTen(pensionBase * legalStandards.nationalPensionEmployeeRate);
      const health = floorToTen(taxable * legalStandards.healthEmployeeRate);
      const care = floorToTen(health * legalStandards.longTermCareRateOfHealth);
      const employment = floorToTen(taxable * legalStandards.employmentEmployeeRate);
      const deductions = pension + health + care + employment;
      return {
        headline: formatWon(values.monthlyPay - deductions),
        subline: `4대 보험 공제 ${formatWon(deductions)} 차감 후`,
        rows: [
          { label: "국민연금", value: formatWon(pension) },
          { label: "건강보험", value: formatWon(health) },
          { label: "장기요양보험", value: formatWon(care) },
          { label: "고용보험", value: formatWon(employment) },
          { label: "공제 합계", value: formatWon(deductions), tone: "strong" }
        ],
        chart: [
          { name: "국민연금", value: pension },
          { name: "건강", value: health },
          { name: "장기요양", value: care },
          { name: "고용", value: employment }
        ]
      };
    }
  },
  {
    slug: "loan-interest",
    title: "대출 이자 계산기",
    description: "대출금액, 금리, 기간, 상환방식에 따라 월 상환액과 총 이자를 계산합니다.",
    category: "금융",
    keywords: ["대출 이자 계산기", "원리금 균등", "원금 균등"],
    badge: "상환방식 비교",
    audience: "대출 검토자, 주담대·신용대출 사용자",
    fields: [
      { name: "principal", label: "대출금액", type: "number", unit: "원", min: 1000000, max: 3000000000, step: 1000000, defaultValue: 200000000 },
      { name: "rate", label: "연 금리", type: "number", unit: "%", min: 0.1, max: 20, step: 0.1, defaultValue: 4.5 },
      { name: "years", label: "대출 기간", type: "number", unit: "년", min: 1, max: 40, step: 1, defaultValue: 20 },
      {
        name: "repaymentType",
        label: "상환 방식",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "원리금 균등상환", value: 0 },
          { label: "원금 균등상환", value: 1 },
          { label: "만기일시상환", value: 2 }
        ]
      }
    ],
    guideTitle: "대출 이자 계산 기준",
    guide: [
      "대출 이자 계산은 같은 금리라도 상환 방식에 따라 월 상환 부담과 총 이자 규모가 달라집니다. 원리금 균등은 월 납입액이 일정하고, 원금 균등은 초반 부담이 크지만 총 이자가 줄어드는 구조입니다.",
      "만기일시상환은 매월 이자만 납부하고 만기에 원금을 상환하는 구조라 월 부담은 낮지만 총 이자 부담은 크게 늘어날 수 있습니다.",
      "실제 금융기관 상품은 중도상환수수료, 우대금리, 변동금리, 거치기간, 인지세 등이 반영되므로 최종 약정 조건과는 차이가 날 수 있습니다."
    ],
    checkpoints: [
      "총 이자만 보면 원금 균등이 유리한 경우가 많지만 초반 현금흐름 부담이 큽니다.",
      "만기일시상환은 월 납입액이 낮아 보여도 총 이자 부담이 가장 커질 수 있습니다.",
      "변동금리 상품은 금리 변경 시 실제 상환액이 계속 달라질 수 있습니다."
    ],
    faqs: [
      { question: "원리금 균등과 원금 균등 중 무엇이 유리한가요?", answer: "총 이자만 보면 원금 균등이 유리한 경우가 많지만, 월 현금흐름 안정성은 원리금 균등이 더 좋을 수 있습니다." },
      { question: "중도상환수수료도 포함되나요?", answer: "아니요. 현재 계산기는 기본 상환 구조만 계산하며 수수료와 부대비용은 포함하지 않습니다." }
    ],
    calculate(values) {
      const months = values.years * 12;
      const monthlyRate = values.rate / 100 / 12;
      let monthlyPayment = 0;
      let totalInterest = 0;
      let chartRows: ChartPoint[] = [];

      if (values.repaymentType === 1) {
        const firstPayment = equalPrincipalFirstPayment(values.principal, values.rate, values.years);
        const averagePayment = equalPrincipalAveragePayment(values.principal, values.rate, values.years);
        totalInterest = values.principal * monthlyRate * (months + 1) / 2;
        monthlyPayment = firstPayment;
        chartRows = [
          { name: "첫달상환", value: firstPayment },
          { name: "평균상환", value: averagePayment },
          { name: "총이자", value: totalInterest }
        ];
      } else if (values.repaymentType === 2) {
        monthlyPayment = values.principal * monthlyRate;
        totalInterest = monthlyPayment * months;
        chartRows = [
          { name: "월이자", value: monthlyPayment },
          { name: "만기원금", value: values.principal },
          { name: "총이자", value: totalInterest }
        ];
      } else {
        monthlyPayment = monthlyLoanPayment(values.principal, values.rate, values.years);
        totalInterest = monthlyPayment * months - values.principal;
        chartRows = [
          { name: "월상환", value: monthlyPayment },
          { name: "원금", value: values.principal },
          { name: "총이자", value: totalInterest }
        ];
      }

      return {
        headline: formatWon(monthlyPayment),
        subline: `${months.toLocaleString("ko-KR")}개월 기준 총 이자 ${formatWon(totalInterest)}`,
        rows: [
          { label: "대출금액", value: formatWon(values.principal) },
          { label: "상환기간", value: `${values.years}년` },
          { label: "연 금리", value: formatPercent(values.rate, 1) },
          { label: "첫 월 상환액", value: formatWon(monthlyPayment), tone: "strong" },
          { label: "총 이자", value: formatWon(totalInterest), tone: "strong" }
        ],
        chart: chartRows
      };
    }
  },
  {
    slug: "comprehensive-income-tax",
    title: "종합소득세 계산기",
    description: "과세표준을 기준으로 종합소득세 산출세액과 지방소득세를 계산합니다.",
    category: "세금",
    keywords: ["종합소득세 계산기", "종소세 계산기", "종합소득세율", "과세표준", "지방소득세"],
    badge: "소득세법 제55조 세율 반영",
    audience: "프리랜서, 사업자, 종합소득세 신고 전 사용자",
    fields: [
      { name: "taxBase", label: "종합소득 과세표준", type: "number", unit: "원", min: 0, max: 3000000000, step: 100000, defaultValue: 50000000 }
    ],
    guideTitle: "종합소득세 계산 기준",
    guide: [
      "이 계산기는 소득세법 제55조 세율표를 기준으로 종합소득 과세표준에 대한 산출세액을 계산합니다. 2026년 8월 27일 기준 확인한 법령 기준을 반영했습니다.",
      "입력값은 총수입이 아니라 각종 필요경비·소득공제 등을 반영한 뒤의 과세표준입니다. 따라서 실제 신고 직전 단계에서 세율표 적용용으로 사용하는 계산기입니다.",
      "실제 납부세액은 세액공제, 감면, 기납부세액, 가산세, 지방소득세, 중간예납 등 추가 요소에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "총매출이나 총급여가 아니라 과세표준을 넣어야 합니다.",
      "이 계산값은 산출세액 중심이며 결정세액과는 다를 수 있습니다.",
      "지방소득세는 일반적으로 산출세액의 10%를 별도로 봅니다."
    ],
    faqs: [
      { question: "매출만 넣어도 되나요?", answer: "아니요. 종합소득세 세율은 과세표준 기준이므로 필요경비와 공제를 반영한 뒤 금액을 넣어야 합니다." },
      { question: "지방소득세도 같이 계산되나요?", answer: "네. 현재 화면은 참고용으로 종합소득세 산출세액의 10%를 지방소득세로 함께 표시합니다." }
    ],
    calculate(values) {
      const tax = comprehensiveIncomeTax(values.taxBase);
      const localTax = tax * 0.1;
      const total = tax + localTax;
      return {
        headline: formatWon(total),
        subline: `종합소득세 ${formatWon(tax)} + 지방소득세 ${formatWon(localTax)}`,
        rows: [
          { label: "과세표준", value: formatWon(values.taxBase) },
          { label: "종합소득세 산출세액", value: formatWon(tax), tone: "strong" },
          { label: "지방소득세", value: formatWon(localTax) },
          { label: "합계 참고세액", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "국세", value: tax },
          { name: "지방세", value: localTax },
          { name: "합계", value: total }
        ]
      };
    }
  },
  {
    slug: "earned-income-tax",
    title: "근로소득세 계산기",
    description: "연간 총급여, 비과세, 부양가족, 추가 공제액으로 근로소득세와 지방소득세를 추정합니다.",
    category: "세금",
    keywords: ["근로소득세 계산기", "소득세 계산기", "월급 세금", "급여 소득세", "연봉 소득세", "근로소득공제"],
    badge: "근로소득공제·기본세율 반영",
    audience: "직장인, 급여 담당자, 연봉 협상 전 사용자",
    fields: [
      { name: "annualSalary", label: "연간 총 지급액", type: "number", unit: "원", min: 0, max: 1000000000, step: 1000000, defaultValue: 60000000 },
      { name: "taxFreeIncome", label: "연간 비과세 금액", type: "number", unit: "원", min: 0, max: 30000000, step: 100000, defaultValue: 2400000 },
      { name: "dependents", label: "기본공제 인원", type: "number", unit: "명", min: 1, max: 10, step: 1, defaultValue: 1 },
      { name: "pensionInsurance", label: "국민연금 등 공적연금 납입액", type: "number", unit: "원", min: 0, max: 30000000, step: 100000, defaultValue: 3000000 },
      { name: "otherIncomeDeduction", label: "기타 소득공제", type: "number", unit: "원", min: 0, max: 100000000, step: 100000, defaultValue: 0 },
      { name: "taxCredits", label: "세액공제·감면 합계", type: "number", unit: "원", min: 0, max: 50000000, step: 100000, defaultValue: 0 }
    ],
    guideTitle: "근로소득세 계산 기준",
    guide: [
      "총 지급액에서 비과세 금액을 뺀 총급여를 기준으로 근로소득공제를 적용하고, 기본공제와 입력한 소득공제를 차감해 과세표준을 계산합니다.",
      "산출세액은 종합소득세 기본세율을 적용하며, 근로소득세액공제와 사용자가 입력한 세액공제·감면을 차감해 결정세액을 추정합니다.",
      "실제 급여 원천징수는 간이세액표, 가족 수, 회사 입력 자료에 따라 월별로 달라질 수 있고 연말정산 때 확정됩니다."
    ],
    checkpoints: [
      "연봉 전체가 아니라 비과세를 제외한 총급여가 세금 계산의 출발점입니다.",
      "기본공제 인원은 본인을 포함해 입력하세요.",
      "이 계산기는 근로소득 중심의 추정치이며 사업·금융·연금소득 합산은 반영하지 않습니다."
    ],
    faqs: [
      { question: "월급명세서의 소득세와 정확히 같나요?", answer: "아니요. 월별 원천징수는 간이세액표로 걷고, 연말정산에서 실제 공제 자료를 반영해 확정됩니다." },
      { question: "기타 소득공제에는 무엇을 넣나요?", answer: "건강보험·고용보험 부담분, 주택자금, 신용카드 소득공제처럼 과세표준 전에 차감되는 항목을 합산해 넣으면 됩니다." }
    ],
    calculate(values) {
      const grossPay = Math.max(values.annualSalary - values.taxFreeIncome, 0);
      const workDeduction = earnedIncomeDeduction(grossPay);
      const earnedIncomeAmount = Math.max(grossPay - workDeduction, 0);
      const personalDeduction = Math.max(Math.floor(values.dependents), 1) * 1500000;
      const incomeDeductions = personalDeduction + values.pensionInsurance + values.otherIncomeDeduction;
      const taxBase = Math.max(earnedIncomeAmount - incomeDeductions, 0);
      const calculatedTax = comprehensiveIncomeTax(taxBase);
      const earnedCredit = earnedIncomeTaxCredit(calculatedTax, grossPay);
      const incomeTax = Math.max(calculatedTax - earnedCredit - values.taxCredits, 0);
      const localTax = incomeTax * 0.1;
      const totalTax = incomeTax + localTax;

      return {
        headline: formatWon(totalTax),
        subline: `결정 소득세 ${formatWon(incomeTax)} + 지방소득세 ${formatWon(localTax)}`,
        rows: [
          { label: "총급여", value: formatWon(grossPay) },
          { label: "근로소득공제", value: formatWon(workDeduction) },
          { label: "근로소득금액", value: formatWon(earnedIncomeAmount) },
          { label: "소득공제 합계", value: formatWon(incomeDeductions), tone: "strong" },
          { label: "과세표준", value: formatWon(taxBase) },
          { label: "산출세액", value: formatWon(calculatedTax) },
          { label: "근로소득세액공제", value: formatWon(earnedCredit) },
          { label: "소득세·지방세 합계", value: formatWon(totalTax), tone: "strong" }
        ],
        chart: [
          { name: "산출세액", value: calculatedTax },
          { name: "세액공제", value: earnedCredit + values.taxCredits },
          { name: "결정세액", value: totalTax }
        ]
      };
    }
  },
  {
    slug: "year-end-tax-settlement",
    title: "연말정산 환급액 계산기",
    description: "총급여, 카드 사용액, 의료·교육·기부·연금계좌, 기납부세액으로 연말정산 환급·추가납부액을 추정합니다.",
    category: "세금",
    keywords: ["연말정산 계산기", "연말정산 환급액 계산기", "연말정산 환급", "연말정산 미리보기", "소득공제", "세액공제", "13월의 월급"],
    badge: "주요 소득·세액공제 반영",
    audience: "직장인, 연말정산 준비 사용자",
    fields: [
      { name: "grossPay", label: "총급여", type: "number", unit: "원", min: 0, max: 1000000000, step: 1000000, defaultValue: 60000000 },
      { name: "dependents", label: "기본공제 인원", type: "number", unit: "명", min: 1, max: 10, step: 1, defaultValue: 1 },
      { name: "pensionInsurance", label: "공적연금 납입액", type: "number", unit: "원", min: 0, max: 30000000, step: 100000, defaultValue: 3000000 },
      { name: "healthEmploymentInsurance", label: "건강·고용보험료", type: "number", unit: "원", min: 0, max: 30000000, step: 100000, defaultValue: 2500000 },
      { name: "creditCard", label: "신용카드 사용액", type: "number", unit: "원", min: 0, max: 300000000, step: 100000, defaultValue: 12000000 },
      { name: "checkCash", label: "체크카드·현금영수증", type: "number", unit: "원", min: 0, max: 300000000, step: 100000, defaultValue: 6000000 },
      { name: "marketTransit", label: "전통시장·대중교통", type: "number", unit: "원", min: 0, max: 100000000, step: 100000, defaultValue: 2000000 },
      { name: "medicalExpense", label: "의료비", type: "number", unit: "원", min: 0, max: 100000000, step: 100000, defaultValue: 1500000 },
      { name: "educationExpense", label: "교육비", type: "number", unit: "원", min: 0, max: 100000000, step: 100000, defaultValue: 0 },
      { name: "donation", label: "기부금", type: "number", unit: "원", min: 0, max: 100000000, step: 100000, defaultValue: 0 },
      { name: "pensionSaving", label: "연금저축 납입액", type: "number", unit: "원", min: 0, max: 6000000, step: 100000, defaultValue: 4000000 },
      { name: "irp", label: "IRP 납입액", type: "number", unit: "원", min: 0, max: 9000000, step: 100000, defaultValue: 3000000 },
      { name: "withheldTax", label: "이미 낸 소득세", type: "number", unit: "원", min: 0, max: 100000000, step: 100000, defaultValue: 2500000 }
    ],
    guideTitle: "연말정산 추정 기준",
    guide: [
      "연말정산은 총급여에서 근로소득공제와 각종 소득공제를 뺀 과세표준에 기본세율을 적용하고, 다시 세액공제를 차감해 결정세액을 확정하는 절차입니다.",
      "이 계산기는 기본공제, 공적연금·보험료, 신용카드 등 사용액 소득공제, 의료비·교육비·기부금·연금계좌 세액공제처럼 자주 쓰는 항목을 빠르게 반영합니다.",
      "간소화 자료의 세부 한도, 부양가족 요건, 월세·주택자금·자녀세액공제 등은 단순화했으므로 홈택스 최종 결과와 차이가 날 수 있습니다."
    ],
    checkpoints: [
      "총급여의 25%를 넘는 카드 사용액부터 신용카드 등 소득공제가 생깁니다.",
      "세액공제는 결정세액을 넘어서 환급을 만들지는 못합니다.",
      "이미 낸 소득세가 결정세액보다 크면 환급, 작으면 추가납부로 봅니다."
    ],
    faqs: [
      { question: "지방소득세 환급도 포함되나요?", answer: "결과의 환급·추가납부는 소득세 중심이며, 지방소득세는 결정세액 안내에 별도로 표시합니다." },
      { question: "월세 세액공제도 계산되나요?", answer: "현재는 주요 공제 중심입니다. 월세, 주택자금, 자녀세액공제는 기타 세액공제에 해당하는 금액만큼 기납부세액과 비교해 별도로 반영해 보세요." }
    ],
    calculate(values) {
      const workDeduction = earnedIncomeDeduction(values.grossPay);
      const earnedIncomeAmount = Math.max(values.grossPay - workDeduction, 0);
      const personalDeduction = Math.max(Math.floor(values.dependents), 1) * 1500000;
      const cardDeduction = creditCardIncomeDeduction(values.grossPay, values.creditCard, values.checkCash, values.marketTransit);
      const incomeDeductions = personalDeduction + values.pensionInsurance + values.healthEmploymentInsurance + cardDeduction;
      const taxBase = Math.max(earnedIncomeAmount - incomeDeductions, 0);
      const calculatedTax = comprehensiveIncomeTax(taxBase);
      const earnedCredit = earnedIncomeTaxCredit(calculatedTax, values.grossPay);
      const medicalCredit = Math.max(values.medicalExpense - values.grossPay * 0.03, 0) * 0.15;
      const educationCredit = values.educationExpense * 0.15;
      const donationCredit = values.donation * 0.15;
      const pensionApplied = Math.min(Math.min(values.pensionSaving, 6000000) + values.irp, 9000000);
      const pensionCredit = pensionApplied * (values.grossPay <= 55000000 ? 0.165 : 0.132);
      const taxCredits = earnedCredit + medicalCredit + educationCredit + donationCredit + pensionCredit;
      const incomeTax = Math.max(calculatedTax - taxCredits, 0);
      const localTax = incomeTax * 0.1;
      const refund = values.withheldTax - incomeTax;

      return {
        headline: refund >= 0 ? `${formatWon(refund)} 환급 예상` : `${formatWon(Math.abs(refund))} 추가납부 예상`,
        subline: `결정 소득세 ${formatWon(incomeTax)} · 지방소득세 참고 ${formatWon(localTax)}`,
        rows: [
          { label: "근로소득공제", value: formatWon(workDeduction) },
          { label: "신용카드 등 소득공제", value: formatWon(cardDeduction), tone: "strong" },
          { label: "소득공제 합계", value: formatWon(incomeDeductions) },
          { label: "과세표준", value: formatWon(taxBase) },
          { label: "산출세액", value: formatWon(calculatedTax) },
          { label: "세액공제 합계", value: formatWon(taxCredits), tone: "strong" },
          { label: "결정 소득세", value: formatWon(incomeTax), tone: "strong" },
          { label: "환급·추가납부", value: refund >= 0 ? formatWon(refund) : `-${formatWon(Math.abs(refund))}`, tone: "strong" }
        ],
        chart: [
          { name: "산출세액", value: calculatedTax },
          { name: "세액공제", value: taxCredits },
          { name: refund >= 0 ? "환급" : "추가납부", value: Math.abs(refund) }
        ]
      };
    }
  },
  {
    slug: "inheritance-tax",
    title: "상속세 계산기",
    description: "상속재산, 채무·장례비, 사전증여, 일괄공제·배우자공제로 상속세와 신고세액공제를 추정합니다.",
    category: "세금",
    keywords: ["상속세 계산기", "상속세율", "상속공제", "배우자공제", "일괄공제", "상속세 과세표준"],
    badge: "상속세 누진세율 반영",
    audience: "상속 준비 가족, 세무 상담 전 사용자",
    fields: [
      { name: "estateValue", label: "상속재산가액", type: "number", unit: "원", min: 0, max: 100000000000, step: 10000000, defaultValue: 2000000000 },
      { name: "debtsAndExpenses", label: "채무·공과금·장례비", type: "number", unit: "원", min: 0, max: 50000000000, step: 1000000, defaultValue: 200000000 },
      { name: "priorGifts", label: "상속재산 가산 사전증여", type: "number", unit: "원", min: 0, max: 50000000000, step: 1000000, defaultValue: 0 },
      { name: "lumpSumDeduction", label: "일괄공제·기초공제 등", type: "number", unit: "원", min: 0, max: 5000000000, step: 1000000, defaultValue: 500000000 },
      { name: "spouseDeduction", label: "배우자 상속공제", type: "number", unit: "원", min: 0, max: 3000000000, step: 1000000, defaultValue: 500000000 },
      { name: "otherDeduction", label: "금융재산 등 기타 공제", type: "number", unit: "원", min: 0, max: 5000000000, step: 1000000, defaultValue: 0 }
    ],
    guideTitle: "상속세 계산 기준",
    guide: [
      "상속세는 상속재산에서 채무·공과금·장례비 등을 차감하고 사전증여재산을 더한 뒤, 상속공제를 적용해 과세표준을 산정합니다.",
      "상속세율은 과세표준 1억원 이하 10%부터 30억원 초과 50%까지의 초과누진세율이며, 이 계산기는 누진공제 방식으로 산출세액을 계산합니다.",
      "배우자공제, 금융재산공제, 동거주택상속공제, 가업상속공제, 세대생략 할증, 연부연납 등은 요건이 복잡하므로 입력한 공제액 기준의 상담 전 추정치로 활용하세요."
    ],
    checkpoints: [
      "사망일이 속하는 달의 말일부터 일반적으로 6개월 이내 신고해야 합니다.",
      "일괄공제 5억원과 배우자공제는 적용 요건과 실제 상속분을 함께 확인해야 합니다.",
      "신고기한 내 신고하면 산출세액에서 신고세액공제 3%를 적용하는 구조로 추정했습니다."
    ],
    faqs: [
      { question: "상속재산이 10억원이면 무조건 세금이 없나요?", answer: "배우자 유무, 채무, 사전증여, 공제 요건에 따라 달라집니다. 기본 예시는 일괄공제와 배우자공제를 직접 조정하도록 만들었습니다." },
      { question: "배우자공제는 자동으로 계산되나요?", answer: "아니요. 실제 배우자가 상속받은 금액과 법정 한도 판단이 필요해 입력값으로 받습니다." }
    ],
    calculate(values) {
      const taxableEstate = Math.max(values.estateValue - values.debtsAndExpenses + values.priorGifts, 0);
      const deductions = values.lumpSumDeduction + values.spouseDeduction + values.otherDeduction;
      const taxBase = Math.max(taxableEstate - deductions, 0);
      const calculatedTax = inheritanceTax(taxBase);
      const filingCredit = calculatedTax * 0.03;
      const finalTax = Math.max(calculatedTax - filingCredit, 0);

      return {
        headline: formatWon(finalTax),
        subline: `산출세액 ${formatWon(calculatedTax)} - 신고세액공제 ${formatWon(filingCredit)}`,
        rows: [
          { label: "상속세 과세가액", value: formatWon(taxableEstate), tone: "strong" },
          { label: "상속공제 합계", value: formatWon(deductions), tone: "strong" },
          { label: "상속세 과세표준", value: formatWon(taxBase) },
          { label: "상속세 산출세액", value: formatWon(calculatedTax) },
          { label: "신고세액공제 3%", value: formatWon(filingCredit) },
          { label: "예상 납부 상속세", value: formatWon(finalTax), tone: "strong" }
        ],
        chart: [
          { name: "과세가액", value: taxableEstate },
          { name: "공제", value: deductions },
          { name: "납부세액", value: finalTax }
        ]
      };
    }
  },
  {
    slug: "loan-dsr",
    title: "대출 DSR/LTV 계산기",
    description: "연소득, 주택가격, 금리, 만기로 대출 가능성과 원리금 균등상환액을 시뮬레이션합니다.",
    category: "금융",
    keywords: ["DSR 계산기", "LTV 계산기", "주담대 한도"],
    badge: "규제 한도 시뮬레이션",
    audience: "주택 구매 예정자, 대출 상담 전 사용자",
    fields: [
      { name: "income", label: "연소득", type: "number", unit: "원", min: 10000000, max: 500000000, step: 1000000, defaultValue: 70000000 },
      { name: "homePrice", label: "주택가격", type: "number", unit: "원", min: 50000000, max: 3000000000, step: 10000000, defaultValue: 600000000 },
      { name: "loan", label: "희망 대출금", type: "number", unit: "원", min: 10000000, max: 2000000000, step: 10000000, defaultValue: 300000000 },
      { name: "rate", label: "연 금리", type: "number", unit: "%", min: 0.1, max: 15, step: 0.1, defaultValue: 4.2 },
      { name: "years", label: "대출 기간", type: "number", unit: "년", min: 1, max: 40, step: 1, defaultValue: 30 },
      { name: "dsrLimit", label: "DSR 기준", type: "number", unit: "%", min: 20, max: 70, step: 1, defaultValue: 40 },
      { name: "ltvLimit", label: "LTV 기준", type: "number", unit: "%", min: 20, max: 90, step: 1, defaultValue: 70 }
    ],
    guideTitle: "DSR과 LTV 핵심",
    guide: [
      "DSR은 연소득 대비 모든 대출의 연간 원리금 상환액 비율입니다. LTV는 담보가치 대비 대출금 비율입니다. 주택담보대출 심사에서는 두 규제가 동시에 작동하므로 둘 중 더 낮은 한도가 실질적인 제약이 됩니다.",
      "원리금 균등상환은 매월 같은 금액을 갚는 방식입니다. 초기에는 이자 비중이 높고 시간이 지날수록 원금 비중이 커집니다.",
      "실제 대출 가능액은 지역, 주택 보유 수, 차주 단위 DSR, 스트레스 금리, 기존 대출, 금융기관 심사 기준에 따라 달라질 수 있습니다. 이 계산기는 상담 전 빠른 시뮬레이션 용도입니다."
    ],
    checkpoints: [
      "실무에서는 DSR과 LTV 중 더 보수적인 한도가 실제 제약이 됩니다.",
      "기존 대출 원리금이 있으면 DSR 여력이 더 줄어듭니다.",
      "은행 심사 시 스트레스 금리와 담보평가가 추가 반영될 수 있습니다."
    ],
    faqs: [
      { question: "기존 대출은 반영되나요?", answer: "현재 버전은 희망 대출만 기준으로 계산합니다. 기존 대출 연간 원리금이 있으면 DSR 여유 한도에서 빼고 보세요." },
      { question: "LTV 한도만 맞으면 대출이 가능한가요?", answer: "아니요. DSR, DTI, 스트레스 금리, 담보 평가, 은행 내부 심사가 함께 적용됩니다." }
    ],
    calculate(values) {
      const monthly = monthlyLoanPayment(values.loan, values.rate, values.years);
      const yearlyPay = monthly * 12;
      const dsr = yearlyPay / values.income * 100;
      const ltv = values.loan / values.homePrice * 100;
      const ltvCap = values.homePrice * values.ltvLimit / 100;
      const dsrMonthlyCap = values.income * values.dsrLimit / 100 / 12;
      const dsrCap = values.loan * (dsrMonthlyCap / monthly);
      const practicalCap = Math.min(ltvCap, dsrCap);
      return {
        headline: formatWon(monthly),
        subline: `DSR ${formatPercent(dsr, 1)}, LTV ${formatPercent(ltv, 1)}`,
        rows: [
          { label: "월 상환액", value: formatWon(monthly), tone: "strong" },
          { label: "연 상환액", value: formatWon(yearlyPay) },
          { label: "DSR", value: formatPercent(dsr, 1) },
          { label: "LTV", value: formatPercent(ltv, 1) },
          { label: "규제 기준 추정 한도", value: formatWon(practicalCap), tone: "strong" }
        ],
        chart: [
          { name: "희망대출", value: values.loan },
          { name: "LTV한도", value: ltvCap },
          { name: "DSR한도", value: dsrCap }
        ]
      };
    }
  },
  {
    slug: "apr-calculator",
    title: "APR 계산기",
    description: "대출금, 명목금리, 기간, 수수료를 입력해 월 상환액과 실질 연이율(APR)을 추정합니다.",
    category: "금융",
    keywords: ["APR 계산기", "실질 연이율 계산", "대출 수수료 포함 금리", "연간 퍼센트율", "대출 실제 비용"],
    badge: "실질 금리",
    audience: "대출 조건을 비교하는 사용자, 수수료 포함 실제 금리를 확인하려는 사용자",
    fields: [
      { name: "principal", label: "대출금", type: "number", unit: "원", min: 1000000, max: 2000000000, step: 1000000, defaultValue: 50000000 },
      { name: "annualRate", label: "명목 연금리", type: "number", unit: "%", min: 0, max: 30, step: 0.1, defaultValue: 5.5 },
      { name: "years", label: "대출 기간", type: "number", unit: "년", min: 1, max: 40, step: 1, defaultValue: 5 },
      { name: "originationFee", label: "취급·중개 수수료", type: "number", unit: "원", min: 0, max: 100000000, step: 10000, defaultValue: 500000 },
      { name: "otherFees", label: "기타 비용", type: "number", unit: "원", min: 0, max: 100000000, step: 10000, defaultValue: 100000 }
    ],
    guideTitle: "APR 계산 기준",
    guide: [
      "APR은 명목 이자율뿐 아니라 대출 실행 시 부담하는 수수료와 기타 비용까지 반영한 실질 연이율입니다.",
      "이 계산기는 원리금균등 상환액을 먼저 계산한 뒤, 실제 수령액(대출금에서 수수료를 차감한 금액)을 기준으로 월 내부수익률을 역산해 APR을 추정합니다.",
      "금융기관의 APR 산정 방식은 비용 포함 범위와 일수 계산 방식에 따라 달라질 수 있으므로, 여러 대출 조건을 비교하는 참고값으로 활용하세요."
    ],
    checkpoints: [
      "수수료가 높을수록 명목금리보다 APR이 높게 나옵니다.",
      "대출 기간이 짧으면 같은 수수료도 APR에 더 크게 반영됩니다.",
      "금융기관 공시 APR과는 비용 포함 기준이 다를 수 있습니다."
    ],
    faqs: [
      { question: "APR과 명목금리는 무엇이 다른가요?", answer: "명목금리는 이자율만 보는 값이고, APR은 수수료와 기타 비용까지 포함해 실제 부담률을 연율로 환산한 값입니다." },
      { question: "수수료가 0원이면 APR은 어떻게 되나요?", answer: "수수료가 없고 원리금균등 상환 기준이라면 APR은 명목금리와 거의 비슷하게 계산됩니다." }
    ],
    calculate(values) {
      const months = Math.max(values.years * 12, 1);
      const monthlyPayment = monthlyLoanPayment(values.principal, values.annualRate, values.years);
      const fees = Math.max(values.originationFee + values.otherFees, 0);
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - values.principal;
      const apr = estimateApr(values.principal, monthlyPayment, months, fees);

      return {
        headline: formatPercent(apr, 2),
        subline: `월 상환액 ${formatWon(monthlyPayment)} · 총 비용 ${formatWon(totalInterest + fees)}`,
        rows: [
          { label: "실질 연이율(APR)", value: formatPercent(apr, 2), tone: "strong" },
          { label: "명목 연금리", value: formatPercent(values.annualRate, 2) },
          { label: "월 상환액", value: formatWon(monthlyPayment), tone: "strong" },
          { label: "총 이자", value: formatWon(totalInterest) },
          { label: "수수료 합계", value: formatWon(fees), tone: "strong" },
          { label: "총 대출 비용", value: formatWon(totalInterest + fees), tone: "strong" }
        ],
        chart: [
          { name: "원금", value: values.principal },
          { name: "이자", value: totalInterest },
          { name: "수수료", value: fees }
        ]
      };
    }
  },
  {
    slug: "inflation-calculator",
    title: "인플레이션 계산기",
    description: "현재 금액, 물가상승률, 기간을 입력해 미래 필요 금액과 구매력 변화를 계산합니다.",
    category: "금융",
    keywords: ["인플레이션 계산기", "물가상승률 계산", "화폐 가치 계산", "구매력 계산", "미래 가격 계산"],
    badge: "구매력 변화",
    audience: "생활비와 목표자금을 장기 계획하는 사용자, 물가 상승 영향을 확인하려는 사용자",
    fields: [
      { name: "currentAmount", label: "현재 금액", type: "number", unit: "원", min: 1000, max: 10000000000, step: 10000, defaultValue: 1000000 },
      { name: "inflationRate", label: "연 물가상승률", type: "number", unit: "%", min: -10, max: 30, step: 0.1, defaultValue: 3 },
      { name: "years", label: "기간", type: "number", unit: "년", min: 1, max: 100, step: 1, defaultValue: 10 }
    ],
    guideTitle: "인플레이션 계산 기준",
    guide: [
      "인플레이션은 시간이 지나며 같은 돈으로 살 수 있는 상품과 서비스의 양이 줄어드는 현상입니다.",
      "이 계산기는 현재 금액에 연 물가상승률을 복리로 적용해 미래에 같은 구매력을 유지하려면 얼마가 필요한지 추정합니다.",
      "실제 물가상승률은 품목, 지역, 기간에 따라 달라지므로 장기 예산과 목표자금 계획의 민감도 분석용으로 활용하세요."
    ],
    checkpoints: [
      "장기 계획에서는 작은 물가상승률 차이도 미래 금액을 크게 바꿉니다.",
      "교육비, 의료비, 주거비처럼 특정 품목은 평균 물가보다 빠르게 오를 수 있습니다.",
      "마이너스 물가상승률을 입력하면 디플레이션 상황도 가정할 수 있습니다."
    ],
    faqs: [
      { question: "현재 100만원이 10년 뒤 얼마의 가치가 되나요?", answer: "물가상승률에 따라 달라집니다. 예를 들어 연 3%라면 10년 뒤 같은 구매력에는 약 134만원이 필요합니다." },
      { question: "미래 구매력은 어떻게 계산하나요?", answer: "현재 금액을 물가상승률로 할인해 미래 시점의 실질 구매력으로 환산합니다." }
    ],
    calculate(values) {
      const factor = (1 + values.inflationRate / 100) ** values.years;
      const futureCost = values.currentAmount * factor;
      const purchasingPower = factor === 0 ? 0 : values.currentAmount / factor;
      const lostPower = values.currentAmount - purchasingPower;

      return {
        headline: formatWon(futureCost),
        subline: `${values.years.toLocaleString("ko-KR")}년 뒤 같은 구매력에 필요한 금액`,
        rows: [
          { label: "현재 금액", value: formatWon(values.currentAmount) },
          { label: "연 물가상승률", value: formatPercent(values.inflationRate, 1), tone: "strong" },
          { label: "미래 필요 금액", value: formatWon(futureCost), tone: "strong" },
          { label: "미래 시점 구매력", value: formatWon(purchasingPower), tone: "strong" },
          { label: "구매력 감소분", value: formatWon(lostPower) }
        ],
        chart: [
          { name: "현재금액", value: values.currentAmount },
          { name: "미래필요", value: futureCost },
          { name: "실질구매력", value: purchasingPower }
        ]
      };
    }
  },
  {
    slug: "roi-calculator",
    title: "ROI 계산기",
    description: "투자금, 회수금, 추가 수익과 비용을 입력해 투자수익률과 연환산 수익률을 계산합니다.",
    category: "금융",
    keywords: ["ROI 계산기", "투자수익률 계산기", "수익률 계산", "연환산 수익률", "투자 성과 분석"],
    badge: "투자수익률",
    audience: "투자 성과를 비교하는 사용자, 프로젝트 수익성을 빠르게 확인하려는 사용자",
    fields: [
      { name: "initialInvestment", label: "초기 투자금", type: "number", unit: "원", min: 0, max: 10000000000, step: 100000, defaultValue: 10000000 },
      { name: "endingValue", label: "최종 평가액", type: "number", unit: "원", min: 0, max: 10000000000, step: 100000, defaultValue: 13000000 },
      { name: "additionalIncome", label: "배당·임대 등 추가 수익", type: "number", unit: "원", min: 0, max: 10000000000, step: 10000, defaultValue: 500000 },
      { name: "totalCosts", label: "수수료·세금·유지비", type: "number", unit: "원", min: 0, max: 10000000000, step: 10000, defaultValue: 200000 },
      { name: "years", label: "투자 기간", type: "number", unit: "년", min: 0.1, max: 50, step: 0.1, defaultValue: 2 }
    ],
    guideTitle: "ROI 계산 기준",
    guide: [
      "ROI는 투자금 대비 순이익 비율을 뜻합니다. 최종 평가액과 추가 수익을 더하고, 초기 투자금과 비용을 뺀 순이익을 초기 투자금으로 나눠 계산합니다.",
      "투자 기간이 서로 다르면 단순 ROI만으로 비교하기 어렵기 때문에, 이 계산기는 연환산 수익률도 함께 보여줍니다.",
      "주식, 부동산, 사업 프로젝트처럼 성격이 다른 투자도 같은 틀로 비교할 수 있지만 위험도와 현금흐름 시점은 별도로 봐야 합니다."
    ],
    checkpoints: [
      "세금과 수수료를 빼야 실제 ROI에 가까워집니다.",
      "기간이 다른 투자는 연환산 수익률을 함께 비교하세요.",
      "ROI가 높아도 변동성·유동성·손실 가능성은 별도 판단이 필요합니다."
    ],
    faqs: [
      { question: "ROI는 어떻게 계산하나요?", answer: "순이익을 초기 투자금으로 나눈 뒤 100을 곱해 계산합니다." },
      { question: "연환산 수익률은 왜 필요한가요?", answer: "투자 기간이 서로 다를 때 1년 기준 성과로 바꿔 비교하기 위해 필요합니다." }
    ],
    calculate(values) {
      const proceeds = values.endingValue + values.additionalIncome;
      const netProfit = proceeds - values.initialInvestment - values.totalCosts;
      const roi = values.initialInvestment > 0 ? netProfit / values.initialInvestment * 100 : 0;
      const finalMultiple = values.initialInvestment > 0 ? (values.initialInvestment + netProfit) / values.initialInvestment : 0;
      const annualized = finalMultiple > 0 ? (finalMultiple ** (1 / values.years) - 1) * 100 : -100;

      return {
        headline: formatPercent(roi, 2),
        subline: `순이익 ${formatWon(netProfit)} · 연환산 ${formatPercent(annualized, 2)}`,
        rows: [
          { label: "투자수익률(ROI)", value: formatPercent(roi, 2), tone: "strong" },
          { label: "연환산 수익률", value: formatPercent(annualized, 2), tone: "strong" },
          { label: "총 회수금", value: formatWon(proceeds) },
          { label: "비용 합계", value: formatWon(values.totalCosts) },
          { label: "순이익", value: formatWon(netProfit), tone: "strong" }
        ],
        chart: [
          { name: "투자금", value: values.initialInvestment },
          { name: "순이익", value: Math.max(netProfit, 0) },
          { name: "비용", value: values.totalCosts }
        ]
      };
    }
  },
  {
    slug: "present-value",
    title: "현재가치 계산기",
    description: "미래 금액과 매년 받을 현금흐름을 할인율로 환산해 현재가치를 계산합니다.",
    category: "금융",
    keywords: ["현재가치 계산기", "PV 계산기", "할인율 계산", "미래 현금흐름 현재가치", "투자 타당성"],
    badge: "PV 할인",
    audience: "미래 현금흐름의 현재 가치를 비교하는 사용자, 투자 타당성을 검토하는 사용자",
    fields: [
      { name: "futureValue", label: "미래 일시금", type: "number", unit: "원", min: 0, max: 10000000000, step: 100000, defaultValue: 100000000 },
      { name: "annualCashFlow", label: "연 현금흐름", type: "number", unit: "원", min: 0, max: 1000000000, step: 10000, defaultValue: 5000000 },
      { name: "discountRate", label: "할인율", type: "number", unit: "%", min: 0, max: 50, step: 0.1, defaultValue: 5 },
      { name: "years", label: "기간", type: "number", unit: "년", min: 1, max: 100, step: 1, defaultValue: 10 }
    ],
    guideTitle: "현재가치 계산 기준",
    guide: [
      "현재가치는 미래에 받을 돈을 오늘의 가치로 환산한 금액입니다. 같은 1억원이라도 10년 뒤의 1억원은 할인율을 적용하면 현재 가치가 더 낮습니다.",
      "이 계산기는 미래 일시금의 현재가치와 매년 동일하게 받는 현금흐름의 현재가치를 합산합니다.",
      "할인율은 요구수익률, 자본비용, 인플레이션 기대 등을 반영해 사용자가 직접 정해야 하며, 할인율이 높을수록 현재가치는 낮아집니다."
    ],
    checkpoints: [
      "할인율은 투자 판단에서 가장 민감한 입력값입니다.",
      "매년 받는 현금흐름은 연말 수령을 가정합니다.",
      "위험이 큰 현금흐름일수록 더 높은 할인율을 적용해 보수적으로 볼 수 있습니다."
    ],
    faqs: [
      { question: "현재가치는 어디에 쓰나요?", answer: "투자안 비교, 임대수익 평가, 미래 수령액의 현재 가치 판단 등에 활용합니다." },
      { question: "할인율은 어떻게 정하나요?", answer: "예상 수익률, 대체 투자 수익률, 자본비용, 위험 수준을 고려해 정합니다." }
    ],
    calculate(values) {
      const rate = values.discountRate / 100;
      const lumpSumPv = rate === 0 ? values.futureValue : values.futureValue / ((1 + rate) ** values.years);
      const annuityPv = rate === 0
        ? values.annualCashFlow * values.years
        : values.annualCashFlow * (1 - (1 + rate) ** -values.years) / rate;
      const totalPv = lumpSumPv + annuityPv;
      const nominalTotal = values.futureValue + values.annualCashFlow * values.years;

      return {
        headline: formatWon(totalPv),
        subline: `명목 합계 ${formatWon(nominalTotal)} · 할인율 ${formatPercent(values.discountRate, 1)}`,
        rows: [
          { label: "현재가치 합계", value: formatWon(totalPv), tone: "strong" },
          { label: "미래 일시금 현재가치", value: formatWon(lumpSumPv), tone: "strong" },
          { label: "연 현금흐름 현재가치", value: formatWon(annuityPv), tone: "strong" },
          { label: "명목 수령 합계", value: formatWon(nominalTotal) },
          { label: "할인 효과", value: formatWon(nominalTotal - totalPv) }
        ],
        chart: [
          { name: "일시금PV", value: lumpSumPv },
          { name: "현금흐름PV", value: annuityPv },
          { name: "할인효과", value: Math.max(nominalTotal - totalPv, 0) }
        ]
      };
    }
  },
  {
    slug: "compound-interest",
    title: "복리 투자 수익 계산기",
    description: "초기 투자금, 월 추가 투자금, 수익률, 투자 기간을 기준으로 복리 수익을 계산합니다.",
    category: "금융",
    keywords: ["복리 계산기", "투자 수익 계산기", "적립식 투자"],
    badge: "장기 투자 시뮬레이션",
    audience: "장기 투자자, 적립식 투자 사용자",
    fields: [
      { name: "initialInvestment", label: "초기 투자금", type: "number", unit: "원", min: 0, max: 1000000000, step: 100000, defaultValue: 10000000 },
      { name: "monthlyContribution", label: "월 추가 투자금", type: "number", unit: "원", min: 0, max: 20000000, step: 10000, defaultValue: 500000 },
      { name: "annualRate", label: "예상 연 수익률", type: "number", unit: "%", min: 0, max: 30, step: 0.1, defaultValue: 7 },
      { name: "years", label: "투자 기간", type: "number", unit: "년", min: 1, max: 50, step: 1, defaultValue: 20 }
    ],
    guideTitle: "복리 수익 계산 기준",
    guide: [
      "복리 계산은 수익에 다시 수익이 붙는 구조를 가정합니다. 장기일수록 동일한 수익률 차이가 미래 자산 규모에 크게 반영됩니다.",
      "이 계산기는 월 적립식 추가 투자와 월 복리 재투자를 가정한 단순 시뮬레이션입니다. 실제 투자 결과는 수익률 변동, 수수료, 세금, 투자 시점에 따라 크게 달라질 수 있습니다.",
      "특히 주식·ETF·펀드처럼 변동성이 있는 상품은 연평균 수익률만으로 실제 경로를 설명할 수 없으므로, 목표 금액 대비 보수적으로 해석하는 편이 안전합니다."
    ],
    checkpoints: [
      "수익률보다 투자 기간과 추가 납입 지속성이 결과 차이를 크게 만듭니다.",
      "실제 투자에는 수수료·세금·변동성이 있어 계산값보다 낮게 나올 수 있습니다.",
      "단기 성과보다 장기 누적 효과를 보는 도구로 쓰는 편이 적합합니다."
    ],
    faqs: [
      { question: "예금 복리와 투자 복리를 같이 봐도 되나요?", answer: "계산 방식은 비슷하지만 투자 상품은 원금 보장이 없고 수익률 변동이 크므로 해석은 다르게 해야 합니다." },
      { question: "월 적립금은 언제 납입한 것으로 보나요?", answer: "현재 계산기는 월말 기준으로 꾸준히 적립한다고 가정한 단순 모델입니다." }
    ],
    calculate(values) {
      const futureValue = compoundFutureValue(values.initialInvestment, values.monthlyContribution, values.annualRate, values.years);
      const totalPrincipal = values.initialInvestment + values.monthlyContribution * values.years * 12;
      const gains = futureValue - totalPrincipal;
      const gainRate = totalPrincipal > 0 ? gains / totalPrincipal * 100 : 0;

      return {
        headline: formatWon(futureValue),
        subline: `총 투자원금 ${formatWon(totalPrincipal)} · 누적 수익 ${formatWon(gains)}`,
        rows: [
          { label: "초기 투자금", value: formatWon(values.initialInvestment) },
          { label: "추가 납입 원금", value: formatWon(values.monthlyContribution * values.years * 12) },
          { label: "총 투자원금", value: formatWon(totalPrincipal) },
          { label: "누적 수익", value: formatWon(gains), tone: "strong" },
          { label: "원금 대비 수익률", value: formatPercent(gainRate, 1) }
        ],
        chart: [
          { name: "초기원금", value: values.initialInvestment },
          { name: "추가원금", value: values.monthlyContribution * values.years * 12 },
          { name: "누적수익", value: gains }
        ]
      };
    }
  },
  {
    slug: "bmi",
    title: "BMI 계산기",
    description: "키와 몸무게를 기준으로 BMI 지수와 비만도 구간을 계산합니다.",
    category: "금융",
    keywords: ["BMI 계산기", "비만도 계산", "체질량지수"],
    badge: "건강 지표",
    audience: "체중 관리 사용자, 건강 정보 확인 사용자",
    fields: [
      { name: "heightCm", label: "키", type: "number", unit: "cm", min: 100, max: 230, step: 1, defaultValue: 170 },
      { name: "weightKg", label: "몸무게", type: "number", unit: "kg", min: 20, max: 200, step: 0.1, defaultValue: 65 }
    ],
    guideTitle: "BMI 계산 기준",
    guide: [
      "BMI는 몸무게를 키의 제곱으로 나눈 값으로, 가장 널리 쓰이는 체중 상태 지표 중 하나입니다.",
      "이 계산기는 성인 기준 참고용이며, 근육량, 체지방률, 나이, 성별, 질환 상태를 반영하지 않습니다.",
      "정확한 건강 상태 평가는 BMI 하나만으로 판단할 수 없으므로 필요하면 체성분 검사나 전문 상담을 병행해야 합니다."
    ],
    checkpoints: [
      "BMI는 스크리닝 지표이지 건강 상태의 최종 판정값이 아닙니다.",
      "근육량이 많은 사람은 BMI가 높아도 실제 체지방 상태와 다를 수 있습니다.",
      "성장기 청소년은 별도 성장 기준표로 보는 것이 맞습니다."
    ],
    faqs: [
      { question: "BMI가 정상이어도 건강 문제가 있을 수 있나요?", answer: "네. 복부비만, 체지방률, 혈압, 혈당 등 다른 지표를 함께 봐야 합니다." },
      { question: "운동선수도 같은 기준을 써도 되나요?", answer: "근육량이 많은 경우 BMI만으로는 과체중처럼 보일 수 있어 해석에 주의가 필요합니다." }
    ],
    calculate(values) {
      const meters = values.heightCm / 100;
      const bmi = meters > 0 ? values.weightKg / (meters * meters) : 0;
      const status = bmi < 18.5 ? "저체중" : bmi < 23 ? "정상" : bmi < 25 ? "과체중" : bmi < 30 ? "비만" : "고도비만";
      const standardWeight = meters * meters * 22;
      return {
        headline: bmi.toFixed(1),
        subline: `판정 ${status} · 표준체중 약 ${standardWeight.toFixed(1)}kg`,
        rows: [
          { label: "BMI", value: bmi.toFixed(1), tone: "strong" },
          { label: "판정", value: status },
          { label: "표준체중(참고)", value: `${standardWeight.toFixed(1)}kg` },
          { label: "현재 몸무게", value: `${values.weightKg.toFixed(1)}kg` }
        ],
        chart: [
          { name: "현재체중", value: values.weightKg },
          { name: "표준체중", value: standardWeight },
          { name: "BMI×2", value: bmi * 2 }
        ]
      };
    }
  },
  {
    slug: "bmr-calculator",
    title: "BMR 기초대사량 계산기",
    description: "성별, 나이, 키, 체중으로 기초대사량(BMR)과 활동 수준별 유지 칼로리를 계산합니다.",
    category: "생활",
    keywords: ["BMR 계산기", "기초대사량 계산기", "유지 칼로리", "활동대사량", "하루 필요 칼로리"],
    badge: "기초대사량",
    audience: "식단 관리 사용자, 운동 계획 사용자, 하루 유지 칼로리가 궁금한 사용자",
    fields: [
      {
        name: "gender",
        label: "성별",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "남성", value: 1 },
          { label: "여성", value: 0 }
        ]
      },
      { name: "age", label: "나이", type: "number", unit: "세", min: 10, max: 100, step: 1, defaultValue: 35 },
      { name: "heightCm", label: "키", type: "number", unit: "cm", min: 100, max: 230, step: 1, defaultValue: 170 },
      { name: "weightKg", label: "체중", type: "number", unit: "kg", min: 25, max: 250, step: 0.1, defaultValue: 70 }
    ],
    guideTitle: "BMR 계산 기준",
    guide: [
      "BMR은 완전한 안정 상태에서 생명 유지에 필요한 최소 에너지입니다.",
      "이 계산기는 Mifflin-St Jeor 공식을 사용해 성별, 나이, 키, 체중 기준의 기초대사량을 추정합니다.",
      "실제 하루 필요 칼로리는 BMR에 활동 수준을 곱해 추정해야 하므로 정주, 가벼운 활동, 보통 활동, 높은 활동 기준의 유지 칼로리를 함께 보여줍니다."
    ],
    checkpoints: [
      "BMR은 하루 섭취 목표가 아니라 최소 필요 에너지에 가까운 참고값입니다.",
      "운동량이 많을수록 유지 칼로리는 BMR보다 크게 높아집니다.",
      "체성분, 질환, 약물, 수면 상태에 따라 실제 에너지 소비는 달라질 수 있습니다."
    ],
    faqs: [
      { question: "BMR과 TDEE는 무엇이 다른가요?", answer: "BMR은 안정 상태의 최소 에너지이고, TDEE는 활동량까지 반영한 하루 유지 칼로리입니다." },
      { question: "다이어트할 때 BMR만큼 먹으면 되나요?", answer: "일반적으로 BMR은 최소 기준에 가깝기 때문에 장기간 BMR 이하로 섭취하는 방식은 권장하기 어렵습니다." }
    ],
    calculate(values) {
      const bmr = values.gender === 1
        ? 10 * values.weightKg + 6.25 * values.heightCm - 5 * values.age + 5
        : 10 * values.weightKg + 6.25 * values.heightCm - 5 * values.age - 161;
      const sedentary = bmr * 1.2;
      const light = bmr * 1.375;
      const moderate = bmr * 1.55;
      const active = bmr * 1.725;

      return {
        headline: formatKcal(bmr),
        subline: `보통 활동 유지 칼로리 ${formatKcal(moderate)}`,
        rows: [
          { label: "기초대사량(BMR)", value: formatKcal(bmr), tone: "strong" },
          { label: "정주 생활 유지 칼로리", value: formatKcal(sedentary) },
          { label: "가벼운 활동 유지 칼로리", value: formatKcal(light) },
          { label: "보통 활동 유지 칼로리", value: formatKcal(moderate), tone: "strong" },
          { label: "높은 활동 유지 칼로리", value: formatKcal(active) }
        ],
        chart: [
          { name: "BMR", value: bmr },
          { name: "가벼운활동", value: light },
          { name: "보통활동", value: moderate },
          { name: "높은활동", value: active }
        ]
      };
    }
  },
  {
    slug: "ideal-weight",
    title: "이상체중 계산기",
    description: "키와 성별을 기준으로 BMI 권장 범위, 표준체중, Hamwi·Devine 방식의 이상체중을 계산합니다.",
    category: "생활",
    keywords: ["이상체중 계산기", "표준체중 계산기", "적정 체중", "건강 체중 범위", "IBW 계산기"],
    badge: "적정 체중 범위",
    audience: "체중 관리 사용자, 건강검진 전후 체중 범위를 확인하려는 사용자",
    fields: [
      {
        name: "gender",
        label: "성별",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "남성", value: 1 },
          { label: "여성", value: 0 }
        ]
      },
      { name: "heightCm", label: "키", type: "number", unit: "cm", min: 120, max: 230, step: 1, defaultValue: 170 },
      { name: "currentWeightKg", label: "현재 체중", type: "number", unit: "kg", min: 25, max: 250, step: 0.1, defaultValue: 70 }
    ],
    guideTitle: "이상체중 계산 기준",
    guide: [
      "이상체중은 하나의 정답이라기보다 키와 성별 기준으로 참고할 수 있는 체중 범위입니다.",
      "이 계산기는 BMI 18.5~23 범위를 건강 체중 참고 범위로 보고, BMI 22 기준 표준체중을 함께 보여줍니다.",
      "Hamwi와 Devine 방식은 성별과 키를 기준으로 한 오래된 이상체중 공식입니다. 근육량, 체지방률, 연령을 반영하지 않으므로 참고값으로 해석하세요."
    ],
    checkpoints: [
      "키가 같아도 근육량과 체지방률에 따라 적정 체중은 달라질 수 있습니다.",
      "BMI 범위와 공식 기반 이상체중을 함께 비교하는 것이 좋습니다.",
      "성장기, 임신, 질환이 있는 경우 일반 공식보다 전문 기준을 우선해야 합니다."
    ],
    faqs: [
      { question: "표준체중과 이상체중은 같은 뜻인가요?", answer: "비슷하게 쓰이지만 표준체중은 보통 BMI 기준, 이상체중은 여러 공식 기반 참고값을 뜻하는 경우가 많습니다." },
      { question: "현재 체중이 범위 밖이면 문제가 있나요?", answer: "반드시 그렇지는 않습니다. 근육량, 체지방률, 건강 상태를 함께 봐야 합니다." }
    ],
    calculate(values) {
      const heightM = values.heightCm / 100;
      const low = heightM * heightM * 18.5;
      const high = heightM * heightM * 23;
      const standard = heightM * heightM * 22;
      const inchesOverFiveFeet = Math.max(values.heightCm / 2.54 - 60, 0);
      const hamwi = values.gender === 1 ? 48 + inchesOverFiveFeet * 2.7 : 45.5 + inchesOverFiveFeet * 2.2;
      const devine = values.gender === 1 ? 50 + inchesOverFiveFeet * 2.3 : 45.5 + inchesOverFiveFeet * 2.3;
      const gap = values.currentWeightKg - standard;

      return {
        headline: `${standard.toFixed(1)}kg`,
        subline: `BMI 권장 범위 ${low.toFixed(1)}kg ~ ${high.toFixed(1)}kg`,
        rows: [
          { label: "BMI 22 표준체중", value: `${standard.toFixed(1)}kg`, tone: "strong" },
          { label: "건강 체중 범위", value: `${low.toFixed(1)}kg ~ ${high.toFixed(1)}kg`, tone: "strong" },
          { label: "Hamwi 이상체중", value: `${hamwi.toFixed(1)}kg` },
          { label: "Devine 이상체중", value: `${devine.toFixed(1)}kg` },
          { label: "현재 체중과 표준체중 차이", value: `${gap >= 0 ? "+" : ""}${gap.toFixed(1)}kg` }
        ],
        chart: [
          { name: "현재", value: values.currentWeightKg },
          { name: "표준", value: standard },
          { name: "하한", value: low },
          { name: "상한", value: high }
        ]
      };
    }
  },
  {
    slug: "calorie-calculator",
    title: "칼로리 계산기",
    description: "성별, 나이, 키, 체중, 활동 수준, 체중 목표를 입력해 BMR, TDEE, BMI, 목표 칼로리와 매크로 영양소를 계산합니다.",
    category: "생활",
    keywords: ["칼로리 계산기", "다이어트 칼로리 계산기", "TDEE 계산기", "BMR 계산기", "BMI 계산기", "매크로 계산기", "칼로리 적자 계산"],
    badge: "BMR·TDEE·매크로",
    audience: "다이어트 칼로리 목표를 정하려는 사용자, 체중 감량·유지·증량 식단을 기록하는 사용자",
    fields: [
      {
        name: "gender",
        label: "성별",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "남성", value: 1 },
          { label: "여성", value: 0 }
        ]
      },
      { name: "age", label: "나이", type: "number", unit: "세", min: 10, max: 100, step: 1, defaultValue: 35 },
      { name: "heightCm", label: "키", type: "number", unit: "cm", min: 100, max: 230, step: 1, defaultValue: 175 },
      { name: "weightKg", label: "현재 체중", type: "number", unit: "kg", min: 25, max: 250, step: 0.1, defaultValue: 75 },
      { name: "targetWeightKg", label: "목표 체중", type: "number", unit: "kg", min: 25, max: 250, step: 0.1, defaultValue: 70 },
      {
        name: "activityLevel",
        label: "활동 수준",
        type: "select",
        defaultValue: 2,
        options: [
          { label: "비활동적 - 운동 거의 없음", value: 0 },
          { label: "가벼운 활동 - 주 1~3일", value: 1 },
          { label: "보통 활동 - 주 3~5일", value: 2 },
          { label: "높은 활동 - 주 6~7일", value: 3 },
          { label: "매우 높은 활동 - 육체노동·고강도", value: 4 }
        ],
        help: "참고 페이지처럼 활동 계수 1.2~1.9 범위로 TDEE를 계산합니다."
      },
      {
        name: "goal",
        label: "목표",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "체중 감량", value: 0 },
          { label: "체중 유지", value: 1 },
          { label: "체중 증가", value: 2 }
        ]
      },
      {
        name: "macroPlan",
        label: "매크로 비율",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "균형형 40/30/30", value: 0 },
          { label: "고탄수 50/25/25", value: 1 },
          { label: "고단백 35/35/30", value: 2 }
        ],
        help: "탄수화물/단백질/지방 순서입니다."
      }
    ],
    guideTitle: "칼로리 계산기 사용 기준",
    guide: [
      "이 계산기는 참고한 CalZen 페이지처럼 Mifflin-St Jeor 공식으로 기초대사량(BMR)을 추정하고, 활동 계수를 곱해 총 일일 에너지 소비량(TDEE)을 계산합니다.",
      "목표가 체중 감량이면 TDEE에서 기본 500kcal를 뺀 값을 제시하되, 여성 1,200kcal·남성 1,500kcal 아래로 내려가지 않도록 안전 하한을 반영합니다. 체중 증가는 TDEE에 300kcal를 더해 계산합니다.",
      "BMI와 목표 체중 차이, 목표 칼로리의 탄수화물·단백질·지방 g 환산값을 함께 보여주므로 식단 기록 앱이나 식단표를 만들 때 출발점으로 쓸 수 있습니다."
    ],
    checkpoints: [
      "BMR은 안정 시 필요한 최소 에너지, TDEE는 활동량까지 반영한 유지 칼로리입니다.",
      "감량 목표는 하루 500kcal 적자를 기본으로 하며 너무 낮은 섭취량은 피해야 합니다.",
      "계산값은 출발점이므로 2~3주간 체중 변화에 맞춰 조정하는 것이 좋습니다."
    ],
    faqs: [
      { question: "칼로리 계산기는 어떤 공식을 쓰나요?", answer: "Mifflin-St Jeor 공식을 사용해 BMR을 계산하고, 활동 수준별 계수를 곱해 TDEE를 추정합니다." },
      { question: "BMR과 TDEE는 무엇이 다른가요?", answer: "BMR은 완전한 안정 상태에서 필요한 최소 칼로리이고, TDEE는 활동량까지 반영한 하루 유지 칼로리입니다." },
      { question: "감량 칼로리는 어떻게 계산하나요?", answer: "기본적으로 TDEE에서 500kcal를 뺍니다. 단, 여성 1,200kcal·남성 1,500kcal 아래로 내려가지 않도록 하한을 적용합니다." },
      { question: "매크로 영양소도 기록해야 하나요?", answer: "총 칼로리가 체중 변화를 좌우하고, 탄수화물·단백질·지방 비율은 포만감, 운동 회복, 체성분 관리에 도움을 줍니다." }
    ],
    calculate(values) {
      const age = Math.max(values.age, 0);
      const heightCm = Math.max(values.heightCm, 0);
      const weightKg = Math.max(values.weightKg, 0);
      const targetWeightKg = Math.max(values.targetWeightKg, 0);
      const heightM = heightCm / 100;
      const bmr = values.gender === 1
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
      const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
      const activityMultiplier = activityMultipliers[Math.min(Math.max(Math.floor(values.activityLevel), 0), activityMultipliers.length - 1)];
      const tdee = Math.max(bmr * activityMultiplier, 0);
      const safeMinimum = values.gender === 1 ? 1500 : 1200;
      const targetCalories = values.goal === 0
        ? Math.max(tdee - 500, safeMinimum)
        : values.goal === 2
          ? tdee + 300
          : tdee;
      const dailyChange = targetCalories - tdee;
      const weeklyChangeKg = dailyChange * 7 / 7700;
      const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
      const targetBmi = heightM > 0 ? targetWeightKg / (heightM * heightM) : 0;
      const macroRatios =
        values.macroPlan === 1 ? { carbs: 0.5, protein: 0.25, fat: 0.25 } :
        values.macroPlan === 2 ? { carbs: 0.35, protein: 0.35, fat: 0.3 } :
        { carbs: 0.4, protein: 0.3, fat: 0.3 };
      const carbsCalories = targetCalories * macroRatios.carbs;
      const proteinCalories = targetCalories * macroRatios.protein;
      const fatCalories = targetCalories * macroRatios.fat;
      const carbsGram = carbsCalories / 4;
      const proteinGram = proteinCalories / 4;
      const fatGram = fatCalories / 9;
      const goalLabel = values.goal === 0 ? "체중 감량" : values.goal === 2 ? "체중 증가" : "체중 유지";

      return {
        headline: formatKcal(targetCalories),
        subline: `${goalLabel} 목표 · TDEE ${formatKcal(tdee)} · BMI ${bmi.toFixed(1)}(${bmiStatus(bmi)})`,
        rows: [
          { label: "목표 칼로리", value: formatKcal(targetCalories), tone: "strong" },
          { label: "유지 칼로리(TDEE)", value: formatKcal(tdee), tone: "strong" },
          { label: "기초대사량(BMR)", value: formatKcal(bmr) },
          { label: "칼로리 조정폭", value: `${dailyChange >= 0 ? "+" : ""}${formatKcal(dailyChange)}` },
          { label: "예상 주간 체중 변화", value: `${weeklyChangeKg >= 0 ? "+" : ""}${weeklyChangeKg.toFixed(2)}kg` },
          { label: "현재 BMI", value: `${bmi.toFixed(1)} · ${bmiStatus(bmi)}`, tone: "strong" },
          { label: "목표 BMI", value: `${targetBmi.toFixed(1)} · ${bmiStatus(targetBmi)}` },
          { label: "탄수화물", value: `${Math.round(carbsGram).toLocaleString("ko-KR")}g (${formatPercent(macroRatios.carbs * 100, 0)})` },
          { label: "단백질", value: `${Math.round(proteinGram).toLocaleString("ko-KR")}g (${formatPercent(macroRatios.protein * 100, 0)})` },
          { label: "지방", value: `${Math.round(fatGram).toLocaleString("ko-KR")}g (${formatPercent(macroRatios.fat * 100, 0)})` }
        ],
        chart: [
          { name: "BMR", value: bmr },
          { name: "TDEE", value: tdee },
          { name: "목표", value: targetCalories }
        ]
      };
    }
  },
  {
    slug: "daily-intake",
    title: "일일 섭취 권장량 계산기",
    description: "나이, 성별, 키, 체중, 활동 수준, 체중 목표를 바탕으로 하루 권장 칼로리와 탄수화물·단백질·지방 섭취량을 계산합니다.",
    category: "생활",
    keywords: ["일일 섭취 권장량 계산기", "일일 권장 칼로리", "RDI 계산기", "하루 칼로리 계산", "기초대사량 계산", "탄단지 계산"],
    badge: "칼로리·탄단지",
    audience: "체중 관리 사용자, 식단 기록 사용자, 하루 칼로리 목표를 정하려는 사용자",
    fields: [
      { name: "age", label: "나이", type: "number", unit: "세", min: 10, max: 100, step: 1, defaultValue: 35 },
      {
        name: "gender",
        label: "성별",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "여성", value: 0 },
          { label: "남성", value: 1 }
        ]
      },
      { name: "heightCm", label: "신장", type: "number", unit: "cm", min: 100, max: 230, step: 1, defaultValue: 170 },
      { name: "weightKg", label: "체중", type: "number", unit: "kg", min: 25, max: 250, step: 0.1, defaultValue: 65 },
      {
        name: "activityLevel",
        label: "활동 수준",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "정주 - 주로 앉아서 생활", value: 0 },
          { label: "낮은 활동 - 가벼운 걷기·가사", value: 1 },
          { label: "활동적 - 규칙적 운동", value: 2 },
          { label: "매우 활동적 - 고강도 활동", value: 3 }
        ],
        help: "FatSecret의 RDI 입력 흐름처럼 활동 수준을 네 단계로 나누어 반영합니다."
      },
      {
        name: "goal",
        label: "목표",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "감량", value: 0 },
          { label: "유지", value: 1 },
          { label: "증량", value: 2 }
        ]
      }
    ],
    guideTitle: "일일 섭취 권장량 계산 기준",
    guide: [
      "이 계산기는 나이, 체중, 신장, 성별, 활동 수준, 체중 목표를 입력해 하루 권장 칼로리를 추정합니다. 참고한 FatSecret의 일일권장 계산 흐름도 같은 핵심 입력값을 사용합니다.",
      "기초대사량은 Mifflin-St Jeor 방식으로 계산하고, 활동 수준별 계수를 곱해 유지 칼로리(TDEE)를 추정합니다. 목표가 감량이면 약 15%를 줄이고, 증량이면 약 10%를 더해 하루 목표 칼로리를 제시합니다.",
      "탄수화물·지방·단백질은 일반적인 식단 기록에 쓰기 쉬운 48%·32%·20% 비율로 나눠 참고량을 보여줍니다. 질환, 임신, 성장기, 운동 목적이 뚜렷한 경우에는 전문가 기준을 우선하세요."
    ],
    checkpoints: [
      "활동 수준을 낮게 잡으면 권장 칼로리가 과소 추정될 수 있습니다.",
      "감량 목표는 무리한 절식 대신 유지 칼로리에서 완만하게 조정하는 편이 안전합니다.",
      "탄단지 비율은 참고값이며 건강 상태와 운동 목적에 따라 달라질 수 있습니다."
    ],
    faqs: [
      { question: "일일 섭취 권장량은 정확한 값인가요?", answer: "아니요. 나이, 체중, 신장, 성별, 활동 수준으로 추정한 참고값입니다. 실제 필요량은 체성분, 수면, 운동량, 질환 여부에 따라 달라질 수 있습니다." },
      { question: "감량 목표는 얼마나 줄여 계산하나요?", answer: "이 계산기는 유지 칼로리에서 약 15%를 줄여 완만한 감량 목표를 보여줍니다." },
      { question: "탄수화물, 단백질, 지방은 어떻게 계산하나요?", answer: "목표 칼로리를 탄수화물 48%, 지방 32%, 단백질 20%로 나눈 뒤 g 단위로 환산합니다. 탄수화물과 단백질은 1g당 4kcal, 지방은 1g당 9kcal로 계산합니다." }
    ],
    calculate(values) {
      const age = Math.max(values.age, 0);
      const heightCm = Math.max(values.heightCm, 0);
      const weightKg = Math.max(values.weightKg, 0);
      const bmr = values.gender === 1
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
      const activityMultipliers = [1.2, 1.375, 1.55, 1.725];
      const activityMultiplier = activityMultipliers[Math.min(Math.max(Math.floor(values.activityLevel), 0), activityMultipliers.length - 1)];
      const maintenanceCalories = Math.max(bmr * activityMultiplier, 0);
      const goalMultiplier = values.goal === 0 ? 0.85 : values.goal === 2 ? 1.1 : 1;
      const targetCalories = maintenanceCalories * goalMultiplier;
      const carbsCalories = targetCalories * 0.48;
      const fatCalories = targetCalories * 0.32;
      const proteinCalories = targetCalories * 0.2;
      const carbsGram = carbsCalories / 4;
      const fatGram = fatCalories / 9;
      const proteinGram = proteinCalories / 4;
      const goalLabel = values.goal === 0 ? "감량" : values.goal === 2 ? "증량" : "유지";

      return {
        headline: formatKcal(targetCalories),
        subline: `${goalLabel} 목표 · 유지 칼로리 ${formatKcal(maintenanceCalories)}`,
        rows: [
          { label: "목표 일일 권장 칼로리", value: formatKcal(targetCalories), tone: "strong" },
          { label: "유지 칼로리(TDEE)", value: formatKcal(maintenanceCalories), tone: "strong" },
          { label: "기초대사량(BMR)", value: formatKcal(bmr) },
          { label: "활동 계수", value: `${activityMultiplier.toFixed(3)}배` },
          { label: "탄수화물 48%", value: `${Math.round(carbsGram).toLocaleString("ko-KR")}g (${formatKcal(carbsCalories)})` },
          { label: "지방 32%", value: `${Math.round(fatGram).toLocaleString("ko-KR")}g (${formatKcal(fatCalories)})` },
          { label: "단백질 20%", value: `${Math.round(proteinGram).toLocaleString("ko-KR")}g (${formatKcal(proteinCalories)})` }
        ],
        chart: [
          { name: "탄수화물", value: carbsCalories },
          { name: "지방", value: fatCalories },
          { name: "단백질", value: proteinCalories }
        ]
      };
    }
  },
  {
    slug: "korean-age",
    title: "만나이 계산기",
    description: "생년월일과 기준일을 입력해 현재 만나이와 다음 생일까지 남은 기간을 계산합니다.",
    category: "금융",
    keywords: ["만나이 계산기", "생일 계산", "연령 계산"],
    badge: "생년월일 기준",
    audience: "연령 확인 사용자, 서류 작성 사용자",
    fields: [
      { name: "birthYear", label: "출생연도", type: "number", unit: "년", min: 1900, max: 2100, step: 1, defaultValue: 1995 },
      { name: "birthMonth", label: "출생월", type: "number", unit: "월", min: 1, max: 12, step: 1, defaultValue: 6 },
      { name: "birthDay", label: "출생일", type: "number", unit: "일", min: 1, max: 31, step: 1, defaultValue: 15 },
      { name: "baseYear", label: "기준연도", type: "number", unit: "년", min: 1900, max: 2100, step: 1, defaultValue: 2026 },
      { name: "baseMonth", label: "기준월", type: "number", unit: "월", min: 1, max: 12, step: 1, defaultValue: 8 },
      { name: "baseDay", label: "기준일", type: "number", unit: "일", min: 1, max: 31, step: 1, defaultValue: 27 }
    ],
    guideTitle: "만나이 계산 기준",
    guide: [
      "만나이는 기준일 현재 생일이 지났는지를 기준으로 계산합니다. 출생연도에서 기준연도를 단순 차감하는 방식과는 다를 수 있습니다.",
      "이 계산기는 서류 작성, 가입 가능 연령 확인, 서비스 이용 연령 체크처럼 날짜 기준이 필요한 상황에 맞춘 도구입니다.",
      "실제 행정·법률 판단에서는 주민등록상 생년월일과 해당 제도의 기준일 정의를 같이 확인해야 합니다."
    ],
    checkpoints: [
      "생일이 지나지 않았으면 연도 차이에서 1을 빼야 합니다.",
      "기준일이 오늘이 아닐 수도 있으므로 서류 기준일을 정확히 넣어야 합니다.",
      "날짜 입력 오류가 있으면 결과가 크게 달라질 수 있습니다."
    ],
    faqs: [
      { question: "연나이와 만나이는 무엇이 다른가요?", answer: "연나이는 현재 연도에서 출생연도를 뺀 값이고, 만나이는 생일 경과 여부를 반영합니다." },
      { question: "기준일을 미래 날짜로 넣어도 되나요?", answer: "네. 특정 예정일 기준 연령 확인에도 사용할 수 있습니다." }
    ],
    calculate(values) {
      const birth = new Date(values.birthYear, values.birthMonth - 1, values.birthDay);
      const base = new Date(values.baseYear, values.baseMonth - 1, values.baseDay);
      let age = values.baseYear - values.birthYear;
      const birthdayThisYear = new Date(values.baseYear, values.birthMonth - 1, values.birthDay);
      if (base < birthdayThisYear) age -= 1;

      const nextBirthday = base >= birthdayThisYear
        ? new Date(values.baseYear + 1, values.birthMonth - 1, values.birthDay)
        : birthdayThisYear;
      const diffDays = Math.max(Math.ceil((nextBirthday.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)), 0);
      const daysLived = Math.max(Math.floor((base.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)), 0);

      return {
        headline: `${age}세`,
        subline: `다음 생일까지 ${diffDays.toLocaleString("ko-KR")}일`,
        rows: [
          { label: "만나이", value: `${age}세`, tone: "strong" },
          { label: "출생일", value: `${values.birthYear}-${String(values.birthMonth).padStart(2, "0")}-${String(values.birthDay).padStart(2, "0")}` },
          { label: "기준일", value: `${values.baseYear}-${String(values.baseMonth).padStart(2, "0")}-${String(values.baseDay).padStart(2, "0")}` },
          { label: "다음 생일까지", value: `${diffDays.toLocaleString("ko-KR")}일` },
          { label: "출생 후 경과일", value: `${daysLived.toLocaleString("ko-KR")}일` }
        ],
        chart: [
          { name: "만나이", value: age },
          { name: "다음생일까지", value: diffDays },
          { name: "경과년수×10", value: age * 10 }
        ]
      };
    }
  },
  {
    slug: "unit-converter",
    title: "단위변환 계산기",
    description: "길이, 무게, 면적 단위를 빠르게 변환합니다.",
    category: "금융",
    keywords: ["단위변환", "평수 변환", "kg lb", "m ft"],
    badge: "길이·무게·면적",
    audience: "생활 계산 사용자, 부동산·쇼핑·해외 단위 확인 사용자",
    fields: [
      {
        name: "conversionType",
        label: "변환 종류",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "㎡ → 평", value: 0 },
          { label: "평 → ㎡", value: 1 },
          { label: "kg → lb", value: 2 },
          { label: "lb → kg", value: 3 },
          { label: "cm → inch", value: 4 },
          { label: "inch → cm", value: 5 },
          { label: "km → mile", value: 6 },
          { label: "mile → km", value: 7 }
        ]
      },
      { name: "inputValue", label: "입력값", type: "number", unit: "", min: 0, max: 1000000, step: 0.01, defaultValue: 84 }
    ],
    guideTitle: "단위변환 기준",
    guide: [
      "이 계산기는 생활에서 자주 쓰는 면적, 무게, 길이 단위를 빠르게 바꾸는 용도입니다.",
      "부동산에서는 1평을 약 3.305785㎡로 보고, 해외 상품 규격이나 운동 데이터에서는 kg/lb, cm/inch, km/mile 변환이 자주 사용됩니다.",
      "실무 문서에서는 소수점 자릿수 기준이 따로 정해질 수 있으므로 제출용 숫자는 해당 기관이나 계약 문서 기준에 맞춰 반올림해야 합니다."
    ],
    checkpoints: [
      "평수 변환은 소수점 자릿수 기준에 따라 체감값이 조금 달라질 수 있습니다.",
      "해외 쇼핑 규격은 inch, lb 단위가 많아 직접 확인용으로 유용합니다.",
      "공식 제출용 수치는 별도 반올림 기준이 있을 수 있습니다."
    ],
    faqs: [
      { question: "84㎡는 몇 평인가요?", answer: "대략 25.4평 수준입니다. 소수점 자릿수에 따라 표기값은 조금 달라질 수 있습니다." },
      { question: "파운드는 정확히 몇 kg인가요?", answer: "1lb는 약 0.45359237kg입니다." }
    ],
    calculate(values) {
      const input = values.inputValue;
      const type = values.conversionType;
      const output =
        type === 0 ? input / 3.305785 :
        type === 1 ? input * 3.305785 :
        type === 2 ? input * 2.2046226218 :
        type === 3 ? input * 0.45359237 :
        type === 4 ? input / 2.54 :
        type === 5 ? input * 2.54 :
        type === 6 ? input * 0.6213711922 :
        input * 1.609344;

      const labels = [
        ["㎡", "평"],
        ["평", "㎡"],
        ["kg", "lb"],
        ["lb", "kg"],
        ["cm", "inch"],
        ["inch", "cm"],
        ["km", "mile"],
        ["mile", "km"]
      ];
      const [from, to] = labels[type] || ["", ""];

      return {
        headline: `${output.toLocaleString("ko-KR", { maximumFractionDigits: 4 })}${to}`,
        subline: `${input.toLocaleString("ko-KR", { maximumFractionDigits: 4 })}${from} → ${to}`,
        rows: [
          { label: "입력 단위", value: from },
          { label: "입력값", value: `${input.toLocaleString("ko-KR", { maximumFractionDigits: 4 })}${from}` },
          { label: "변환 결과", value: `${output.toLocaleString("ko-KR", { maximumFractionDigits: 4 })}${to}`, tone: "strong" }
        ],
        chart: [
          { name: "입력", value: input },
          { name: "출력", value: output },
          { name: "차이", value: Math.abs(output - input) }
        ]
      };
    }
  },
  {
    slug: "real-estate-acquisition-tax",
    title: "부동산 취득세 계산기",
    description: "주택 취득가액을 기준으로 취득세와 지방교육세를 계산합니다.",
    category: "금융",
    keywords: ["취득세 계산기", "부동산 취득세", "주택 취득세"],
    badge: "2026년 지방세법 기준",
    audience: "주택 매수 예정자, 부동산 비용 확인 사용자",
    fields: [
      { name: "homePrice", label: "주택 취득가액", type: "number", unit: "원", min: 10000000, max: 5000000000, step: 1000000, defaultValue: 600000000 }
    ],
    guideTitle: "주택 취득세 계산 기준",
    guide: [
      "2026년 7월 1일 시행 지방세법 제11조 기준으로, 유상거래 주택 취득세는 6억원 이하 1%, 6억원 초과 9억원 이하 구간식, 9억원 초과 3% 구조를 적용합니다.",
      "지방세법 제151조 구조상 주택 유상취득에 대한 지방교육세는 취득세 계산액의 약 10% 수준으로 함께 계산할 수 있습니다. 이 페이지는 그 구조를 단순화해 참고값으로 표시합니다.",
      "실제 납부세액은 주택 수, 조정대상지역 여부, 법인 취득, 생애최초 특례, 농어촌특별세 적용 여부에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "현재 계산기는 일반적인 주택 유상취득 기준입니다.",
      "다주택 중과, 법인 취득, 특례 감면은 포함하지 않았습니다.",
      "지방교육세는 법 조문 구조를 단순화한 참고 계산값입니다."
    ],
    faqs: [
      { question: "6억 초과 9억 이하는 어떻게 계산하나요?", answer: "지방세법 제11조의 구간식에 따라 세율이 1%에서 3% 사이로 올라갑니다." },
      { question: "농어촌특별세도 포함되나요?", answer: "아니요. 현재 화면은 취득세와 지방교육세 중심입니다." }
    ],
    calculate(values) {
      const rate = realEstateAcquisitionRate(values.homePrice);
      const acquisitionTax = values.homePrice * rate;
      const educationTax = acquisitionTax * 0.1;
      const total = acquisitionTax + educationTax;
      return {
        headline: formatWon(total),
        subline: `취득세 ${formatWon(acquisitionTax)} + 지방교육세 ${formatWon(educationTax)}`,
        rows: [
          { label: "주택 취득가액", value: formatWon(values.homePrice) },
          { label: "적용 세율", value: formatPercent(rate * 100, 4) },
          { label: "취득세", value: formatWon(acquisitionTax), tone: "strong" },
          { label: "지방교육세", value: formatWon(educationTax) },
          { label: "합계 참고세액", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "취득세", value: acquisitionTax },
          { name: "지방교육세", value: educationTax },
          { name: "합계", value: total }
        ]
      };
    }
  },
  {
    slug: "car-maintenance",
    title: "자동차 유지비 계산기",
    description: "주행거리, 연비, 유류비, 보험료, 세금, 주차비를 기준으로 월 자동차 유지비를 계산합니다.",
    category: "금융",
    keywords: ["자동차 유지비 계산기", "월 차량비", "유류비 계산"],
    badge: "월 운영비 추정",
    audience: "차량 보유자, 구매 검토자",
    fields: [
      { name: "monthlyDistance", label: "월 주행거리", type: "number", unit: "km", min: 0, max: 10000, step: 10, defaultValue: 1000 },
      { name: "fuelEfficiency", label: "연비", type: "number", unit: "km/L", min: 1, max: 40, step: 0.1, defaultValue: 12 },
      { name: "fuelPrice", label: "유류 단가", type: "number", unit: "원/L", min: 500, max: 4000, step: 10, defaultValue: 1700 },
      { name: "annualInsurance", label: "연 보험료", type: "number", unit: "원", min: 0, max: 5000000, step: 10000, defaultValue: 900000 },
      { name: "annualTax", label: "연 자동차세", type: "number", unit: "원", min: 0, max: 3000000, step: 10000, defaultValue: 400000 },
      { name: "monthlyParking", label: "월 주차/기타비", type: "number", unit: "원", min: 0, max: 1000000, step: 10000, defaultValue: 150000 }
    ],
    guideTitle: "자동차 유지비 계산 기준",
    guide: [
      "자동차 유지비는 유류비뿐 아니라 보험료, 자동차세, 주차비, 소모품, 통행료 등 반복 비용을 같이 봐야 정확해집니다.",
      "이 계산기는 월 주행거리와 연비를 기준으로 유류비를 계산하고, 연간 고정비를 월 기준으로 나눠 합산하는 구조입니다.",
      "정비비, 타이어 교체, 감가상각, 할부이자, 통행료는 운행 패턴과 차량 종류에 따라 크게 달라지므로 필요하면 별도 반영해야 합니다."
    ],
    checkpoints: [
      "연비는 실제 도심 주행 기준으로 입력하는 편이 정확합니다.",
      "보험료와 자동차세는 월이 아니라 연 비용을 월 환산합니다.",
      "할부금은 유지비와 별도 자금 계획 항목으로 보는 것이 좋습니다."
    ],
    faqs: [
      { question: "전기차도 계산할 수 있나요?", answer: "현재는 유류비 기준 구조라 전기차는 연료 단가와 효율을 전비 개념으로 단순 치환해 참고용으로만 쓰는 것이 좋습니다." },
      { question: "정비비는 왜 없나요?", answer: "차종과 주행 습관에 따라 차이가 커서 기본 계산에서는 제외했습니다." }
    ],
    calculate(values) {
      const fuelCost = values.fuelEfficiency > 0 ? values.monthlyDistance / values.fuelEfficiency * values.fuelPrice : 0;
      const insuranceMonthly = values.annualInsurance / 12;
      const taxMonthly = values.annualTax / 12;
      const total = fuelCost + insuranceMonthly + taxMonthly + values.monthlyParking;
      return {
        headline: formatWon(total),
        subline: `월 유류비 ${formatWon(fuelCost)} · 연 고정비 월환산 포함`,
        rows: [
          { label: "유류비", value: formatWon(fuelCost), tone: "strong" },
          { label: "보험료 월환산", value: formatWon(insuranceMonthly) },
          { label: "자동차세 월환산", value: formatWon(taxMonthly) },
          { label: "주차/기타비", value: formatWon(values.monthlyParking) },
          { label: "월 유지비 합계", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "유류비", value: fuelCost },
          { name: "보험료", value: insuranceMonthly },
          { name: "기타", value: taxMonthly + values.monthlyParking }
        ]
      };
    }
  },
  {
    slug: "moving-cost",
    title: "이사 비용 계산기",
    description: "집 크기, 거리, 엘리베이터 여부, 사다리차 여부를 기준으로 이사 비용을 추정합니다.",
    category: "금융",
    keywords: ["이사 비용 계산기", "포장이사 견적", "사다리차 비용"],
    badge: "견적 전 참고용",
    audience: "이사 예정자, 포장이사 비교 사용자",
    fields: [
      { name: "homeSizePyeong", label: "집 크기", type: "number", unit: "평", min: 5, max: 100, step: 1, defaultValue: 24 },
      { name: "distanceKm", label: "이사 거리", type: "number", unit: "km", min: 1, max: 500, step: 1, defaultValue: 15 },
      {
        name: "elevator",
        label: "엘리베이터 사용",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "사용 가능", value: 1 },
          { label: "사용 불가", value: 0 }
        ]
      },
      {
        name: "ladderTruck",
        label: "사다리차 사용",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "미사용", value: 0 },
          { label: "사용", value: 1 }
        ]
      }
    ],
    guideTitle: "이사 비용 계산 기준",
    guide: [
      "실제 포장이사 견적은 짐의 양, 거리, 층수, 엘리베이터 사용 가능 여부, 사다리차 필요 여부에 따라 크게 달라집니다.",
      "이 계산기는 평형대별 기본 비용에 거리 가산, 엘리베이터 불가 가산, 사다리차 가산을 더해 참고용 금액을 추정합니다.",
      "성수기, 주말, 손 없는 날, 보관이사 여부, 폐기물 처리 비용은 별도 견적 요소라 실제 금액과 차이가 날 수 있습니다."
    ],
    checkpoints: [
      "짐의 실제 양이 평형보다 더 중요할 수 있습니다.",
      "엘리베이터 불가와 사다리차 사용은 비용 차이를 크게 만듭니다.",
      "실제 계약 전에는 최소 2~3곳 비교 견적이 필요합니다."
    ],
    faqs: [
      { question: "원룸도 계산 가능한가요?", answer: "네. 평수를 작게 입력하면 참고용 금액을 볼 수 있습니다." },
      { question: "손 없는 날 비용도 반영되나요?", answer: "아니요. 시즌성과 날짜 프리미엄은 제외했습니다." }
    ],
    calculate(values) {
      const base = values.homeSizePyeong <= 10 ? 250000 : values.homeSizePyeong <= 20 ? 450000 : values.homeSizePyeong <= 30 ? 700000 : 1000000 + Math.max(values.homeSizePyeong - 30, 0) * 25000;
      const distanceCost = values.distanceKm * 5000;
      const elevatorSurcharge = values.elevator === 1 ? 0 : 150000;
      const ladderTruckCost = values.ladderTruck === 1 ? 180000 : 0;
      const total = base + distanceCost + elevatorSurcharge + ladderTruckCost;
      return {
        headline: formatWon(total),
        subline: `기본 ${formatWon(base)} + 거리 ${formatWon(distanceCost)}`,
        rows: [
          { label: "기본 이사비", value: formatWon(base) },
          { label: "거리 가산", value: formatWon(distanceCost) },
          { label: "엘리베이터 가산", value: formatWon(elevatorSurcharge) },
          { label: "사다리차 비용", value: formatWon(ladderTruckCost) },
          { label: "예상 이사비", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "기본", value: base },
          { name: "거리", value: distanceCost },
          { name: "추가비", value: elevatorSurcharge + ladderTruckCost }
        ]
      };
    }
  },
  {
    slug: "mobile-plan",
    title: "휴대폰 요금 계산기",
    description: "기본요금, 데이터 옵션, 선택약정 할인, 가족결합을 반영해 월 통신비를 계산합니다.",
    category: "금융",
    keywords: ["휴대폰 요금 계산기", "선택약정 할인", "통신비 계산"],
    badge: "월 통신비 비교",
    audience: "요금제 변경 사용자, 통신비 절감 사용자",
    fields: [
      { name: "baseFee", label: "기본 요금제", type: "number", unit: "원", min: 0, max: 200000, step: 1000, defaultValue: 69000 },
      { name: "extraOptions", label: "부가서비스", type: "number", unit: "원", min: 0, max: 100000, step: 1000, defaultValue: 5000 },
      {
        name: "contractDiscount",
        label: "선택약정 할인",
        type: "select",
        defaultValue: 25,
        options: [
          { label: "없음", value: 0 },
          { label: "25%", value: 25 }
        ]
      },
      { name: "familyDiscount", label: "가족/결합 할인", type: "number", unit: "원", min: 0, max: 100000, step: 1000, defaultValue: 10000 }
    ],
    guideTitle: "휴대폰 요금 계산 기준",
    guide: [
      "휴대폰 요금은 기본요금, 데이터·부가서비스, 선택약정 할인, 가족결합 할인, 기기할부금으로 나뉘어 보는 것이 가장 명확합니다.",
      "이 계산기는 통신서비스 요금 중심이며, 단말기 할부금과 보험료는 제외한 구조입니다.",
      "실제 청구금액은 부가세, 단말기 할부, 콘텐츠 이용료, 멤버십 조건, 프로모션 할인 종료 여부에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "선택약정 할인은 보통 기본요금에 적용됩니다.",
      "가족결합 할인은 통신사별 조건과 묶는 회선 수에 따라 다릅니다.",
      "단말기 할부금은 통신비와 분리해서 보는 것이 좋습니다."
    ],
    faqs: [
      { question: "공시지원금과 선택약정은 같이 적용되나요?", answer: "일반적으로 중복 적용되지 않습니다. 현재 계산기는 선택약정 중심입니다." },
      { question: "부가세까지 포함되나요?", answer: "현재는 입력한 금액 기준 합산이며, 세부 청구 구조는 통신사 청구서와 다를 수 있습니다." }
    ],
    calculate(values) {
      const discount = values.baseFee * (values.contractDiscount / 100);
      const total = Math.max(values.baseFee + values.extraOptions - discount - values.familyDiscount, 0);
      return {
        headline: formatWon(total),
        subline: `선택약정 할인 ${formatWon(discount)} 반영`,
        rows: [
          { label: "기본요금", value: formatWon(values.baseFee) },
          { label: "부가서비스", value: formatWon(values.extraOptions) },
          { label: "선택약정 할인", value: `-${formatWon(discount)}` },
          { label: "가족/결합 할인", value: `-${formatWon(values.familyDiscount)}` },
          { label: "예상 월 통신비", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "기본+옵션", value: values.baseFee + values.extraOptions },
          { name: "할인", value: discount + values.familyDiscount },
          { name: "최종", value: total }
        ]
      };
    }
  },
  {
    slug: "seller-profit",
    title: "판매자 수익 계산기",
    description: "판매가, 원가, 수수료율, 광고비, 배송비를 기준으로 판매 수익과 마진율을 계산합니다.",
    category: "금융",
    keywords: ["판매자 계산기", "마진율 계산기", "스마트스토어 수익"],
    badge: "판매 수익성 분석",
    audience: "온라인 셀러, 자사몰 운영자, 마켓 판매자",
    fields: [
      { name: "salePrice", label: "판매가", type: "number", unit: "원", min: 0, max: 10000000, step: 1000, defaultValue: 39900 },
      { name: "costPrice", label: "원가", type: "number", unit: "원", min: 0, max: 10000000, step: 1000, defaultValue: 15000 },
      { name: "feeRate", label: "플랫폼 수수료율", type: "number", unit: "%", min: 0, max: 50, step: 0.1, defaultValue: 6 },
      { name: "adCost", label: "건당 광고비", type: "number", unit: "원", min: 0, max: 1000000, step: 100, defaultValue: 3000 },
      { name: "shippingCost", label: "건당 배송비 부담", type: "number", unit: "원", min: 0, max: 1000000, step: 100, defaultValue: 3500 }
    ],
    guideTitle: "판매 수익 계산 기준",
    guide: [
      "판매 수익은 판매가에서 원가만 빼는 것이 아니라 플랫폼 수수료, 광고비, 배송비, 포장비, 반품 비용까지 같이 봐야 정확해집니다.",
      "이 계산기는 주문 1건 기준으로 플랫폼 수수료율을 판매가에 적용하고, 원가·광고비·배송비를 차감해 순이익을 계산합니다.",
      "실제 사업 수익성은 VAT, 카드수수료, CS 비용, 반품률, 쿠폰 분담금 등 추가 요소에 따라 더 낮아질 수 있습니다."
    ],
    checkpoints: [
      "수수료율이 낮아 보여도 광고비와 배송비가 마진을 크게 깎을 수 있습니다.",
      "원가 외에 포장비·반품비도 있으면 더 보수적으로 봐야 합니다.",
      "마진율은 판매가 기준과 원가 기준을 구분해서 봐야 합니다."
    ],
    faqs: [
      { question: "부가세도 포함되나요?", answer: "아니요. 현재는 주문 1건 기준 운영 마진 중심입니다." },
      { question: "무료배송이면 배송비를 어떻게 넣나요?", answer: "판매자가 실제 부담하는 평균 배송비를 입력하면 됩니다." }
    ],
    calculate(values) {
      const fee = values.salePrice * (values.feeRate / 100);
      const profit = values.salePrice - values.costPrice - fee - values.adCost - values.shippingCost;
      const marginRate = values.salePrice > 0 ? profit / values.salePrice * 100 : 0;
      return {
        headline: formatWon(profit),
        subline: `판매가 대비 마진율 ${formatPercent(marginRate, 1)}`,
        rows: [
          { label: "판매가", value: formatWon(values.salePrice) },
          { label: "원가", value: formatWon(values.costPrice) },
          { label: "수수료", value: formatWon(fee) },
          { label: "광고비+배송비", value: formatWon(values.adCost + values.shippingCost) },
          { label: "예상 순이익", value: formatWon(profit), tone: "strong" }
        ],
        chart: [
          { name: "원가", value: values.costPrice },
          { name: "비용", value: fee + values.adCost + values.shippingCost },
          { name: "이익", value: Math.max(profit, 0) }
        ]
      };
    }
  },
  {
    slug: "adsense-revenue",
    title: "구글 애드센스 수익 계산기",
    description: "페이지뷰, CTR, CPC, RPM을 입력해 애드센스 예상 클릭수와 일·월·연 수익을 계산합니다.",
    category: "금융",
    keywords: ["애드센스 수익 계산기", "구글 애드센스 계산기", "RPM 계산기", "CPC 계산기", "블로그 수익"],
    badge: "광고 수익 시뮬레이션",
    audience: "블로그 운영자, 콘텐츠 사이트 운영자, 애드센스 수익을 추정하려는 사용자",
    fields: [
      { name: "dailyPageViews", label: "일 페이지뷰", type: "number", unit: "PV", min: 0, max: 100000000, step: 100, defaultValue: 3000 },
      { name: "ctr", label: "광고 CTR", type: "number", unit: "%", min: 0, max: 30, step: 0.1, defaultValue: 1.2 },
      { name: "cpc", label: "평균 CPC", type: "number", unit: "원", min: 0, max: 100000, step: 10, defaultValue: 180 },
      { name: "rpm", label: "페이지 RPM", type: "number", unit: "원", min: 0, max: 1000000, step: 10, defaultValue: 2160 },
      {
        name: "calculationMode",
        label: "계산 기준",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "CTR×CPC 기준", value: 0 },
          { label: "RPM 기준", value: 1 }
        ]
      }
    ],
    guideTitle: "애드센스 수익 계산 기준",
    guide: [
      "애드센스 수익은 보통 페이지뷰, 광고 클릭률(CTR), 클릭당 수익(CPC), 페이지 RPM을 함께 봅니다. CTR×CPC 방식은 예상 클릭수에서 수익을 추정하고, RPM 방식은 1,000 페이지뷰당 수익으로 추정합니다.",
      "CTR×CPC 기준 예상 수익은 페이지뷰×CTR×CPC로 계산합니다. RPM 기준 예상 수익은 페이지뷰÷1,000×RPM으로 계산합니다.",
      "실제 애드센스 수익은 광고 위치, 국가, 기기, 광고 단가, 콘텐츠 주제, 무효 트래픽, 계절성, 정책 제한에 따라 달라집니다. 이 계산기는 수익 보장이 아니라 시나리오 비교용입니다."
    ],
    checkpoints: [
      "CTR이 높아 보여도 무효 클릭이나 정책 위반 가능성을 만들면 안 됩니다.",
      "RPM은 국가와 콘텐츠 주제에 따라 크게 달라집니다.",
      "일 페이지뷰가 같아도 모바일 비중, 체류시간, 광고 배치에 따라 수익이 달라질 수 있습니다.",
      "예상 수익은 세금, 환율, 지급 보류, 무효 트래픽 차감을 반영하지 않습니다."
    ],
    faqs: [
      { question: "CTR과 CPC 기준, RPM 기준 중 무엇을 써야 하나요?", answer: "광고 클릭수와 평균 CPC를 알고 있으면 CTR×CPC 기준을, 애드센스 보고서의 페이지 RPM을 알고 있으면 RPM 기준을 쓰는 편이 편합니다." },
      { question: "월 수익은 어떻게 계산하나요?", answer: "일 예상 수익에 30일을 곱해 단순 추정합니다. 요일, 시즌, 검색 유입 변화는 별도로 감안해야 합니다." },
      { question: "애드센스 승인 전에도 사용할 수 있나요?", answer: "네. 예상 페이지뷰와 보수적인 RPM을 넣어 목표 트래픽과 수익 규모를 가늠하는 용도로 사용할 수 있습니다." }
    ],
    calculate(values) {
      const dailyPageViews = Math.max(values.dailyPageViews, 0);
      const expectedClicks = dailyPageViews * (values.ctr / 100);
      const ctrCpcDailyRevenue = expectedClicks * values.cpc;
      const rpmDailyRevenue = dailyPageViews / 1000 * values.rpm;
      const dailyRevenue = values.calculationMode === 1 ? rpmDailyRevenue : ctrCpcDailyRevenue;
      const monthlyRevenue = dailyRevenue * 30;
      const annualRevenue = dailyRevenue * 365;
      const effectiveRpm = dailyPageViews > 0 ? dailyRevenue / dailyPageViews * 1000 : 0;
      const effectiveCpc = expectedClicks > 0 ? dailyRevenue / expectedClicks : 0;

      return {
        headline: formatWon(monthlyRevenue),
        subline: `일 예상 ${formatWon(dailyRevenue)} · 연 예상 ${formatWon(annualRevenue)}`,
        rows: [
          { label: "일 페이지뷰", value: `${formatNumber(dailyPageViews)} PV` },
          { label: "예상 클릭수", value: `${formatNumber(expectedClicks, 1)}회` },
          { label: "일 예상 수익", value: formatWon(dailyRevenue), tone: "strong" },
          { label: "월 예상 수익", value: formatWon(monthlyRevenue), tone: "strong" },
          { label: "연 예상 수익", value: formatWon(annualRevenue), tone: "strong" },
          { label: "유효 RPM", value: `${formatNumber(effectiveRpm, 0)}원` },
          { label: "유효 CPC", value: `${formatNumber(effectiveCpc, 0)}원` },
          { label: "CTR×CPC 기준 일수익", value: formatWon(ctrCpcDailyRevenue) },
          { label: "RPM 기준 일수익", value: formatWon(rpmDailyRevenue) }
        ],
        chart: [
          { name: "일수익", value: dailyRevenue },
          { name: "월수익", value: monthlyRevenue },
          { name: "연수익", value: annualRevenue / 12 }
        ]
      };
    }
  },
  {
    slug: "youtube-ad-revenue",
    title: "YouTube 광고 수익 계산기",
    description: "조회수, 광고 노출률, RPM, CPM, 수익 배분율을 입력해 유튜브 예상 광고 수익을 계산합니다.",
    category: "금융",
    keywords: ["유튜브 수익 계산기", "YouTube 광고 수익", "유튜브 RPM", "유튜브 CPM", "크리에이터 수익"],
    badge: "유튜브 수익 시뮬레이션",
    audience: "유튜브 채널 운영자, 크리에이터, 영상 수익을 추정하려는 사용자",
    fields: [
      { name: "dailyViews", label: "일 조회수", type: "number", unit: "회", min: 0, max: 1000000000, step: 1000, defaultValue: 50000 },
      { name: "rpm", label: "조회수 RPM", type: "number", unit: "원", min: 0, max: 1000000, step: 10, defaultValue: 2500 },
      { name: "adFillRate", label: "광고 노출률", type: "number", unit: "%", min: 0, max: 100, step: 1, defaultValue: 65 },
      { name: "cpm", label: "광고 CPM", type: "number", unit: "원", min: 0, max: 1000000, step: 10, defaultValue: 6000 },
      { name: "creatorShareRate", label: "크리에이터 수익 배분율", type: "number", unit: "%", min: 0, max: 100, step: 1, defaultValue: 55 },
      {
        name: "calculationMode",
        label: "계산 기준",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "RPM 기준", value: 0 },
          { label: "광고노출×CPM 기준", value: 1 }
        ]
      }
    ],
    guideTitle: "YouTube 광고 수익 계산 기준",
    guide: [
      "유튜브 광고 수익은 조회수만으로 정해지지 않습니다. 국가, 콘텐츠 주제, 시청 지속시간, 광고 노출률, 광고 단가, 쇼츠와 롱폼 비중에 따라 실제 수익이 달라집니다.",
      "RPM 기준은 조회수 1,000회당 크리에이터가 받는 수익을 직접 입력해 계산합니다. 광고노출×CPM 기준은 조회수 중 광고가 노출되는 비율과 광고 CPM, 수익 배분율을 반영해 추정합니다.",
      "이 계산기는 광고 수익 시나리오를 비교하기 위한 도구입니다. 멤버십, 슈퍼챗, 브랜드 광고, 제휴 수익, 쇼츠 보너스, 세금, 환율, 무효 트래픽 조정은 별도로 확인해야 합니다."
    ],
    checkpoints: [
      "RPM은 크리에이터가 실제로 체감하는 1,000 조회수당 수익에 가깝습니다.",
      "CPM은 광고주가 보는 광고 노출 1,000회당 단가라 크리에이터 수익과 다를 수 있습니다.",
      "광고 노출률이 낮으면 조회수가 높아도 수익이 기대보다 낮을 수 있습니다.",
      "쇼츠, 롱폼, 라이브는 수익 구조가 다르므로 같은 기준으로 섞어 해석하지 않는 편이 좋습니다."
    ],
    faqs: [
      { question: "RPM 기준과 CPM 기준 중 무엇을 써야 하나요?", answer: "유튜브 스튜디오에서 RPM을 알고 있다면 RPM 기준이 간단합니다. 광고 노출률과 CPM을 따로 가정하고 싶다면 광고노출×CPM 기준을 쓰세요." },
      { question: "월 수익은 어떻게 계산하나요?", answer: "일 예상 광고 수익에 30일을 곱해 단순 추정합니다. 실제 월 수익은 업로드 빈도와 영상별 조회수 편차에 따라 달라집니다." },
      { question: "쇼츠 수익도 계산되나요?", answer: "직접 입력한 RPM이나 CPM 가정으로 시뮬레이션할 수는 있지만, 쇼츠는 수익 배분 구조가 다르므로 별도 보정이 필요합니다." }
    ],
    calculate(values) {
      const dailyViews = Math.max(values.dailyViews, 0);
      const monetizedViews = dailyViews * (values.adFillRate / 100);
      const rpmDailyRevenue = dailyViews / 1000 * values.rpm;
      const cpmDailyRevenue = monetizedViews / 1000 * values.cpm * (values.creatorShareRate / 100);
      const dailyRevenue = values.calculationMode === 1 ? cpmDailyRevenue : rpmDailyRevenue;
      const monthlyRevenue = dailyRevenue * 30;
      const annualRevenue = dailyRevenue * 365;
      const effectiveRpm = dailyViews > 0 ? dailyRevenue / dailyViews * 1000 : 0;
      const monthlyViews = dailyViews * 30;

      return {
        headline: formatWon(monthlyRevenue),
        subline: `일 예상 ${formatWon(dailyRevenue)} · 월 조회수 ${formatNumber(monthlyViews)}회 기준`,
        rows: [
          { label: "일 조회수", value: `${formatNumber(dailyViews)}회` },
          { label: "수익화 광고 노출", value: `${formatNumber(monetizedViews)}회` },
          { label: "일 예상 광고 수익", value: formatWon(dailyRevenue), tone: "strong" },
          { label: "월 예상 광고 수익", value: formatWon(monthlyRevenue), tone: "strong" },
          { label: "연 예상 광고 수익", value: formatWon(annualRevenue), tone: "strong" },
          { label: "유효 RPM", value: `${formatNumber(effectiveRpm, 0)}원` },
          { label: "RPM 기준 일수익", value: formatWon(rpmDailyRevenue) },
          { label: "CPM 기준 일수익", value: formatWon(cpmDailyRevenue) }
        ],
        chart: [
          { name: "일수익", value: dailyRevenue },
          { name: "월수익", value: monthlyRevenue },
          { name: "연평균월", value: annualRevenue / 12 }
        ]
      };
    }
  },
  {
    slug: "military-discharge-date",
    title: "군 전역일 계산기",
    description: "입대일과 복무 개월 수를 기준으로 예상 전역일을 계산합니다.",
    category: "노무",
    keywords: ["군 전역일 계산기", "복무기간 계산", "입대일 계산"],
    badge: "입대일 기준",
    audience: "입대 예정자, 군 복무자, 가족",
    fields: [
      { name: "enlistYear", label: "입대연도", type: "number", unit: "년", min: 2000, max: 2100, step: 1, defaultValue: 2026 },
      { name: "enlistMonth", label: "입대월", type: "number", unit: "월", min: 1, max: 12, step: 1, defaultValue: 9 },
      { name: "enlistDay", label: "입대일", type: "number", unit: "일", min: 1, max: 31, step: 1, defaultValue: 1 },
      { name: "serviceMonths", label: "복무기간", type: "number", unit: "개월", min: 1, max: 36, step: 1, defaultValue: 18 }
    ],
    guideTitle: "전역일 계산 기준",
    guide: [
      "전역일은 군별, 병과, 제도 변경, 복무 단축 여부에 따라 달라질 수 있습니다. 이 계산기는 입대일에 복무 개월 수를 더하는 단순 기준으로 예상 날짜를 계산합니다.",
      "2026년 8월 27일 현재 복무기간 제도는 변경 가능성이 있으므로, 실제 전역일은 병무청·소속 부대 안내를 우선 확인해야 합니다.",
      "휴가, 조기전역, 연장복무, 징계, 특례 적용 등은 반영하지 않습니다."
    ],
    checkpoints: [
      "복무기간 개월 수를 직접 입력하는 구조라 군별 차이를 스스로 반영할 수 있습니다.",
      "실제 전역일은 행정 처리 기준일과 다를 수 있습니다.",
      "제도 변경 가능성이 있어 최신 공지를 반드시 확인해야 합니다."
    ],
    faqs: [
      { question: "육군, 해군, 공군 기간이 다른데 반영되나요?", answer: "현재는 복무 개월 수 직접 입력 방식이라 원하는 기간을 넣어 계산하면 됩니다." },
      { question: "정확한 전역 예정일과 차이가 날 수 있나요?", answer: "네. 부대 행정 기준, 복무 변동, 제도 변경에 따라 실제 날짜와 차이가 날 수 있습니다." }
    ],
    calculate(values) {
      const dischargeDate = addMonthsToDate(values.enlistYear, values.enlistMonth, values.enlistDay, Math.floor(values.serviceMonths));
      const formatted = `${dischargeDate.getFullYear()}-${String(dischargeDate.getMonth() + 1).padStart(2, "0")}-${String(dischargeDate.getDate()).padStart(2, "0")}`;
      return {
        headline: formatted,
        subline: `${Math.floor(values.serviceMonths)}개월 복무 기준 예상 전역일`,
        rows: [
          { label: "입대일", value: `${values.enlistYear}-${String(values.enlistMonth).padStart(2, "0")}-${String(values.enlistDay).padStart(2, "0")}` },
          { label: "복무기간", value: `${Math.floor(values.serviceMonths)}개월` },
          { label: "예상 전역일", value: formatted, tone: "strong" }
        ],
        chart: [
          { name: "입대월", value: values.enlistMonth },
          { name: "복무개월", value: values.serviceMonths },
          { name: "전역월", value: dischargeDate.getMonth() + 1 }
        ]
      };
    }
  },
  {
    slug: "lump-sum-deposit",
    title: "예금 단리 계산기",
    description: "목돈 예치금, 기간, 금리, 과세 유형을 기준으로 만기 원리금과 세후 이자를 계산합니다.",
    category: "금융",
    keywords: ["예금 계산기", "단리 계산기", "목돈 예치"],
    badge: "목돈 예치 기준",
    audience: "예금 가입 사용자, 자금 운용 비교 사용자",
    fields: [
      { name: "principal", label: "예치금", type: "number", unit: "원", min: 10000, max: 5000000000, step: 10000, defaultValue: 10000000 },
      { name: "months", label: "기간", type: "number", unit: "개월", min: 1, max: 120, step: 1, defaultValue: 12 },
      { name: "rate", label: "연 이율", type: "number", unit: "%", min: 0, max: 20, step: 0.1, defaultValue: 3.5 },
      {
        name: "taxRate",
        label: "과세 유형",
        type: "select",
        defaultValue: 15.4,
        options: [
          { label: "일반과세 15.4%", value: 15.4 },
          { label: "세금우대 9.5%", value: 9.5 },
          { label: "비과세 0%", value: 0 }
        ]
      }
    ],
    guideTitle: "예금 단리 계산 기준",
    guide: [
      "목돈 예금은 예치 원금 전체에 약정 금리를 적용하는 구조라 적금보다 이자 계산이 단순합니다.",
      "이 계산기는 단리를 기준으로 연이율과 예치 개월 수를 반영해 세전 이자와 세후 실수령액을 계산합니다.",
      "실제 상품은 중도해지 금리, 우대금리 조건, 이자 지급 방식에 따라 차이가 날 수 있습니다."
    ],
    checkpoints: [
      "적금과 달리 예금은 처음부터 원금 전체가 예치됩니다.",
      "세후 기준으로 봐야 실제 수익 비교가 가능합니다.",
      "우대금리 미충족 시 실제 이자는 더 낮아질 수 있습니다."
    ],
    faqs: [
      { question: "복리 예금도 계산되나요?", answer: "현재는 단리 기준입니다. 복리형 상품은 별도 계산이 필요합니다." },
      { question: "만기 전 해지 시 같은 금액을 받나요?", answer: "아니요. 중도해지 시 약정금리 대신 중도해지금리가 적용될 수 있습니다." }
    ],
    calculate(values) {
      const grossInterest = values.principal * (values.rate / 100) * (values.months / 12);
      const tax = grossInterest * (values.taxRate / 100);
      const netInterest = grossInterest - tax;
      const maturity = values.principal + netInterest;
      return {
        headline: formatWon(maturity),
        subline: `세후 이자 ${formatWon(netInterest)} · 만기 실수령액`,
        rows: [
          { label: "예치 원금", value: formatWon(values.principal) },
          { label: "세전 이자", value: formatWon(grossInterest) },
          { label: "이자세", value: formatWon(tax) },
          { label: "세후 이자", value: formatWon(netInterest), tone: "strong" },
          { label: "만기 실수령액", value: formatWon(maturity), tone: "strong" }
        ],
        chart: [
          { name: "원금", value: values.principal },
          { name: "세후이자", value: netInterest },
          { name: "세금", value: tax }
        ]
      };
    }
  },
  {
    slug: "break-even",
    title: "원가율·손익분기점 계산기",
    description: "판매가, 원가, 월 고정비를 기준으로 원가율과 손익분기 판매수량을 계산합니다.",
    category: "금융",
    keywords: ["손익분기점 계산기", "원가율 계산기", "판매 수량"],
    badge: "사업 수익 구조 분석",
    audience: "셀러, 자영업자, 소규모 사업 운영자",
    fields: [
      { name: "salePrice", label: "판매가", type: "number", unit: "원", min: 1, max: 10000000, step: 100, defaultValue: 25000 },
      { name: "costPrice", label: "변동원가", type: "number", unit: "원", min: 0, max: 10000000, step: 100, defaultValue: 12000 },
      { name: "monthlyFixedCost", label: "월 고정비", type: "number", unit: "원", min: 0, max: 100000000, step: 10000, defaultValue: 3000000 }
    ],
    guideTitle: "손익분기점 계산 기준",
    guide: [
      "손익분기점은 한 건당 남는 공헌이익으로 월 고정비를 몇 건 팔아야 회수하는지 보는 지표입니다.",
      "이 계산기는 판매가에서 변동원가를 뺀 공헌이익을 구하고, 월 고정비를 나누어 손익분기 수량을 계산합니다.",
      "실제 사업에서는 반품률, 할인쿠폰, 광고비, 수수료, 세금 등 추가 변동비가 있어 보수적으로 해석해야 합니다."
    ],
    checkpoints: [
      "원가율만 낮아도 고정비가 크면 손익분기점은 높아질 수 있습니다.",
      "한 건당 공헌이익이 핵심입니다.",
      "광고비와 수수료가 빠져 있으면 실제 손익분기점은 더 높습니다."
    ],
    faqs: [
      { question: "원가율은 어떻게 보나요?", answer: "일반적으로 변동원가를 판매가로 나눈 비율로 봅니다." },
      { question: "고정비는 월 기준만 가능한가요?", answer: "현재는 월 운영 기준입니다. 일/분기 기준은 환산해서 입력하면 됩니다." }
    ],
    calculate(values) {
      const costRate = values.salePrice > 0 ? values.costPrice / values.salePrice * 100 : 0;
      const contribution = values.salePrice - values.costPrice;
      const breakEvenUnits = contribution > 0 ? Math.ceil(values.monthlyFixedCost / contribution) : 0;
      const breakEvenSales = breakEvenUnits * values.salePrice;
      return {
        headline: `${breakEvenUnits.toLocaleString("ko-KR")}개`,
        subline: `손익분기 매출 ${formatWon(breakEvenSales)} · 공헌이익 ${formatWon(contribution)}`,
        rows: [
          { label: "원가율", value: formatPercent(costRate, 1) },
          { label: "건당 공헌이익", value: formatWon(contribution), tone: "strong" },
          { label: "월 고정비", value: formatWon(values.monthlyFixedCost) },
          { label: "손익분기 판매수량", value: `${breakEvenUnits.toLocaleString("ko-KR")}개`, tone: "strong" },
          { label: "손익분기 매출", value: formatWon(breakEvenSales) }
        ],
        chart: [
          { name: "판매가", value: values.salePrice },
          { name: "원가", value: values.costPrice },
          { name: "공헌이익", value: Math.max(contribution, 0) }
        ]
      };
    }
  },
  {
    slug: "jeonse-vs-monthly-rent",
    title: "전세 vs 월세 비교 계산기",
    description: "전세보증금과 월세 조건을 이자 기회비용 기준으로 비교합니다.",
    category: "금융",
    keywords: ["전세 월세 비교", "보증금 기회비용", "주거비 비교"],
    badge: "주거비 의사결정",
    audience: "이사 예정자, 임대차 비교 사용자",
    fields: [
      { name: "jeonseDeposit", label: "전세보증금", type: "number", unit: "원", min: 0, max: 5000000000, step: 1000000, defaultValue: 300000000 },
      { name: "monthlyDeposit", label: "월세 보증금", type: "number", unit: "원", min: 0, max: 1000000000, step: 1000000, defaultValue: 10000000 },
      { name: "monthlyRent", label: "월세", type: "number", unit: "원", min: 0, max: 10000000, step: 10000, defaultValue: 1200000 },
      { name: "opportunityRate", label: "기회비용 금리", type: "number", unit: "%", min: 0, max: 20, step: 0.1, defaultValue: 3.5 }
    ],
    guideTitle: "전세와 월세 비교 기준",
    guide: [
      "전세와 월세 비교의 핵심은 월세만이 아니라 보증금이 묶이는 기회비용까지 함께 보는 것입니다.",
      "이 계산기는 전세보증금과 월세 보증금 차액에 기회비용 금리를 적용해 월 환산비용을 계산하고, 월세와 비교하는 구조입니다.",
      "실제 판단에서는 이사 가능성, 자금 유동성, 대출이자, 관리비, 집값 전망 등도 함께 고려해야 합니다."
    ],
    checkpoints: [
      "보증금 차액이 클수록 금리 환경에 따라 전세 체감비용이 달라집니다.",
      "월세는 현금 유출이 분명하고, 전세는 자금 묶임 비용을 봐야 합니다.",
      "대출 활용 여부에 따라 비교 결과가 크게 바뀔 수 있습니다."
    ],
    faqs: [
      { question: "전세대출 이자도 반영되나요?", answer: "현재는 기회비용 금리 입력형입니다. 전세대출 이자를 금리처럼 넣어 비교하면 참고용으로 활용할 수 있습니다." },
      { question: "관리비는 포함되나요?", answer: "아니요. 순수 임대차 구조만 비교합니다." }
    ],
    calculate(values) {
      const depositGap = Math.max(values.jeonseDeposit - values.monthlyDeposit, 0);
      const monthlyOpportunityCost = depositGap * (values.opportunityRate / 100) / 12;
      const monthlyRentCost = values.monthlyRent;
      const cheaper = monthlyOpportunityCost < monthlyRentCost ? "전세 쪽 부담이 낮음" : monthlyRentCost < monthlyOpportunityCost ? "월세 쪽 부담이 낮음" : "유사";
      return {
        headline: formatWon(Math.min(monthlyOpportunityCost, monthlyRentCost)),
        subline: `${cheaper} · 전세 월환산 ${formatWon(monthlyOpportunityCost)} / 월세 ${formatWon(monthlyRentCost)}`,
        rows: [
          { label: "보증금 차액", value: formatWon(depositGap) },
          { label: "전세 기회비용(월환산)", value: formatWon(monthlyOpportunityCost), tone: "strong" },
          { label: "월세", value: formatWon(monthlyRentCost), tone: "strong" },
          { label: "비교 결과", value: cheaper },
          { label: "연간 비용 차이", value: formatWon(Math.abs(monthlyOpportunityCost - monthlyRentCost) * 12) }
        ],
        chart: [
          { name: "전세월환산", value: monthlyOpportunityCost },
          { name: "월세", value: monthlyRentCost },
          { name: "보증금차액", value: depositGap }
        ]
      };
    }
  },
  {
    slug: "gpa",
    title: "학점 계산기",
    description: "과목 학점과 성적을 기준으로 평균평점과 총 취득학점을 계산합니다.",
    category: "금융",
    keywords: ["학점 계산기", "평균평점", "GPA 계산기"],
    badge: "4.5 만점 기준",
    audience: "대학생, 성적 관리 사용자",
    fields: [
      { name: "course1Credit", label: "과목1 학점", type: "number", unit: "학점", min: 0, max: 6, step: 1, defaultValue: 3 },
      { name: "course1Grade", label: "과목1 평점", type: "number", unit: "", min: 0, max: 4.5, step: 0.5, defaultValue: 4.5 },
      { name: "course2Credit", label: "과목2 학점", type: "number", unit: "학점", min: 0, max: 6, step: 1, defaultValue: 3 },
      { name: "course2Grade", label: "과목2 평점", type: "number", unit: "", min: 0, max: 4.5, step: 0.5, defaultValue: 4 },
      { name: "course3Credit", label: "과목3 학점", type: "number", unit: "학점", min: 0, max: 6, step: 1, defaultValue: 3 },
      { name: "course3Grade", label: "과목3 평점", type: "number", unit: "", min: 0, max: 4.5, step: 0.5, defaultValue: 3.5 },
      { name: "course4Credit", label: "과목4 학점", type: "number", unit: "학점", min: 0, max: 6, step: 1, defaultValue: 3 },
      { name: "course4Grade", label: "과목4 평점", type: "number", unit: "", min: 0, max: 4.5, step: 0.5, defaultValue: 4 }
    ],
    guideTitle: "학점 계산 기준",
    guide: [
      "평균평점은 과목별 평점의 단순 평균이 아니라, 각 과목 학점을 가중치로 적용한 가중평균으로 계산합니다.",
      "이 계산기는 4.5 만점 기준으로 4과목까지 빠르게 계산하는 단순 구조입니다.",
      "P/F 과목, 재수강 반영 규정, 대학별 4.3 만점 체계는 별도 기준이 필요합니다."
    ],
    checkpoints: [
      "학점이 큰 과목의 영향이 더 큽니다.",
      "단순 과목 평균과 실제 평균평점은 다를 수 있습니다.",
      "학교별 만점 체계가 다르면 해석에 주의가 필요합니다."
    ],
    faqs: [
      { question: "4.3 만점 학교도 쓸 수 있나요?", answer: "현재는 4.5 만점 기준 입력형입니다. 평점을 해당 체계에 맞게 직접 넣어 참고용으로 볼 수 있습니다." },
      { question: "과목이 4개보다 많으면 어떻게 하나요?", answer: "현재 버전은 4과목 단순 계산입니다. 더 많은 과목 입력형으로 확장 가능합니다." }
    ],
    calculate(values) {
      const items = [
        [values.course1Credit, values.course1Grade],
        [values.course2Credit, values.course2Grade],
        [values.course3Credit, values.course3Grade],
        [values.course4Credit, values.course4Grade]
      ];
      const totalCredits = items.reduce((sum, [credit]) => sum + credit, 0);
      const totalPoints = items.reduce((sum, [credit, grade]) => sum + credit * grade, 0);
      const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
      return {
        headline: gpa.toFixed(2),
        subline: `총 취득학점 ${totalCredits.toLocaleString("ko-KR")}학점`,
        rows: [
          { label: "총 취득학점", value: `${totalCredits.toLocaleString("ko-KR")}학점` },
          { label: "총 평점합", value: totalPoints.toFixed(2) },
          { label: "평균평점", value: gpa.toFixed(2), tone: "strong" }
        ],
        chart: [
          { name: "과목1", value: values.course1Credit * values.course1Grade },
          { name: "과목2", value: values.course2Credit * values.course2Grade },
          { name: "과목3", value: values.course3Credit * values.course3Grade },
          { name: "과목4", value: values.course4Credit * values.course4Grade }
        ]
      };
    }
  },
  {
    slug: "exchange-rate",
    title: "환율 계산기",
    description: "환율과 금액을 직접 입력해 원화와 외화 환산 금액을 계산합니다.",
    category: "금융",
    keywords: ["환율 계산기", "달러 원화 변환", "환전 계산"],
    badge: "수동 환율 입력형",
    audience: "해외결제 사용자, 여행자, 해외구매 사용자",
    fields: [
      { name: "foreignAmount", label: "외화 금액", type: "number", unit: "", min: 0, max: 1000000000, step: 0.01, defaultValue: 1000 },
      { name: "exchangeRate", label: "환율", type: "number", unit: "원", min: 0, max: 100000, step: 0.01, defaultValue: 1380 },
      { name: "feeRate", label: "환전 수수료율", type: "number", unit: "%", min: 0, max: 20, step: 0.1, defaultValue: 1.75 }
    ],
    guideTitle: "환율 계산 기준",
    guide: [
      "이 계산기는 실시간 환율 API를 붙이지 않은 수동 입력형 구조입니다. 사용자가 기준 환율을 직접 넣으면 빠르게 환산 금액과 수수료를 계산할 수 있습니다.",
      "실제 카드 결제, 현찰 매매, 송금 환율은 서로 다를 수 있고, 은행·카드사별 스프레드와 수수료 정책도 차이가 있습니다.",
      "정확한 결제 예상액이 필요하면 사용 중인 은행이나 카드사의 적용 환율을 확인해야 합니다."
    ],
    checkpoints: [
      "매매기준율과 실제 결제 환율은 다를 수 있습니다.",
      "환전 수수료와 카드 해외서비스 수수료는 구조가 다릅니다.",
      "실시간 환율은 별도 API 연동이 필요합니다."
    ],
    faqs: [
      { question: "실시간 환율이 자동 반영되나요?", answer: "아니요. 현재는 기준 환율을 직접 입력하는 방식입니다." },
      { question: "달러 외 통화도 계산되나요?", answer: "네. 통화 종류와 관계없이 외화 금액과 환율을 직접 넣으면 계산할 수 있습니다." }
    ],
    calculate(values) {
      const baseWon = values.foreignAmount * values.exchangeRate;
      const fee = baseWon * (values.feeRate / 100);
      const totalWon = baseWon + fee;
      return {
        headline: formatWon(totalWon),
        subline: `기준 환산 ${formatWon(baseWon)} + 수수료 ${formatWon(fee)}`,
        rows: [
          { label: "외화 금액", value: values.foreignAmount.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) },
          { label: "적용 환율", value: `${values.exchangeRate.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}원` },
          { label: "환산 금액", value: formatWon(baseWon), tone: "strong" },
          { label: "수수료", value: formatWon(fee) },
          { label: "총 원화 기준", value: formatWon(totalWon), tone: "strong" }
        ],
        chart: [
          { name: "환산금액", value: baseWon },
          { name: "수수료", value: fee },
          { name: "총액", value: totalWon }
        ]
      };
    }
  },
  {
    slug: "vat",
    title: "부가세 계산기",
    description: "공급가액 또는 합계금액을 기준으로 부가세와 총액을 계산합니다.",
    category: "금융",
    keywords: ["부가세 계산기", "공급가액", "VAT 계산"],
    badge: "10% VAT 기준",
    audience: "사업자, 프리랜서, 견적서 작성 사용자",
    fields: [
      { name: "amount", label: "기준 금액", type: "number", unit: "원", min: 0, max: 10000000000, step: 1000, defaultValue: 1000000 },
      {
        name: "mode",
        label: "입력 방식",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "공급가액 입력", value: 0 },
          { label: "합계금액 입력", value: 1 }
        ]
      }
    ],
    guideTitle: "부가세 계산 기준",
    guide: [
      "국내 일반적인 부가가치세는 공급가액의 10% 구조로 계산합니다.",
      "이 계산기는 공급가액 입력형과 부가세 포함 합계금액 입력형 두 가지를 모두 지원합니다.",
      "실제 세무 처리에서는 면세, 영세율, 간이과세, 의제매입세액공제 등 별도 제도가 적용될 수 있습니다."
    ],
    checkpoints: [
      "공급가액 기준인지 합계금액 기준인지 먼저 구분해야 합니다.",
      "간이과세자와 면세사업자는 계산 구조가 다를 수 있습니다.",
      "세금계산서 발행 기준과 실제 입금 금액을 혼동하지 않아야 합니다."
    ],
    faqs: [
      { question: "1,100,000원이 부가세 포함이면 공급가액은 얼마인가요?", answer: "통상 1,000,000원이 공급가액이고 100,000원이 부가세입니다." },
      { question: "부가세 10%가 항상 적용되나요?", answer: "일반 과세 거래는 통상 10%지만 면세·영세율 등 예외가 있습니다." }
    ],
    calculate(values) {
      const supply = values.mode === 0 ? values.amount : values.amount / 1.1;
      const vat = values.mode === 0 ? values.amount * 0.1 : values.amount - supply;
      const total = supply + vat;
      return {
        headline: formatWon(total),
        subline: `공급가액 ${formatWon(supply)} · 부가세 ${formatWon(vat)}`,
        rows: [
          { label: "공급가액", value: formatWon(supply), tone: "strong" },
          { label: "부가세", value: formatWon(vat), tone: "strong" },
          { label: "합계금액", value: formatWon(total) }
        ],
        chart: [
          { name: "공급가액", value: supply },
          { name: "부가세", value: vat },
          { name: "합계", value: total }
        ]
      };
    }
  },
  {
    slug: "discount-rate",
    title: "할인율 계산기",
    description: "정가와 판매가를 기준으로 할인금액과 할인율을 계산합니다.",
    category: "금융",
    keywords: ["할인율 계산기", "정가 판매가", "세일 계산"],
    badge: "가격 비교",
    audience: "쇼핑 사용자, 판매자, 가격 비교 사용자",
    fields: [
      { name: "originalPrice", label: "정가", type: "number", unit: "원", min: 0, max: 1000000000, step: 100, defaultValue: 100000 },
      { name: "salePrice", label: "판매가", type: "number", unit: "원", min: 0, max: 1000000000, step: 100, defaultValue: 79000 }
    ],
    guideTitle: "할인율 계산 기준",
    guide: [
      "할인율은 정가 대비 얼마가 줄었는지를 백분율로 보는 구조입니다.",
      "이 계산기는 정가와 실제 판매가를 비교해 할인금액과 할인율을 계산합니다.",
      "쿠폰 중복, 카드 할인, 적립금 환급 등은 별도 반영이 필요합니다."
    ],
    checkpoints: [
      "정가 기준인지 정상가 기준인지 확인해야 합니다.",
      "체감가는 카드할인과 적립까지 반영해야 달라질 수 있습니다.",
      "판매자 관점에서는 할인 후 마진도 함께 봐야 합니다."
    ],
    faqs: [
      { question: "30% 할인인데 체감이 왜 다른가요?", answer: "할인율은 정가 기준이고, 쿠폰/적립/배송비가 체감가를 바꿀 수 있습니다." },
      { question: "가격이 오히려 올랐으면 어떻게 보이나요?", answer: "판매가가 정가보다 높으면 음수 할인 대신 인상 구조로 해석해야 합니다." }
    ],
    calculate(values) {
      const discount = values.originalPrice - values.salePrice;
      const rate = values.originalPrice > 0 ? discount / values.originalPrice * 100 : 0;
      return {
        headline: formatPercent(rate, 1),
        subline: `할인금액 ${formatWon(discount)}`,
        rows: [
          { label: "정가", value: formatWon(values.originalPrice) },
          { label: "판매가", value: formatWon(values.salePrice) },
          { label: "할인금액", value: formatWon(discount), tone: "strong" },
          { label: "할인율", value: formatPercent(rate, 1), tone: "strong" }
        ],
        chart: [
          { name: "정가", value: values.originalPrice },
          { name: "판매가", value: values.salePrice },
          { name: "할인액", value: Math.max(discount, 0) }
        ]
      };
    }
  },
  {
    slug: "date-diff",
    title: "날짜 차이 계산기",
    description: "시작일과 종료일 기준으로 날짜 차이와 주/개월 환산값을 계산합니다.",
    category: "금융",
    keywords: ["날짜 차이 계산기", "D-day", "기간 계산"],
    badge: "기간 계산",
    audience: "일정 관리 사용자, 계약 기간 확인 사용자",
    fields: [
      { name: "startYear", label: "시작연도", type: "number", unit: "년", min: 1900, max: 2100, step: 1, defaultValue: 2026 },
      { name: "startMonth", label: "시작월", type: "number", unit: "월", min: 1, max: 12, step: 1, defaultValue: 8 },
      { name: "startDay", label: "시작일", type: "number", unit: "일", min: 1, max: 31, step: 1, defaultValue: 1 },
      { name: "endYear", label: "종료연도", type: "number", unit: "년", min: 1900, max: 2100, step: 1, defaultValue: 2026 },
      { name: "endMonth", label: "종료월", type: "number", unit: "월", min: 1, max: 12, step: 1, defaultValue: 8 },
      { name: "endDay", label: "종료일", type: "number", unit: "일", min: 1, max: 31, step: 1, defaultValue: 27 }
    ],
    guideTitle: "날짜 차이 계산 기준",
    guide: [
      "날짜 차이 계산은 일정 관리, 계약 기간 확인, D-day 계산에 자주 쓰입니다.",
      "이 계산기는 시작일과 종료일의 달력상 차이를 기준으로 일수, 주수, 개월 환산값을 보여줍니다.",
      "월수는 평균치 환산이므로 계약상 정확한 개월 수 판단과는 다를 수 있습니다."
    ],
    checkpoints: [
      "시작일 포함 여부는 제도별로 다를 수 있습니다.",
      "월수는 평균 환산값이라 참고용으로 봐야 합니다.",
      "잘못된 날짜 입력은 결과를 크게 왜곡합니다."
    ],
    faqs: [
      { question: "같은 날이면 0일인가요?", answer: "현재 계산기는 시작일과 종료일이 같으면 차이를 0일로 봅니다." },
      { question: "음수도 나오나요?", answer: "종료일이 시작일보다 빠르면 음수 일수로 표시될 수 있습니다." }
    ],
    calculate(values) {
      const start = new Date(values.startYear, values.startMonth - 1, values.startDay);
      const end = new Date(values.endYear, values.endMonth - 1, values.endDay);
      const diffDays = daysBetweenDates(start, end);
      const diffWeeks = diffDays / 7;
      const diffMonths = diffDays / 30.4375;
      return {
        headline: `${diffDays.toLocaleString("ko-KR")}일`,
        subline: `약 ${diffWeeks.toFixed(1)}주 · ${diffMonths.toFixed(1)}개월`,
        rows: [
          { label: "날짜 차이", value: `${diffDays.toLocaleString("ko-KR")}일`, tone: "strong" },
          { label: "주 환산", value: `${diffWeeks.toFixed(1)}주` },
          { label: "개월 환산", value: `${diffMonths.toFixed(1)}개월` }
        ],
        chart: [
          { name: "일수", value: Math.abs(diffDays) },
          { name: "주수×7", value: Math.abs(diffWeeks * 7) },
          { name: "개월×30", value: Math.abs(diffMonths * 30) }
        ]
      };
    }
  },
  {
    slug: "dday",
    title: "D-Day 계산기",
    description: "기준일과 목표일 사이의 남은 일수, 지난 일수, 포함 일수를 빠르게 확인합니다.",
    category: "수학",
    keywords: ["D-Day 계산기", "디데이", "날짜 계산", "기념일 계산"],
    badge: "날짜 카운트",
    audience: "시험, 여행, 계약, 기념일을 관리하는 사용자",
    fields: [],
    guideTitle: "D-Day 계산 기준",
    guide: [
      "기준일과 목표일을 선택하면 두 날짜 사이의 차이를 일수로 계산합니다.",
      "오늘을 기준으로 남은 일정, 이미 지난 일정, 시작일 포함 일수를 함께 확인할 수 있습니다."
    ],
    checkpoints: [
      "같은 날짜는 D-Day 0일로 표시합니다.",
      "포함 일수는 시작일과 종료일을 모두 하루로 셉니다.",
      "시간대 차이가 섞이지 않도록 날짜 단위로만 계산합니다."
    ],
    faqs: [
      { question: "D-Day 당일은 어떻게 표시되나요?", answer: "기준일과 목표일이 같으면 D-Day 0일로 표시합니다." },
      { question: "시작일을 포함한 일수도 볼 수 있나요?", answer: "네. 두 날짜를 모두 포함한 일수를 별도로 보여줍니다." }
    ],
    calculate() {
      return {
        headline: "D-Day",
        subline: "전용 날짜 패널에서 기준일과 목표일을 선택하세요.",
        rows: [{ label: "지원", value: "남은 일수, 지난 일수, 포함 일수, 주 환산", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "date-add",
    title: "날짜 더하기 계산기",
    description: "시작일에 일·주·월·년을 더하거나 빼서 도착 날짜와 요일을 계산합니다.",
    category: "수학",
    keywords: ["날짜 더하기", "날짜 빼기", "며칠 후", "개월 후"],
    badge: "일정 계산",
    audience: "업무 마감일, 계약 만료일, 학습 계획을 계산하는 사용자",
    fields: [],
    guideTitle: "날짜 더하기 계산 기준",
    guide: [
      "시작일에 일, 주, 월, 년 단위 값을 더하거나 뺀 날짜를 계산합니다.",
      "월말 날짜는 브라우저 날짜 규칙에 따라 가능한 다음 날짜로 보정됩니다."
    ],
    checkpoints: [
      "주 단위는 7일로 환산합니다.",
      "음수 값을 넣으면 날짜를 거꾸로 계산합니다.",
      "계약 기간 산정처럼 법적 기준이 있는 경우 공식 기준을 함께 확인하세요."
    ],
    faqs: [
      { question: "3개월 후 날짜도 계산되나요?", answer: "네. 월 단위 입력을 사용하면 됩니다." },
      { question: "과거 날짜도 계산할 수 있나요?", answer: "네. 빼기 모드를 선택하거나 음수 값을 입력하면 됩니다." }
    ],
    calculate() {
      return {
        headline: "날짜 이동",
        subline: "전용 날짜 패널에서 시작일과 기간을 입력하세요.",
        rows: [{ label: "지원", value: "일, 주, 월, 년 더하기·빼기, 요일 표시", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "stopwatch",
    title: "스톱워치",
    description: "시작, 일시정지, 랩 기록, 초기화를 지원하는 브라우저 스톱워치입니다.",
    category: "수학",
    keywords: ["스톱워치", "타이머", "랩타임", "시간 측정"],
    badge: "시간 측정",
    audience: "운동, 공부, 업무 시간을 재는 사용자",
    fields: [],
    guideTitle: "스톱워치 사용 기준",
    guide: [
      "시작 버튼으로 시간을 재고, 랩 버튼으로 중간 기록을 남길 수 있습니다.",
      "브라우저 탭이 절전 상태가 되면 표시 갱신 간격은 느려질 수 있지만 경과 시간은 실제 시각 기준으로 보정합니다."
    ],
    checkpoints: [
      "정밀 계측 장비가 필요한 스포츠 공식 기록용은 아닙니다.",
      "랩 기록은 현재 화면에서만 유지됩니다.",
      "모바일에서도 같은 버튼 흐름으로 사용할 수 있습니다."
    ],
    faqs: [
      { question: "랩 기록을 남길 수 있나요?", answer: "네. 실행 중 랩 버튼을 누르면 현재 시간을 목록에 추가합니다." },
      { question: "다른 앱처럼 백그라운드에서도 완벽히 동작하나요?", answer: "브라우저 정책에 따라 화면 갱신은 제한될 수 있지만 경과 시간은 실제 시각 차이로 계산합니다." }
    ],
    calculate() {
      return {
        headline: "스톱워치",
        subline: "전용 시간 측정 패널에서 시작하세요.",
        rows: [{ label: "지원", value: "시작, 일시정지, 랩, 초기화", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "internet-speed-test",
    title: "인터넷 속도 측정기",
    description: "브라우저에서 테스트 파일을 내려받아 다운로드 속도와 지연 시간을 근사 측정합니다.",
    category: "수학",
    keywords: ["인터넷 속도 측정", "다운로드 속도", "핑", "네트워크 테스트"],
    badge: "네트워크 점검",
    audience: "와이파이, 모바일 데이터, 사무실 네트워크를 점검하는 사용자",
    fields: [],
    guideTitle: "속도 측정 기준",
    guide: [
      "테스트 버튼을 누르면 공개 테스트 파일을 내려받은 시간으로 다운로드 속도를 추정합니다.",
      "결과는 현재 브라우저, CDN 위치, 와이파이 상태, 기기 성능에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "측정 중 다른 다운로드나 스트리밍을 멈추면 더 안정적입니다.",
      "VPN, 프록시, 회사 보안망은 결과에 큰 영향을 줄 수 있습니다.",
      "통신사 공식 품질 측정값과는 차이가 날 수 있습니다."
    ],
    faqs: [
      { question: "업로드 속도도 측정하나요?", answer: "현재는 브라우저에서 안전하게 처리하기 쉬운 다운로드 속도와 지연 시간 중심입니다." },
      { question: "결과가 매번 다른 이유는 무엇인가요?", answer: "네트워크 혼잡도, 무선 신호, 테스트 서버 거리, 브라우저 캐시 상태가 계속 변하기 때문입니다." }
    ],
    calculate() {
      return {
        headline: "속도 측정",
        subline: "전용 네트워크 패널에서 테스트를 시작하세요.",
        rows: [{ label: "지원", value: "다운로드 속도, 지연 시간, 테스트 이력", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "pyeong-converter",
    title: "평수 계산기",
    description: "제곱미터와 평을 서로 변환하고 전용면적 기준 주거 규모를 빠르게 확인합니다.",
    category: "수학",
    keywords: ["평수 계산기", "평 제곱미터", "㎡ 변환", "아파트 평수"],
    badge: "면적 변환",
    audience: "부동산 면적을 확인하는 사용자",
    fields: [
      { name: "squareMeter", label: "제곱미터", type: "number", unit: "㎡", min: 0, max: 10000, step: 0.01, defaultValue: 84 },
      { name: "pyeong", label: "평", type: "number", unit: "평", min: 0, max: 3000, step: 0.01, defaultValue: 25.41 }
    ],
    guideTitle: "평수 변환 기준",
    guide: [
      "1평은 약 3.305785㎡ 기준으로 변환합니다.",
      "아파트 광고의 공급면적과 실제 전용면적은 다를 수 있으므로 어떤 면적인지 함께 확인해야 합니다."
    ],
    checkpoints: [
      "㎡→평과 평→㎡ 결과를 동시에 보여줍니다.",
      "소수점 반올림 때문에 등기부나 계약서 수치와 약간 다를 수 있습니다.",
      "전용률은 단지와 주택 유형에 따라 달라집니다."
    ],
    faqs: [
      { question: "84㎡는 몇 평인가요?", answer: "전용면적 기준 약 25.4평입니다." },
      { question: "공급면적 평수와 다른가요?", answer: "네. 공급면적은 공용면적을 포함할 수 있어 전용면적 변환값과 다를 수 있습니다." }
    ],
    calculate(values) {
      const fromSquareMeter = values.squareMeter / 3.305785;
      const fromPyeong = values.pyeong * 3.305785;
      return {
        headline: `${formatNumber(fromSquareMeter, 2)}평`,
        subline: `${formatNumber(values.pyeong, 2)}평은 ${formatNumber(fromPyeong, 2)}㎡`,
        rows: [
          { label: "㎡ → 평", value: `${formatNumber(fromSquareMeter, 2)}평`, tone: "strong" },
          { label: "평 → ㎡", value: `${formatNumber(fromPyeong, 2)}㎡`, tone: "strong" },
          { label: "1평 기준", value: "3.305785㎡" }
        ],
        chart: [
          { name: "입력㎡", value: values.squareMeter },
          { name: "환산평×3.3", value: fromSquareMeter * 3.305785 },
          { name: "입력평㎡", value: fromPyeong }
        ]
      };
    }
  },
  {
    slug: "random-number",
    title: "랜덤 숫자 생성기",
    description: "최소값과 최대값 사이에서 중복 허용 여부를 선택해 임의 숫자를 생성합니다.",
    category: "수학",
    keywords: ["랜덤 숫자", "무작위 번호", "추첨", "난수 생성기"],
    badge: "무작위 추첨",
    audience: "자리 배정, 추첨, 게임, 샘플링이 필요한 사용자",
    fields: [
      { name: "min", label: "최소값", type: "number", min: -1000000, max: 1000000, step: 1, defaultValue: 1 },
      { name: "max", label: "최대값", type: "number", min: -1000000, max: 1000000, step: 1, defaultValue: 45 },
      { name: "count", label: "개수", type: "number", unit: "개", min: 1, max: 100, step: 1, defaultValue: 6 },
      {
        name: "unique",
        label: "중복 허용",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "중복 없이", value: 0 },
          { label: "중복 허용", value: 1 }
        ]
      }
    ],
    actionLabel: "새 숫자 생성",
    guideTitle: "랜덤 숫자 생성 기준",
    guide: [
      "최소값과 최대값을 포함한 범위에서 정수 난수를 생성합니다.",
      "중복 없이 생성할 때 요청 개수가 범위보다 크면 가능한 범위까지만 생성합니다."
    ],
    checkpoints: [
      "보안 추첨이나 암호 생성 용도가 아닌 일반 편의용 난수입니다.",
      "새 숫자 생성 버튼을 누를 때마다 결과가 바뀝니다.",
      "범위가 좁으면 중복 없는 개수는 자동으로 제한됩니다."
    ],
    faqs: [
      { question: "로또 번호처럼 중복 없이 뽑을 수 있나요?", answer: "네. 최소 1, 최대 45, 개수 6, 중복 없이를 선택하면 됩니다." },
      { question: "음수도 가능한가요?", answer: "네. 최소값과 최대값에 음수를 입력할 수 있습니다." }
    ],
    calculate(values, context) {
      const min = Math.floor(Math.min(values.min, values.max));
      const max = Math.floor(Math.max(values.min, values.max));
      const range = max - min + 1;
      const requested = Math.max(1, Math.min(100, Math.floor(values.count)));
      const count = values.unique === 0 ? Math.min(requested, range) : requested;
      const seed = (context?.refreshKey ?? 0) + min * 17 + max * 31 + count * 43;
      const generated = generateRandomIntegers(min, max, count, values.unique === 0, seed);
      return {
        headline: generated.join(", "),
        subline: `${min}부터 ${max}까지 ${count}개 생성`,
        rows: [
          { label: "생성 숫자", value: generated.join(", "), tone: "strong" },
          { label: "범위", value: `${min} ~ ${max}` },
          { label: "중복", value: values.unique === 0 ? "없음" : "허용" }
        ],
        chart: generated.map((value, index) => ({ name: `${index + 1}`, value: Math.abs(value) }))
      };
    }
  },
  {
    slug: "text-counter",
    title: "글자수 계산기",
    description: "텍스트를 입력해 공백 포함/제외 글자수, 단어 수, 줄 수, UTF-8 바이트, 원고지 매수를 계산합니다.",
    category: "생활",
    keywords: ["글자수 계산기", "문자수 세기", "바이트 계산기", "공백 제외 글자수", "원고지 매수"],
    badge: "문서 분량",
    audience: "자기소개서, 블로그, 과제, 원고 분량을 확인하는 사용자",
    fields: [],
    guideTitle: "글자수 계산 기준",
    guide: [
      "공백 포함 글자수는 줄바꿈과 띄어쓰기를 포함한 전체 문자를 기준으로 계산합니다.",
      "공백 제외 글자수는 띄어쓰기, 탭, 줄바꿈을 제거한 문자 수입니다.",
      "바이트는 UTF-8 인코딩 기준이라 한글, 영문, 숫자, 특수문자에 따라 길이가 달라집니다."
    ],
    checkpoints: [
      "자기소개서나 지원서 제한이 공백 포함인지 제외인지 먼저 확인하세요.",
      "사이트마다 줄바꿈과 특수문자 처리 기준이 다를 수 있습니다.",
      "원고지 매수는 200자 원고지를 기준으로 한 대략값입니다."
    ],
    faqs: [
      { question: "한글은 몇 바이트로 계산되나요?", answer: "UTF-8 기준 한글 한 글자는 보통 3바이트로 계산됩니다." },
      { question: "공백 제외 글자수에는 줄바꿈도 빠지나요?", answer: "네. 띄어쓰기, 탭, 줄바꿈 같은 공백 문자를 제외합니다." }
    ],
    calculate() {
      return {
        headline: "텍스트 입력",
        subline: "전용 입력창에 문장을 붙여 넣으면 즉시 계산합니다.",
        rows: [{ label: "지원", value: "공백 포함/제외, 단어, 줄, 바이트, 원고지", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "tip-calculator",
    title: "팁 계산기",
    description: "결제금액, 팁 비율, 인원 수를 입력해 총 팁, 총 결제액, 1인당 부담액을 계산합니다.",
    category: "생활",
    keywords: ["팁 계산기", "팁 비율 계산", "1인당 계산", "더치페이 계산", "서비스 팁"],
    badge: "팁·더치페이",
    audience: "식당, 여행, 단체 결제 비용을 나누려는 사용자",
    fields: [
      { name: "billAmount", label: "결제금액", type: "number", unit: "원", min: 0, step: 1000, defaultValue: 80000 },
      { name: "tipRate", label: "팁 비율", type: "number", unit: "%", min: 0, max: 50, step: 0.5, defaultValue: 10 },
      { name: "people", label: "인원 수", type: "number", unit: "명", min: 1, max: 50, step: 1, defaultValue: 2 },
      {
        name: "roundUnit",
        label: "1인당 올림 단위",
        type: "select",
        defaultValue: 1000,
        options: [
          { label: "정확히 나누기", value: 0 },
          { label: "100원 단위", value: 100 },
          { label: "500원 단위", value: 500 },
          { label: "1,000원 단위", value: 1000 }
        ]
      }
    ],
    guideTitle: "팁 계산 기준",
    guide: [
      "팁은 결제금액에 입력한 팁 비율을 곱해 계산합니다.",
      "1인당 부담액은 팁 포함 총액을 인원 수로 나눈 뒤 선택한 단위로 올림 처리합니다.",
      "올림 단위를 적용하면 실제 모이는 금액이 팁 포함 총액보다 조금 커질 수 있습니다."
    ],
    checkpoints: [
      "카드 수수료나 세금이 별도인 해외 영수증은 최종 결제금액 기준으로 다시 계산하세요.",
      "인원 수는 최소 1명으로 계산합니다.",
      "올림 차액은 더치페이를 편하게 하기 위한 여유 금액입니다."
    ],
    faqs: [
      { question: "팁 비율은 몇 퍼센트를 넣으면 되나요?", answer: "국가와 상황에 따라 다르지만 10%, 15%, 20%처럼 자주 쓰는 비율을 입력하면 됩니다." },
      { question: "1인당 금액을 천원 단위로 맞출 수 있나요?", answer: "네. 1,000원 단위 올림을 선택하면 각자 내기 쉬운 금액으로 계산합니다." }
    ],
    calculate(values) {
      const billAmount = Math.max(0, values.billAmount);
      const tipRate = Math.max(0, values.tipRate);
      const people = Math.max(1, Math.floor(values.people));
      const roundUnit = Math.max(0, values.roundUnit);
      const tip = billAmount * tipRate / 100;
      const total = billAmount + tip;
      const perPersonRaw = total / people;
      const perPerson = roundUnit > 0 ? Math.ceil(perPersonRaw / roundUnit) * roundUnit : perPersonRaw;
      const roundedTotal = perPerson * people;
      const extraFromRounding = Math.max(0, roundedTotal - total);

      return {
        headline: formatWon(perPerson),
        subline: `총 팁 ${formatWon(tip)} · 총 결제액 ${formatWon(total)}`,
        rows: [
          { label: "결제금액", value: formatWon(billAmount) },
          { label: "팁 금액", value: formatWon(tip), tone: "strong" },
          { label: "팁 포함 총액", value: formatWon(total), tone: "strong" },
          { label: "인원 수", value: `${people.toLocaleString("ko-KR")}명` },
          { label: "1인당 부담액", value: formatWon(perPerson), tone: "strong" },
          { label: "올림 차액", value: formatWon(extraFromRounding) }
        ],
        chart: [
          { name: "결제금액", value: billAmount },
          { name: "팁", value: tip },
          { name: "올림차액", value: extraFromRounding }
        ]
      };
    }
  },
  {
    slug: "poker-equity-calculator",
    title: "포커 승률 계산기",
    description: "텍사스 홀덤 홀카드와 보드 카드를 선택해 플레이어별 승률, 타이율, 에퀴티를 몬테카를로 방식으로 계산합니다.",
    category: "생활",
    keywords: ["포커 승률 계산기", "포커 에퀴티", "텍사스 홀덤 승률", "홀덤 계산기", "포커 핸드 확률"],
    badge: "홀덤 에퀴티",
    audience: "텍사스 홀덤 핸드 승률과 콜 판단용 에퀴티를 확인하는 사용자",
    fields: [],
    guideTitle: "포커 승률 계산 기준",
    guide: [
      "각 플레이어의 홀카드 2장과 선택한 보드 카드를 기준으로 남은 카드를 샘플링해 승률을 추정합니다.",
      "보드는 프리플랍 0장, 플랍 3장, 턴 4장, 리버 5장 형태로 지정하는 것을 권장합니다.",
      "결과는 브라우저에서 계산되며 입력한 카드 정보가 서버로 전송되지 않습니다."
    ],
    checkpoints: [
      "같은 카드는 플레이어 핸드나 보드에 중복으로 사용할 수 없습니다.",
      "샘플 수가 많을수록 결과가 안정적이지만 계산 시간이 늘어납니다.",
      "타이 발생 시 해당 팟을 나눈 값까지 포함해 에퀴티를 계산합니다."
    ],
    faqs: [
      { question: "정확한 전체 조합 계산인가요?", answer: "아니요. 빠른 사용성을 위해 몬테카를로 샘플링으로 근사 계산합니다." },
      { question: "몇 명까지 비교할 수 있나요?", answer: "2명부터 6명까지 플레이어를 추가해 멀티웨이 승률을 비교할 수 있습니다." }
    ],
    calculate() {
      return {
        headline: "카드 선택",
        subline: "전용 포커 패널에서 홀카드와 보드를 선택하세요.",
        rows: [{ label: "지원", value: "2~6명, 보드 0~5장, 중복 카드 방지, 승률·타이율·에퀴티", tone: "strong" }],
        chart: []
      };
    }
  },
  {
    slug: "spending-habit-score",
    title: "소비 습관 점수 계산기",
    description: "월 소득, 고정비, 변동비, 저축, 빚 상환, 충동구매 횟수를 입력해 소비 습관 점수와 유형을 계산합니다.",
    category: "생활",
    keywords: ["소비 습관 점수", "소비 성향 테스트", "지출 점수", "가계부 점검", "저축률 계산"],
    badge: "공유형 점수",
    audience: "내 소비 습관을 점수와 유형으로 가볍게 확인하고 싶은 사용자",
    fields: [
      { name: "monthlyIncome", label: "월 소득", type: "number", unit: "원", min: 0, step: 100000, defaultValue: 3200000 },
      { name: "fixedCost", label: "월 고정비", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 1200000 },
      { name: "variableCost", label: "월 변동비", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 950000 },
      { name: "saving", label: "월 저축·투자", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 700000 },
      { name: "debtPayment", label: "월 빚 상환", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 250000 },
      { name: "impulseCount", label: "월 충동구매 횟수", type: "number", unit: "회", min: 0, max: 100, step: 1, defaultValue: 4 }
    ],
    guideTitle: "소비 습관 점수 계산 기준",
    guide: [
      "월 소득 대비 저축률, 소비율, 빚 상환 부담, 충동구매 횟수를 종합해 0~100점 점수로 환산합니다.",
      "점수는 재미와 자기 점검을 위한 참고값이며, 실제 재무 상담이나 신용평가 기준이 아닙니다.",
      "저축률이 높고 고정비와 충동구매가 낮을수록 점수가 올라가도록 설계했습니다."
    ],
    checkpoints: [
      "고정비에는 주거비, 통신비, 보험료처럼 매달 거의 고정되는 비용을 넣으세요.",
      "변동비에는 식비, 쇼핑, 교통, 취미, 외식비처럼 매달 달라지는 비용을 넣으세요.",
      "소득이 불규칙하면 최근 3개월 평균을 입력하면 더 현실적입니다."
    ],
    faqs: [
      { question: "점수가 낮으면 문제가 있다는 뜻인가요?", answer: "아니요. 재미형 점검 도구입니다. 다만 저축률과 고정비 비중을 확인하는 계기로 활용할 수 있습니다." },
      { question: "저축과 투자는 같이 넣어도 되나요?", answer: "네. 예금, 적금, 연금, 주식, 펀드 등 미래를 위해 남기는 금액을 합산해 입력하세요." }
    ],
    calculate(values) {
      const income = Math.max(values.monthlyIncome, 1);
      const spending = values.fixedCost + values.variableCost;
      const savingRate = values.saving / income;
      const spendingRate = spending / income;
      const debtRate = values.debtPayment / income;
      const impulsePenalty = Math.min(20, values.impulseCount * 1.5);
      const rawScore = 55 + savingRate * 85 - Math.max(0, spendingRate - 0.65) * 70 - debtRate * 35 - impulsePenalty;
      const score = Math.max(0, Math.min(100, Math.round(rawScore)));
      const type = score >= 85 ? "재테크 우등생" : score >= 70 ? "균형 잡힌 절약러" : score >= 50 ? "가끔 새는 지갑" : "월말 생존 모드";
      const remaining = values.monthlyIncome - spending - values.saving - values.debtPayment;
      return {
        headline: `${score}점 · ${type}`,
        subline: `저축률 ${formatPercent(savingRate * 100, 1)} · 월 잔액 ${formatWon(remaining)}`,
        rows: [
          { label: "소비 습관 점수", value: `${score}점`, tone: "strong" },
          { label: "소비 유형", value: type, tone: "strong" },
          { label: "저축률", value: formatPercent(savingRate * 100, 1) },
          { label: "소비율", value: formatPercent(spendingRate * 100, 1) },
          { label: "빚 상환 비율", value: formatPercent(debtRate * 100, 1) },
          { label: "월 잔액", value: formatWon(remaining) }
        ],
        chart: [
          { name: "저축", value: values.saving },
          { name: "고정비", value: values.fixedCost },
          { name: "변동비", value: values.variableCost },
          { name: "빚상환", value: values.debtPayment }
        ]
      };
    }
  },
  {
    slug: "salary-vanish-calculator",
    title: "월급 증발 계산기",
    description: "월급에서 주거비, 대출, 식비, 구독, 쇼핑비를 빼면 월급이 며칠 만에 사라지는지 계산합니다.",
    category: "생활",
    keywords: ["월급 증발 계산기", "월급 순삭", "월급 남는 돈", "생활비 계산", "월급 소비"],
    badge: "월급 순삭 테스트",
    audience: "월급이 어디로 사라지는지 재미있게 확인하고 싶은 사용자",
    fields: [
      { name: "salary", label: "월급 실수령액", type: "number", unit: "원", min: 0, step: 100000, defaultValue: 2800000 },
      { name: "housing", label: "주거비", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 750000 },
      { name: "loan", label: "대출·카드 상환", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 350000 },
      { name: "food", label: "식비·카페", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 650000 },
      { name: "transport", label: "교통·통신", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 220000 },
      { name: "subscriptions", label: "구독·멤버십", type: "number", unit: "원", min: 0, step: 1000, defaultValue: 69000 },
      { name: "shopping", label: "쇼핑·취미", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 300000 }
    ],
    guideTitle: "월급 증발 계산 기준",
    guide: [
      "입력한 월 지출 합계를 월급 실수령액과 비교해 월급이 며칠 치 지출로 소진되는지 계산합니다.",
      "30일을 한 달로 보고 지출 비중이 100%를 넘으면 월급이 한 달을 버티지 못하는 상태로 표시합니다.",
      "결과는 재미형 표현이지만, 고정비와 변동비를 분리해 월급 흐름을 점검하는 데 도움이 됩니다."
    ],
    checkpoints: [
      "월급은 세후 실수령액 기준으로 입력하세요.",
      "카드값은 이미 식비·쇼핑에 포함했다면 중복 입력하지 마세요.",
      "남는 돈이 적다면 주거비, 구독비, 쇼핑비처럼 줄일 수 있는 항목부터 비교하세요."
    ],
    faqs: [
      { question: "월급 증발일은 어떤 의미인가요?", answer: "한 달 지출 비중을 날짜로 바꾼 값입니다. 예를 들어 20일이면 월급의 20일 치가 고정·생활비로 사라진다는 뜻입니다." },
      { question: "저축은 어디에 넣나요?", answer: "이 계산기는 지출 중심입니다. 저축까지 포함해 보고 싶다면 쇼핑·취미 대신 별도 지출로 더해 비교하세요." }
    ],
    calculate(values) {
      const salary = Math.max(values.salary, 1);
      const totalExpense = values.housing + values.loan + values.food + values.transport + values.subscriptions + values.shopping;
      const expenseRate = totalExpense / salary;
      const vanishDay = Math.max(1, Math.min(30, Math.ceil(expenseRate * 30)));
      const remaining = values.salary - totalExpense;
      const dailyBudget = remaining / 30;
      const status = expenseRate >= 1 ? "월급 초과 경보" : expenseRate >= 0.85 ? "월말 긴장 모드" : expenseRate >= 0.65 ? "균형 관리 모드" : "여유 확보 모드";
      return {
        headline: `${vanishDay}일차 · ${status}`,
        subline: `월 지출 ${formatWon(totalExpense)} · 남는 돈 ${formatWon(remaining)}`,
        rows: [
          { label: "월급 증발일", value: `${vanishDay}일차`, tone: "strong" },
          { label: "상태", value: status, tone: "strong" },
          { label: "월 지출 합계", value: formatWon(totalExpense) },
          { label: "지출 비중", value: formatPercent(expenseRate * 100, 1) },
          { label: "월 잔액", value: formatWon(remaining), tone: "strong" },
          { label: "하루 잔여 예산", value: formatWon(dailyBudget) }
        ],
        chart: [
          { name: "주거", value: values.housing },
          { name: "상환", value: values.loan },
          { name: "식비", value: values.food },
          { name: "기타", value: values.transport + values.subscriptions + values.shopping }
        ]
      };
    }
  },
  {
    slug: "fire-retirement-age",
    title: "FIRE 은퇴 가능 나이 계산기",
    description: "현재 자산, 월 저축액, 연 지출, 기대수익률, 인출률을 입력해 경제적 자유 목표 나이를 계산합니다.",
    category: "금융",
    keywords: ["FIRE 계산기", "은퇴 가능 나이", "경제적 자유 계산기", "파이어족 계산", "조기은퇴 계산기"],
    badge: "경제적 자유",
    audience: "조기은퇴와 경제적 자유 목표를 재미있게 시뮬레이션하려는 사용자",
    fields: [
      { name: "currentAge", label: "현재 나이", type: "number", unit: "세", min: 15, max: 90, step: 1, defaultValue: 32 },
      { name: "currentAssets", label: "현재 투자자산", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 50000000 },
      { name: "monthlySaving", label: "월 저축·투자액", type: "number", unit: "원", min: 0, step: 100000, defaultValue: 1500000 },
      { name: "annualSpending", label: "연간 생활비", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 30000000 },
      { name: "annualReturn", label: "연 기대수익률", type: "number", unit: "%", min: 0, max: 30, step: 0.1, defaultValue: 5 },
      { name: "withdrawalRate", label: "목표 인출률", type: "number", unit: "%", min: 1, max: 10, step: 0.1, defaultValue: 4 }
    ],
    guideTitle: "FIRE 은퇴 가능 나이 계산 기준",
    guide: [
      "목표 자산은 연간 생활비를 목표 인출률로 나누어 계산합니다. 예를 들어 연 생활비 3,000만원, 인출률 4%라면 목표 자산은 7억5천만원입니다.",
      "현재 자산과 매년 저축액이 기대수익률로 성장한다고 가정해 목표 자산에 도달하는 나이를 찾습니다.",
      "세금, 물가상승률, 소득 변화, 투자 손실, 은퇴 후 추가소득은 단순화되어 있으므로 재미형 시뮬레이션으로 해석하세요."
    ],
    checkpoints: [
      "생활비를 낮추거나 월 저축액을 높이면 FIRE 나이가 크게 앞당겨질 수 있습니다.",
      "기대수익률은 보수적으로 여러 번 바꿔보는 것이 좋습니다.",
      "인출률이 낮을수록 필요한 목표 자산은 커집니다."
    ],
    faqs: [
      { question: "4% 룰이 정확한 기준인가요?", answer: "아니요. 4%는 자주 쓰는 참고값일 뿐이며 시장 상황, 세금, 물가, 은퇴 기간에 따라 달라질 수 있습니다." },
      { question: "집이나 전세보증금도 자산에 넣나요?", answer: "생활비를 만들어내는 투자자산 중심으로 넣는 것이 보수적입니다. 주거자산은 별도 시나리오로 비교하세요." }
    ],
    calculate(values) {
      const withdrawalRate = Math.max(values.withdrawalRate, 0.1) / 100;
      const targetAssets = values.annualSpending / withdrawalRate;
      const annualSaving = values.monthlySaving * 12;
      const annualReturn = values.annualReturn / 100;
      let assets = values.currentAssets;
      let years = 0;
      while (assets < targetAssets && years < 80) {
        assets = assets * (1 + annualReturn) + annualSaving;
        years += 1;
      }
      const fireAge = values.currentAge + years;
      const gap = Math.max(0, targetAssets - values.currentAssets);
      const status = assets >= targetAssets ? `${fireAge}세 FIRE 가능` : "80년 내 도달 어려움";
      return {
        headline: status,
        subline: `목표 자산 ${formatWon(targetAssets)} · 현재 부족액 ${formatWon(gap)}`,
        rows: [
          { label: "FIRE 목표 나이", value: assets >= targetAssets ? `${fireAge}세` : "도달 어려움", tone: "strong" },
          { label: "남은 기간", value: assets >= targetAssets ? `${years.toLocaleString("ko-KR")}년` : "80년 이상" },
          { label: "목표 자산", value: formatWon(targetAssets), tone: "strong" },
          { label: "현재 투자자산", value: formatWon(values.currentAssets) },
          { label: "연 저축액", value: formatWon(annualSaving) },
          { label: "도달 시 예상자산", value: formatWon(assets) }
        ],
        chart: [
          { name: "현재자산", value: values.currentAssets },
          { name: "부족액", value: gap },
          { name: "목표자산", value: targetAssets }
        ]
      };
    }
  },
  {
    slug: "loan-prepayment",
    title: "중도상환 계산기",
    description: "대출 일부를 먼저 갚을 때 줄어드는 이자와 중도상환수수료를 비교합니다.",
    category: "금융",
    keywords: ["중도상환 계산기", "대출 조기상환", "상환수수료", "이자 절감"],
    badge: "조기상환 비교",
    audience: "대출 상환 계획을 조정하는 사용자",
    fields: [
      { name: "balance", label: "현재 대출잔액", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 200000000 },
      { name: "prepayAmount", label: "중도상환액", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 30000000 },
      { name: "rate", label: "연 금리", type: "number", unit: "%", min: 0, max: 30, step: 0.1, defaultValue: 4.5 },
      { name: "remainingMonths", label: "남은 기간", type: "number", unit: "개월", min: 1, max: 600, step: 1, defaultValue: 120 },
      { name: "feeRate", label: "중도상환수수료율", type: "number", unit: "%", min: 0, max: 5, step: 0.1, defaultValue: 1.0 }
    ],
    guideTitle: "중도상환 계산 기준",
    guide: [
      "중도상환액만큼 원금이 줄어든다고 가정하고 남은 기간 동안의 단순 이자 절감액을 추정합니다.",
      "수수료는 중도상환액에 입력한 수수료율을 곱해 계산합니다."
    ],
    checkpoints: [
      "실제 대출은 상환방식, 금리변동, 수수료 면제기간에 따라 결과가 달라집니다.",
      "상환액이 잔액보다 크면 잔액까지만 반영합니다.",
      "절감액에서 수수료를 뺀 순효과가 양수인지 확인하세요."
    ],
    faqs: [
      { question: "정확한 월별 재계산인가요?", answer: "아니요. 빠른 판단을 위한 단순 추정이며 실제 금융기관 계산과 다를 수 있습니다." },
      { question: "수수료가 없으면 어떻게 입력하나요?", answer: "중도상환수수료율을 0으로 입력하면 됩니다." }
    ],
    calculate(values) {
      const prepay = Math.min(values.balance, values.prepayAmount);
      const interestSaved = prepay * (values.rate / 100) * (values.remainingMonths / 12);
      const fee = prepay * (values.feeRate / 100);
      const net = interestSaved - fee;
      return {
        headline: formatWon(net),
        subline: `이자 절감 ${formatWon(interestSaved)} · 수수료 ${formatWon(fee)}`,
        rows: [
          { label: "반영 상환액", value: formatWon(prepay), tone: "strong" },
          { label: "예상 이자 절감", value: formatWon(interestSaved), tone: "strong" },
          { label: "중도상환수수료", value: formatWon(fee) },
          { label: "순 절감 효과", value: formatWon(net), tone: "strong" }
        ],
        chart: [
          { name: "이자절감", value: interestSaved },
          { name: "수수료", value: fee },
          { name: "순효과", value: Math.max(net, 0) }
        ]
      };
    }
  },
  {
    slug: "refinance-calculator",
    title: "대환대출 비교 계산기",
    description: "기존 대출과 갈아탈 대출의 월 상환액, 총 이자, 수수료 포함 절감 효과를 비교합니다.",
    category: "금융",
    keywords: ["대환대출 계산기", "갈아타기 대출", "금리 비교", "월 상환액 비교"],
    badge: "대출 갈아타기",
    audience: "금리 인하, 대환대출을 검토하는 사용자",
    fields: [
      { name: "balance", label: "대출잔액", type: "number", unit: "원", min: 1000000, step: 1000000, defaultValue: 250000000 },
      { name: "oldRate", label: "기존 연 금리", type: "number", unit: "%", min: 0.1, max: 30, step: 0.1, defaultValue: 5.2 },
      { name: "newRate", label: "신규 연 금리", type: "number", unit: "%", min: 0.1, max: 30, step: 0.1, defaultValue: 3.9 },
      { name: "years", label: "남은/신규 기간", type: "number", unit: "년", min: 1, max: 40, step: 1, defaultValue: 20 },
      { name: "switchingCost", label: "갈아타기 비용", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 800000 }
    ],
    guideTitle: "대환대출 비교 기준",
    guide: [
      "기존 금리와 신규 금리를 같은 원리금균등 기간으로 비교해 월 상환액과 총 비용 차이를 계산합니다.",
      "갈아타기 비용에는 중도상환수수료, 인지세, 설정비, 플랫폼 비용 등을 합산해 입력합니다."
    ],
    checkpoints: [
      "신규 기간이 길어지면 월 부담은 줄어도 총 이자는 늘 수 있습니다.",
      "변동금리 상품은 향후 금리 변동 위험을 함께 봐야 합니다.",
      "우대금리 조건을 충족하지 못하면 실제 절감액이 줄어듭니다."
    ],
    faqs: [
      { question: "기간이 달라도 비교할 수 있나요?", answer: "현재는 같은 기간 기준으로 단순 비교합니다. 기간을 바꿔 여러 시나리오를 확인하세요." },
      { question: "갈아타기 비용은 어디에 넣나요?", answer: "수수료, 세금, 기타 비용을 합산해 갈아타기 비용에 입력하면 순효과에 반영됩니다." }
    ],
    calculate(values) {
      const oldPayment = monthlyLoanPayment(values.balance, values.oldRate, values.years);
      const newPayment = monthlyLoanPayment(values.balance, values.newRate, values.years);
      const months = values.years * 12;
      const oldTotal = oldPayment * months;
      const newTotal = newPayment * months + values.switchingCost;
      const saving = oldTotal - newTotal;
      return {
        headline: formatWon(saving),
        subline: `월 ${formatWon(oldPayment - newPayment)} 절감 · 비용 포함`,
        rows: [
          { label: "기존 월 상환액", value: formatWon(oldPayment) },
          { label: "신규 월 상환액", value: formatWon(newPayment), tone: "strong" },
          { label: "월 절감액", value: formatWon(oldPayment - newPayment), tone: "strong" },
          { label: "갈아타기 비용", value: formatWon(values.switchingCost) },
          { label: "총 절감 효과", value: formatWon(saving), tone: "strong" }
        ],
        chart: [
          { name: "기존총액", value: oldTotal },
          { name: "신규총액", value: newTotal },
          { name: "절감", value: Math.max(saving, 0) }
        ]
      };
    }
  },
  {
    slug: "credit-card-payoff",
    title: "신용카드 상환 계산기",
    description: "카드 잔액, 연 이자율, 월 상환액을 입력해 완납까지 걸리는 기간과 총 이자를 계산합니다.",
    category: "금융",
    keywords: ["신용카드 상환 계산기", "카드 리볼빙 이자", "카드값 갚기", "부채 상환 계획", "월 상환액 계산"],
    badge: "카드 부채 상환",
    audience: "카드 잔액과 리볼빙 상환 계획을 세우는 사용자",
    fields: [
      { name: "balance", label: "현재 카드 잔액", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 3000000 },
      { name: "apr", label: "연 이자율", type: "number", unit: "%", min: 0, max: 50, step: 0.1, defaultValue: 16.5 },
      { name: "monthlyPayment", label: "월 기본 상환액", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 250000 },
      { name: "extraPayment", label: "추가 상환액", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 50000 }
    ],
    guideTitle: "카드 상환 계산 기준",
    guide: [
      "매월 잔액에 월 이자를 더한 뒤 입력한 상환액을 차감하는 방식으로 완납 기간을 추정합니다.",
      "월 상환액은 기본 상환액과 추가 상환액을 합산해 반영합니다.",
      "실제 카드사는 일별 이자, 수수료, 결제일, 최소결제금액 기준이 다를 수 있습니다."
    ],
    checkpoints: [
      "월 상환액이 월 이자보다 작거나 같으면 잔액이 줄지 않을 수 있습니다.",
      "리볼빙은 기간이 길어질수록 총 이자 부담이 커집니다.",
      "추가 상환액을 바꿔 총 이자가 얼마나 줄어드는지 비교하세요."
    ],
    faqs: [
      { question: "리볼빙 수수료도 포함되나요?", answer: "입력한 연 이자율에 리볼빙 수수료율을 넣으면 유사하게 추정할 수 있습니다." },
      { question: "일시불 추가 납부는 어떻게 보나요?", answer: "일시불로 먼저 갚을 금액을 현재 카드 잔액에서 빼고 다시 계산하세요." }
    ],
    calculate(values) {
      let balance = Math.max(0, values.balance);
      const monthlyRate = Math.max(0, values.apr) / 100 / 12;
      const payment = Math.max(0, values.monthlyPayment + values.extraPayment);
      let totalInterest = 0;
      let months = 0;
      const firstInterest = balance * monthlyRate;
      const canPayoff = balance === 0 || payment > firstInterest;

      while (balance > 0 && months < 600 && canPayoff) {
        const interest = balance * monthlyRate;
        totalInterest += interest;
        balance = Math.max(0, balance + interest - payment);
        months += 1;
      }

      const years = Math.floor(months / 12);
      const restMonths = months % 12;
      const payoffLabel = canPayoff ? `${years > 0 ? `${years}년 ` : ""}${restMonths}개월` : "상환액 부족";

      return {
        headline: payoffLabel,
        subline: canPayoff ? `총 이자 ${formatWon(totalInterest)} · 총 납입 ${formatWon(values.balance + totalInterest)}` : "월 상환액이 월 이자보다 커야 잔액이 줄어듭니다.",
        rows: [
          { label: "월 상환액 합계", value: formatWon(payment), tone: "strong" },
          { label: "첫 달 예상 이자", value: formatWon(firstInterest) },
          { label: "완납 예상 기간", value: payoffLabel, tone: "strong" },
          { label: "총 이자", value: canPayoff ? formatWon(totalInterest) : "계산 불가", tone: "strong" },
          { label: "총 납입액", value: canPayoff ? formatWon(values.balance + totalInterest) : "계산 불가" }
        ],
        chart: [
          { name: "원금", value: values.balance },
          { name: "이자", value: canPayoff ? totalInterest : firstInterest },
          { name: "월상환", value: payment }
        ]
      };
    }
  },
  {
    slug: "retirement-savings",
    title: "은퇴자금 계산기",
    description: "현재 나이, 은퇴 시점, 월 저축액, 기대수익률, 물가상승률을 입력해 은퇴 목표자금과 부족액을 계산합니다.",
    category: "금융",
    keywords: ["은퇴자금 계산기", "노후자금 계산", "은퇴 준비", "월 저축액", "노후 생활비"],
    badge: "노후 준비",
    audience: "은퇴 전까지 필요한 저축 규모를 점검하는 사용자",
    fields: [
      { name: "currentAge", label: "현재 나이", type: "number", unit: "세", min: 18, max: 80, step: 1, defaultValue: 35 },
      { name: "retirementAge", label: "은퇴 나이", type: "number", unit: "세", min: 40, max: 90, step: 1, defaultValue: 65 },
      { name: "currentSavings", label: "현재 은퇴자금", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 50000000 },
      { name: "monthlySaving", label: "월 저축액", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 800000 },
      { name: "annualReturn", label: "연 기대수익률", type: "number", unit: "%", min: 0, max: 20, step: 0.1, defaultValue: 5 },
      { name: "inflation", label: "연 물가상승률", type: "number", unit: "%", min: 0, max: 10, step: 0.1, defaultValue: 2.5 },
      { name: "targetMonthlyIncome", label: "현재 가치 월 생활비", type: "number", unit: "원", min: 0, step: 100000, defaultValue: 3000000 },
      { name: "retirementYears", label: "은퇴 후 기간", type: "number", unit: "년", min: 1, max: 50, step: 1, defaultValue: 25 }
    ],
    guideTitle: "은퇴자금 계산 기준",
    guide: [
      "현재 보유 은퇴자금과 매월 저축액이 은퇴 시점까지 복리로 성장한다고 가정합니다.",
      "목표 월 생활비는 현재 가치로 입력하고, 은퇴 시점까지 물가상승률을 반영해 미래 필요 생활비로 환산합니다.",
      "은퇴 후 자금 운용수익, 국민연금, 퇴직연금, 세금은 단순화해 별도 반영하지 않습니다."
    ],
    checkpoints: [
      "물가상승률을 반영하면 필요한 은퇴자금이 크게 늘어날 수 있습니다.",
      "기대수익률은 보수적인 값으로 여러 번 비교하는 것이 좋습니다.",
      "국민연금 등 확정 소득이 있다면 목표 월 생활비에서 차감해 시나리오를 다시 보세요."
    ],
    faqs: [
      { question: "국민연금도 포함되나요?", answer: "아니요. 국민연금 예상 수령액은 목표 월 생활비에서 직접 빼고 계산하면 됩니다." },
      { question: "은퇴 후에도 투자수익이 나면 어떻게 하나요?", answer: "현재 계산은 보수적으로 단순 필요자금을 봅니다. 은퇴 후 운용수익을 넣으면 필요자금은 줄어들 수 있습니다." }
    ],
    calculate(values) {
      const yearsToRetire = Math.max(0, values.retirementAge - values.currentAge);
      const months = yearsToRetire * 12;
      const monthlyReturn = values.annualReturn / 100 / 12;
      let futureSavings = values.currentSavings * Math.pow(1 + monthlyReturn, months);
      if (monthlyReturn > 0) {
        futureSavings += values.monthlySaving * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
      } else {
        futureSavings += values.monthlySaving * months;
      }
      const futureMonthlyNeed = values.targetMonthlyIncome * Math.pow(1 + values.inflation / 100, yearsToRetire);
      const targetFund = futureMonthlyNeed * 12 * values.retirementYears;
      const gap = futureSavings - targetFund;
      return {
        headline: gap >= 0 ? `여유 ${formatWon(gap)}` : `부족 ${formatWon(Math.abs(gap))}`,
        subline: `은퇴 예상자금 ${formatWon(futureSavings)} · 목표 ${formatWon(targetFund)}`,
        rows: [
          { label: "은퇴까지 남은 기간", value: `${yearsToRetire.toLocaleString("ko-KR")}년` },
          { label: "은퇴 시점 월 생활비", value: formatWon(futureMonthlyNeed), tone: "strong" },
          { label: "은퇴 예상자금", value: formatWon(futureSavings), tone: "strong" },
          { label: "목표 은퇴자금", value: formatWon(targetFund), tone: "strong" },
          { label: gap >= 0 ? "예상 여유자금" : "예상 부족자금", value: formatWon(Math.abs(gap)), tone: "strong" }
        ],
        chart: [
          { name: "예상자금", value: futureSavings },
          { name: "목표자금", value: targetFund },
          { name: gap >= 0 ? "여유" : "부족", value: Math.abs(gap) }
        ]
      };
    }
  },
  {
    slug: "rental-property-roi",
    title: "임대수익률 계산기",
    description: "매입가, 보증금, 월세, 공실률, 운영비, 대출이자를 입력해 임대 부동산의 순수익률을 계산합니다.",
    category: "금융",
    keywords: ["임대수익률 계산기", "부동산 수익률", "월세 수익률", "캡레이트", "현금수익률"],
    badge: "임대 투자",
    audience: "월세 부동산 투자 수익성을 점검하는 사용자",
    fields: [
      { name: "purchasePrice", label: "매입가", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 500000000 },
      { name: "acquisitionCosts", label: "취득 부대비용", type: "number", unit: "원", min: 0, step: 100000, defaultValue: 15000000 },
      { name: "deposit", label: "임대보증금", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 50000000 },
      { name: "monthlyRent", label: "월세", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 1800000 },
      { name: "vacancyRate", label: "공실률", type: "number", unit: "%", min: 0, max: 100, step: 1, defaultValue: 5 },
      { name: "annualCosts", label: "연 운영비", type: "number", unit: "원", min: 0, step: 100000, defaultValue: 4000000 },
      { name: "loanAmount", label: "대출금", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 250000000 },
      { name: "loanRate", label: "대출 연 이자율", type: "number", unit: "%", min: 0, max: 20, step: 0.1, defaultValue: 4.5 }
    ],
    guideTitle: "임대수익률 계산 기준",
    guide: [
      "연 임대수입은 월세에 12개월을 곱한 뒤 공실률을 차감해 계산합니다.",
      "순영업수익은 임대수입에서 운영비를 뺀 값이고, 현금흐름은 여기에 대출이자를 추가로 차감합니다.",
      "현금투입액은 매입가와 취득비용에서 보증금과 대출금을 뺀 금액으로 단순 추정합니다."
    ],
    checkpoints: [
      "취득세, 중개보수, 수선비, 재산세, 종합부동산세를 빠뜨리면 수익률이 과대평가될 수 있습니다.",
      "대출 원금상환은 별도 반영하지 않고 이자 비용만 반영합니다.",
      "보증금 운용수익이나 월세 세금은 투자자 상황에 따라 따로 확인하세요."
    ],
    faqs: [
      { question: "캡레이트와 현금수익률은 무엇이 다른가요?", answer: "캡레이트는 부동산 가격 대비 순영업수익이고, 현금수익률은 실제 투입한 현금 대비 이자 차감 후 현금흐름입니다." },
      { question: "대출 원리금 상환도 포함되나요?", answer: "현재는 빠른 비교를 위해 대출 이자만 반영합니다. 원금상환은 자산 이전 성격이 있어 별도 현금흐름 분석이 필요합니다." }
    ],
    calculate(values) {
      const annualRent = values.monthlyRent * 12 * (1 - Math.min(100, Math.max(0, values.vacancyRate)) / 100);
      const netOperatingIncome = annualRent - values.annualCosts;
      const annualInterest = values.loanAmount * values.loanRate / 100;
      const cashFlow = netOperatingIncome - annualInterest;
      const totalPrice = values.purchasePrice + values.acquisitionCosts;
      const cashInvested = Math.max(1, totalPrice - values.deposit - values.loanAmount);
      const grossYield = values.purchasePrice > 0 ? annualRent / values.purchasePrice * 100 : 0;
      const capRate = totalPrice > 0 ? netOperatingIncome / totalPrice * 100 : 0;
      const cashOnCash = cashFlow / cashInvested * 100;
      return {
        headline: formatPercent(cashOnCash),
        subline: `연 현금흐름 ${formatWon(cashFlow)} · 캡레이트 ${formatPercent(capRate)}`,
        rows: [
          { label: "공실 반영 연 임대수입", value: formatWon(annualRent), tone: "strong" },
          { label: "순영업수익", value: formatWon(netOperatingIncome), tone: "strong" },
          { label: "연 대출이자", value: formatWon(annualInterest) },
          { label: "연 현금흐름", value: formatWon(cashFlow), tone: "strong" },
          { label: "현금투입액", value: formatWon(cashInvested) },
          { label: "총수익률", value: formatPercent(grossYield) },
          { label: "캡레이트", value: formatPercent(capRate), tone: "strong" },
          { label: "현금수익률", value: formatPercent(cashOnCash), tone: "strong" }
        ],
        chart: [
          { name: "임대수입", value: annualRent },
          { name: "운영비", value: values.annualCosts },
          { name: "이자", value: annualInterest },
          { name: "현금흐름", value: Math.max(cashFlow, 0) }
        ]
      };
    }
  },
  {
    slug: "password-generator",
    title: "비밀번호 생성기",
    description: "길이와 문자 종류를 선택해 보안에 쓰기 좋은 무작위 비밀번호를 생성합니다.",
    category: "생활",
    keywords: ["비밀번호 생성기", "랜덤 비밀번호", "강력한 비밀번호", "패스워드 생성", "보안 비밀번호"],
    badge: "랜덤 보안 문자열",
    audience: "새 계정 비밀번호가 필요한 사용자, 임시 비밀번호를 빠르게 만들려는 사용자",
    actionLabel: "비밀번호 다시 생성",
    fields: [
      { name: "length", label: "길이", type: "number", unit: "자", min: 8, max: 64, step: 1, defaultValue: 16 },
      {
        name: "includeUpper",
        label: "대문자 포함",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "포함", value: 1 },
          { label: "제외", value: 0 }
        ]
      },
      {
        name: "includeLower",
        label: "소문자 포함",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "포함", value: 1 },
          { label: "제외", value: 0 }
        ]
      },
      {
        name: "includeNumbers",
        label: "숫자 포함",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "포함", value: 1 },
          { label: "제외", value: 0 }
        ]
      },
      {
        name: "includeSymbols",
        label: "특수문자 포함",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "포함", value: 1 },
          { label: "제외", value: 0 }
        ]
      }
    ],
    guideTitle: "비밀번호 생성 기준",
    guide: [
      "이 도구는 선택한 문자 종류를 조합해 무작위 비밀번호를 생성합니다. 혼동하기 쉬운 일부 문자(0, 1, O, l 등)는 기본 문자풀에서 제외했습니다.",
      "길이가 길고 문자 종류가 다양할수록 무차별 대입 공격에 더 강합니다. 일반적인 계정에는 14자 이상, 중요한 계정에는 20자 이상을 권장합니다.",
      "생성된 비밀번호는 서버로 저장하지 않는 클라이언트 계산 결과로 활용되며, 실제 사용 시에는 비밀번호 관리자에 안전하게 보관하세요."
    ],
    checkpoints: [
      "각 사이트마다 서로 다른 비밀번호를 쓰는 것이 가장 중요합니다.",
      "특수문자를 허용하지 않는 서비스라면 특수문자 제외 옵션을 사용하세요.",
      "생성 후 다시 생성 버튼을 누르면 새 조합을 확인할 수 있습니다."
    ],
    faqs: [
      { question: "생성된 비밀번호가 저장되나요?", answer: "이 계산기 결과는 사용자의 브라우저에서 표시되는 값이며, 서버에 비밀번호를 저장하는 기능은 없습니다." },
      { question: "어떤 길이가 안전한가요?", answer: "일반 계정은 14자 이상, 금융·업무 계정은 20자 이상처럼 길게 설정하는 편이 좋습니다." }
    ],
    calculate(values, context) {
      const length = Math.min(Math.max(Math.floor(values.length || 16), 8), 64);
      const seed =
        20260927 +
        length * 131 +
        (values.includeUpper ? 17 : 0) +
        (values.includeLower ? 31 : 0) +
        (values.includeNumbers ? 47 : 0) +
        (values.includeSymbols ? 61 : 0) +
        (context?.refreshKey || 0) * 8191;
      const password = generatePassword(
        length,
        values.includeUpper === 1,
        values.includeLower === 1,
        values.includeNumbers === 1,
        values.includeSymbols === 1,
        seed
      );
      const enabledTypes = [values.includeUpper, values.includeLower, values.includeNumbers, values.includeSymbols].filter((value) => value === 1).length || 3;
      const poolSize =
        (values.includeUpper === 1 ? 24 : 0) +
        (values.includeLower === 1 ? 24 : 0) +
        (values.includeNumbers === 1 ? 8 : 0) +
        (values.includeSymbols === 1 ? 13 : 0);
      const entropy = poolSize > 0 ? Math.log2(poolSize ** length) : 0;

      return {
        headline: password,
        subline: `${length}자 · 문자 종류 ${enabledTypes}개 · 추정 엔트로피 ${entropy.toFixed(0)}bit`,
        rows: [
          { label: "생성된 비밀번호", value: password, tone: "strong" },
          { label: "길이", value: `${length}자` },
          { label: "문자 종류", value: `${enabledTypes}개` },
          { label: "문자풀 크기", value: `${poolSize.toLocaleString("ko-KR")}개` },
          { label: "추정 엔트로피", value: `${entropy.toFixed(0)}bit`, tone: "strong" }
        ],
        chart: [
          { name: "길이", value: length },
          { name: "문자종류", value: enabledTypes },
          { name: "엔트로피", value: entropy }
        ]
      };
    }
  },
  {
    slug: "standard-deviation",
    title: "표준편차 계산기",
    description: "여러 숫자의 평균, 분산, 모집단 표준편차, 표본 표준편차를 계산합니다.",
    category: "수학",
    keywords: ["표준편차 계산기", "분산 계산기", "평균 계산", "통계 계산기", "표본 표준편차"],
    badge: "기초 통계",
    audience: "통계 학습자, 데이터 분포를 빠르게 확인하려는 사용자",
    fields: [
      { name: "x1", label: "값 1", type: "number", step: 0.01, defaultValue: 12 },
      { name: "x2", label: "값 2", type: "number", step: 0.01, defaultValue: 15 },
      { name: "x3", label: "값 3", type: "number", step: 0.01, defaultValue: 18 },
      { name: "x4", label: "값 4", type: "number", step: 0.01, defaultValue: 20 },
      { name: "x5", label: "값 5", type: "number", step: 0.01, defaultValue: 22 },
      { name: "x6", label: "값 6", type: "number", step: 0.01, defaultValue: 25 },
      { name: "x7", label: "값 7", type: "number", step: 0.01, defaultValue: 0, help: "사용하지 않는 값은 0으로 두고 아래 사용 개수에서 제외하세요." },
      { name: "x8", label: "값 8", type: "number", step: 0.01, defaultValue: 0 },
      { name: "count", label: "사용할 값 개수", type: "number", unit: "개", min: 2, max: 8, step: 1, defaultValue: 6 }
    ],
    guideTitle: "표준편차 계산 기준",
    guide: [
      "표준편차는 데이터가 평균에서 얼마나 퍼져 있는지 보여주는 대표적인 통계 지표입니다.",
      "모집단 표준편차는 전체 데이터를 모두 알고 있다고 가정하고 n으로 나누며, 표본 표준편차는 일부 표본으로 전체를 추정하기 위해 n-1로 나눕니다.",
      "값 1부터 사용 개수만큼만 계산에 포함합니다. 여러 데이터를 빠르게 비교할 때 평균과 표준편차를 함께 확인하세요."
    ],
    checkpoints: [
      "표준편차가 클수록 값들이 평균에서 더 넓게 퍼져 있습니다.",
      "전체 데이터라면 모집단 표준편차, 표본 데이터라면 표본 표준편차를 주로 봅니다.",
      "극단값이 있으면 평균과 표준편차가 크게 흔들릴 수 있습니다."
    ],
    faqs: [
      { question: "모집단 표준편차와 표본 표준편차는 무엇이 다른가요?", answer: "모집단은 n으로 나누고, 표본은 n-1로 나누어 전체 집단의 분산을 더 보수적으로 추정합니다." },
      { question: "표준편차가 0이면 무슨 뜻인가요?", answer: "모든 값이 평균과 같아 데이터가 전혀 흩어져 있지 않다는 뜻입니다." }
    ],
    calculate(values) {
      const raw = [values.x1, values.x2, values.x3, values.x4, values.x5, values.x6, values.x7, values.x8];
      const count = Math.min(Math.max(Math.floor(values.count || 2), 2), raw.length);
      const items = raw.slice(0, count).map((value) => Number.isFinite(value) ? value : 0);
      const mean = items.reduce((sum, value) => sum + value, 0) / count;
      const squaredDiffs = items.map((value) => (value - mean) ** 2);
      const populationVariance = squaredDiffs.reduce((sum, value) => sum + value, 0) / count;
      const sampleVariance = count > 1 ? squaredDiffs.reduce((sum, value) => sum + value, 0) / (count - 1) : 0;
      const populationSd = Math.sqrt(populationVariance);
      const sampleSd = Math.sqrt(sampleVariance);
      const min = Math.min(...items);
      const max = Math.max(...items);

      return {
        headline: sampleSd.toFixed(3),
        subline: `평균 ${mean.toFixed(3)} · 표본 표준편차`,
        rows: [
          { label: "사용한 값 개수", value: `${count}개` },
          { label: "평균", value: mean.toFixed(3), tone: "strong" },
          { label: "모집단 분산", value: populationVariance.toFixed(3) },
          { label: "모집단 표준편차", value: populationSd.toFixed(3), tone: "strong" },
          { label: "표본 분산", value: sampleVariance.toFixed(3) },
          { label: "표본 표준편차", value: sampleSd.toFixed(3), tone: "strong" },
          { label: "최솟값~최댓값", value: `${min.toLocaleString("ko-KR")} ~ ${max.toLocaleString("ko-KR")}` }
        ],
        chart: [
          { name: "평균", value: Math.abs(mean) },
          { name: "모집단SD", value: populationSd },
          { name: "표본SD", value: sampleSd },
          { name: "범위", value: max - min }
        ]
      };
    }
  },
  {
    slug: "percent",
    title: "퍼센트 계산기",
    description: "비율, 증가율, 감소율, 일부 값 계산을 한 번에 할 수 있는 퍼센트 계산기입니다.",
    category: "금융",
    keywords: ["퍼센트 계산기", "증가율 계산", "비율 계산"],
    badge: "기초 비율 계산",
    audience: "쇼핑, 업무, 공부, 보고서 작성 사용자",
    fields: [
      { name: "baseValue", label: "기준값", type: "number", unit: "", min: 0, max: 1000000000, step: 0.01, defaultValue: 200 },
      { name: "compareValue", label: "비교값", type: "number", unit: "", min: 0, max: 1000000000, step: 0.01, defaultValue: 250 },
      { name: "percentValue", label: "퍼센트 값", type: "number", unit: "%", min: 0, max: 1000, step: 0.1, defaultValue: 15 }
    ],
    guideTitle: "퍼센트 계산 기준",
    guide: [
      "퍼센트 계산은 전체 중 비율, 증가율, 감소율, 특정 비율의 값 계산 등 여러 상황에서 사용됩니다.",
      "이 계산기는 기준값과 비교값으로 변화율을 계산하고, 기준값의 특정 퍼센트가 얼마인지도 함께 보여줍니다.",
      "보고서나 견적서에서는 기준값이 무엇인지 명확히 두고 해석해야 합니다."
    ],
    checkpoints: [
      "퍼센트는 기준값이 무엇인지에 따라 완전히 달라집니다.",
      "증가율과 비중은 같은 숫자라도 의미가 다릅니다.",
      "0을 기준값으로 두면 변화율 계산이 불가능합니다."
    ],
    faqs: [
      { question: "200에서 250이면 몇 퍼센트 증가인가요?", answer: "기준값 200 대비 50 증가이므로 25% 증가입니다." },
      { question: "15%가 얼마인지도 같이 볼 수 있나요?", answer: "네. 기준값의 15% 금액도 함께 계산합니다." }
    ],
    calculate(values) {
      const change = values.compareValue - values.baseValue;
      const changeRate = values.baseValue !== 0 ? change / values.baseValue * 100 : 0;
      const portion = values.baseValue * (values.percentValue / 100);
      return {
        headline: formatPercent(changeRate, 1),
        subline: `${values.percentValue.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}% 값은 ${portion.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}`,
        rows: [
          { label: "증감값", value: change.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) },
          { label: "증감률", value: formatPercent(changeRate, 1), tone: "strong" },
          { label: `${values.percentValue.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}% 값`, value: portion.toLocaleString("ko-KR", { maximumFractionDigits: 2 }), tone: "strong" }
        ],
        chart: [
          { name: "기준값", value: values.baseValue },
          { name: "비교값", value: values.compareValue },
          { name: "퍼센트값", value: portion }
        ]
      };
    }
  },
  {
    slug: "loan-amortization",
    title: "대출 상환 스케줄 계산기",
    description: "대출금액, 금리, 기간을 기준으로 월 상환액과 총 이자, 초반/후반 상환 구조를 계산합니다.",
    category: "금융",
    keywords: ["대출 상환 스케줄", "원리금 균등", "상환 계획"],
    badge: "월 상환 구조 분석",
    audience: "대출 실행 전 사용자, 상환 계획 검토 사용자",
    fields: [
      { name: "principal", label: "대출금액", type: "number", unit: "원", min: 1000000, max: 5000000000, step: 1000000, defaultValue: 300000000 },
      { name: "rate", label: "연 금리", type: "number", unit: "%", min: 0.1, max: 20, step: 0.1, defaultValue: 4.2 },
      { name: "years", label: "상환 기간", type: "number", unit: "년", min: 1, max: 40, step: 1, defaultValue: 30 }
    ],
    guideTitle: "대출 상환 스케줄 기준",
    guide: [
      "이 계산기는 원리금 균등상환 기준으로 월 상환액과 총 이자 규모를 계산합니다.",
      "전체 월별 표를 노출하는 대신, 첫 달 이자 비중, 마지막 구간 원금 비중, 총 상환액을 요약해 보여주는 구조입니다.",
      "실제 상품은 변동금리, 중도상환, 거치기간, 인지세, 보증료 등에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "초반에는 이자 비중이 높고 후반에는 원금 비중이 커집니다.",
      "같은 금리라도 기간이 길수록 총 이자 부담이 크게 늘어납니다.",
      "실제 실행 전에는 중도상환수수료와 변동금리 조건을 함께 확인해야 합니다."
    ],
    faqs: [
      { question: "상환 스케줄 표도 보여주나요?", answer: "현재는 요약형입니다. 필요하면 월별 테이블 버전으로 확장할 수 있습니다." },
      { question: "원금균등도 가능한가요?", answer: "별도 대출 이자 계산기에서 상환방식 비교를 지원하고 있습니다." }
    ],
    calculate(values) {
      const months = values.years * 12;
      const monthlyPayment = monthlyLoanPayment(values.principal, values.rate, values.years);
      const monthlyRate = values.rate / 100 / 12;
      const firstInterest = values.principal * monthlyRate;
      const firstPrincipal = monthlyPayment - firstInterest;
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - values.principal;
      const lastMonthPrincipal = monthlyPayment / (1 + monthlyRate);
      return {
        headline: formatWon(monthlyPayment),
        subline: `총 상환액 ${formatWon(totalPayment)} · 총 이자 ${formatWon(totalInterest)}`,
        rows: [
          { label: "월 상환액", value: formatWon(monthlyPayment), tone: "strong" },
          { label: "첫 달 이자", value: formatWon(firstInterest) },
          { label: "첫 달 원금", value: formatWon(firstPrincipal) },
          { label: "총 이자", value: formatWon(totalInterest), tone: "strong" },
          { label: "말기 원금 비중(참고)", value: formatWon(lastMonthPrincipal) }
        ],
        chart: [
          { name: "원금", value: values.principal },
          { name: "총이자", value: totalInterest },
          { name: "총상환", value: totalPayment }
        ]
      };
    }
  },
  {
    slug: "youth-leap-account",
    title: "청년도약계좌 계산기",
    description: "월 납입액과 소득구간을 기준으로 청년도약계좌 정부기여금과 만기 누적 납입액을 계산합니다.",
    category: "금융",
    keywords: ["청년도약계좌 계산기", "정부기여금", "청년 자산형성"],
    badge: "2026-08-27 기준 운영 종료 상품",
    audience: "기존 청년도약계좌 가입자, 정책상품 비교 사용자",
    fields: [
      { name: "monthlyDeposit", label: "월 납입액", type: "number", unit: "원", min: 1000, max: 700000, step: 1000, defaultValue: 700000 },
      {
        name: "incomeBand",
        label: "소득 구간",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "총급여 2,400만원 이하", value: 0 },
          { label: "총급여 3,600만원 이하", value: 1 },
          { label: "총급여 4,800만원 이하", value: 2 },
          { label: "총급여 6,000만원 이하", value: 3 },
          { label: "총급여 7,500만원 이하", value: 4 }
        ]
      }
    ],
    guideTitle: "청년도약계좌 계산 기준",
    guide: [
      "서민금융진흥원 청년도약계좌 안내 기준으로, 2026년 8월 27일 현재 이 상품은 신규 가입이 종료되었지만 기존 가입자는 만기까지 정부기여금과 비과세 혜택을 유지할 수 있습니다.",
      "정부기여금 구조는 2025년 1월 납입분부터 적용된 구간별 지급표를 기준으로 계산했습니다. 총급여 2,400만원 이하 구간은 월 최대 3만3천원, 3,600만원 이하 2만9천원, 4,800만원 이하 2만5,200원, 6,000만원 이하 2만1천원까지 가능합니다.",
      "이 계산기는 은행 이자와 우대금리를 제외한 본인 납입금과 정부기여금 누계만 보여줍니다."
    ],
    checkpoints: [
      "2026년 8월 27일 기준 신규가입 종료 상품입니다.",
      "현재 계산기는 정부기여금과 납입원금 누계 중심입니다.",
      "실제 만기수령액은 은행금리와 우대금리에 따라 더 커질 수 있습니다."
    ],
    faqs: [
      { question: "지금 신규로 가입할 수 있나요?", answer: "아니요. 2026년 8월 27일 기준 청년도약계좌 신규가입은 종료된 상태입니다." },
      { question: "월 70만원을 꼭 넣어야 하나요?", answer: "아니요. 자유 적립이지만, 정부기여금은 소득구간별 지급 구조에 따라 달라집니다." }
    ],
    calculate(values) {
      const monthlyGov = youthLeapMonthlyContribution(values.monthlyDeposit, values.incomeBand);
      const principal60 = values.monthlyDeposit * 60;
      const gov60 = monthlyGov * 60;
      const total = principal60 + gov60;
      return {
        headline: formatWon(total),
        subline: `5년 납입원금 ${formatWon(principal60)} · 정부기여금 ${formatWon(gov60)}`,
        rows: [
          { label: "월 납입액", value: formatWon(values.monthlyDeposit) },
          { label: "월 정부기여금", value: formatWon(monthlyGov), tone: "strong" },
          { label: "5년 납입원금", value: formatWon(principal60) },
          { label: "5년 정부기여금", value: formatWon(gov60), tone: "strong" },
          { label: "원금+기여금 합계", value: formatWon(total), tone: "strong" }
        ],
        chart: [
          { name: "납입원금", value: principal60 },
          { name: "정부기여금", value: gov60 },
          { name: "합계", value: total }
        ]
      };
    }
  },
  {
    slug: "isa-tax",
    title: "ISA 절세 계산기",
    description: "ISA 계좌 이익과 소득구간에 따라 비과세 한도와 초과분 9% 분리과세 효과를 계산합니다.",
    category: "금융",
    keywords: ["ISA 계산기", "ISA 비과세", "ISA 절세"],
    badge: "2026.01.01 조세특례제한법 기준",
    audience: "투자자, 절세 상품 비교 사용자",
    fields: [
      { name: "profit", label: "계좌 내 이익", type: "number", unit: "원", min: 0, max: 1000000000, step: 10000, defaultValue: 5000000 },
      {
        name: "taxBand",
        label: "비과세 구간",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "총급여 5,000만원 이하 등 400만원 한도", value: 0 },
          { label: "그 외 일반형 200만원 한도", value: 1 }
        ]
      }
    ],
    guideTitle: "ISA 절세 계산 기준",
    guide: [
      "2026년 1월 1일 시행 조세특례제한법 제91조의18 기준으로 ISA에서 발생한 이자·배당소득은 일정 한도까지 비과세되고, 초과분은 9% 분리과세가 적용됩니다.",
      "비과세 한도는 총급여 5천만원 이하 등 일정 요건을 충족하는 경우 400만원, 일반형은 200만원으로 계산했습니다.",
      "이 계산기는 일반 과세 15.4%와 ISA 9% 분리과세를 단순 비교해 절세 차이를 보여줍니다."
    ],
    checkpoints: [
      "현재 계산기는 계좌 내 이익 기준입니다.",
      "비과세 한도 초과분은 9% 분리과세로 계산합니다.",
      "실제 가입 자격과 세부 요건은 계좌 개설 시점 기준 확인이 필요합니다."
    ],
    faqs: [
      { question: "초과분은 완전 비과세인가요?", answer: "아니요. 비과세 한도를 넘는 이익은 9% 분리과세가 적용됩니다." },
      { question: "일반 과세와 비교하면 얼마나 절세되나요?", answer: "현재 계산기는 일반 과세 15.4%와 ISA 적용세액을 비교해 절세 차이를 보여줍니다." }
    ],
    calculate(values) {
      const taxFreeLimit = values.taxBand === 0 ? 4000000 : 2000000;
      const taxableProfit = Math.max(values.profit - taxFreeLimit, 0);
      const isaTax = taxableProfit * 0.09;
      const normalTax = values.profit * 0.154;
      const savedTax = Math.max(normalTax - isaTax, 0);
      return {
        headline: formatWon(savedTax),
        subline: `ISA 세액 ${formatWon(isaTax)} vs 일반과세 ${formatWon(normalTax)}`,
        rows: [
          { label: "계좌 이익", value: formatWon(values.profit) },
          { label: "비과세 한도", value: formatWon(taxFreeLimit) },
          { label: "초과 과세대상", value: formatWon(taxableProfit) },
          { label: "ISA 적용세액", value: formatWon(isaTax), tone: "strong" },
          { label: "예상 절세효과", value: formatWon(savedTax), tone: "strong" }
        ],
        chart: [
          { name: "이익", value: values.profit },
          { name: "ISA세액", value: isaTax },
          { name: "절세", value: savedTax }
        ]
      };
    }
  },
  {
    slug: "card-installment",
    title: "카드 할부 계산기",
    description: "결제금액, 개월 수, 할부 수수료율을 기준으로 월 납부액과 총 수수료를 계산합니다.",
    category: "금융",
    keywords: ["카드 할부 계산기", "할부 수수료", "월 납부액"],
    badge: "할부 비용 추정",
    audience: "고액 결제 사용자, 카드 비용 비교 사용자",
    fields: [
      { name: "purchaseAmount", label: "결제금액", type: "number", unit: "원", min: 0, max: 100000000, step: 1000, defaultValue: 1200000 },
      { name: "months", label: "할부 개월 수", type: "number", unit: "개월", min: 2, max: 36, step: 1, defaultValue: 12 },
      { name: "annualFeeRate", label: "연 할부 수수료율", type: "number", unit: "%", min: 0, max: 30, step: 0.1, defaultValue: 11.5 }
    ],
    guideTitle: "카드 할부 계산 기준",
    guide: [
      "카드 할부는 원금에 할부 수수료가 붙는 구조라 일시불보다 총 부담액이 커질 수 있습니다.",
      "이 계산기는 할부 수수료율을 연 기준으로 보고 월 단위 균등 상환처럼 단순 환산해 월 납부액과 총 수수료를 계산합니다.",
      "실제 카드사별 수수료율, 무이자 행사, 부분무이자 구조는 카드사 정책에 따라 다릅니다."
    ],
    checkpoints: [
      "무이자 행사면 수수료가 0일 수 있습니다.",
      "부분무이자는 카드사 부담/가맹점 부담 구조를 따로 봐야 합니다.",
      "고액 결제는 할부 편의보다 총 비용을 같이 봐야 합니다."
    ],
    faqs: [
      { question: "실제 청구액과 왜 다를 수 있나요?", answer: "카드사별 계산일수, 행사 적용, 수수료율 차이 때문입니다." },
      { question: "무이자 할부도 입력할 수 있나요?", answer: "네. 수수료율을 0으로 넣으면 됩니다." }
    ],
    calculate(values) {
      const monthlyRate = values.annualFeeRate / 100 / 12;
      const totalFee = values.purchaseAmount * monthlyRate * values.months;
      const total = values.purchaseAmount + totalFee;
      const monthly = values.months > 0 ? total / values.months : 0;
      return {
        headline: formatWon(monthly),
        subline: `총 수수료 ${formatWon(totalFee)} · 총 납부액 ${formatWon(total)}`,
        rows: [
          { label: "결제금액", value: formatWon(values.purchaseAmount) },
          { label: "총 수수료", value: formatWon(totalFee), tone: "strong" },
          { label: "총 납부액", value: formatWon(total) },
          { label: "월 납부액", value: formatWon(monthly), tone: "strong" }
        ],
        chart: [
          { name: "원금", value: values.purchaseAmount },
          { name: "수수료", value: totalFee },
          { name: "총액", value: total }
        ]
      };
    }
  },
  {
    slug: "distance-calculator",
    title: "거리 계산기",
    description: "현재 위치를 기준으로 검색한 장소까지의 직선거리와 방향을 계산합니다.",
    category: "생활",
    keywords: ["거리 계산기", "현재 위치 거리", "장소 거리", "직선거리", "위치 검색", "좌표 거리"],
    badge: "현재 위치 기반",
    audience: "주변 목적지까지의 대략적인 거리를 빠르게 확인하는 사용자",
    fields: [],
    guideTitle: "거리 계산 기준",
    guide: [
      "브라우저 위치 권한을 허용하면 현재 위도·경도를 가져오고, 장소 검색 결과의 좌표와 비교해 직선거리를 계산합니다.",
      "거리 계산에는 지구 반지름을 이용한 하버사인 공식을 사용합니다. 실제 이동거리, 도로 경로, 대중교통 시간과는 다를 수 있습니다.",
      "장소 검색은 OpenStreetMap Nominatim 검색 API를 사용하며, 자동완성처럼 매 글자마다 요청하지 않고 검색 버튼을 눌렀을 때만 요청합니다."
    ],
    checkpoints: [
      "현재 위치 권한을 허용해야 내 위치 기준 계산이 가능합니다.",
      "검색 결과가 여러 개이면 주소를 확인하고 원하는 장소를 선택하세요.",
      "결과는 직선거리 기준이므로 실제 길찾기 거리보다 짧게 나올 수 있습니다."
    ],
    faqs: [
      { question: "실제 도로 이동거리인가요?", answer: "아니요. 현재 버전은 두 좌표 사이의 직선거리입니다. 도보·자동차 경로 거리는 도로망과 교통 정보를 별도로 반영해야 합니다." },
      { question: "내 위치 정보가 서버에 저장되나요?", answer: "아니요. 현재 위치 좌표는 브라우저 화면 안에서 거리 계산에만 사용합니다. 장소 검색어는 검색 API 요청에 사용됩니다." }
    ],
    calculate() {
      return {
        headline: "현재 위치 기준 거리",
        subline: "전용 거리 계산기에서 위치를 설정하고 장소를 검색하세요.",
        rows: [
          { label: "지원", value: "현재 위치 가져오기, 장소 검색, 좌표 직접 입력, 직선거리, 방향각", tone: "strong" }
        ],
        chart: []
      };
    }
  },
  {
    slug: "retirement-income-tax",
    title: "퇴직소득세 계산기",
    description: "퇴직급여액과 근속연수를 기준으로 퇴직소득세 산출세액을 계산합니다.",
    category: "금융",
    keywords: ["퇴직소득세 계산기", "퇴직세금", "퇴직금 세금"],
    badge: "국세청 2026 계산 구조 반영",
    audience: "퇴직 예정자, 인사 담당자",
    fields: [
      { name: "retirementPay", label: "퇴직급여액", type: "number", unit: "원", min: 0, max: 5000000000, step: 100000, defaultValue: 100000000 },
      { name: "serviceYears", label: "근속연수", type: "number", unit: "년", min: 1, max: 50, step: 1, defaultValue: 20 }
    ],
    guideTitle: "퇴직소득세 계산 기준",
    guide: [
      "국세청 퇴직소득 계산안내와 2026년 소득세법 제48조 기준을 반영했습니다. 퇴직급여액에서 근속연수공제를 뺀 뒤 환산급여를 계산하고, 환산급여공제와 기본세율을 적용해 산출세액을 계산합니다.",
      "근속연수공제는 5년 이하 연 100만원, 5년 초과 10년 이하 구간은 500만원 + 초과연수×200만원, 10년 초과 20년 이하 구간은 1,500만원 + 초과연수×250만원, 20년 초과는 4,000만원 + 초과연수×300만원 구조입니다.",
      "이 계산기는 지방소득세, 퇴직연금 이연과세, 명예퇴직 특례, 중간정산 이력은 반영하지 않은 단순 산출세액 계산기입니다."
    ],
    checkpoints: [
      "퇴직소득세는 일반 근로소득세와 계산 구조가 다릅니다.",
      "근속연수공제와 환산급여공제가 핵심입니다.",
      "실제 원천징수세액은 이연과세, 기납부세액 등에 따라 달라질 수 있습니다."
    ],
    faqs: [
      { question: "퇴직금 1억원이면 세금이 어느 정도인가요?", answer: "근속연수에 따라 많이 달라집니다. 현재 계산기는 근속연수를 함께 넣어 산출세액을 계산합니다." },
      { question: "지방소득세도 포함되나요?", answer: "아니요. 현재는 퇴직소득세 산출세액 중심입니다." }
    ],
    calculate(values) {
      const years = Math.max(Math.floor(values.serviceYears), 1);
      const serviceDeduction = retirementServiceDeduction(years);
      const convertedSalary = Math.max((values.retirementPay - serviceDeduction) * 12 / years, 0);
      const convertedDeduction = retirementConvertedSalaryDeduction(convertedSalary);
      const taxBase = Math.max(convertedSalary - convertedDeduction, 0);
      const convertedTax = comprehensiveIncomeTax(taxBase);
      const retirementTax = convertedTax / 12 * years;
      return {
        headline: formatWon(retirementTax),
        subline: `환산급여 ${formatWon(convertedSalary)} · 과세표준 ${formatWon(taxBase)}`,
        rows: [
          { label: "근속연수공제", value: formatWon(serviceDeduction) },
          { label: "환산급여", value: formatWon(convertedSalary) },
          { label: "환산급여공제", value: formatWon(convertedDeduction) },
          { label: "과세표준", value: formatWon(taxBase) },
          { label: "퇴직소득세 산출세액", value: formatWon(retirementTax), tone: "strong" }
        ],
        chart: [
          { name: "퇴직급여", value: values.retirementPay },
          { name: "공제합계", value: serviceDeduction + convertedDeduction },
          { name: "세액", value: retirementTax }
        ]
      };
    }
  },
  {
    slug: "savings",
    title: "예금·적금 실수령액 계산기",
    description: "납입액, 기간, 금리, 과세 유형을 입력해 만기 원리금과 세후 이자를 계산합니다.",
    category: "금융",
    keywords: ["적금 계산기", "예금 계산기", "복리 계산기"],
    badge: "세후 수익 중심",
    audience: "저축 계획 사용자, 금융상품 비교 사용자",
    fields: [
      { name: "monthlyDeposit", label: "월 납입액", type: "number", unit: "원", min: 10000, max: 10000000, step: 10000, defaultValue: 500000 },
      { name: "months", label: "기간", type: "number", unit: "개월", min: 1, max: 120, step: 1, defaultValue: 24 },
      { name: "rate", label: "연 이율", type: "number", unit: "%", min: 0, max: 20, step: 0.1, defaultValue: 4.5 },
      {
        name: "taxRate",
        label: "과세 유형",
        type: "select",
        unit: "%",
        defaultValue: 15.4,
        options: [
          { label: "일반과세 15.4%", value: 15.4 },
          { label: "세금우대 9.5%", value: 9.5 },
          { label: "비과세 0%", value: 0 }
        ]
      }
    ],
    guideTitle: "저축상품 세후 수익 계산",
    guide: [
      "예금과 적금은 표시 금리만으로 실수령액을 판단하기 어렵습니다. 적금은 매월 납입한 돈의 예치 기간이 서로 달라 실제 이자가 단순히 총 납입액 × 연이율이 되지 않습니다.",
      "일반 금융상품의 이자소득세는 통상 15.4%가 적용됩니다. ISA, 청년도약계좌, 비과세종합저축 등은 상품 요건과 한도에 따라 비과세 또는 분리과세 혜택이 달라집니다.",
      "이 계산기는 월 납입식 적금을 기준으로 복리 효과를 단순 반영합니다. 은행별 이자 계산 방식, 우대금리 충족 여부, 중도해지 여부에 따라 실제 지급액은 달라질 수 있습니다."
    ],
    checkpoints: [
      "표시 금리보다 과세 후 이자를 봐야 실제 수익이 보입니다.",
      "우대금리 충족 여부에 따라 만기 금액 차이가 크게 날 수 있습니다.",
      "예금과 적금은 자금 투입 시점이 달라 동일 금리여도 결과가 다릅니다."
    ],
    faqs: [
      { question: "예금 계산도 가능한가요?", answer: "목돈 예금은 월 납입액 대신 총액을 1회 납입하는 별도 모드가 필요합니다. 현재 화면은 정기적금 중심입니다." },
      { question: "청년도약계좌 정부기여금도 포함되나요?", answer: "아니요. 현재는 납입액과 이자 과세만 계산합니다. 정부기여금은 소득 구간별로 달라 별도 확장이 필요합니다." }
    ],
    calculate(values) {
      const monthlyRate = values.rate / 100 / 12;
      let balance = new Decimal(0);
      let principal = new Decimal(0);
      for (let i = 0; i < values.months; i += 1) {
        balance = balance.plus(values.monthlyDeposit).mul(1 + monthlyRate);
        principal = principal.plus(values.monthlyDeposit);
      }
      const grossInterest = balance.minus(principal);
      const tax = grossInterest.mul(values.taxRate / 100);
      const afterTax = balance.minus(tax).toNumber();
      return {
        headline: formatWon(afterTax),
        subline: `세후 이자 ${formatWon(grossInterest.minus(tax).toNumber())}`,
        rows: [
          { label: "원금 합계", value: formatWon(principal.toNumber()) },
          { label: "세전 이자", value: formatWon(grossInterest.toNumber()) },
          { label: "이자세", value: formatWon(tax.toNumber()) },
          { label: "만기 실수령액", value: formatWon(afterTax), tone: "strong" }
        ],
        chart: [
          { name: "원금", value: principal.toNumber() },
          { name: "세후이자", value: grossInterest.minus(tax).toNumber() },
          { name: "세금", value: tax.toNumber() }
        ]
      };
    }
  },
  {
    slug: "lotto-generator",
    title: "로또 세금 계산기",
    description: "로또 당첨금의 기타소득세와 지방소득세를 계산해 예상 실수령액을 확인합니다.",
    category: "세금",
    keywords: ["로또 세금 계산기", "로또 실수령액", "로또 당첨금 세금", "로또 1등 세금", "복권 당첨금 세금"],
    badge: "당첨금 세금",
    audience: "로또 당첨금 실수령액이 궁금한 사용자, 고액 당첨금 세후 금액을 확인하려는 사용자",
    fields: [
      {
        name: "prizeAmount",
        label: "당첨금",
        type: "number",
        unit: "원",
        min: 0,
        step: 10000,
        defaultValue: 1000000000,
        help: "로또 6/45 당첨금 총액을 입력하세요. 5만원 이하는 비과세로 계산합니다."
      }
    ],
    guideTitle: "로또 당첨금 세금 계산 기준",
    guide: [
      "로또 당첨금은 기타소득으로 보며, 5만원 이하는 비과세로 계산합니다. 5만원을 초과하면 3억원 이하 구간은 기타소득세 20%와 지방소득세 2%, 3억원 초과분은 기타소득세 30%와 지방소득세 3%를 적용해 실수령액을 추정합니다.",
      "예를 들어 10억원 당첨금은 3억원까지 22%, 초과 7억원은 33%를 적용하는 방식으로 세금을 나누어 계산합니다. 실제 원천징수와 지급 조건은 회차, 지급 기관, 법령 해석에 따라 달라질 수 있습니다.",
      "실제 지급 단계에서는 당첨금 수령 방식, 관련 법령, 원천징수 처리 기준에 따라 최종 금액이 달라질 수 있으므로 계산 결과는 참고값으로 활용하세요."
    ],
    checkpoints: [
      "5만원 이하는 비과세, 5만원 초과 당첨금은 기타소득세와 지방소득세를 함께 봅니다.",
      "3억원 초과분은 더 높은 세율이 적용되므로 고액 당첨금은 구간별 계산이 중요합니다.",
      "세후 실수령액은 입력한 당첨금에서 예상 세금 합계를 차감해 계산합니다."
    ],
    faqs: [
      { question: "로또 당첨금 세금은 어떻게 계산하나요?", answer: "5만원 초과 당첨금에 대해 3억원 이하 구간은 기타소득세 20%와 지방소득세 2%, 3억원 초과 구간은 기타소득세 30%와 지방소득세 3%를 적용해 추정합니다." },
      { question: "로또 5만원 당첨도 세금이 있나요?", answer: "5만원 이하는 비과세로 보아 세금을 0원으로 계산합니다. 5만원을 초과하면 당첨금 전체를 기준으로 원천징수 세액을 추정합니다." },
      { question: "로또 1등 실수령액도 계산할 수 있나요?", answer: "네. 발표된 당첨금 총액을 입력하면 구간별 세금과 예상 실수령액을 계산할 수 있습니다." },
      { question: "실제 수령액과 차이가 날 수 있나요?", answer: "네. 지급 기관의 원천징수 처리, 법령 변경, 개별 상황에 따라 실제 수령액은 달라질 수 있으므로 참고용으로 확인하세요." }
    ],
    calculate(values) {
      const tax = lotteryTax(values.prizeAmount || 0);
      return {
        headline: formatWon(tax.netPrize),
        subline: `입력 당첨금 ${formatWon(values.prizeAmount || 0)} · 예상 세금 ${formatWon(tax.totalTax)}`,
        rows: [
          { label: "입력 당첨금", value: formatWon(values.prizeAmount || 0), tone: "strong" },
          { label: "과세 대상 금액", value: formatWon(tax.taxable) },
          { label: "3억원 이하 과세 구간", value: formatWon(tax.lowBase) },
          { label: "3억원 초과 과세 구간", value: formatWon(tax.highBase) },
          { label: "기타소득세", value: formatWon(tax.incomeTax), tone: "strong" },
          { label: "지방소득세", value: formatWon(tax.localTax) },
          { label: "예상 세금 합계", value: formatWon(tax.totalTax), tone: "strong" },
          { label: "예상 실수령액", value: formatWon(tax.netPrize), tone: "strong" }
        ],
        chart: [
          { name: "실수령", value: tax.netPrize },
          { name: "기타소득세", value: tax.incomeTax },
          { name: "지방소득세", value: tax.localTax }
        ]
      };
    }
  },
  {
    slug: "cbm-freight",
    title: "CBM 화물 계산기",
    description: "박스 규격과 수량을 입력해 총 CBM, 컨테이너 적재비율, 부피중량을 계산합니다.",
    category: "금융",
    keywords: ["CBM 계산기", "화물 부피 계산", "컨테이너 적재"],
    badge: "물류 부피 산정",
    audience: "수출입 담당자, 이커머스 물류 사용자, 포워더 상담 전 사용자",
    fields: [
      { name: "lengthCm", label: "가로", type: "number", unit: "cm", min: 1, step: 1, defaultValue: 60 },
      { name: "widthCm", label: "세로", type: "number", unit: "cm", min: 1, step: 1, defaultValue: 45 },
      { name: "heightCm", label: "높이", type: "number", unit: "cm", min: 1, step: 1, defaultValue: 40 },
      { name: "quantity", label: "수량", type: "number", unit: "박스", min: 1, step: 1, defaultValue: 120 },
      {
        name: "containerType",
        label: "비교 컨테이너",
        type: "select",
        unit: "CBM",
        defaultValue: 33,
        options: [
          { label: "20ft 컨테이너 (33 CBM)", value: 33 },
          { label: "40ft 컨테이너 (67 CBM)", value: 67 },
          { label: "40ft HQ 컨테이너 (76 CBM)", value: 76 }
        ]
      }
    ],
    guideTitle: "CBM 계산 기준",
    guide: [
      "CBM은 가로×세로×높이를 미터 단위로 환산한 뒤 곱해 구하는 화물 부피입니다. 해상운송과 창고 보관, 컨테이너 적재 계획에서 기본 기준으로 쓰입니다.",
      "이 계산기는 박스 기준 총 CBM과 선택한 컨테이너 용적 대비 점유율, 항공운송에서 자주 쓰는 167kg/CBM 기준 부피중량을 함께 보여줍니다.",
      "실제 적재 가능 수량은 포장 방식, 팔레트 적재, 여유 공간, 통관 서류 조건에 따라 달라질 수 있으므로 포워더 견적 전 1차 추정용으로 쓰는 편이 적합합니다."
    ],
    checkpoints: [
      "입력 단위는 cm이며 결과는 m³ 기준으로 계산됩니다.",
      "부피는 같아도 실제 적재 가능 수량은 팔레트 구조에 따라 달라질 수 있습니다.",
      "항공 부피중량 기준은 운송사마다 다를 수 있으므로 계약 단가를 다시 확인하세요."
    ],
    faqs: [
      { question: "CBM만 맞으면 컨테이너에 다 들어가나요?", answer: "아니요. 실제 적재는 박스 배치, 팔레트, 하중 분산, 컨테이너 내 빈 공간에 따라 차이가 납니다." },
      { question: "항공 부피중량도 같이 보나요?", answer: "네. 참고용으로 167kg/CBM 기준 부피중량을 같이 계산합니다." }
    ],
    calculate(values) {
      const eachCbm = (values.lengthCm / 100) * (values.widthCm / 100) * (values.heightCm / 100);
      const totalCbm = eachCbm * values.quantity;
      const occupancy = values.containerType > 0 ? totalCbm / values.containerType * 100 : 0;
      const remaining = Math.max(values.containerType - totalCbm, 0);
      const volumetricWeight = totalCbm * 167;
      return {
        headline: `${formatNumber(totalCbm, 3)} CBM`,
        subline: `선택 컨테이너 용적의 ${formatPercent(occupancy, 1)} 수준`,
        rows: [
          { label: "박스 1개 CBM", value: `${formatNumber(eachCbm, 3)} m³` },
          { label: "총 수량", value: `${formatNumber(values.quantity)}박스` },
          { label: "총 CBM", value: `${formatNumber(totalCbm, 3)} m³`, tone: "strong" },
          { label: "남은 용적", value: `${formatNumber(remaining, 3)} m³` },
          { label: "부피중량(참고)", value: `${formatNumber(volumetricWeight, 1)}kg` },
          { label: "컨테이너 점유율", value: formatPercent(occupancy, 1), tone: "strong" }
        ],
        chart: [
          { name: "적재부피", value: totalCbm },
          { name: "잔여용적", value: remaining },
          { name: "부피중량", value: volumetricWeight }
        ]
      };
    }
  },
  {
    slug: "subscription-revenue",
    title: "구독/멤버십 수익 계산기",
    description: "구독자 수, 월 구독료, 이탈률, 고정비를 기준으로 MRR, ARR, CLV를 계산합니다.",
    category: "금융",
    keywords: ["MRR 계산기", "ARR 계산기", "구독 수익 계산기"],
    badge: "구독 비즈니스 지표",
    audience: "구독 서비스 운영자, 멤버십 기획자, SaaS 수익성 검토 사용자",
    fields: [
      { name: "subscribers", label: "유료 구독자 수", type: "number", unit: "명", min: 1, step: 1, defaultValue: 850 },
      { name: "monthlyFee", label: "월 구독료", type: "number", unit: "원", min: 0, step: 100, defaultValue: 12900 },
      { name: "churnRate", label: "월 이탈률", type: "number", unit: "%", min: 0.1, max: 50, step: 0.1, defaultValue: 4.5 },
      { name: "grossMarginRate", label: "매출총이익률", type: "number", unit: "%", min: 1, max: 100, step: 0.1, defaultValue: 78 },
      { name: "cac", label: "가입자 1인당 CAC", type: "number", unit: "원", min: 0, step: 1000, defaultValue: 28000 },
      { name: "fixedCost", label: "월 고정비", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 4200000 }
    ],
    guideTitle: "구독 수익 계산 기준",
    guide: [
      "구독형 비즈니스는 단일 월 매출보다 반복매출(MRR), 연환산 반복매출(ARR), 이탈률, 고객생애가치(CLV)를 함께 봐야 구조가 보입니다.",
      "이 계산기는 월 구독자 수와 구독료를 기준으로 MRR과 ARR을 계산하고, 월 이탈률을 이용해 예상 해지 인원과 단순 CLV를 추정합니다.",
      "CLV는 1인당 월 매출×매출총이익률÷월 이탈률로 단순 계산한 값입니다. 실제 사업에서는 환불, 할인, 세금, 결제수수료, 업셀/다운셀, 연간 플랜 비중이 더해집니다."
    ],
    checkpoints: [
      "이탈률이 낮을수록 CLV는 크게 늘어나므로 가정값을 보수적으로 잡는 편이 안전합니다.",
      "MRR이 커도 고정비와 CAC 회수기간이 길면 현금흐름은 나빠질 수 있습니다.",
      "연간 플랜, 기업계약, 무료체험 전환은 별도로 보정해야 실제에 가까워집니다."
    ],
    faqs: [
      { question: "CLV가 왜 크게 나오나요?", answer: "월 이탈률이 낮을수록 고객이 오래 남는다고 가정하기 때문에 1인당 누적 이익 추정치가 크게 보일 수 있습니다." },
      { question: "CAC 회수기간도 보나요?", answer: "네. 1인당 월 매출총이익을 기준으로 CAC를 회수하는 데 걸리는 개월 수를 함께 표시합니다." }
    ],
    calculate(values) {
      const mrr = values.subscribers * values.monthlyFee;
      const arr = mrr * 12;
      const grossProfit = mrr * (values.grossMarginRate / 100);
      const churnedUsers = values.subscribers * (values.churnRate / 100);
      const contributionPerSubscriber = values.monthlyFee * (values.grossMarginRate / 100);
      const clv = values.churnRate > 0 ? contributionPerSubscriber / (values.churnRate / 100) : 0;
      const cacPayback = contributionPerSubscriber > 0 ? values.cac / contributionPerSubscriber : 0;
      const operatingProfit = grossProfit - values.fixedCost;
      return {
        headline: formatWon(mrr),
        subline: `ARR ${formatWon(arr)} · 월 예상 이탈 ${formatNumber(churnedUsers, 1)}명`,
        rows: [
          { label: "월 반복매출 MRR", value: formatWon(mrr), tone: "strong" },
          { label: "연 반복매출 ARR", value: formatWon(arr) },
          { label: "월 예상 이탈 인원", value: `${formatNumber(churnedUsers, 1)}명` },
          { label: "월 매출총이익", value: formatWon(grossProfit) },
          { label: "1인당 추정 CLV", value: formatWon(clv), tone: "strong" },
          { label: "CAC 회수기간", value: `${formatNumber(cacPayback, 1)}개월` },
          { label: "고정비 차감 손익", value: formatWon(operatingProfit), tone: "strong" }
        ],
        chart: [
          { name: "MRR", value: mrr },
          { name: "총이익", value: grossProfit },
          { name: "고정비", value: values.fixedCost }
        ]
      };
    }
  },
  {
    slug: "real-estate-brokerage-fee",
    title: "부동산 중개보수 계산기",
    description: "주택 매매·임대차 거래금액을 기준으로 중개보수 상한요율과 예상 보수를 계산합니다.",
    category: "금융",
    keywords: ["중개보수 계산기", "복비 계산기", "부동산 수수료"],
    badge: "주택 거래 상한요율 기준",
    audience: "주택 매수자, 임차인, 공인중개사 상담 전 사용자",
    fields: [
      {
        name: "transactionType",
        label: "거래 유형",
        type: "select",
        defaultValue: 0,
        options: [
          { label: "주택 매매", value: 0 },
          { label: "주택 임대차", value: 1 }
        ]
      },
      { name: "salePrice", label: "매매가", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 850000000, help: "매매 선택 시 사용합니다." },
      { name: "deposit", label: "보증금", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 300000000, help: "임대차 선택 시 사용합니다." },
      { name: "monthlyRent", label: "월 차임", type: "number", unit: "원", min: 0, step: 10000, defaultValue: 1500000, help: "임대차 선택 시 거래금액 환산에 사용합니다." }
    ],
    guideTitle: "중개보수 계산 기준",
    guide: [
      "국토교통부 부동산거래 전자계약시스템의 2026년 8월 28일 확인 기준을 바탕으로, 주택 매매와 임대차의 상한요율 구간을 적용했습니다.",
      "임대차 거래금액은 전세는 보증금, 월세는 보증금+(월 차임×100)으로 보되 계산값이 5천만원 미만이면 보증금+(월 차임×70) 기준을 적용했습니다.",
      "9억원 이상 매매, 6억원 이상 임대차는 상한요율 범위 안에서 중개의뢰인과 중개업자가 협의해 실제 보수가 달라질 수 있습니다. 이 계산기는 상한 기준 추정용입니다."
    ],
    checkpoints: [
      "현재 계산기는 주택 기준입니다. 상가·토지·오피스텔은 별도 규정이 적용될 수 있습니다.",
      "고가 주택 구간은 실제 협의요율이 상한보다 낮게 정해질 수 있습니다.",
      "부가세 별도 청구 여부와 지역 조례 세부사항은 계약 전에 다시 확인해야 합니다."
    ],
    faqs: [
      { question: "월세 거래금액은 어떻게 계산하나요?", answer: "보증금+(월세×100)을 기본으로 보되, 그 금액이 5천만원 미만이면 보증금+(월세×70)으로 계산합니다." },
      { question: "표시된 금액이 확정 복비인가요?", answer: "아니요. 상한요율 기준 추정치이며 실제 보수는 중개사무소와 협의 결과에 따라 달라질 수 있습니다." }
    ],
    calculate(values) {
      const tradeValue = values.transactionType === 0 ? values.salePrice : rentalTradeValue(values.deposit, values.monthlyRent);
      const terms = housingBrokerageTerms(values.transactionType, tradeValue);
      const rawFee = tradeValue * terms.rate;
      const fee = terms.cap ? Math.min(rawFee, terms.cap) : rawFee;
      return {
        headline: formatWon(fee),
        subline: `${terms.label} · 거래금액 ${formatWon(tradeValue)}`,
        rows: [
          { label: "거래금액", value: formatWon(tradeValue), tone: "strong" },
          { label: "적용 상한요율", value: formatPercent(terms.rate * 100, 2) },
          { label: "요율 계산액", value: formatWon(rawFee) },
          { label: "구간 한도액", value: terms.cap ? formatWon(terms.cap) : "별도 한도 없음" },
          { label: "예상 중개보수", value: formatWon(fee), tone: "strong" }
        ],
        chart: [
          { name: "거래금액", value: tradeValue },
          { name: "중개보수", value: fee },
          { name: "한도기준", value: terms.cap ?? fee }
        ]
      };
    }
  },
  {
    slug: "property-tax",
    title: "재산세·보유세 계산기",
    description: "주택 공시가격과 주택 수를 기준으로 재산세와 종합부동산세를 단순 추정합니다.",
    category: "금융",
    keywords: ["재산세 계산기", "보유세 계산기", "종부세 계산기"],
    badge: "2026-08-28 기준 단순 추정",
    audience: "주택 보유자, 세금 점검 사용자, 부동산 비용 검토 사용자",
    fields: [
      { name: "publicPrice", label: "주택 공시가격", type: "number", unit: "원", min: 0, step: 1000000, defaultValue: 1350000000 },
      {
        name: "oneHome",
        label: "1세대 1주택 여부",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "예", value: 1 },
          { label: "아니오", value: 0 }
        ]
      },
      {
        name: "homeCount",
        label: "보유 주택 수",
        type: "select",
        defaultValue: 1,
        options: [
          { label: "1주택", value: 1 },
          { label: "2주택", value: 2 },
          { label: "3주택 이상", value: 3 }
        ]
      }
    ],
    guideTitle: "재산세·보유세 계산 기준",
    guide: [
      "이 계산기는 국세청 종합부동산세 안내와 2026년 8월 28일 기준 공개 세율표를 바탕으로 주택분 재산세와 종합부동산세를 단순 추정합니다.",
      "재산세는 공시가격의 60%를 과세표준으로 보고 주택분 지방세율을 적용했습니다. 종합부동산세는 1세대 1주택 12억원, 그 외 9억원 공제 후 60% 공정시장가액비율을 반영했습니다.",
      "실제 종부세는 공제할 재산세액, 세액공제, 세부담상한, 공동명의 특례, 연령·보유기간 공제에 따라 달라집니다. 따라서 현재 결과는 보수적인 1차 점검용으로 보세요."
    ],
    checkpoints: [
      "현재는 주택분 기준 단순 추정이며 토지·상가·공동명의 특례는 반영하지 않습니다.",
      "종부세는 재산세 상당액 공제 전 추정이라 실제 납부세액보다 높게 보일 수 있습니다.",
      "공시가격과 주택 수가 바뀌면 보유세 추정치도 크게 달라질 수 있습니다."
    ],
    faqs: [
      { question: "종부세가 실제보다 높게 보이는 이유는 무엇인가요?", answer: "현재 계산기는 공제할 재산세액과 각종 세액공제를 차감하기 전 단순 추정치를 보여주기 때문입니다." },
      { question: "1세대 1주택 공제는 반영되나요?", answer: "네. 1세대 1주택 선택 시 종부세 공제금액 12억원 기준을 적용합니다." }
    ],
    calculate(values) {
      const propertyTaxBase = values.publicPrice * 0.6;
      const propertyTax = Math.max(calculateHousingPropertyTax(propertyTaxBase).tax, 0);
      const localEducationTax = propertyTax * 0.2;
      const compDeduction = values.oneHome === 1 ? 1200000000 : 900000000;
      const compTaxBase = Math.max((values.publicPrice - compDeduction) * 0.6, 0);
      const compTax = calculateComprehensiveRealEstateTax(compTaxBase, values.homeCount);
      const totalHoldingTax = propertyTax + localEducationTax + compTax;
      return {
        headline: formatWon(totalHoldingTax),
        subline: `재산세 ${formatWon(propertyTax)} · 종부세 추정 ${formatWon(compTax)}`,
        rows: [
          { label: "재산세 과세표준", value: formatWon(propertyTaxBase) },
          { label: "재산세", value: formatWon(propertyTax), tone: "strong" },
          { label: "지방교육세", value: formatWon(localEducationTax) },
          { label: "종부세 과세표준", value: formatWon(compTaxBase) },
          { label: "종부세 단순 추정", value: formatWon(compTax), tone: "strong" },
          { label: "연간 보유세 합계", value: formatWon(totalHoldingTax), tone: "strong" }
        ],
        chart: [
          { name: "재산세", value: propertyTax },
          { name: "교육세", value: localEducationTax },
          { name: "종부세", value: compTax }
        ]
      };
    }
  },
  {
    slug: "stock-return",
    title: "주식 수익률 계산기",
    description: "매수단가, 매도단가, 수량, 수수료와 거래세를 반영해 주식 투자 수익금과 수익률을 계산합니다.",
    category: "금융",
    keywords: ["주식 수익률 계산기", "주식 수익 계산", "매도 수익", "주식 수익금", "거래세"],
    badge: "수수료·거래세 반영",
    audience: "국내주식 매매 전후 손익을 빠르게 확인하려는 투자자",
    fields: [
      { name: "buyPrice", label: "매수단가", type: "number", unit: "원", min: 0, max: 10000000, step: 10, defaultValue: 50000 },
      { name: "sellPrice", label: "매도단가", type: "number", unit: "원", min: 0, max: 10000000, step: 10, defaultValue: 58000 },
      { name: "quantity", label: "수량", type: "number", unit: "주", min: 1, max: 1000000, step: 1, defaultValue: 100 },
      { name: "buyFeeRate", label: "매수 수수료율", type: "number", unit: "%", min: 0, max: 1, step: 0.001, defaultValue: 0.015 },
      { name: "sellFeeRate", label: "매도 수수료율", type: "number", unit: "%", min: 0, max: 1, step: 0.001, defaultValue: 0.015 },
      { name: "taxRate", label: "거래세율", type: "number", unit: "%", min: 0, max: 1, step: 0.001, defaultValue: 0.18 }
    ],
    guideTitle: "주식 수익률 계산 기준",
    guide: [
      "주식 수익률은 매도금액에서 매수금액, 수수료, 거래세를 뺀 실제 손익을 매수 총비용으로 나누어 계산합니다.",
      "국내주식은 매도 시 증권거래세 등 매도 관련 비용이 붙을 수 있고, 증권사별 수수료율도 다릅니다. 이 계산기는 입력한 수수료율과 거래세율을 기준으로 단순 추정합니다.",
      "배당금, 환율, 양도소득세, 금융투자소득 과세 여부, 해외주식 세금은 반영하지 않습니다. 실제 세금은 계좌 유형과 종목, 거래시장, 투자자 상황에 따라 달라질 수 있습니다."
    ],
    checkpoints: [
      "수익률은 매수금액이 아니라 매수 수수료까지 포함한 총비용 기준으로 계산합니다.",
      "거래세는 일반적으로 매도금액 기준으로 입력합니다.",
      "해외주식은 환율과 양도소득세를 별도로 고려해야 합니다."
    ],
    faqs: [
      { question: "수수료율은 어디서 확인하나요?", answer: "사용 중인 증권사 앱의 국내주식 수수료 안내나 거래 내역에서 확인할 수 있습니다." },
      { question: "배당금도 포함되나요?", answer: "아니요. 이 계산기는 매수·매도 차익 중심입니다. 배당 수익은 별도로 더해 총수익률을 판단하세요." }
    ],
    calculate(values) {
      const quantity = Math.max(Math.floor(values.quantity), 0);
      const buyAmount = values.buyPrice * quantity;
      const sellAmount = values.sellPrice * quantity;
      const buyFee = buyAmount * (values.buyFeeRate / 100);
      const sellFee = sellAmount * (values.sellFeeRate / 100);
      const transactionTax = sellAmount * (values.taxRate / 100);
      const totalCost = buyAmount + buyFee;
      const netProceeds = sellAmount - sellFee - transactionTax;
      const profit = netProceeds - totalCost;
      const returnRate = totalCost > 0 ? (profit / totalCost) * 100 : 0;

      return {
        headline: `${formatWon(profit)} (${formatPercent(returnRate, 2)})`,
        subline: `매수 총비용 ${formatWon(totalCost)} · 매도 실수령 ${formatWon(netProceeds)}`,
        rows: [
          { label: "매수금액", value: formatWon(buyAmount) },
          { label: "매도금액", value: formatWon(sellAmount) },
          { label: "매수 수수료", value: formatWon(buyFee) },
          { label: "매도 수수료", value: formatWon(sellFee) },
          { label: "거래세", value: formatWon(transactionTax) },
          { label: "순손익", value: formatWon(profit), tone: "strong" },
          { label: "수익률", value: formatPercent(returnRate, 2), tone: "strong" }
        ],
        chart: [
          { name: "매수비용", value: totalCost },
          { name: "매도실수령", value: netProceeds },
          { name: profit >= 0 ? "수익" : "손실", value: Math.abs(profit) }
        ]
      };
    }
  },
  {
    slug: "stock-average-price",
    title: "주식 물타기 계산기",
    description: "현재 보유 수량과 평균단가에 추가 매수 수량·가격을 더해 새로운 평균 매입단가를 계산합니다.",
    category: "금융",
    keywords: ["주식 물타기 계산기", "평단가 계산기", "평균 매입단가", "추가매수", "주식 평단"],
    badge: "평균단가 재계산",
    audience: "추가 매수 전 평균단가와 손익분기 가격을 확인하려는 투자자",
    fields: [
      { name: "currentShares", label: "현재 보유 수량", type: "number", unit: "주", min: 0, max: 1000000, step: 1, defaultValue: 100 },
      { name: "currentAveragePrice", label: "현재 평균단가", type: "number", unit: "원", min: 0, max: 10000000, step: 10, defaultValue: 50000 },
      { name: "addShares", label: "추가 매수 수량", type: "number", unit: "주", min: 0, max: 1000000, step: 1, defaultValue: 50 },
      { name: "addPrice", label: "추가 매수 단가", type: "number", unit: "원", min: 0, max: 10000000, step: 10, defaultValue: 42000 },
      { name: "feeRate", label: "매수 수수료율", type: "number", unit: "%", min: 0, max: 1, step: 0.001, defaultValue: 0.015 }
    ],
    guideTitle: "물타기 평균단가 계산 기준",
    guide: [
      "물타기 평균단가는 기존 보유금액과 추가 매수금액을 합산한 뒤 총 보유 수량으로 나누어 계산합니다.",
      "추가 매수 단가가 현재 평균단가보다 낮으면 평균단가는 내려가고, 높으면 올라갑니다. 평균단가가 내려가도 투자 위험 자체가 줄어드는 것은 아닙니다.",
      "이 계산기는 매수 수수료를 추가 매수 비용에 반영합니다. 세금, 배당, 환율, 신용융자 이자, 예탁금 이용료 등은 포함하지 않습니다."
    ],
    checkpoints: [
      "평균단가 하락보다 총 투자금 증가를 함께 봐야 합니다.",
      "추가 매수 후 손익분기 가격은 새 평균단가와 수수료 구조에 따라 달라집니다.",
      "하락 이유가 기업가치 훼손이라면 단순 물타기는 손실을 키울 수 있습니다."
    ],
    faqs: [
      { question: "물타기와 분할매수는 같은가요?", answer: "계산식은 비슷하지만 목적이 다릅니다. 분할매수는 계획된 진입이고, 물타기는 하락 후 평균단가를 낮추는 경우가 많습니다." },
      { question: "평단이 낮아지면 좋은 건가요?", answer: "평균단가만 보면 좋아 보일 수 있지만 총 투자금과 종목 리스크가 같이 커질 수 있습니다." }
    ],
    calculate(values) {
      const currentShares = Math.max(Math.floor(values.currentShares), 0);
      const addShares = Math.max(Math.floor(values.addShares), 0);
      const currentAmount = currentShares * values.currentAveragePrice;
      const addAmount = addShares * values.addPrice;
      const buyFee = addAmount * (values.feeRate / 100);
      const totalShares = currentShares + addShares;
      const totalCost = currentAmount + addAmount + buyFee;
      const newAverage = totalShares > 0 ? totalCost / totalShares : 0;
      const averageChange = newAverage - values.currentAveragePrice;
      const breakEvenRise = newAverage > 0 ? ((newAverage - values.addPrice) / newAverage) * 100 : 0;

      return {
        headline: `${formatWon(newAverage)} / 주`,
        subline: `총 ${formatNumber(totalShares)}주 · 총 투자금 ${formatWon(totalCost)}`,
        rows: [
          { label: "기존 투자금", value: formatWon(currentAmount) },
          { label: "추가 매수금", value: formatWon(addAmount) },
          { label: "추가 매수 수수료", value: formatWon(buyFee) },
          { label: "총 보유 수량", value: `${formatNumber(totalShares)}주` },
          { label: "새 평균단가", value: formatWon(newAverage), tone: "strong" },
          { label: "평균단가 변화", value: `${averageChange >= 0 ? "+" : ""}${formatWon(averageChange)}`, tone: "strong" },
          { label: "추가 매수가 대비 회복률", value: formatPercent(breakEvenRise, 2) }
        ],
        chart: [
          { name: "기존금액", value: currentAmount },
          { name: "추가금액", value: addAmount + buyFee },
          { name: "평균단가", value: newAverage * totalShares }
        ]
      };
    }
  },
  {
    slug: "stock-valuation",
    title: "PER/PBR 주식 가치평가 계산기",
    description: "현재 주가, EPS, BPS와 비교 PER·PBR을 입력해 현재 배수와 적정주가 범위를 추정합니다.",
    category: "금융",
    keywords: ["PER 계산기", "PBR 계산기", "주식 가치평가", "적정주가 계산기", "EPS BPS"],
    badge: "PER·PBR 배수 비교",
    audience: "종목의 현재 주가가 이익·순자산 대비 어느 정도인지 비교하려는 투자자",
    fields: [
      { name: "currentPrice", label: "현재 주가", type: "number", unit: "원", min: 0, max: 10000000, step: 10, defaultValue: 70000 },
      { name: "eps", label: "EPS", type: "number", unit: "원", min: -1000000, max: 1000000, step: 10, defaultValue: 5000 },
      { name: "bps", label: "BPS", type: "number", unit: "원", min: 0, max: 10000000, step: 10, defaultValue: 50000 },
      { name: "targetPer", label: "비교 PER", type: "number", unit: "배", min: 0, max: 200, step: 0.1, defaultValue: 12 },
      { name: "targetPbr", label: "비교 PBR", type: "number", unit: "배", min: 0, max: 20, step: 0.1, defaultValue: 1.4 }
    ],
    guideTitle: "PER/PBR 가치평가 기준",
    guide: [
      "PER은 주가를 주당순이익(EPS)으로 나눈 값이고, PBR은 주가를 주당순자산(BPS)으로 나눈 값입니다. 각각 이익과 순자산 대비 현재 주가 수준을 보는 배수입니다.",
      "비교 PER과 비교 PBR은 같은 업종, 비슷한 성장률·수익성·재무구조를 가진 기업의 평균이나 본인이 가정한 목표 배수를 입력합니다.",
      "적정주가는 EPS에 비교 PER을 곱한 값, BPS에 비교 PBR을 곱한 값을 각각 계산하고 단순 평균으로 참고 범위를 보여줍니다. 성장률, 부채, 일회성 이익, 경기 사이클은 별도로 판단해야 합니다."
    ],
    checkpoints: [
      "EPS가 0 이하이면 PER 기반 평가는 의미가 제한됩니다.",
      "PBR은 자산가치가 중요한 금융·제조·지주사 분석에 더 유용할 수 있습니다.",
      "업종 평균 배수를 그대로 적용하면 성장률과 재무위험 차이를 놓칠 수 있습니다."
    ],
    faqs: [
      { question: "PER이 낮으면 무조건 저평가인가요?", answer: "아니요. 이익이 일시적으로 높거나 성장성이 낮거나 리스크가 큰 기업은 낮은 PER이 정당화될 수 있습니다." },
      { question: "적정주가는 목표가인가요?", answer: "아니요. 입력한 가정으로 계산한 참고값입니다. 실제 투자 판단은 실적, 산업, 금리, 리스크를 함께 봐야 합니다." }
    ],
    calculate(values) {
      const per = values.eps > 0 ? values.currentPrice / values.eps : 0;
      const pbr = values.bps > 0 ? values.currentPrice / values.bps : 0;
      const fairByPer = values.eps > 0 ? values.eps * values.targetPer : 0;
      const fairByPbr = values.bps > 0 ? values.bps * values.targetPbr : 0;
      const fairValues = [fairByPer, fairByPbr].filter((value) => value > 0);
      const blendedFair = fairValues.length ? fairValues.reduce((sum, value) => sum + value, 0) / fairValues.length : 0;
      const upside = values.currentPrice > 0 ? ((blendedFair - values.currentPrice) / values.currentPrice) * 100 : 0;

      return {
        headline: `${formatWon(blendedFair)} (${formatPercent(upside, 1)})`,
        subline: `현재 PER ${per > 0 ? `${formatNumber(per, 2)}배` : "산정 제한"} · 현재 PBR ${pbr > 0 ? `${formatNumber(pbr, 2)}배` : "산정 제한"}`,
        rows: [
          { label: "현재 PER", value: per > 0 ? `${formatNumber(per, 2)}배` : "EPS 0 이하로 산정 제한" },
          { label: "현재 PBR", value: pbr > 0 ? `${formatNumber(pbr, 2)}배` : "BPS 0 이하로 산정 제한" },
          { label: "PER 기준 적정주가", value: fairByPer > 0 ? formatWon(fairByPer) : "산정 제한", tone: "strong" },
          { label: "PBR 기준 적정주가", value: fairByPbr > 0 ? formatWon(fairByPbr) : "산정 제한", tone: "strong" },
          { label: "단순 평균 적정주가", value: formatWon(blendedFair), tone: "strong" },
          { label: "현재가 대비 차이", value: formatPercent(upside, 1), tone: "strong" }
        ],
        chart: [
          { name: "현재가", value: values.currentPrice },
          { name: "PER기준", value: fairByPer },
          { name: "PBR기준", value: fairByPbr }
        ]
      };
    }
  },
  {
    slug: "crypto-investment-growth",
    title: "암호화폐 투자 성장 계산기",
    description: "초기 투자금, 월 추가 투자금, 투자 기간, 예상 수익률을 입력해 암호화폐 포트폴리오의 성장 시나리오를 계산합니다.",
    category: "금융",
    keywords: ["암호화폐 투자 계산기", "코인 투자 계산기", "비트코인 투자 계산기", "적립식 코인 투자", "암호화폐 수익률"],
    badge: "적립식·시나리오 비교",
    audience: "비트코인·이더리움 등 암호화폐 장기 투자 계획을 점검하려는 투자자",
    fields: [
      { name: "initialInvestment", label: "초기 투자금", type: "number", unit: "원", min: 0, max: 10000000000, step: 100000, defaultValue: 5000000 },
      { name: "monthlyContribution", label: "월 추가 투자금", type: "number", unit: "원", min: 0, max: 1000000000, step: 10000, defaultValue: 300000 },
      { name: "years", label: "투자 기간", type: "number", unit: "년", min: 1, max: 30, step: 1, defaultValue: 5 },
      { name: "expectedAnnualReturn", label: "기준 연수익률", type: "number", unit: "%", min: -95, max: 300, step: 0.5, defaultValue: 12 },
      { name: "conservativeAnnualReturn", label: "보수 시나리오", type: "number", unit: "%", min: -95, max: 300, step: 0.5, defaultValue: -10 },
      { name: "optimisticAnnualReturn", label: "낙관 시나리오", type: "number", unit: "%", min: -95, max: 300, step: 0.5, defaultValue: 35 },
      { name: "annualFeeRate", label: "연간 비용률", type: "number", unit: "%", min: 0, max: 20, step: 0.1, defaultValue: 0.5 }
    ],
    guideTitle: "암호화폐 투자 성장 계산 기준",
    guide: [
      "이 계산기는 초기 투자금과 매월 말 추가 투자금을 기준으로, 입력한 연수익률이 월복리로 적용된다고 가정해 미래 평가액을 추정합니다.",
      "참조한 투자 성장 계산기처럼 한 가지 평균값만 보지 않도록 보수·기준·낙관 시나리오를 함께 보여줍니다. 다만 특정 서비스나 전략의 과거 성과를 사용하지 않고 사용자가 직접 입력한 가정을 계산합니다.",
      "암호화폐는 변동성과 낙폭이 매우 큰 자산입니다. 거래 수수료, 슬리피지, 세금, 환율, 스테이킹 보상, 디파이·거래소 리스크는 별도로 확인해야 합니다."
    ],
    checkpoints: [
      "월 추가 투자금은 매월 말에 납입한다고 가정합니다.",
      "연간 비용률은 예상 연수익률에서 차감해 단순 반영합니다.",
      "과거 수익률이나 목표 수익률은 미래 수익을 보장하지 않습니다.",
      "손실 시나리오에서 얼마나 오래 버틸 수 있는지 투자금 규모를 함께 보세요."
    ],
    faqs: [
      { question: "비트코인과 알트코인 모두 계산할 수 있나요?", answer: "네. 계산식은 특정 코인 가격을 직접 가져오지 않고 투자금과 수익률 가정을 사용하므로 비트코인, 이더리움, 알트코인 포트폴리오 모두에 적용할 수 있습니다." },
      { question: "연수익률은 어떻게 입력해야 하나요?", answer: "본인이 가정하는 연평균 수익률을 입력하세요. 변동성이 큰 자산이므로 기준 수익률만 보지 말고 보수 시나리오를 반드시 함께 확인하는 것이 좋습니다." },
      { question: "실제 세금도 반영되나요?", answer: "아니요. 이 계산기는 투자 성장 시뮬레이션이며 세금, 거래 수수료, 환율, 출금 수수료는 별도로 반영해야 합니다." }
    ],
    calculate(values) {
      const years = Math.max(Math.floor(values.years), 1);
      const months = years * 12;
      const initialInvestment = Math.max(values.initialInvestment, 0);
      const monthlyContribution = Math.max(values.monthlyContribution, 0);
      const totalContributions = initialInvestment + monthlyContribution * months;

      const futureValue = (annualReturn: number) => {
        const netAnnualRate = annualReturn - values.annualFeeRate;
        return compoundFutureValue(initialInvestment, monthlyContribution, netAnnualRate, years);
      };

      const conservativeValue = futureValue(values.conservativeAnnualReturn);
      const expectedValue = futureValue(values.expectedAnnualReturn);
      const optimisticValue = futureValue(values.optimisticAnnualReturn);
      const profit = expectedValue - totalContributions;
      const returnRate = totalContributions > 0 ? (profit / totalContributions) * 100 : 0;
      const conservativeProfit = conservativeValue - totalContributions;
      const optimisticProfit = optimisticValue - totalContributions;

      return {
        headline: `${formatWon(expectedValue)} (${formatPercent(returnRate, 1)})`,
        subline: `총 납입 ${formatWon(totalContributions)} · 예상 수익 ${formatWon(profit)}`,
        rows: [
          { label: "총 납입액", value: formatWon(totalContributions), tone: "strong" },
          { label: "초기 투자금", value: formatWon(initialInvestment) },
          { label: "월 추가 투자금 합계", value: formatWon(monthlyContribution * months) },
          { label: "순 기준 연수익률", value: formatPercent(values.expectedAnnualReturn - values.annualFeeRate, 1) },
          { label: "기준 예상 평가액", value: formatWon(expectedValue), tone: "strong" },
          { label: "기준 예상 수익", value: `${profit >= 0 ? "+" : ""}${formatWon(profit)}`, tone: "strong" },
          { label: "기준 수익률", value: formatPercent(returnRate, 1), tone: "strong" },
          { label: "보수 시나리오 손익", value: `${conservativeProfit >= 0 ? "+" : ""}${formatWon(conservativeProfit)}` },
          { label: "낙관 시나리오 손익", value: `${optimisticProfit >= 0 ? "+" : ""}${formatWon(optimisticProfit)}` }
        ],
        chart: [
          { name: "총납입", value: totalContributions },
          { name: "보수", value: conservativeValue },
          { name: "기준", value: expectedValue },
          { name: "낙관", value: optimisticValue }
        ]
      };
    }
  },
  {
    slug: "pension-tax",
    title: "IRP·연금저축 절세액 계산기",
    description: "연금계좌 납입액과 총급여 구간에 따라 세액공제 예상액을 계산합니다.",
    category: "금융",
    keywords: ["IRP 계산기", "연금저축 세액공제", "절세 계산기"],
    badge: "세액공제 한도 반영",
    audience: "직장인, 연말정산 준비 사용자",
    fields: [
      { name: "income", label: "총급여", type: "number", unit: "원", min: 10000000, max: 300000000, step: 1000000, defaultValue: 55000000 },
      { name: "pensionSaving", label: "연금저축 납입액", type: "number", unit: "원", min: 0, max: 6000000, step: 100000, defaultValue: 4000000 },
      { name: "irp", label: "IRP 납입액", type: "number", unit: "원", min: 0, max: 9000000, step: 100000, defaultValue: 3000000 }
    ],
    guideTitle: "연금계좌 세액공제 구조",
    guide: [
      "연금저축과 IRP는 노후자금 마련과 세액공제를 동시에 노리는 대표 상품입니다. 납입액 전체가 무제한 공제되는 것은 아니며, 연금저축 한도와 IRP 포함 통합 한도가 함께 적용됩니다.",
      "총급여 5,500만원 이하 구간은 통상 더 높은 세액공제율이 적용되고, 이를 초과하면 낮은 공제율이 적용됩니다. 실제 적용은 종합소득금액, 나이, 세법 개정, 다른 공제 항목에 따라 달라질 수 있습니다.",
      "중도해지하거나 연금 외 방식으로 수령하면 기타소득세 등 불이익이 생길 수 있습니다. 절세액만 보고 가입하기보다 운용 수수료, 투자 위험, 수령 계획을 함께 봐야 합니다."
    ],
    checkpoints: [
      "연금저축 한도와 IRP 통합 한도를 같이 봐야 합니다.",
      "세액공제율은 급여 구간에 따라 달라집니다.",
      "실제 환급액은 결정세액 크기에 따라 계산값보다 작을 수 있습니다."
    ],
    faqs: [
      { question: "연금저축과 IRP를 합쳐 얼마까지 계산하나요?", answer: "일반적인 통합 세액공제 한도 900만원을 기준으로 추정합니다. 연금저축은 먼저 600만원 한도를 적용합니다." },
      { question: "환급액과 절세액은 같은가요?", answer: "세액공제는 낼 세금을 줄이는 효과입니다. 이미 납부한 세금과 결정세액이 적으면 실제 환급액은 계산값보다 작을 수 있습니다." }
    ],
    calculate(values) {
      const pensionApplied = Math.min(values.pensionSaving, 6000000);
      const totalApplied = Math.min(pensionApplied + values.irp, 9000000);
      const creditRate = values.income <= 55000000 ? 0.165 : 0.132;
      const credit = totalApplied * creditRate;
      return {
        headline: formatWon(credit),
        subline: `공제 대상 ${formatWon(totalApplied)}, 적용률 ${formatPercent(creditRate * 100, 1)}`,
        rows: [
          { label: "연금저축 인정액", value: formatWon(pensionApplied) },
          { label: "IRP 포함 인정액", value: formatWon(totalApplied) },
          { label: "세액공제율", value: formatPercent(creditRate * 100, 1) },
          { label: "예상 절세액", value: formatWon(credit), tone: "strong" }
        ],
        chart: [
          { name: "연금저축", value: pensionApplied },
          { name: "IRP", value: totalApplied - pensionApplied },
          { name: "한도잔여", value: Math.max(9000000 - totalApplied, 0) }
        ]
      };
    }
  }
];

export function getCalculator(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug);
}

export function getCalculatorBySlug(slug: CalculatorSlug) {
  return calculators.find((calculator) => calculator.slug === slug)!;
}
