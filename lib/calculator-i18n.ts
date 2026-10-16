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

const RESULT_LABELS: Record<string, LocalizedText> = {
  "합계": { en: "Total", ja: "合計" }, "총액": { en: "Total amount", ja: "総額" }, "예상 금액": { en: "Estimated amount", ja: "予想金額" },
  "월 납입액": { en: "Monthly payment", ja: "月々の支払額" }, "월 상환액": { en: "Monthly repayment", ja: "月々の返済額" },
  "총이자": { en: "Total interest", ja: "総利息" }, "원금": { en: "Principal", ja: "元金" }, "이자": { en: "Interest", ja: "利息" },
  "세금": { en: "Tax", ja: "税金" }, "환급액": { en: "Refund", ja: "還付額" }, "추가 납부액": { en: "Additional tax", ja: "追加納付額" },
  "수익": { en: "Profit", ja: "利益" }, "수익률": { en: "Return", ja: "収益率" }, "손실": { en: "Loss", ja: "損失" },
  "승률": { en: "Win rate", ja: "勝率" }, "확률": { en: "Probability", ja: "確率" }, "기대값": { en: "Expected value", ja: "期待値" },
  "기간": { en: "Period", ja: "期間" }, "남은 기간": { en: "Remaining period", ja: "残り期間" }, "필요 금액": { en: "Required amount", ja: "必要金額" },
  "평균": { en: "Average", ja: "平均" }, "평균단가": { en: "Average price", ja: "平均単価" }, "현재값": { en: "Current value", ja: "現在値" },
  "최종 금액": { en: "Final amount", ja: "最終金額" }, "차이": { en: "Difference", ja: "差額" }, "총 비용": { en: "Total cost", ja: "総費用" },
  "점수": { en: "Score", ja: "スコア" }, "등급": { en: "Grade", ja: "等級" }, "나이": { en: "Age", ja: "年齢" }, "생년월일": { en: "Birth date", ja: "生年月日" }
};

export function getLocalizedResultLabel(label: string, locale: Locale) {
  if (locale === "ko") return label;
  if (RESULT_LABELS[label]?.[locale]) return RESULT_LABELS[label][locale];
  let translated = label;
  const replacements: Array<[string, LocalizedText]> = [
    ["월", { en: "Monthly ", ja: "月" }], ["연", { en: "Annual ", ja: "年" }], ["예상", { en: "Estimated ", ja: "予想" }],
    ["금액", { en: "amount", ja: "金額" }], ["비용", { en: "cost", ja: "費用" }], ["수량", { en: "quantity", ja: "数量" }],
    ["결과", { en: "result", ja: "結果" }], ["기간", { en: "period", ja: "期間" }], ["시간", { en: "time", ja: "時間" }]
  ];
  for (const [source, replacement] of replacements) translated = translated.replaceAll(source, replacement[locale]);
  if (/[가-힣]/.test(translated)) return locale === "en" ? "Result" : "結果";
  return translated;
}

