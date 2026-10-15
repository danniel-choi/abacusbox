import type { CalculatorCategory, CalculatorConfig, CalculatorSlug } from "@/lib/calculators";
import { getCalculatorGroup, getLocalizedGroupMeta } from "@/lib/calculator-directory";
import type { Locale } from "@/lib/i18n";

type LocalizedText = { en: string; ja: string };

const TITLE_OVERRIDES: Partial<Record<CalculatorSlug, LocalizedText>> = {
  "minimum-wage": { en: "Minimum Wage Checker", ja: "最低賃金チェック" },
  "unpaid-wage": { en: "Unpaid Wage Calculator", ja: "未払い賃金計算機" },
  unemployment: { en: "Unemployment Benefit Calculator", ja: "失業給付計算機" },
  severance: { en: "Severance Pay Calculator", ja: "退職金計算機" },
  "net-salary": { en: "Net Salary Calculator", ja: "手取り給与計算機" },
  "loan-interest": { en: "Loan Interest Calculator", ja: "ローン利息計算機" },
  "loan-dsr": { en: "DSR Calculator", ja: "DSR計算機" },
  "year-end-tax-settlement": { en: "Year-end Tax Settlement Calculator", ja: "年末調整計算機" },
  "comprehensive-income-tax": { en: "Comprehensive Income Tax Calculator", ja: "総合所得税計算機" },
  "earned-income-tax": { en: "Earned Income Tax Calculator", ja: "勤労所得税計算機" },
  "inheritance-tax": { en: "Inheritance Tax Calculator", ja: "相続税計算機" },
  "pension-tax": { en: "Pension Tax Credit Calculator", ja: "年金税額控除計算機" },
  "stock-return": { en: "Stock Return Calculator", ja: "株式収益率計算機" },
  "crypto-investment-growth": { en: "Crypto Investment Growth Calculator", ja: "暗号資産積立計算機" },
  bmi: { en: "BMI Calculator", ja: "BMI計算機" },
  "calorie-calculator": { en: "Calorie Calculator", ja: "カロリー計算機" },
  "daily-intake": { en: "Daily Intake Calculator", ja: "1日摂取量計算機" },
  "pregnancy-week-calculator": { en: "Pregnancy Week Calculator", ja: "妊娠週数計算機" },
  "pet-age": { en: "Pet Age Calculator", ja: "ペット年齢計算機" },
  "korean-age": { en: "Korean Age Calculator", ja: "韓国式年齢計算機" },
  "anniversary-calculator": { en: "Anniversary Calculator", ja: "記念日計算機" },
  "lunar-solar-converter": { en: "Lunar-Solar Converter", ja: "旧暦・新暦変換機" },
  "unit-converter": { en: "Unit Converter", ja: "単位変換機" },
  "date-diff": { en: "Date Difference Calculator", ja: "日付差計算機" },
  dday: { en: "D-Day Calculator", ja: "D-Day計算機" },
  "random-number": { en: "Random Number Generator", ja: "乱数生成機" },
  "draw-probability": { en: "Draw Probability Calculator", ja: "ガチャ確率計算機" },
  "poker-equity-calculator": { en: "Poker Equity Calculator", ja: "ポーカー勝率計算機" },
  "spending-habit-score": { en: "Spending Habit Score", ja: "消費習慣スコア" },
  "salary-vanish-calculator": { en: "Salary Vanish Calculator", ja: "給料消滅計算機" },
  "fire-retirement-age": { en: "FIRE Retirement Age Calculator", ja: "FIRE退職年齢計算機" },
  "retirement-savings": { en: "Retirement Savings Calculator", ja: "老後資金計算機" },
  "password-generator": { en: "Password Generator", ja: "パスワード生成機" },
  "graphing-calculator": { en: "Graphing Calculator", ja: "グラフ計算機" },
  "scientific-calculator": { en: "Scientific Calculator", ja: "関数電卓" },
  "math-notes": { en: "Math Notes", ja: "数学ノート" },
  "matrix-calculator": { en: "Matrix Calculator", ja: "行列計算機" },
  "tarot-birth-card-calculator": { en: "Tarot Birth Card Calculator", ja: "タロット誕生カード計算機" },
  "manse-ryeok": { en: "Korean Manse-ryeok Calculator", ja: "韓国万歳暦計算機" },
  "korean-zodiac": { en: "Korean Zodiac Calculator", ja: "韓国干支計算機" },
  "samjae-calculator": { en: "Samjae Calculator", ja: "三災計算機" },
  "sunrise-sunset-calculator": { en: "Sunrise and Sunset Calculator", ja: "日の出・日の入り計算機" }
};

const TOKEN_LABELS: Record<string, LocalizedText> = {
  calculator: { en: "Calculator", ja: "計算機" },
  calculation: { en: "Calculator", ja: "計算機" },
  converter: { en: "Converter", ja: "変換機" },
  tax: { en: "Tax", ja: "税" },
  salary: { en: "Salary", ja: "給与" },
  wage: { en: "Wage", ja: "賃金" },
  loan: { en: "Loan", ja: "ローン" },
  stock: { en: "Stock", ja: "株式" },
  crypto: { en: "Crypto", ja: "暗号資産" },
  investment: { en: "Investment", ja: "投資" },
  health: { en: "Health", ja: "健康" },
  age: { en: "Age", ja: "年齢" },
  date: { en: "Date", ja: "日付" },
  time: { en: "Time", ja: "時間" },
  speed: { en: "Speed", ja: "速度" },
  distance: { en: "Distance", ja: "距離" }
};

const CATEGORY_LABELS: Record<CalculatorCategory, LocalizedText> = {
  노무: { en: "Labor", ja: "労務" },
  금융: { en: "Finance", ja: "金融" },
  세금: { en: "Tax", ja: "税金" },
  생활: { en: "Life", ja: "生活" },
  수학: { en: "Math", ja: "数学" },
  게임: { en: "Games", ja: "ゲーム" },
  사주: { en: "Saju & fortune", ja: "四柱推命・占い" }
};

function humanizeSlug(slug: string, locale: "en" | "ja") {
  const words = slug.split("-").map((word) => TOKEN_LABELS[word]?.[locale] ?? word);
  if (locale === "ja") return `${words.join("")}計算機`;
  return `${words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Calculator`;
}

export type CalculatorPresentationInput = Pick<CalculatorConfig, "slug" | "title" | "description" | "audience" | "badge" | "category">;

export function getLocalizedCalculatorPresentation(calculator: CalculatorPresentationInput, locale: Locale) {
  if (locale === "ko") {
    return {
      title: calculator.title,
      description: calculator.description,
      audience: calculator.audience,
      badge: calculator.badge,
      category: calculator.category
    };
  }

  const group = getLocalizedGroupMeta(locale, getCalculatorGroup(calculator.slug));
  const title = TITLE_OVERRIDES[calculator.slug]?.[locale] ?? humanizeSlug(calculator.slug, locale);
  const category = CATEGORY_LABELS[calculator.category][locale];
  return {
    title,
    description:
      locale === "en"
        ? `A practical tool for checking ${title.toLowerCase()} values with clear assumptions and results.`
        : `条件を入力して${title}の目安を確認できる実用ツールです。`,
    audience:
      locale === "en" ? `For anyone comparing ${group.label.toLowerCase()} values` : `${group.label}の数値を確認したい方`,
    badge: locale === "en" ? "Calculator" : "計算機",
    category
  };
}
