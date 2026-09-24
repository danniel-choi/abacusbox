const CALCULATOR_BLOG_META = {
  unemployment: { title: "실업급여 모의계산기", category: "노무", audience: "퇴사 예정자, 이직자", description: "평균임금, 연령, 고용보험 가입기간을 입력해 구직급여 1일액과 예상 총액을 계산합니다.", family: "labor-benefit" },
  severance: { title: "퇴직금 계산기", category: "노무", audience: "퇴직 예정 근로자, 인사 담당자", description: "최근 3개월 임금과 계속근로기간으로 법정 퇴직금 예상액을 계산합니다.", family: "labor-benefit" },
  "weekly-holiday": { title: "주휴수당 계산기", category: "노무", audience: "아르바이트, 단시간 근로자", description: "주 근무시간과 시급을 입력해 예상 주휴수당과 주급을 계산합니다.", family: "labor-benefit" },
  "hourly-wage": { title: "시급 계산기", category: "노무", audience: "아르바이트, 단시간 근로자, 급여 비교 사용자", description: "시급을 기준으로 일급, 주급, 월급, 연봉과 수당 포함 예상 급여를 계산합니다.", family: "payroll" },
  "annual-leave": { title: "연차수당 계산기", category: "노무", audience: "퇴직 예정자, 인사 담당자, 급여 확인 사용자", description: "통상임금과 1일 근로시간, 미사용 연차일수를 기준으로 연차수당 예상액을 계산합니다.", family: "payroll" },
  "annual-leave-grant": { title: "연차 발생일수 계산기", category: "노무", audience: "근로자, 인사 담당자, 휴가 정산 사용자", description: "근속연수, 출근율, 개근 개월 수를 기준으로 법정 연차 발생일수를 계산합니다.", family: "payroll" },
  "parental-leave": { title: "육아휴직 급여 계산기", category: "노무", audience: "육아휴직 예정자, 인사 담당자", description: "월 통상임금과 육아휴직 사용 개월 수를 기준으로 육아휴직 급여 예상액을 계산합니다.", family: "labor-benefit" },
  "net-salary": { title: "4대 보험 실수령액 계산기", category: "노무", audience: "직장인, 급여 담당자", description: "월 급여에서 국민연금, 건강보험, 장기요양, 고용보험 근로자 부담분을 계산합니다.", family: "payroll" },
  "military-discharge-date": { title: "군 전역일 계산기", category: "생활", audience: "입대 예정자, 군 복무자, 가족", description: "입대일과 복무 개월 수를 기준으로 예상 전역일을 계산합니다.", family: "date-tool" },
  "loan-interest": { title: "대출 이자 계산기", category: "금융", audience: "대출 검토자, 주담대·신용대출 사용자", description: "대출금액, 금리, 기간, 상환방식에 따라 월 상환액과 총 이자를 계산합니다.", family: "loan" },
  "loan-dsr": { title: "대출 DSR/LTV 계산기", category: "금융", audience: "주택 구매 예정자, 대출 상담 전 사용자", description: "연소득, 주택가격, 금리, 만기로 대출 가능성과 원리금 균등상환액을 시뮬레이션합니다.", family: "loan" },
  "loan-amortization": { title: "대출 상환 스케줄 계산기", category: "금융", audience: "대출 실행 전 사용자, 상환 계획 검토 사용자", description: "대출금액, 금리, 기간을 기준으로 월 상환액과 총 이자, 초반·후반 상환 구조를 계산합니다.", family: "loan" },
  "real-estate-acquisition-tax": { title: "부동산 취득세 계산기", category: "부동산", audience: "주택 매수 예정자, 부동산 비용 확인 사용자", description: "주택 취득가액을 기준으로 취득세와 지방교육세를 계산합니다.", family: "housing-cost" },
  "jeonse-vs-monthly-rent": { title: "전세 vs 월세 비교 계산기", category: "부동산", audience: "이사 예정자, 임대차 비교 사용자", description: "전세보증금과 월세 조건을 이자 기회비용 기준으로 비교합니다.", family: "housing-cost" },
  "card-installment": { title: "카드 할부 계산기", category: "금융", audience: "고액 결제 사용자, 카드 비용 비교 사용자", description: "결제금액, 개월 수, 할부 수수료율을 기준으로 월 납부액과 총 수수료를 계산합니다.", family: "consumer-cost" },
  "exchange-rate": { title: "환율 계산기", category: "금융", audience: "해외결제 사용자, 여행자, 해외구매 사용자", description: "환율과 금액을 입력해 원화와 외화 환산 금액을 계산합니다.", family: "consumer-cost" },
  savings: { title: "예금·적금 실수령액 계산기", category: "금융", audience: "저축 계획 사용자, 금융상품 비교 사용자", description: "납입액, 기간, 금리, 과세 유형을 입력해 만기 원리금과 세후 이자를 계산합니다.", family: "savings" },
  "lump-sum-deposit": { title: "예금 단리 계산기", category: "금융", audience: "예금 가입 사용자, 자금 운용 비교 사용자", description: "목돈 예치금, 기간, 금리, 과세 유형을 기준으로 만기 원리금과 세후 이자를 계산합니다.", family: "savings" },
  "compound-interest": { title: "복리 투자 수익 계산기", category: "금융", audience: "장기 투자자, 적립식 투자 사용자", description: "초기 투자금, 월 추가 투자금, 수익률, 투자 기간을 기준으로 복리 수익을 계산합니다.", family: "investment" },
  "pension-tax": { title: "IRP·연금저축 절세액 계산기", category: "절세", audience: "직장인, 연말정산 준비 사용자", description: "연금계좌 납입액과 총급여 구간에 따라 세액공제 예상액을 계산합니다.", family: "tax-saving" },
  "isa-tax": { title: "ISA 절세 계산기", category: "절세", audience: "투자자, 절세 상품 비교 사용자", description: "ISA 계좌 이익과 소득구간에 따라 비과세 한도와 분리과세 효과를 계산합니다.", family: "tax-saving" },
  "youth-leap-account": { title: "청년도약계좌 계산기", category: "정책금융", audience: "기존 청년도약계좌 가입자, 정책상품 비교 사용자", description: "월 납입액과 소득구간을 기준으로 정부기여금과 만기 누적 납입액을 계산합니다.", family: "policy-finance" },
  "comprehensive-income-tax": { title: "종합소득세 계산기", category: "세금", audience: "프리랜서, 사업자, 종합소득세 신고 전 사용자", description: "과세표준을 기준으로 종합소득세 산출세액과 지방소득세를 계산합니다.", family: "tax-core" },
  "retirement-income-tax": { title: "퇴직소득세 계산기", category: "세금", audience: "퇴직 예정자, 인사 담당자", description: "퇴직급여액과 근속연수를 기준으로 퇴직소득세 산출세액을 계산합니다.", family: "tax-core" },
  vat: { title: "부가세 계산기", category: "세금", audience: "사업자, 프리랜서, 견적서 작성 사용자", description: "공급가액 또는 합계금액을 기준으로 부가세와 총액을 계산합니다.", family: "business" },
  "seller-profit": { title: "판매자 수익 계산기", category: "사업", audience: "온라인 셀러, 자사몰 운영자, 마켓 판매자", description: "판매가, 원가, 수수료율, 광고비, 배송비를 기준으로 판매 수익과 마진율을 계산합니다.", family: "business" },
  "break-even": { title: "원가율·손익분기점 계산기", category: "사업", audience: "셀러, 자영업자, 소규모 사업 운영자", description: "판매가, 원가, 월 고정비를 기준으로 원가율과 손익분기 판매수량을 계산합니다.", family: "business" },
  "car-maintenance": { title: "자동차 유지비 계산기", category: "생활비", audience: "차량 보유자, 구매 검토자", description: "주행거리, 연비, 유류비, 보험료, 세금, 주차비를 기준으로 월 자동차 유지비를 계산합니다.", family: "living-cost" },
  "moving-cost": { title: "이사 비용 계산기", category: "생활비", audience: "이사 예정자, 포장이사 비교 사용자", description: "집 크기, 거리, 엘리베이터 여부, 사다리차 여부를 기준으로 이사 비용을 추정합니다.", family: "living-cost" },
  "mobile-plan": { title: "휴대폰 요금 계산기", category: "생활비", audience: "요금제 변경 사용자, 통신비 절감 사용자", description: "기본요금, 데이터 옵션, 선택약정 할인, 가족결합을 반영해 월 통신비를 계산합니다.", family: "living-cost" },
  bmi: { title: "BMI 계산기", category: "건강", audience: "체중 관리 사용자, 건강 정보 확인 사용자", description: "키와 몸무게를 기준으로 BMI 지수와 비만도 구간을 계산합니다.", family: "life-metric" },
  "korean-age": { title: "만나이 계산기", category: "생활", audience: "연령 확인 사용자, 서류 작성 사용자", description: "생년월일과 기준일을 입력해 현재 만나이와 다음 생일까지 남은 기간을 계산합니다.", family: "date-tool" },
  "date-diff": { title: "날짜 차이 계산기", category: "생활", audience: "일정 관리 사용자, 계약 기간 확인 사용자", description: "시작일과 종료일 기준으로 날짜 차이와 주·개월 환산값을 계산합니다.", family: "date-tool" },
  "unit-converter": { title: "단위변환 계산기", category: "생활", audience: "생활 계산 사용자, 부동산·쇼핑·해외 단위 확인 사용자", description: "길이, 무게, 면적 단위를 빠르게 변환합니다.", family: "utility" },
  percent: { title: "퍼센트 계산기", category: "생활", audience: "쇼핑, 업무, 공부, 보고서 작성 사용자", description: "비율, 증가율, 감소율, 일부 값 계산을 한 번에 할 수 있는 퍼센트 계산기입니다.", family: "utility" },
  "discount-rate": { title: "할인율 계산기", category: "생활", audience: "쇼핑 사용자, 판매자, 가격 비교 사용자", description: "정가와 판매가를 기준으로 할인금액과 할인율을 계산합니다.", family: "consumer-cost" },
  gpa: { title: "학점 계산기", category: "학업", audience: "대학생, 성적 관리 사용자", description: "과목 학점과 성적을 기준으로 평균평점과 총 취득학점을 계산합니다.", family: "study" }
};

