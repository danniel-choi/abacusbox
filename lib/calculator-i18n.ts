import type { CalculatorCategory, CalculatorConfig, CalculatorSlug, InputField } from "@/lib/calculators";
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

const FIELD_LABELS: Record<string, LocalizedText> = {
  year: { en: "Year", ja: "年" }, month: { en: "Month", ja: "月" }, day: { en: "Day", ja: "日" },
  birthYear: { en: "Birth year", ja: "出生年" }, birthMonth: { en: "Birth month", ja: "出生月" }, birthDay: { en: "Birth day", ja: "出生日" },
  dateBasis: { en: "Calendar type", ja: "暦の種類" }, lunarLeap: { en: "Lunar month type", ja: "旧暦の月区分" },
  birthTimeKnown: { en: "Birth time known", ja: "出生時刻が分かる" }, hour: { en: "Hour", ja: "時" }, minute: { en: "Minute", ja: "分" },
  amount: { en: "Amount", ja: "金額" }, monthlyIncome: { en: "Monthly income", ja: "月収" }, annualIncome: { en: "Annual income", ja: "年収" },
  monthlySalary: { en: "Monthly salary", ja: "月給" }, hourlyWage: { en: "Hourly wage", ja: "時給" }, workingHours: { en: "Working hours", ja: "勤務時間" },
  interestRate: { en: "Interest rate", ja: "金利" }, annualRate: { en: "Annual rate", ja: "年利" }, months: { en: "Months", ja: "月数" }, years: { en: "Years", ja: "年数" },
  principal: { en: "Principal", ja: "元金" }, loanAmount: { en: "Loan amount", ja: "借入額" }, term: { en: "Term", ja: "期間" },
  purchasePrice: { en: "Purchase price", ja: "購入価格" }, salePrice: { en: "Sale price", ja: "売却価格" }, quantity: { en: "Quantity", ja: "数量" },
  height: { en: "Height", ja: "身長" }, weight: { en: "Weight", ja: "体重" }, age: { en: "Age", ja: "年齢" }, gender: { en: "Gender", ja: "性別" },
  activity: { en: "Activity level", ja: "活動量" }, target: { en: "Target", ja: "目標" }, distance: { en: "Distance", ja: "距離" }, time: { en: "Time", ja: "時間" },
  probability: { en: "Probability", ja: "確率" }, trials: { en: "Number of trials", ja: "試行回数" }, price: { en: "Price", ja: "価格" },
  expenses: { en: "Expenses", ja: "費用" }, cost: { en: "Cost", ja: "コスト" }, savings: { en: "Savings", ja: "貯蓄額" }, rate: { en: "Rate", ja: "割合" }
};

const OPTION_LABELS: Record<string, LocalizedText> = {
  "남성": { en: "Male", ja: "男性" }, "여성": { en: "Female", ja: "女性" }, "예": { en: "Yes", ja: "はい" }, "아니오": { en: "No", ja: "いいえ" },
  "양력": { en: "Solar calendar", ja: "新暦" }, "음력": { en: "Lunar calendar", ja: "旧暦" }, "평달": { en: "Regular month", ja: "平月" }, "윤달": { en: "Leap month", ja: "閏月" },
  "미혼": { en: "Single", ja: "未婚" }, "기혼": { en: "Married", ja: "既婚" }, "없음": { en: "None", ja: "なし" }, "있음": { en: "Yes", ja: "あり" },
  "개인": { en: "Individual", ja: "個人" }, "법인": { en: "Corporation", ja: "法人" }, "주간": { en: "Day", ja: "昼" }, "야간": { en: "Night", ja: "夜" }
};

function humanizeFieldName(name: string, locale: "en" | "ja") {
  const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").split(/[-_ ]+/).filter(Boolean);
  const translated = words.map((word) => FIELD_LABELS[word]?.[locale] ?? word);
  if (locale === "ja") return translated.join("");
  return translated.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

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

export function getLocalizedFieldLabel(field: InputField, locale: Locale) {
  if (locale === "ko") return field.label;
  return FIELD_LABELS[field.name]?.[locale] ?? humanizeFieldName(field.name, locale);
}

export function getLocalizedFieldHelp(field: InputField, locale: Locale) {
  if (!field.help || locale === "ko") return field.help;
  const label = getLocalizedFieldLabel(field, locale);
  return locale === "en" ? `Enter ${label.toLowerCase()} to update the estimate.` : `${label}を入力すると結果が更新されます。`;
}

export function getLocalizedOptionLabel(label: string, locale: Locale) {
  if (locale === "ko") return label;
  return OPTION_LABELS[label]?.[locale] ?? (label.replace(/[가-힣]+/g, "").trim() || (locale === "en" ? "Option" : "選択肢"));
}