const UTILITY_TEXT: Record<string, LocalizedText> = {
  "기준일": { en: "Base date", ja: "基準日" }, "목표일": { en: "Target date", ja: "目標日" }, "오늘": { en: "Today", ja: "今日" },
  "7일 후": { en: "In 7 days", ja: "7日後" }, "30일 후": { en: "In 30 days", ja: "30日後" }, "100일 후": { en: "In 100 days", ja: "100日後" },
  "시작일": { en: "Start date", ja: "開始日" }, "더하기": { en: "Add", ja: "足す" }, "빼기": { en: "Subtract", ja: "引く" },
  "년": { en: "Years", ja: "年" }, "개월": { en: "Months", ja: "か月" }, "주": { en: "Weeks", ja: "週" }, "일": { en: "Days", ja: "日" },
  "결과": { en: "Result", ja: "結果" }, "도착 날짜": { en: "Result date", ja: "到着日" }, "날짜 차이": { en: "Date difference", ja: "日付の差" }, "포함 일수": { en: "Inclusive days", ja: "含む日数" }, "주 환산": { en: "Weeks", ja: "週換算" },
  "텍스트": { en: "Text", ja: "テキスト" }, "전체 지우기": { en: "Clear all", ja: "すべて消去" }, "예문 넣기": { en: "Insert sample", ja: "サンプルを入力" },
  "수식 입력": { en: "Enter expression", ja: "式を入力" }, "계산 기록": { en: "Calculation history", ja: "計算履歴" }, "계산": { en: "Calculate", ja: "計算" }, "지우기": { en: "Clear", ja: "消去" },
  "사용 체크포인트": { en: "Checks to review", ja: "確認ポイント" }, "계산 결과": { en: "Calculation result", ja: "計算結果" }, "해석 포인트": { en: "Interpretation points", ja: "解釈ポイント" },
  "카드 입력": { en: "Card input", ja: "カード入力" }, "플레이어와 보드를 선택하세요": { en: "Select players and the board", ja: "プレイヤーとボードを選択" }, "보드": { en: "Board", ja: "ボード" }, "카드 선택": { en: "Select cards", ja: "カードを選択" }, "선택": { en: "Select", ja: "選択" },
  "수식": { en: "Expression", ja: "式" }, "기록": { en: "History", ja: "履歴" }, "다운로드 속도": { en: "Download speed", ja: "ダウンロード速度" }, "최근 측정": { en: "Recent tests", ja: "最近の測定" }, "경과 시간": { en: "Elapsed time", ja: "経過時間" }, "랩 기록": { en: "Lap records", ja: "ラップ記録" },
  "기준일과 목표일을 계산하세요": { en: "Calculate the days between a base date and target date", ja: "基準日と目標日の差を計算" },
  "날짜에 기간을 더하거나 빼세요": { en: "Add or subtract time from a date", ja: "日付に期間を足し引き" },
  "문장을 붙여 넣고 분량을 확인하세요": { en: "Paste text to check its length", ja: "文章を貼り付けて文字数を確認" },
  "홀덤 핸드와 보드의 에퀴티를 비교하세요": { en: "Compare hand and board equity", ja: "ハンドとボードのエクイティを比較" },
  "함수의 순간 기울기를 확인하세요": { en: "Check a function's instantaneous slope", ja: "関数の瞬間的な傾きを確認" },
  "구간 아래 면적을 계산하세요": { en: "Calculate the area under an interval", ja: "区間の下の面積を計算" },
  "시간을 측정하고 랩을 기록하세요": { en: "Measure time and record laps", ja: "時間を測ってラップを記録" },
  "현재 인터넷 속도를 측정하세요": { en: "Measure your current internet speed", ja: "現在のインターネット速度を測定" },
  "도형을 만들고 측정하세요": { en: "Create and measure a shape", ja: "図形を作成して測定" },
  "수식을 입력하세요": { en: "Enter an expression", ja: "式を入力" },
  "정의역, 괄호, 연산자를 확인하세요.": { en: "Check the domain, parentheses, and operators.", ja: "定義域、括弧、演算子を確認してください。" },
  "아직 기록이 없습니다.": { en: "There are no records yet.", ja: "まだ記録がありません。" },
  "아직 측정 기록이 없습니다.": { en: "There are no measurement records yet.", ja: "まだ測定記録がありません。" },
  "측정에 실패했습니다. 네트워크 상태를 확인해 주세요.": { en: "Measurement failed. Check your network connection.", ja: "測定に失敗しました。ネットワーク接続を確認してください。" },
  "중복 카드가 있습니다.": { en: "There are duplicate cards.", ja: "重複したカードがあります。" },
  "계산 결과가 여기에 표시됩니다.": { en: "The calculation result will appear here.", ja: "計算結果がここに表示されます。" },
  "최근 10건까지 이 브라우저에 저장됩니다.": { en: "Up to 10 recent items are saved in this browser.", ja: "最近10件までこのブラウザに保存されます。" },
  "계산 기록이 여기에 표시됩니다.": { en: "Calculation history will appear here.", ja: "計算履歴がここに表示されます。" },
  "목차": { en: "Contents", ja: "目次" }, "그래프": { en: "Graph", ja: "グラフ" }, "변수": { en: "Variables", ja: "変数" }, "선택한 줄": { en: "Selected line", ja: "選択した行" },
  "작도 목록": { en: "Construction list", ja: "作図一覧" }, "와이어프레임": { en: "Wireframe", ja: "ワイヤーフレーム" }, "3D 수식": { en: "3D expression", ja: "3D数式" }, "토큰 삽입": { en: "Insert token", ja: "トークンを挿入" }
};

export function getLocalizedUtilityText(text: string, locale: Locale) {
  if (locale === "ko") return text;
  return UTILITY_TEXT[text]?.[locale] ?? (text.length <= 12 ? (locale === "en" ? "Input" : "入力") : locale === "en" ? "Review this step before calculating." : "計算前にこの項目を確認してください。" );
}