const FAMILY_PROFILES = {
  "labor-benefit": {
    keywords: ["수급 요건", "기간 산정", "인정 기준"],
    checkpoints: ["대상 요건을 먼저 확인합니다.", "기간과 기준 시점이 맞는지 봅니다.", "기관 심사 단계가 따로 있는지 확인합니다."],
    documents: ["근로계약서", "급여명세서", "퇴직 관련 서류"],
    faqs: ["요건을 충족하지 않으면 계산 결과가 있어도 실제 적용이 제한될 수 있습니다.", "지급 기간과 금액은 기준 연도 변경에 따라 달라질 수 있습니다."],
    closing: "노무 급여성 항목은 계산식보다 자격 요건과 산정 기간을 먼저 맞추는 것이 중요합니다."
  },
  payroll: {
    keywords: ["통상임금", "평균임금", "공제 구조"],
    checkpoints: ["입력 급여가 세전인지 세후인지 구분합니다.", "통상임금과 평균임금을 혼동하지 않습니다.", "수당 포함 범위를 먼저 정리합니다."],
    documents: ["급여명세서", "취업규칙", "근태 기록"],
    faqs: ["수당 포함 범위가 바뀌면 결과가 크게 달라질 수 있습니다.", "정산 기준일과 지급 기준일이 다르면 실제 금액과 차이가 생길 수 있습니다."],
    closing: "급여 계산 주제는 같은 월급이라도 포함 항목에 따라 결과가 달라지므로 입력 정의를 먼저 맞춰야 합니다."
  },
  loan: {
    keywords: ["금리", "만기", "상환 방식"],
    checkpoints: ["고정금리와 변동금리를 구분합니다.", "원리금균등과 원금균등 차이를 먼저 봅니다.", "기존 부채가 새 한도에 미치는 영향을 확인합니다."],
    documents: ["대출 약정서", "상품 설명서", "상환 스케줄표"],
    faqs: ["같은 금리라도 상환 방식에 따라 총이자가 달라집니다.", "은행 내부 심사 기준은 계산 결과보다 더 보수적일 수 있습니다."],
    closing: "대출 계산은 월 납부액보다 전체 상환 구조와 기존 부채 반영 여부를 같이 보는 것이 안전합니다."
  },
  "housing-cost": {
    keywords: ["취득 부대비용", "거주비 비교", "기회비용"],
    checkpoints: ["일회성 비용과 월 고정비를 분리합니다.", "보증금 묶임 비용을 같이 계산합니다.", "이사·취득 시점의 세율과 부대비를 따로 확인합니다."],
    documents: ["매매계약서", "임대차 조건표", "세율 안내 자료"],
    faqs: ["세율 구간과 조건에 따라 실제 비용이 달라질 수 있습니다.", "주거비는 월세만이 아니라 보증금 기회비용까지 같이 봐야 합니다."],
    closing: "주거비 계산은 눈에 보이는 월 비용보다 보증금·세금·부대비용을 함께 봐야 정확도가 올라갑니다."
  },
  savings: {
    keywords: ["세후 이자", "만기 수령액", "과세 유형"],
    checkpoints: ["세전 금리와 세후 수익을 구분합니다.", "단리와 월복리 구조를 먼저 확인합니다.", "중도해지 가능성이 있으면 약정 수익을 보수적으로 봅니다."],
    documents: ["예금 상품 설명서", "금리 안내문", "과세 유형 확인 자료"],
    faqs: ["우대금리 조건을 못 채우면 계산보다 수익이 낮아질 수 있습니다.", "세후 기준으로 비교해야 체감 수익이 맞습니다."],
    closing: "저축 상품은 표면 금리보다 세후 수익과 우대조건 충족 가능성을 같이 봐야 합니다."
  },
  investment: {
    keywords: ["복리", "추가 납입", "장기 수익률"],
    checkpoints: ["연 수익률 가정을 과하게 잡지 않습니다.", "추가 납입 주기와 금액을 고정해 비교합니다.", "세금과 수수료가 반영됐는지 확인합니다."],
    documents: ["투자 계획표", "상품 수수료 표", "세금 안내 자료"],
    faqs: ["복리 결과는 수익률 가정에 매우 민감합니다.", "장기 계산일수록 납입 중단 가능성까지 고려해야 합니다."],
    closing: "투자 계산은 결과 숫자보다 가정한 수익률과 납입 지속 가능성을 검토하는 데 더 큰 의미가 있습니다."
  },
  "tax-saving": {
    keywords: ["세액공제", "비과세 한도", "분리과세"],
    checkpoints: ["소득구간을 먼저 확인합니다.", "한도 초과분 처리 방식을 분리합니다.", "절세 효과와 자금 묶임을 함께 판단합니다."],
    documents: ["연말정산 자료", "계좌 납입 내역", "상품 세제 안내"],
    faqs: ["절세 효과가 커 보여도 자금 유동성은 별도 판단이 필요합니다.", "소득구간이 바뀌면 체감 절세액이 달라질 수 있습니다."],
    closing: "절세형 상품은 공제 숫자만 볼 것이 아니라 인출 제한과 실제 현금흐름까지 같이 봐야 합니다."
  },
  "policy-finance": {
    keywords: ["정부기여금", "소득구간", "정책 조건"],
    checkpoints: ["가입 가능 조건을 먼저 확인합니다.", "소득구간에 따라 지원 구조가 달라지는지 봅니다.", "중도해지 불이익 여부를 확인합니다."],
    documents: ["정책상품 안내문", "소득 확인 자료", "가입 조건표"],
    faqs: ["정책상품은 연도별 조건 변경 가능성이 있습니다.", "정부기여금 구조를 이해하지 않으면 체감 수익을 과대평가할 수 있습니다."],
    closing: "정책금융 상품은 일반 금융상품과 비교할 때 지원 조건 유지 가능성을 함께 봐야 합니다."
  },
  "tax-core": {
    keywords: ["과세표준", "공제", "세율 구간"],
    checkpoints: ["과세표준과 실제 소득을 혼동하지 않습니다.", "필요경비와 공제를 분리해서 봅니다.", "지방세 포함 여부를 확인합니다."],
    documents: ["소득 자료", "신고서 초안", "세율표"],
    faqs: ["공제 누락만으로도 결과가 달라질 수 있습니다.", "세금 계산은 신고서 기준 항목 정의가 중요합니다."],
    closing: "세금 계산은 단순 산출보다 과세표준과 공제 항목을 정확히 분리하는 것이 핵심입니다."
  },
  business: {
    keywords: ["마진", "수수료", "고정비"],
    checkpoints: ["매출과 이익을 분리해서 봅니다.", "광고비·배송비·플랫폼 수수료를 빠뜨리지 않습니다.", "손익분기점은 판매량 기준으로 확인합니다."],
    documents: ["판매 정산서", "원가표", "광고비 집행 내역"],
    faqs: ["매출이 늘어도 마진 구조가 나쁘면 손익은 악화될 수 있습니다.", "플랫폼별 수수료 차이가 실제 순이익을 크게 바꿉니다."],
    closing: "사업 계산기는 총매출보다 순이익 구조를 보게 해주는 도구로 써야 의미가 있습니다."
  },
  "living-cost": {
    keywords: ["고정비", "변동비", "월 예산"],
    checkpoints: ["정기 지출과 일회성 지출을 나눕니다.", "절감 가능 항목을 먼저 표시합니다.", "비교 기준 월을 통일합니다."],
    documents: ["카드 명세서", "견적서", "요금제 상세 조건"],
    faqs: ["생활비는 작은 항목 누락이 누적되면 차이가 커집니다.", "비교 기준 월이 다르면 절감 효과가 왜곡됩니다."],
    closing: "생활비 계산은 합계보다 항목 구조를 드러내는 데 더 큰 가치가 있습니다."
  },
  "consumer-cost": {
    keywords: ["실구매가", "수수료", "할인 효과"],
    checkpoints: ["정가 기준과 실결제 기준을 나눕니다.", "수수료 포함 총지출을 봅니다.", "환율·할인율 같은 변동값은 시점 기준을 맞춥니다."],
    documents: ["결제 예정 금액", "수수료 표", "할인 조건 안내"],
    faqs: ["표면 할인율과 실제 절감액은 다를 수 있습니다.", "수수료를 뒤에서 더하면 계산 결과 해석이 어긋납니다."],
    closing: "소비 계산 주제는 할인율보다 실제 총지출을 기준으로 보는 편이 더 실용적입니다."
  },
  "date-tool": {
    keywords: ["기준일", "경과 기간", "일정 산정"],
    checkpoints: ["시작일과 종료일 포함 여부를 확인합니다.", "공식 기준일이 따로 있는지 봅니다.", "월 단위와 일 단위를 섞지 않습니다."],
    documents: ["기준 날짜", "일정표", "제출 서류"],
    faqs: ["하루 차이로 판단 결과가 바뀌는 경우가 있습니다.", "월수 계산과 일수 계산은 같은 값이 아닙니다."],
    closing: "날짜 계산은 기준일 정의만 정확히 잡아도 대부분의 오류를 줄일 수 있습니다."
  },
  utility: {
    keywords: ["변환 기준", "입력 단위", "해석 오류 방지"],
    checkpoints: ["입력 단위를 먼저 확인합니다.", "결과 단위를 고정해서 비교합니다.", "소수점 처리 방식을 정합니다."],
    documents: ["원본 수치", "변환 대상 단위", "비교 기준표"],
    faqs: ["단위를 한 번만 잘못 잡아도 전체 판단이 틀어질 수 있습니다.", "퍼센트와 절대값을 혼동하면 결과 해석이 엇갈립니다."],
    closing: "도구형 계산기는 계산 그 자체보다 단위를 통일하는 역할에 더 강점이 있습니다."
  },
  "life-metric": {
    keywords: ["측정값", "구간 해석", "참고 기준"],
    checkpoints: ["측정값 자체가 정확한지 확인합니다.", "구간 해석은 참고용으로 봅니다.", "개별 상황에 따라 해석이 달라질 수 있습니다."],
    documents: ["최근 측정값", "비교 기준표", "기록 메모"],
    faqs: ["숫자만으로 상태를 단정하면 안 됩니다.", "기준 구간은 참고용이며 개인 상황이 더 중요합니다."],
    closing: "생활 지표형 계산기는 상태를 단정하기보다 현재 위치를 빠르게 점검하는 용도로 적합합니다."
  },
  study: {
    keywords: ["평균 계산", "누적 관리", "목표 역산"],
    checkpoints: ["반영 학점과 제외 학점을 구분합니다.", "누적과 학기별 값을 분리합니다.", "목표 점수는 역산으로 확인합니다."],
    documents: ["성적표", "수강 계획", "학점 기준표"],
    faqs: ["과목별 학점 차이가 평균에 크게 작용합니다.", "재수강 반영 규칙은 학교마다 다를 수 있습니다."],
    closing: "학업 계산기는 결과 확인보다 다음 학기 목표를 역산하는 데 더 실용적입니다."
  }
};

