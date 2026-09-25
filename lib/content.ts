export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "노무 가이드" | "금융 가이드" | "세금 가이드" | "생활 가이드" | "사업 가이드" | "수학 도구" | "운영";
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: string[];
};

export type CommunityPost = {
  slug: string;
  title: string;
  excerpt: string;
  board: "질문답변" | "사례공유" | "공지";
  author: string;
  publishedAt: string;
  comments: number;
  likes: number;
  content: string[];
};

type AutoBlogMeta = {
  title: string;
  category: BlogPost["category"];
  audience: string;
  description: string;
  tags: string[];
};

const hourlyAutoBlogMeta: Record<string, AutoBlogMeta> = {
  "break-even": {
    title: "원가율·손익분기점 계산기",
    category: "사업 가이드",
    audience: "셀러, 자영업자, 소규모 사업 운영자",
    description: "판매가, 원가, 월 고정비를 기준으로 원가율과 손익분기 판매수량을 계산합니다.",
    tags: ["손익분기점", "원가율", "판매수익"]
  },
  "car-maintenance": {
    title: "자동차 유지비 계산기",
    category: "생활 가이드",
    audience: "차량 보유자, 구매 검토자",
    description: "주행거리, 연비, 유류비, 보험료, 세금, 주차비를 기준으로 월 자동차 유지비를 계산합니다.",
    tags: ["자동차유지비", "생활비", "월예산"]
  },
  "moving-cost": {
    title: "이사 비용 계산기",
    category: "생활 가이드",
    audience: "이사 예정자, 포장이사 비교 사용자",
    description: "집 크기, 거리, 엘리베이터 여부, 사다리차 여부를 기준으로 이사 비용을 추정합니다.",
    tags: ["이사비용", "포장이사", "견적비교"]
  },
  "mobile-plan": {
    title: "휴대폰 요금 계산기",
    category: "생활 가이드",
    audience: "요금제 변경 사용자, 통신비 절감 사용자",
    description: "기본요금, 데이터 옵션, 선택약정 할인, 가족결합을 반영해 월 통신비를 계산합니다.",
    tags: ["휴대폰요금", "통신비", "요금제"]
  },
  bmi: {
    title: "BMI 계산기",
    category: "생활 가이드",
    audience: "체중 관리 사용자, 건강 정보 확인 사용자",
    description: "키와 몸무게를 기준으로 BMI 지수와 비만도 구간을 계산합니다.",
    tags: ["BMI", "건강", "체중관리"]
  },
  "korean-age": {
    title: "만나이 계산기",
    category: "생활 가이드",
    audience: "연령 확인 사용자, 서류 작성 사용자",
    description: "생년월일과 기준일을 입력해 현재 만나이와 다음 생일까지 남은 기간을 계산합니다.",
    tags: ["만나이", "생년월일", "기준일"]
  },
  "date-diff": {
    title: "날짜 차이 계산기",
    category: "생활 가이드",
    audience: "일정 관리 사용자, 계약 기간 확인 사용자",
    description: "시작일과 종료일 기준으로 날짜 차이와 주·개월 환산값을 계산합니다.",
    tags: ["날짜계산", "기간계산", "일정관리"]
  },
  "unit-converter": {
    title: "단위변환 계산기",
    category: "생활 가이드",
    audience: "생활 계산 사용자, 부동산·쇼핑·해외 단위 확인 사용자",
    description: "길이, 무게, 면적 단위를 빠르게 변환합니다.",
    tags: ["단위변환", "생활계산", "면적"]
  },
  percent: {
    title: "퍼센트 계산기",
    category: "생활 가이드",
    audience: "쇼핑, 업무, 공부, 보고서 작성 사용자",
    description: "비율, 증가율, 감소율, 일부 값 계산을 한 번에 할 수 있는 퍼센트 계산기입니다.",
    tags: ["퍼센트", "비율", "증가율"]
  },
  "discount-rate": {
    title: "할인율 계산기",
    category: "생활 가이드",
    audience: "쇼핑 사용자, 판매자, 가격 비교 사용자",
    description: "정가와 판매가를 기준으로 할인금액과 할인율을 계산합니다.",
    tags: ["할인율", "쇼핑", "가격비교"]
  },
  gpa: {
    title: "학점 계산기",
    category: "생활 가이드",
    audience: "대학생, 성적 관리 사용자",
    description: "과목 학점과 성적을 기준으로 평균평점과 총 취득학점을 계산합니다.",
    tags: ["학점", "성적", "GPA"]
  },
  unemployment: {
    title: "실업급여 모의계산기",
    category: "노무 가이드",
    audience: "퇴사 예정자, 이직자",
    description: "평균임금, 연령, 고용보험 가입기간을 입력해 구직급여 1일액과 예상 총액을 계산합니다.",
    tags: ["실업급여", "고용보험", "퇴사"]
  },
  severance: {
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
  savings: {
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
  vat: {
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
  }
};

const hourlyAutoBlogCalculatorOrder = [
  "unemployment",
  "severance",
  "weekly-holiday",
  "hourly-wage",
  "annual-leave",
  "annual-leave-grant",
  "parental-leave",
  "net-salary",
  "military-discharge-date",
  "loan-interest",
  "loan-dsr",
  "loan-amortization",
  "real-estate-acquisition-tax",
  "jeonse-vs-monthly-rent",
  "card-installment",
  "exchange-rate",
  "savings",
  "lump-sum-deposit",
  "compound-interest",
  "pension-tax",
  "isa-tax",
  "youth-leap-account",
  "comprehensive-income-tax",
  "retirement-income-tax",
  "vat",
  "seller-profit",
  "break-even",
  "car-maintenance",
  "moving-cost",
  "mobile-plan",
  "bmi",
  "korean-age",
  "date-diff",
  "unit-converter",
  "percent",
  "discount-rate",
  "gpa"
];

const hourlyTemplateMeta = {
  guide: { suffix: "핵심 정리", focus: "기준 구조와 입력 흐름" },
  checklist: { suffix: "입력 전 체크리스트", focus: "계산 전에 확인할 항목" },
  mistakes: { suffix: "자주 틀리는 포인트", focus: "반복되는 입력 실수와 해석 오류" },
  comparison: { suffix: "비교할 때 봐야 할 기준", focus: "여러 조건을 비교하는 기준" },
  scenario: { suffix: "상황별 활용 방법", focus: "실제 상황별 계산 흐름" }
} as const;

const hourlyAutoBlogTemplateOrder = Object.keys(hourlyTemplateMeta) as (keyof typeof hourlyTemplateMeta)[];
const hourlyAutoBlogDateCodes = Array.from({ length: 26 }, (_, index) => `202609${String(index + 1).padStart(2, "0")}`);

function buildHourlyAutoBlogSlug(dateCode: string, hour: number) {
  const dayNumber = Number(dateCode.slice(-2));
  const calculatorSlug = hourlyAutoBlogCalculatorOrder[(dayNumber + hour) % hourlyAutoBlogCalculatorOrder.length];
  const templateKey = hourlyAutoBlogTemplateOrder[(dayNumber + hour) % hourlyAutoBlogTemplateOrder.length];
  const hourCode = String(hour).padStart(2, "0");

  return `${calculatorSlug}-${templateKey}-${dateCode}-${hourCode}-hourly`;
}

const hourlyAutoBlogSlugs = hourlyAutoBlogDateCodes.flatMap((dateCode) =>
  Array.from({ length: 24 }, (_, hour) => buildHourlyAutoBlogSlug(dateCode, hour))
);

function buildHourlyAutoBlogPost(slug: string): BlogPost {
  const match = slug.match(/^(.+)-(guide|checklist|mistakes|comparison|scenario)-(\d{8})-(\d{2})-hourly$/);
  const calculatorSlug = match?.[1] || "";
  const templateKey = (match?.[2] || "guide") as keyof typeof hourlyTemplateMeta;
  const dateCode = match?.[3] || "20260926";
  const meta = hourlyAutoBlogMeta[calculatorSlug] || hourlyAutoBlogMeta.percent;
  const template = hourlyTemplateMeta[templateKey];
  const publishedAt = `${dateCode.slice(0, 4)}-${dateCode.slice(4, 6)}-${dateCode.slice(6, 8)}`;
  const plainTitle = meta.title.replace(" 계산기", "");

  return {
    slug,
    title: `${plainTitle} ${template.suffix}`,
    excerpt: `${meta.title}를 쓰기 전에 ${template.focus}을 정리해 실제 판단에 필요한 숫자를 놓치지 않도록 돕습니다.`,
    category: meta.category,
    publishedAt,
    readTime: "5분",
    tags: meta.tags,
    content: [
      `${meta.title}는 ${meta.audience}가 빠르게 기준값을 확인할 때 유용한 도구입니다. ${meta.description}`,
      `계산 전에는 입력값의 기준을 먼저 맞춰야 합니다. 세전과 세후, 월 단위와 연 단위, 총액과 일부 금액이 섞이면 같은 계산기라도 결과 해석이 달라질 수 있습니다.`,
      `${template.focus}을 볼 때는 기준 시나리오 하나만 두지 말고 보수적인 경우와 여유 있는 경우를 함께 비교하는 편이 좋습니다. 작은 입력 차이가 월 비용이나 예상 금액에서는 크게 벌어질 수 있습니다.`,
      `계산 결과는 의사결정을 돕는 참고값입니다. 실제 계약, 신고, 구매, 급여 정산, 비용 집행 전에는 견적서, 명세서, 약정서, 공식 안내문처럼 원자료를 함께 확인해야 합니다.`,
      `계산의정석의 ${meta.title}는 복잡한 표를 보기 전에 대략적인 범위를 잡는 데 맞춰져 있습니다. 결과가 예상과 다르면 입력 단위, 기간, 포함 항목을 다시 점검해 보세요.`,
      `마지막으로 결과값 하나보다 항목별 구조를 보는 습관이 중요합니다. 어떤 항목이 결과를 크게 움직이는지 알면 절감, 협상, 계획 수정의 우선순위를 더 쉽게 정할 수 있습니다.`
    ]
  };
}

const hourlyAutoBlogPosts = hourlyAutoBlogSlugs.map(buildHourlyAutoBlogPost);

export const blogPosts: BlogPost[] = [
  ...hourlyAutoBlogPosts,
  {
    slug: "irp-tax-credit-strategy-2026",
    title: "IRP와 연금저축, 세액공제 한도를 어떻게 나눠 넣는 게 유리할까",
    excerpt: "총급여 구간과 납입 여력에 따라 IRP와 연금저축의 배분 전략을 실무적으로 정리했습니다.",
    category: "금융 가이드",
    publishedAt: "2026-08-20",
    readTime: "5분",
    tags: ["IRP", "연금저축", "세액공제"],
    content: [
      "연금계좌 절세는 단순히 한도만 채운다고 끝나지 않습니다. 총급여 구간, 기존 연금저축 납입액, 연말 현금흐름을 같이 봐야 실제 체감 효과가 달라집니다.",
      "보통은 연금저축을 먼저 채우고, 추가 납입 여력이 있으면 IRP로 확장하는 흐름이 단순합니다. 다만 회사 DC형 퇴직연금이나 다른 장기 저축과 함께 운영할 때는 현금 유동성이 더 중요할 수 있습니다.",
      "계산의정석의 연금 절세 계산기는 예상 공제액을 빠르게 확인하는 용도에 맞고, 실제 납입 결정 전에는 올해 총급여와 이미 납입한 금액을 기준으로 최종 점검하는 편이 안전합니다."
    ]
  },
  {
    slug: "weekly-holiday-pay-part-time-guide",
    title: "아르바이트 주휴수당, 실제로 어디까지 받을 수 있나",
    excerpt: "근무일수와 소정근로시간이 애매한 아르바이트 사례를 기준으로 주휴수당 판단 흐름을 정리했습니다.",
    category: "노무 가이드",
    publishedAt: "2026-08-20",
    readTime: "4분",
    tags: ["주휴수당", "아르바이트", "근로시간"],
    content: [
      "주휴수당은 주 15시간 이상이라는 한 줄 기준으로만 이해하면 놓치는 부분이 많습니다. 소정근로일 개근 여부와 주간 스케줄 변동도 같이 봐야 합니다.",
      "특히 아르바이트는 주별 스케줄이 달라지는 경우가 많아서, 계약서상 근로시간과 실제 출근기록이 다르면 체감 결과가 달라질 수 있습니다.",
      "계산기로 대략적인 주휴수당 규모를 확인한 뒤에는, 급여 산정 단위가 주 기준인지 월 기준인지와 근무표 변경 이력을 같이 확인하는 편이 실무적으로 맞습니다."
    ]
  },
  {
    slug: "unemployment-guide-2026",
    title: "2026 실업급여 계산 전에 먼저 확인해야 할 5가지",
    excerpt: "평균임금, 가입기간, 이직 사유처럼 계산 결과보다 먼저 봐야 할 기준을 정리했습니다.",
    category: "노무 가이드",
    publishedAt: "2026-08-18",
    readTime: "4분",
    tags: ["실업급여", "고용보험", "퇴사"],
    content: [
      "실업급여는 단순히 평균임금만 넣어서 끝나는 계산이 아닙니다. 이직 사유, 피보험 단위기간, 연령, 구직활동 인정 여부가 함께 작동합니다.",
      "실무에서는 사용자가 총액만 보다가 수급자격 요건을 놓치는 경우가 많습니다. 그래서 계산 전 체크리스트를 먼저 보는 흐름이 중요합니다.",
      "계산의정석의 실업급여 계산기는 상한액과 하한액을 반영하지만, 실제 지급 여부는 고용센터 심사와 최신 기준 적용일에 따라 달라질 수 있습니다."
    ]
  },
  {
    slug: "severance-common-mistakes-2026",
    title: "퇴직금 계산할 때 가장 자주 틀리는 4가지",
    excerpt: "평균임금, 계속근로기간, 상여 반영 방식처럼 퇴직금 계산에서 반복적으로 틀리는 지점을 정리했습니다.",
    category: "노무 가이드",
    publishedAt: "2026-08-19",
    readTime: "5분",
    tags: ["퇴직금", "평균임금", "상여금"],
    content: [
      "퇴직금 계산에서 가장 흔한 오해는 월급 한 달치를 그대로 기준으로 잡는 것입니다. 실제로는 평균임금과 계속근로기간이 함께 작동합니다.",
      "상여금이나 각종 수당이 매달 일정하지 않으면 포함 여부가 더 복잡해집니다. 그래서 급여명세서를 몇 달치만 보지 말고 산정기간 전체 구조를 봐야 합니다.",
      "계산기로 추정한 뒤에는 입사일·퇴사일, 무급휴직 여부, 정기 상여 지급 규칙을 다시 점검해야 실제 지급액과 오차를 줄일 수 있습니다."
    ]
  },
  {
    slug: "dsr-ltv-practical-difference",
    title: "DSR과 LTV, 실제 대출 한도에서는 무엇이 더 먼저 막을까",
    excerpt: "같은 집값과 소득이어도 어떤 규제가 먼저 한도를 막는지 실전 관점에서 설명합니다.",
    category: "금융 가이드",
    publishedAt: "2026-08-15",
    readTime: "5분",
    tags: ["DSR", "LTV", "주택담보대출"],
    content: [
      "LTV는 담보가치 기준이고, DSR은 상환능력 기준입니다. 둘은 같은 듯 보이지만 실제로는 완전히 다른 제약입니다.",
      "소득이 충분하지 않으면 집값이 낮아도 DSR이 먼저 막습니다. 반대로 소득은 충분한데 담보 인정비율이 낮으면 LTV가 먼저 한도를 제한합니다.",
      "상담 전에는 희망 대출금만 보지 말고, 월 상환액과 연 상환액이 소득 대비 어떤 압박을 만드는지 같이 보는 편이 맞습니다."
    ]
  },
  {
    slug: "net-salary-payslip-checklist",
    title: "실수령액 계산기와 급여명세서를 같이 볼 때 체크할 항목",
    excerpt: "4대 보험, 소득세, 비과세 항목까지 급여명세서 비교에서 꼭 봐야 할 항목을 묶어 정리했습니다.",
    category: "노무 가이드",
    publishedAt: "2026-08-16",
    readTime: "4분",
    tags: ["실수령액", "급여명세서", "4대보험"],
    content: [
      "실수령액 계산기는 빠르게 감을 잡기 좋지만, 실제 급여명세서와 1원 단위까지 맞추는 도구는 아닙니다. 반영 항목 범위가 다르기 때문입니다.",
      "소득세, 지방소득세, 비과세 식대, 부양가족 수, 국민연금 상한 적용 여부처럼 작은 차이가 체감 실수령액을 크게 바꿀 수 있습니다.",
      "비교할 때는 총지급액과 공제총액만 보지 말고, 과세 대상 급여와 비과세 항목이 어떻게 분리됐는지까지 봐야 원인을 정확히 찾을 수 있습니다."
    ]
  },
  {
    slug: "calcrule-content-hub-launch",
    title: "계산의정석 콘텐츠 허브 오픈: 계산기에서 정보 플랫폼으로 확장합니다",
    excerpt: "계산 결과만 제공하던 구조에서, 가이드와 커뮤니티까지 연결하는 이유를 정리했습니다.",
    category: "운영",
    publishedAt: "2026-08-20",
    readTime: "3분",
    tags: ["업데이트", "블로그", "커뮤니티"],
    content: [
      "계산기는 빠른 판단에 유용하지만, 실제 의사결정에는 설명과 사례가 함께 필요합니다. 그래서 계산의정석은 콘텐츠 허브 구조를 추가했습니다.",
      "블로그에서는 제도 가이드와 비교 글을 제공하고, 커뮤니티에서는 질문과 사례를 축적하는 방향으로 확장합니다.",
      "다음 단계에서는 계산기 결과와 관련 글을 더 촘촘하게 연결해 사용자가 계산에서 해석까지 바로 이동할 수 있게 만들 예정입니다."
    ]
  },
  {
    slug: "year-end-tax-refund-checklist-2026",
    title: "연말정산 환급액을 계산하기 전에 정리해야 할 항목",
    excerpt: "총급여, 결정세액, 기납부세액, 소득공제와 세액공제를 분리해 환급 가능성을 점검하는 방법입니다.",
    category: "세금 가이드",
    publishedAt: "2026-09-22",
    readTime: "7분",
    tags: ["연말정산", "환급액", "세액공제"],
    content: [
      "연말정산 환급액은 공제액을 많이 입력한다고 자동으로 커지는 구조가 아닙니다. 이미 낸 세금인 기납부세액과 최종적으로 부담해야 할 결정세액의 차이가 핵심입니다.",
      "먼저 총급여와 비과세 항목을 분리해야 합니다. 같은 연봉이라도 비과세 식대, 자가운전보조금, 출산·보육수당처럼 과세표준에 들어가지 않는 항목이 있으면 계산 출발점이 달라집니다.",
      "소득공제와 세액공제도 역할이 다릅니다. 소득공제는 세금을 매기는 기준 금액을 줄이고, 세액공제는 계산된 세금에서 직접 차감됩니다. 카드 사용액, 보험료, 의료비, 교육비, 기부금은 적용 방식이 서로 다릅니다.",
      "환급 여부를 빠르게 보려면 지난해 원천징수영수증과 올해 급여명세서 누계를 나란히 놓고 비교하는 것이 좋습니다. 총급여가 늘었는데 공제 구조가 그대로라면 환급액이 줄거나 추가 납부가 생길 수 있습니다.",
      "계산의정석 연말정산 환급액 계산기는 예상 결정세액과 기납부세액 차이를 중심으로 빠른 시뮬레이션을 제공합니다. 다만 실제 신고에서는 회사 제출 자료, 국세청 간소화 자료, 공제 한도별 세부 요건을 함께 확인해야 합니다.",
      "특히 맞벌이 부부는 부양가족, 의료비, 신용카드 공제 배분이 결과에 영향을 줍니다. 한 사람에게 몰아넣는 방식이 항상 유리하지 않으므로, 큰 공제 항목은 배우자별로 나눠 계산해 보는 편이 안전합니다."
    ]
  },
  {
    slug: "earned-income-tax-vs-net-salary",
    title: "근로소득세와 실수령액이 다르게 느껴지는 이유",
    excerpt: "간이세액, 4대 보험, 지방소득세, 비과세 항목이 월급 실수령액에 미치는 영향을 정리했습니다.",
    category: "세금 가이드",
    publishedAt: "2026-09-21",
    readTime: "6분",
    tags: ["근로소득세", "실수령액", "급여명세서"],
    content: [
      "월급에서 빠지는 세금은 근로소득세 하나로 끝나지 않습니다. 지방소득세가 함께 붙고, 국민연금·건강보험·고용보험 같은 사회보험료도 공제됩니다. 그래서 근로소득세만 계산한 값과 실수령액 차이는 자연스럽게 벌어집니다.",
      "근로소득세는 매월 확정세액을 내는 방식이라기보다 간이세액표 기준으로 미리 떼는 성격이 강합니다. 부양가족 수, 자녀 수, 월 급여 수준에 따라 원천징수액이 달라지고, 연말정산 때 실제 부담세액과 맞춰집니다.",
      "비과세 항목도 중요합니다. 식대처럼 비과세로 처리되는 금액은 과세 대상 급여에서 빠질 수 있어 같은 총지급액이라도 세금과 보험료 산정 기준이 달라집니다.",
      "급여명세서를 볼 때는 총지급액, 과세급여, 비과세급여, 공제합계, 차인지급액을 순서대로 확인하면 원인을 찾기 쉽습니다. 계산기 결과와 다르다면 대부분 입력 기준이 총지급액인지 과세급여인지에서 차이가 납니다.",
      "계산의정석 근로소득세 계산기는 월 급여 기준의 세금 부담을 빠르게 확인하는 도구입니다. 실수령액까지 보려면 4대 보험과 비과세 항목을 함께 확인하고, 연말에는 연말정산 계산기로 최종 차이를 점검하는 흐름이 좋습니다.",
      "성과급, 상여금, 수당이 있는 달은 평소 월급과 다르게 보일 수 있습니다. 일시적으로 세금이 많이 빠졌다고 해서 연간 세금이 그대로 확정되는 것은 아니므로, 누적 기준으로 보는 습관이 필요합니다."
    ]
  },
  {
    slug: "inheritance-tax-basic-deductions",
    title: "상속세 계산에서 공제 항목을 먼저 봐야 하는 이유",
    excerpt: "상속재산가액보다 먼저 점검해야 할 채무, 장례비, 배우자공제, 일괄공제의 계산 흐름입니다.",
    category: "세금 가이드",
    publishedAt: "2026-09-20",
    readTime: "7분",
    tags: ["상속세", "상속공제", "세금"],
    content: [
      "상속세는 상속재산 전체에 세율을 바로 곱하는 방식이 아닙니다. 재산가액에서 채무, 장례비, 공과금, 각종 공제를 차감한 뒤 과세표준을 계산합니다.",
      "가장 먼저 해야 할 일은 재산과 부채를 나누어 목록화하는 것입니다. 부동산, 예금, 보험금, 주식, 차량 같은 자산과 함께 금융채무, 임대보증금, 미납 세금 등을 따로 정리해야 합니다.",
      "상속공제는 가족관계와 상속 구조에 따라 달라집니다. 배우자공제, 일괄공제, 기초공제, 인적공제 등은 이름은 익숙해도 적용 요건과 한도가 다르기 때문에 단순 비교가 어렵습니다.",
      "상속세 계산기에서 예상세액이 나오더라도 실제 신고에서는 재산 평가일, 부동산 평가 방식, 사전증여 여부가 큰 영향을 줍니다. 특히 사전증여가 있으면 상속재산에 합산되는 기간과 대상 여부를 확인해야 합니다.",
      "계산의정석 상속세 계산기는 대략적인 과세표준과 예상세액을 이해하기 위한 출발점입니다. 결과가 0원으로 나오더라도 신고 의무나 자료 보관 필요성이 사라지는 것은 아니므로 상황별 확인이 필요합니다.",
      "상속은 세금뿐 아니라 분할 협의, 등기, 금융기관 절차가 함께 이어집니다. 계산 결과는 가족 간 의사결정을 준비하는 참고값으로 활용하고, 금액이 크거나 이해관계가 복잡하면 전문가 상담을 병행하는 편이 안전합니다."
    ]
  },
  {
    slug: "distance-calculator-how-to-use",
    title: "현재 위치에서 목적지까지 거리 계산을 정확하게 쓰는 방법",
    excerpt: "브라우저 위치 권한, 검색어 입력, 직선거리와 실제 이동거리 차이를 이해하는 생활 가이드입니다.",
    category: "생활 가이드",
    publishedAt: "2026-09-19",
    readTime: "5분",
    tags: ["거리계산기", "현재위치", "지도"],
    content: [
      "거리 계산은 생각보다 기준점이 중요합니다. 현재 위치를 브라우저 권한으로 가져오는지, 직접 주소를 입력하는지에 따라 출발점 좌표가 달라질 수 있습니다.",
      "현재 위치 권한을 허용하면 기기와 브라우저가 제공하는 좌표를 기준으로 계산합니다. 실내, 지하, Wi-Fi 환경에서는 위치 오차가 커질 수 있으므로 결과가 이상하면 출발지를 직접 입력해 보는 것이 좋습니다.",
      "직선거리는 두 좌표 사이를 곧게 이은 거리입니다. 실제 자동차 이동거리나 도보 경로와는 다릅니다. 산, 강, 도로망, 일방통행, 대중교통 경로가 반영되지 않기 때문입니다.",
      "계산의정석 거리계산기는 현재 위치에서 찾는 위치까지의 대략적인 거리감을 빠르게 확인하는 용도에 맞습니다. 약속 장소, 생활권, 배송 가능 범위, 출장 반경을 미리 보는 데 유용합니다.",
      "정확한 이동시간이나 경로 안내가 필요하다면 지도 앱의 길찾기 기능을 함께 사용해야 합니다. 거리계산기는 의사결정 초기에 후보지를 좁히는 도구로 쓰는 것이 가장 실용적입니다."
    ]
  },
  {
    slug: "math-notes-classroom-guide",
    title: "수학 노트 도구로 식, 그래프, 표를 함께 정리하는 법",
    excerpt: "Desmos 노트북처럼 여러 줄의 계산과 설명을 한 화면에서 관리하는 수학 학습 흐름입니다.",
    category: "수학 도구",
    publishedAt: "2026-09-18",
    readTime: "6분",
    tags: ["수학노트", "그래프", "학습도구"],
    content: [
      "수학 문제를 풀 때 식만 따로 쓰고 그래프를 따로 그리면 풀이 흐름이 끊깁니다. 수학 노트 도구는 설명, 수식, 표, 그래프를 한 화면에 쌓아가며 사고 과정을 보존하는 데 목적이 있습니다.",
      "예를 들어 일차함수 문제를 풀 때는 첫 줄에 조건을 글로 정리하고, 다음 줄에 식을 입력한 뒤, 그래프 줄에서 기울기와 절편을 확인할 수 있습니다. 표를 추가하면 x값 변화에 따른 y값도 함께 비교할 수 있습니다.",
      "그래프는 정답 확인용만이 아니라 가설을 세우는 도구입니다. 식을 조금 바꾸었을 때 기울기, 교점, 대칭성이 어떻게 변하는지 바로 보면 개념이 훨씬 선명해집니다.",
      "계산의정석 수학 노트는 여러 행을 이동, 복제, 삭제하면서 풀이 과정을 정리할 수 있게 구성했습니다. 예시 노트를 불러와 수업 자료나 개인 학습 템플릿으로 바꿔 쓰는 것도 가능합니다.",
      "이미지 행은 손글씨 문제, 칠판 사진, 참고 도표를 함께 붙일 때 유용합니다. 단순 계산기보다 노트에 가까운 구조라서 풀이 기록을 남기고 다시 검토하기 좋습니다.",
      "수업이나 과외에서는 한 문제의 풀이를 완성본으로만 보여주기보다, 조건 정리, 식 세우기, 그래프 확인, 결론 작성 순서로 나누어 작성해 보세요. 학생이 어디에서 막히는지 훨씬 쉽게 확인할 수 있습니다."
    ]
  },
  {
    slug: "loan-prepayment-before-refinance",
    title: "대환대출 전에 중도상환수수료를 먼저 계산해야 하는 이유",
    excerpt: "낮은 금리만 보고 갈아타기 전에 남은 기간, 수수료, 부대비용을 함께 비교하는 방법입니다.",
    category: "금융 가이드",
    publishedAt: "2026-09-17",
    readTime: "6분",
    tags: ["대환대출", "중도상환수수료", "대출비교"],
    content: [
      "대환대출은 금리가 낮아졌다는 이유만으로 바로 유리해지지 않습니다. 기존 대출을 갚을 때 발생하는 중도상환수수료와 새 대출의 부대비용을 함께 계산해야 실제 절감액이 보입니다.",
      "먼저 기존 대출의 잔액, 남은 기간, 현재 금리, 중도상환수수료율을 정리합니다. 수수료 면제 기간이 가까워졌다면 조금 기다리는 선택이 더 유리할 수도 있습니다.",
      "새 대출은 금리뿐 아니라 상환방식도 비교해야 합니다. 원리금균등, 원금균등, 만기일시 방식은 월 부담과 총이자가 다르게 움직입니다. 월 납입액이 줄어도 총비용이 늘어나는 경우가 있습니다.",
      "계산의정석 중도상환수수료 계산기와 대환대출 계산기를 함께 쓰면, 갈아타기 비용과 이자 절감액을 나눠 볼 수 있습니다. 두 값을 같은 기간 기준으로 비교해야 판단이 쉬워집니다.",
      "주택담보대출은 근저당 설정비, 인지세, 보증료, 감정 관련 비용이 붙을 수 있습니다. 신용대출도 플랫폼 수수료나 우대금리 조건 변경을 확인해야 합니다.",
      "실무적으로는 최소 두 가지 시나리오를 놓고 보는 것이 좋습니다. 지금 바로 갈아타는 경우와 수수료가 줄어드는 시점까지 기다리는 경우를 비교하면, 낮은 금리라는 한 숫자에만 끌려가는 실수를 줄일 수 있습니다."
    ]
  },
  {
    slug: "property-tax-holding-cost-guide",
    title: "재산세와 보유비용을 함께 봐야 하는 부동산 계산법",
    excerpt: "재산세, 종부세 가능성, 관리비, 대출이자를 묶어 보유 부담을 현실적으로 점검합니다.",
    category: "세금 가이드",
    publishedAt: "2026-09-16",
    readTime: "6분",
    tags: ["재산세", "부동산", "보유비용"],
    content: [
      "부동산을 보유할 때 드는 비용은 대출이자만이 아닙니다. 재산세, 지방교육세, 도시지역분, 관리비, 수선비, 보험료까지 합치면 매월 체감 부담이 달라집니다.",
      "재산세는 공시가격과 과세표준, 세율 구조를 기준으로 계산됩니다. 실제 거래가격과 공시가격이 다르기 때문에 매매가만 보고 세금을 추정하면 오차가 커질 수 있습니다.",
      "보유세 부담은 주택 수, 공시가격 변동, 세법 변경에 따라 달라질 수 있습니다. 특히 고가 주택이나 다주택 상황에서는 종합부동산세 가능성도 함께 점검해야 합니다.",
      "계산의정석 재산세 계산기는 보유세 규모를 빠르게 가늠하는 용도입니다. 대출이자 계산기, 원리금 상환 계산기와 함께 보면 매월 현금흐름에 가까운 숫자를 만들 수 있습니다.",
      "실거주 목적이라면 세금과 관리비를 월 단위로 환산해 소득 대비 부담률을 보세요. 투자 목적이라면 임대수입, 공실 가능성, 수선비까지 반영해야 실제 수익률이 보입니다.",
      "부동산 계산은 하나의 결과값보다 시나리오 비교가 중요합니다. 금리 0.5%p 상승, 공시가격 상승, 임대료 하락 같은 조건을 나눠 입력해 보면 감당 가능한 범위를 더 현실적으로 판단할 수 있습니다."
    ]
  },
  {
    slug: "stock-calculator-before-trading",
    title: "주식 매매 전에 수익률, 평단가, PER/PBR을 함께 봐야 하는 이유",
    excerpt: "주식 수익률 계산, 물타기 평균단가, PER/PBR 가치평가를 매매 전 체크리스트로 활용하는 방법입니다.",
    category: "금융 가이드",
    publishedAt: "2026-09-24",
    readTime: "7분",
    tags: ["주식", "수익률", "평단가", "PER", "PBR"],
    content: [
      "주식 매매 판단에서 가장 먼저 보이는 숫자는 수익률입니다. 하지만 수익률만 보면 실제 계좌에 남는 금액을 놓치기 쉽습니다. 매수 수수료, 매도 수수료, 거래세가 반영되면 같은 매도가라도 순손익은 달라질 수 있습니다.",
      "단기 매매를 자주 한다면 비용의 영향은 더 커집니다. 한 번의 거래에서는 작아 보이는 수수료와 세금도 여러 번 반복되면 수익률을 갉아먹습니다. 그래서 매수 전 목표 매도가를 정할 때는 세후·비용 반영 수익률을 같이 계산하는 편이 좋습니다.",
      "물타기 계산은 평균단가를 낮추는 데 도움이 되지만, 언제나 좋은 선택은 아닙니다. 추가 매수 후 평균단가가 얼마나 내려가는지와 동시에 총 투자금이 얼마나 늘어나는지, 종목 비중이 감당 가능한 수준인지 확인해야 합니다.",
      "PER과 PBR은 종목의 가격 수준을 빠르게 비교하는 도구입니다. PER은 이익 대비 주가, PBR은 순자산 대비 주가를 보는 지표입니다. 다만 업종마다 적정 배수가 다르고, 성장률과 이익 안정성이 다르면 같은 배수도 다르게 해석해야 합니다.",
      "계산의정석 주식 수익률 계산기는 매수·매도 가격과 비용을 반영해 실제 손익을 보여주고, 주식 물타기 계산기는 추가 매수 후 평균단가와 총 투자금을 확인하게 해줍니다. PER/PBR 계산기는 현재 배수와 사용자가 입력한 비교 배수 기준의 참고 적정가를 보여줍니다.",
      "실전에서는 세 계산기를 함께 쓰는 흐름이 좋습니다. 먼저 가치평가로 관심 가격대를 잡고, 매수 후에는 평균단가와 비중을 관리하며, 매도 전에는 비용 반영 수익률을 확인하는 방식입니다.",
      "이 계산 결과는 투자 권유가 아니라 입력값에 따른 단순 계산입니다. 실적 발표, 금리, 환율, 산업 사이클, 기업별 리스크는 계산기 밖에서 따로 검토해야 합니다."
    ]
  }
];

export const communityPosts: CommunityPost[] = [
  {
    slug: "severance-includes-bonus",
    title: "퇴직금 계산에 상여금이 포함되는지 헷갈릴 때",
    excerpt: "정기 상여와 비정기 상여의 처리 차이를 실제 질문 형태로 정리한 글입니다.",
    board: "질문답변",
    author: "운영팀",
    publishedAt: "2026-08-19",
    comments: 12,
    likes: 18,
    content: [
      "퇴직금 계산에서 상여금 포함 여부는 지급 주기와 정기성, 평균임금 산정기간 반영 방식에 따라 달라집니다.",
      "사용자 입장에서는 상여금이 '받은 돈'이기 때문에 무조건 포함된다고 보기 쉽지만, 실제 판단은 그보다 더 세부적입니다.",
      "복잡한 임금구조라면 단순 월급 기준 계산기 결과만 보지 말고, 임금명세서와 지급 규정을 같이 확인하는 편이 안전합니다."
    ]
  },
  {
    slug: "net-salary-tax-gap-case",
    title: "실수령액 계산기 결과와 급여명세서가 다른 사례",
    excerpt: "4대 보험만 반영한 계산과 실제 급여명세서가 달라지는 대표 원인을 정리했습니다.",
    board: "사례공유",
    author: "관리자",
    publishedAt: "2026-08-17",
    comments: 9,
    likes: 14,
    content: [
      "가장 흔한 원인은 소득세와 지방소득세입니다. 4대 보험만 계산하면 실제 명세서보다 실수령액이 높게 보입니다.",
      "비과세 식대, 연장근로수당, 부양가족 수에 따른 세액 차이도 결과 오차를 크게 만듭니다.",
      "따라서 급여명세서 비교용 기능을 확장하려면 세금과 비과세 항목 구조를 함께 반영해야 합니다."
    ]
  },
  {
    slug: "content-community-open",
    title: "블로그·커뮤니티 섹션을 새로 열었습니다",
    excerpt: "운영 공지와 함께 앞으로 어떤 글과 사례를 쌓아갈지 안내합니다.",
    board: "공지",
    author: "계산의정석",
    publishedAt: "2026-08-20",
    comments: 3,
    likes: 21,
    content: [
      "계산의정석은 계산 결과에 더해 설명, 사례, 질문을 연결하는 구조로 확장하고 있습니다.",
      "초기에는 운영팀이 정리한 글 중심으로 시작하고, 이후에는 자주 묻는 질문과 사례를 더 체계적으로 분류할 예정입니다.",
      "콘텐츠 허브가 자리 잡으면 계산기별 관련 글 추천도 함께 붙일 계획입니다."
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getCommunityPost(slug: string) {
  return communityPosts.find((post) => post.slug === slug);
}

export function getLatestBlogPosts(limit?: number) {
  const sorted = [...blogPosts].sort((left, right) => {
    const timeDiff = new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    if (timeDiff !== 0) return timeDiff;
    return right.slug.localeCompare(left.slug);
  });

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