export const AUTO_BLOG_CALCULATOR_ORDER = Object.keys(CALCULATOR_BLOG_META);
const AUTO_BLOG_TEMPLATE_ORDER = ["guide", "checklist", "mistakes", "comparison", "scenario"];

const TEMPLATE_META = {
  guide: { label: "기초 가이드", titleSuffix: "핵심 정리", focus: "구조를 먼저 이해하는 글" },
  checklist: { label: "체크리스트", titleSuffix: "입력 전 체크리스트", focus: "입력 전 점검 항목" },
  mistakes: { label: "실수 방지", titleSuffix: "자주 틀리는 포인트", focus: "반복되는 해석 오류" },
  comparison: { label: "비교 포인트", titleSuffix: "비교할 때 봐야 할 기준", focus: "비교 판단에 필요한 기준" },
  scenario: { label: "상황별 가이드", titleSuffix: "상황별 활용 방법", focus: "실제 사용 상황에 맞춘 흐름" }
};

function randomCode() {
  return Math.random().toString(36).slice(2, 6);
}

function normalizeAutoDraftTitle(rawTitle) {
  return String(rawTitle || "")
    .replace(/^\[자동 초안[^\]]*\]\s*/u, "")
    .replace(/^\d{4}[-./]?\d{2}[-./]?\d{2}\s*/u, "")
    .trim();
}

function normalizeAutoDraftText(rawText) {
  return String(rawText || "")
    .replace(/\[자동 초안[^\]]*\]\s*/gu, "")
    .replace(/이 글은 기준 구조와 확인 순서 중심으로 정리한 자동 생성 초안입니다\.?\s*/gu, "")
    .replace(/이 글은 .*?자동 생성 초안입니다\.?\s*/gu, "")
    .trim();
}

function toSeoulDateParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  });
  const parts = formatter.formatToParts(now);
  const get = (type) => parts.find((item) => item.type === type)?.value || "";
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour") };
}

function buildDateCodeFromNow(now = new Date()) {
  const { year, month, day } = toSeoulDateParts(now);
  return `${year}${month}${day}`;
}

function buildHourCodeFromNow(now = new Date()) {
  return toSeoulDateParts(now).hour;
}

function pick(list, index, fallback = "") {
  if (!Array.isArray(list) || list.length === 0) return fallback;
  return list[index % list.length];
}

function variantIndex(...parts) {
  const seed = parts.join(":");
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickVariant(list, ...parts) {
  return pick(list, variantIndex(...parts));
}

function topicName(meta) {
  return meta.title
    .replace(/ 모의계산기$/u, " 계산")
    .replace(/ 계산기$/u, "")
    .trim();
}

function hasBatchim(word) {
  const text = String(word || "").trim();
  const lastChar = text.charCodeAt(text.length - 1);
  if (!lastChar || lastChar < 0xac00 || lastChar > 0xd7a3) return false;
  return (lastChar - 0xac00) % 28 !== 0;
}

function topicWithParticle(meta, pair = ["은", "는"]) {
  const topic = topicName(meta);
  return `${topic}${hasBatchim(topic) ? pair[0] : pair[1]}`;
}

function titleFor(meta, templateKey) {
  const topic = topicName(meta);
  const variants = {
    guide: [
      `${topic}, 계산 전에 먼저 잡아야 할 기준`,
      `${topic} 볼 때 먼저 정리해야 할 포인트`,
      `${topic}, 결과보다 먼저 봐야 할 기준`
    ],
    checklist: [
      `${topic} 돌리기 전에 체크할 5가지`,
      `${topic} 입력 전에 먼저 확인할 항목`,
      `${topic}, 숫자 넣기 전에 점검할 기준`
    ],
    mistakes: [
      `${topic}에서 자주 틀리는 포인트`,
      `${topic} 계산할 때 반복해서 헷갈리는 부분`,
      `${topic}, 결과가 달라지는 흔한 실수`
    ],
    comparison: [
      `${topic} 비교할 때 갈라봐야 할 기준`,
      `${topic}, 같은 조건으로 비교하는 방법`,
      `${topic} 결과를 나란히 볼 때 체크할 항목`
    ],
    scenario: [
      `${topic}, 이런 상황이면 이렇게 보는 편이 맞습니다`,
      `${topic}가 특히 필요한 상황 정리`,
      `${topic}, 실제로 많이 쓰는 장면부터 보면 쉽습니다`
    ]
  };

  return normalizeAutoDraftTitle(pickVariant(variants[templateKey] || variants.guide, meta.slug, templateKey, meta.title));
}

function buildExcerpt(meta, profile, templateKey) {
  const related = getRelatedCalculatorMeta(meta.slug || null, 2);
  const opener = pickVariant([
    `${topicWithParticle(meta)} 계산 자체보다 입력 전제를 어떻게 잡느냐에 따라 해석이 달라집니다.`,
    `${topicWithParticle(meta)} 숫자 하나만 보는 문제가 아니라 기준과 조건을 같이 봐야 오차가 줄어듭니다.`,
    `${topicWithParticle(meta)} 계산 결과보다 입력 정의와 적용 조건을 먼저 정리해야 실무에서 덜 헷갈립니다.`
  ], meta.slug, templateKey, "excerpt-opener");
  const closer = pickVariant([
    `실무에서 많이 놓치는 ${profile.keywords.slice(0, 2).join(", ")} 중심으로 정리했습니다.`,
    `${profile.keywords.slice(0, 2).join(", ")}처럼 헷갈리기 쉬운 기준을 먼저 짚습니다.`,
    `바로 계산하기 전에 확인할 포인트와 결과 해석 순서를 같이 묶었습니다.`
  ], meta.slug, templateKey, "excerpt-closer");
  const relatedLine = related.length > 0
    ? ` 관련 계산기인 ${related.map((item) => topicName(item)).join(", ")}도 같이 보면 판단이 더 안정됩니다.`
    : "";
  return `${opener} ${closer}${relatedLine}`;
}

function getRelatedCalculatorMeta(calculatorSlug, limit = 3) {
  const current = CALCULATOR_BLOG_META[calculatorSlug];
  if (!current) return [];

  return Object.entries(CALCULATOR_BLOG_META)
    .filter(([slug, item]) => slug !== calculatorSlug && item.family === current.family)
    .slice(0, limit)
    .map(([slug, item]) => ({ slug, ...item }));
}

function buildLinkedCalculatorSection(relatedCalculators) {
  if (relatedCalculators.length === 0) {
    return [];
  }

  return [
    "## 함께 보면 좋은 다른 계산기",
    ...relatedCalculators.map(
      (item) => `- ${item.title}: ${item.description}`
    ),
    "이 글의 주제만 따로 보지 말고, 위 계산기들과 연결해서 보면 입력 기준과 결과 해석이 더 정확해집니다."
  ];
}

function buildCrossCalculatorSection(meta, relatedCalculators) {
  if (relatedCalculators.length === 0) {
    return [];
  }

  return [
    "## 다른 계산기 정보까지 같이 보는 이유",
    `${meta.title} 결과만 보면 판단이 단순해질 수 있습니다. 실제로는 ${relatedCalculators
      .map((item) => item.title.replace(" 계산기", ""))
      .join(", ")}처럼 인접한 계산기 결과를 함께 봐야 전체 비용, 세금, 일정, 현금흐름을 더 정확히 읽을 수 있습니다.`
  ];
}

function bulletList(items) {
  return items.map((item) => `- ${item}`);
}

function numberedList(items) {
  return items.map((item, index) => `${index + 1}. ${item}`);
}

function joinSections(sections) {
  const blocks = [];

  for (const section of sections) {
    if (Array.isArray(section)) {
      if (section.length === 0) continue;
      if (blocks.length > 0) {
        blocks.push("");
      }
      blocks.push(section.join("\n"));
      continue;
    }

    const text = String(section || "").trim();
    if (!text) continue;
    if (blocks.length > 0) {
      blocks.push("");
    }
    blocks.push(text);
  }

  return blocks.join("\n");
}

function buildIntro(meta, profile, templateKey) {
  const topic = topicName(meta);
  const topicSubject = topicWithParticle(meta);
  const intros = {
    guide: [
      `${topicSubject} 계산기 숫자만 보면 간단해 보이지만, 실제로는 입력값이 어떤 기준에서 나온 값인지 먼저 맞춰야 결과 해석이 흔들리지 않습니다.`,
      `${topicSubject} 결과 숫자보다 어떤 항목을 넣었는지가 더 중요합니다. 비슷한 표현이 많아도 기준이 다르면 판단은 완전히 달라질 수 있습니다.`
    ],
    checklist: [
      `${topicSubject} 급하게 숫자부터 넣으면 오히려 더 헷갈리기 쉬운 주제입니다. 계산 전에 기준일, 포함 항목, 적용 조건부터 정리해 두는 편이 훨씬 안전합니다.`,
      `${topicSubject} 입력 순서보다 입력 기준이 먼저입니다. 특히 ${profile.keywords.slice(0, 2).join("와 ")} 같은 항목은 정의를 잘못 잡으면 결과를 다시 봐야 하는 경우가 많습니다.`
    ],
    mistakes: [
      `${topic}에서 자주 생기는 오류는 계산식이 복잡해서가 아니라 전제 조건을 대충 잡아서 생기는 경우가 많습니다.`,
      `${topicSubject} 숫자 자체보다 기준을 혼동해서 결과가 달라지는 일이 많습니다. 비슷한 용어를 같은 뜻으로 넣는 순간 해석이 어긋나기 시작합니다.`
    ],
    comparison: [
      `${topicSubject} 한 개 결과를 보는 용도보다 여러 선택지를 같은 기준으로 놓고 비교할 때 더 유용합니다.`,
      `${topicSubject} 숫자를 크게 만드는 선택이 아니라, 어떤 조건 차이 때문에 결과가 갈리는지 확인하는 데 더 적합합니다.`
    ],
    scenario: [
      `${topicSubject} 실제 상황을 먼저 떠올리면 계산기 활용이 훨씬 쉬워집니다. 어떤 값을 넣어야 하는지보다 어떤 장면에서 이 계산이 필요한지부터 정리하는 편이 맞습니다.`,
      `${topicSubject} 막상 써보려 하면 어떤 숫자를 기준으로 넣어야 할지 막히는 경우가 많습니다. 실제 사용 장면에 맞춰 순서를 잡으면 해석도 같이 쉬워집니다.`
    ]
  };

  return pickVariant(intros[templateKey] || intros.guide, meta.slug, templateKey, "intro");
}

function buildClosing(meta, profile) {
  const topic = topicName(meta);
  const topicSubject = topicWithParticle(meta);
  return pickVariant([
    `${profile.closing} ${topicSubject} 결과 숫자를 외우는 것보다 어떤 기준을 확인해야 하는지 익혀두는 쪽이 실무적으로 더 도움이 됩니다.`,
    `${profile.closing} 결국 ${topicSubject} 계산기 한 번 돌리는 문제라기보다 입력 기준과 적용 조건을 얼마나 정확히 맞추느냐의 문제에 가깝습니다.`,
    `${profile.closing} ${topic}을 볼 때는 계산값보다 전제 조건과 비교 기준을 같이 기록해 두는 습관이 더 중요합니다.`
  ], meta.slug, meta.family, "closing");
}

function buildBody(meta, profile, templateKey, relatedCalculators) {
  const baseTitle = titleFor(meta, templateKey);
  const keywordLine = profile.keywords.join(", ");
  const documentLine = profile.documents.join(", ");
  const linkedCalculators = buildLinkedCalculatorSection(relatedCalculators);
  const crossCalculatorSection = buildCrossCalculatorSection(meta, relatedCalculators);
  const intro = buildIntro(meta, profile, templateKey);
  const closing = buildClosing(meta, profile);
  const readerLine = `${meta.audience}처럼 바로 판단해야 하는 사용자일수록 계산 전에 기준을 먼저 정리하는 편이 낫습니다.`;
  const readingOrder = numberedList([
    "입력값이 같은 기준 시점에서 나온 값인지 먼저 맞춥니다.",
    "합계만 보지 말고 어떤 항목이 결과를 끌어올리거나 낮추는지 나눠서 읽습니다.",
    "실제 적용 단계에서는 제도 요건, 예외 조건, 원자료를 한 번 더 대조합니다."
  ]);
  const practicalTip = pickVariant([
    "실무에서는 계산 결과를 바로 확정값처럼 쓰기보다, 어떤 가정으로 나온 숫자인지를 같이 메모해 두는 편이 안전합니다.",
    "결과가 비슷해 보여도 입력 정의가 다르면 판단은 완전히 달라질 수 있습니다. 숫자보다 기준어를 먼저 맞추는 습관이 필요합니다.",
    "계산기는 빠른 1차 판단 도구로 쓰고, 실제 의사결정은 원자료와 제도 요건을 붙여서 보는 흐름이 더 안정적입니다."
  ], meta.slug, templateKey, "practical-tip");

  if (templateKey === "checklist") {
    return joinSections([
      `# ${baseTitle}`,
      intro,
      `## 계산 전에 먼저 정리할 것`,
      readerLine,
      `## 실제로 체크하는 항목`,
      ...bulletList(profile.checkpoints),
      `## 여기서 가장 많이 놓칩니다`,
      `${meta.description} 특히 ${keywordLine}처럼 비슷해 보이는 기준을 같은 뜻으로 넣지 않는 것이 중요합니다.`,
      `## 미리 꺼내두면 좋은 자료`,
      ...bulletList(profile.documents),
      `## 체크한 뒤 결과를 읽는 순서`,
      ...readingOrder,
      ...crossCalculatorSection,
      `## 현장에서 자주 나오는 질문`,
      ...bulletList(profile.faqs),
      ...linkedCalculators,
      `## 마무리`,
      closing
    ]);
  }

  if (templateKey === "mistakes") {
    return joinSections([
      `# ${baseTitle}`,
      intro,
      `## 가장 자주 헷갈리는 지점`,
      ...bulletList(profile.checkpoints),
      `## 왜 여기서 많이 틀리나`,
      `${meta.description} ${keywordLine}처럼 표현이 비슷한 항목이 많아서 입력 단계부터 전제가 섞이기 쉽기 때문입니다.`,
      `## 한 번 틀리면 어디까지 어긋나나`,
      `한 항목만 잘못 넣어도 결과 금액보다 해석 순서가 먼저 흔들립니다. 그래서 비교 대상 전체를 다시 봐야 하는 경우가 적지 않습니다.`,
      `${pick(profile.faqs, 0)}`,
      `## 실수 줄이는 방법`,
      ...numberedList([
        "기준일과 단위를 먼저 고정합니다.",
        "계산 전제와 결과 해석을 따로 적어 봅니다.",
        "원자료의 항목명을 그대로 입력값에 대응시킵니다."
      ]),
      ...crossCalculatorSection,
      `## 옆에 두고 보면 좋은 자료`,
      `- ${documentLine}`,
      practicalTip,
      ...linkedCalculators,
      `## 마무리`,
      closing
    ]);
  }

  if (templateKey === "comparison") {
    return joinSections([
      `# ${baseTitle}`,
      intro,
      `## 무엇을 같은 기준으로 놓고 봐야 하나`,
      `${meta.description} 비교할 때는 ${keywordLine} 같은 핵심 기준이 서로 같은 뜻인지부터 맞춰야 합니다.`,
      `## 비교할 때는 이런 순서가 편합니다`,
      ...numberedList([
        "모든 선택지의 기준 시점과 단위를 먼저 통일합니다.",
        "공통 비용과 추가 비용을 분리해서 적습니다.",
        "마지막에 총액보다 조건 차이와 리스크를 읽습니다."
      ]),
      `## 비교에서 자주 빠지는 부분`,
      ...bulletList(profile.checkpoints),
      ...crossCalculatorSection,
      `## 같이 펼쳐둘 자료`,
      ...bulletList(profile.documents),
      `## 많이 묻는 부분`,
      ...bulletList(profile.faqs),
      practicalTip,
      ...linkedCalculators,
      `## 마무리`,
      closing
    ]);
  }

  if (templateKey === "scenario") {
    return joinSections([
      `# ${baseTitle}`,
      intro,
      `## 이런 상황에서 특히 많이 씁니다`,
      `${meta.audience}`,
      `## 실제로는 이렇게 보는 편이 자연스럽습니다`,
      ...numberedList([
        "현재 상황을 숫자로 옮길 수 있는 자료를 먼저 모읍니다.",
        `${meta.title}에 핵심 입력값을 넣어 1차 결과를 봅니다.`,
        "결과를 기준으로 추가 확인이 필요한 항목을 다시 점검합니다."
      ]),
      `## 상황에 따라 달라지는 포인트`,
      `${meta.description}`,
      ...bulletList(profile.checkpoints),
      ...crossCalculatorSection,
      `## 같이 챙기면 좋은 자료`,
      ...bulletList(profile.documents),
      `## 실무 메모`,
      practicalTip,
      ...linkedCalculators,
      `## 마무리`,
      closing
    ]);
  }

  return joinSections([
    `# ${baseTitle}`,
    intro,
    `## 이런 분들께 먼저 필요합니다`,
    meta.audience,
    `## 먼저 이해할 구조`,
    `${meta.description} 이 주제는 ${keywordLine} 같은 기준을 먼저 이해하면 계산기를 훨씬 안정적으로 사용할 수 있습니다.`,
    `## 계산 전에 짚고 넘어갈 포인트`,
    ...bulletList(profile.checkpoints),
    ...crossCalculatorSection,
    `## 옆에 두면 좋은 자료`,
    ...bulletList(profile.documents),
    `## 결과는 이런 순서로 읽는 편이 좋습니다`,
    ...readingOrder,
    `## 많이 물어보는 부분`,
    ...bulletList(profile.faqs),
    practicalTip,
    ...linkedCalculators,
    `## 마무리`,
    closing
  ]);
}

export function getAutoBlogOptions() {
  return {
    calculators: Object.entries(CALCULATOR_BLOG_META).map(([slug, item]) => ({
      slug,
      title: item.title,
      category: item.category
    })),
    templates: Object.entries(TEMPLATE_META).map(([key, item]) => ({
      key,
      label: item.label
    }))
  };
}

export function buildAutoBlogDraft(calculatorSlug, templateKey = "guide", options = {}) {
  const meta = CALCULATOR_BLOG_META[calculatorSlug];
  const template = TEMPLATE_META[templateKey];

  if (!meta) throw new Error("Unsupported calculator slug");
  if (!template) throw new Error("Unsupported template key");

  const profile = FAMILY_PROFILES[meta.family] || FAMILY_PROFILES.utility;
  const metaWithSlug = { slug: calculatorSlug, ...meta };
  const relatedCalculators = getRelatedCalculatorMeta(calculatorSlug, 3);
  const customTitle = options.title ? normalizeAutoDraftTitle(options.title) : null;
  const customSlug = options.slug ? String(options.slug) : null;
  const customTags = Array.isArray(options.tags)
    ? options.tags.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const title = customTitle || titleFor(meta, templateKey);
  const slug = customSlug || `${calculatorSlug}-${templateKey}-${buildDateCodeFromNow()}-${randomCode()}`;

  return {
    type: "blog",
    board: "guide",
    status: "published",
    featured: 0,
    title,
    slug,
    excerpt: normalizeAutoDraftText(buildExcerpt(metaWithSlug, profile, templateKey)),
    body_md: normalizeAutoDraftText(buildBody(metaWithSlug, profile, templateKey, relatedCalculators)),
    calculatorSlug,
    tags: customTags.length > 0
      ? customTags
      : [
          meta.category,
          ...profile.keywords.slice(0, 2),
          meta.title.replace(" 계산기", ""),
          ...relatedCalculators.slice(0, 2).map((item) => item.title.replace(" 계산기", ""))
        ]
  };
}

export function buildDailyAutoBlogDraft(now = new Date()) {
  const dateCode = buildDateCodeFromNow(now);
  const dayNumber = Number(dateCode.slice(-2));
  const calculatorSlug = AUTO_BLOG_CALCULATOR_ORDER[(dayNumber - 1) % AUTO_BLOG_CALCULATOR_ORDER.length];
  const templateKey = AUTO_BLOG_TEMPLATE_ORDER[(dayNumber - 1) % AUTO_BLOG_TEMPLATE_ORDER.length];

  return buildAutoBlogDraft(calculatorSlug, templateKey, {
    slug: `${calculatorSlug}-${templateKey}-${dateCode}-daily`
  });
}

export function buildHourlyAutoBlogDraft(now = new Date()) {
  const dateCode = buildDateCodeFromNow(now);
  const hourCode = buildHourCodeFromNow(now);
  const hourNumber = Number(hourCode);
  const dayNumber = Number(dateCode.slice(-2));
  const calculatorSlug = AUTO_BLOG_CALCULATOR_ORDER[(dayNumber + hourNumber) % AUTO_BLOG_CALCULATOR_ORDER.length];
  const templateKey = AUTO_BLOG_TEMPLATE_ORDER[(dayNumber + hourNumber) % AUTO_BLOG_TEMPLATE_ORDER.length];

  return buildAutoBlogDraft(calculatorSlug, templateKey, {
    slug: `${calculatorSlug}-${templateKey}-${dateCode}-${hourCode}-hourly`
  });
}
