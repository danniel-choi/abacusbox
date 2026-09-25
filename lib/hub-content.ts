import type { CalculatorGroup } from "@/lib/calculator-directory";

export type HubKey = "tax" | "labor" | "loan" | "stock" | "life" | "business" | "math";

export type HubContent = {
  key: HubKey;
  group: CalculatorGroup;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
  checklist: string[];
  featuredSlugs: string[];
  blogSlugs: string[];
};

export const hubContents: Record<HubKey, HubContent> = {
  tax: {
    key: "tax",
    group: "tax",
    path: "/tax",
    eyebrow: "세금·절세 허브",
    title: "연말정산·소득세·상속세 세금 계산기",
    description: "연말정산 환급액, 근로소득세, 종합소득세, 상속세, 연금 세액공제처럼 자주 찾는 세금 계산기를 한곳에 모았습니다.",
    featuredSlugs: ["year-end-tax-settlement", "earned-income-tax", "comprehensive-income-tax", "inheritance-tax", "pension-tax", "retirement-income-tax"],
    blogSlugs: ["year-end-tax-refund-checklist-2026", "earned-income-tax-vs-net-salary", "inheritance-tax-basic-deductions", "property-tax-holding-cost-guide"],
    sections: [
      {
        title: "연말정산과 소득세는 결정세액 흐름을 함께 봐야 합니다.",
        body: "연말정산 환급액은 이미 낸 세금과 최종 결정세액의 차이로 정해집니다. 근로소득세, 종합소득세, 연말정산 계산기를 이어서 보면 총급여, 과세표준, 산출세액, 세액공제가 어떤 순서로 작동하는지 이해하기 쉽습니다."
      },
      {
        title: "세금 계산기는 검색 전환용이 아니라 신고 전 점검 도구입니다.",
        body: "계산기는 빠른 판단을 돕는 추정 도구입니다. 공제 요건, 한도, 가족관계, 사전증여, 회사 제출자료, 국세청 간소화 자료 같은 세부 조건은 실제 신고 과정에서 다시 확인해야 합니다."
      },
      {
        title: "상속세와 연금 절세까지 함께 비교할 수 있습니다.",
        body: "상속세는 상속재산가액보다 공제 구조가 결과를 크게 바꿉니다. 연금저축·IRP 세액공제는 연말정산 환급 가능성에 영향을 줄 수 있어 세금 계산기 모음에서 함께 확인하는 것이 좋습니다."
      }
    ],
    checklist: ["총액과 과세대상 금액을 분리했는지 확인", "공제 항목의 적용 요건과 한도 확인", "월별 원천징수와 연간 정산의 차이 이해", "결과가 크거나 복잡하면 전문가 상담 병행"]
  },
  labor: {
    key: "labor",
    group: "labor",
    path: "/labor",
    eyebrow: "급여·노무 허브",
    title: "급여, 퇴직, 휴가 계산기",
    description: "실수령액, 퇴직금, 주휴수당, 연차수당, 실업급여처럼 근로자가 자주 확인하는 계산을 기준별로 묶었습니다.",
    featuredSlugs: ["net-salary", "severance", "weekly-holiday", "annual-leave", "unemployment", "parental-leave"],
    blogSlugs: ["weekly-holiday-pay-part-time-guide", "unemployment-guide-2026", "severance-common-mistakes-2026", "net-salary-payslip-checklist"],
    sections: [
      {
        title: "노무 계산은 기간과 기준임금이 핵심입니다.",
        body: "퇴직금, 연차수당, 주휴수당은 모두 근무기간과 임금 기준을 어떻게 잡느냐에 따라 결과가 달라집니다. 입사일, 퇴사일, 소정근로시간, 평균임금, 통상임금을 분리해서 입력해야 합니다."
      },
      {
        title: "급여명세서와 계산기 결과를 함께 봐야 합니다.",
        body: "실제 지급액은 4대 보험, 소득세, 비과세 항목, 수당 구조가 함께 반영됩니다. 계산 결과가 급여명세서와 다르면 총지급액과 과세급여, 공제 항목을 순서대로 비교해 보세요."
      },
      {
        title: "제도 요건을 함께 확인해야 합니다.",
        body: "실업급여, 육아휴직, 연차는 계산액만으로 판단하기 어렵습니다. 수급자격, 근속기간, 출근율, 신청 시기 같은 요건을 함께 확인해야 실제 받을 수 있는 금액에 가까워집니다."
      }
    ],
    checklist: ["입사일과 퇴사일을 정확히 입력", "소정근로시간과 실제 근무시간 구분", "평균임금과 통상임금의 차이 확인", "급여명세서의 비과세 항목 확인"]
  },
  loan: {
    key: "loan",
    group: "loan",
    path: "/loan",
    eyebrow: "대출·부동산 허브",
    title: "대출 상환과 부동산 비용 계산기",
    description: "대출이자, DSR, 원리금 상환, 대환대출, 중도상환수수료, 취득세와 보유비용을 비교할 수 있습니다.",
    featuredSlugs: ["loan-interest", "loan-dsr", "loan-amortization", "refinance-calculator", "loan-prepayment", "real-estate-acquisition-tax"],
    blogSlugs: ["dsr-ltv-practical-difference", "loan-prepayment-before-refinance", "property-tax-holding-cost-guide"],
    sections: [
      {
        title: "대출은 월 납입액과 총비용을 같이 봐야 합니다.",
        body: "금리가 낮아도 기간이 길어지면 총이자가 늘 수 있습니다. 원리금균등, 원금균등, 만기일시 방식은 월 부담과 총비용이 서로 다르므로 같은 금액이라도 상환방식별 비교가 필요합니다."
      },
      {
        title: "한도 계산과 상환 계산은 목적이 다릅니다.",
        body: "DSR은 소득 대비 상환능력을 보는 지표이고, LTV는 담보가치 대비 대출비율을 보는 지표입니다. 대출 실행 전에는 한도, 월 납입액, 중도상환 비용을 따로 계산해야 합니다."
      },
      {
        title: "부동산 비용은 세금과 유지비까지 포함해야 합니다.",
        body: "취득세, 재산세, 중개보수, 관리비, 수선비를 제외하면 실제 보유 부담을 과소평가하기 쉽습니다. 매수 전에는 초기비용과 보유비용을 분리해 월 단위 현금흐름으로 환산해 보세요."
      }
    ],
    checklist: ["상환방식별 총이자 비교", "DSR과 LTV를 분리해 확인", "중도상환수수료와 대환 비용 반영", "취득세와 보유세를 함께 점검"]
  },
  stock: {
    key: "stock",
    group: "investment",
    path: "/stock",
    eyebrow: "투자·주식 허브",
    title: "주식·암호화폐 투자 계산기",
    description: "주식 매매 손익, 추가 매수 후 평균단가, PER/PBR 가치평가, 암호화폐 적립식 투자 성장 시나리오를 한곳에서 비교할 수 있습니다.",
    featuredSlugs: ["stock-return", "crypto-investment-growth", "stock-average-price", "stock-valuation", "compound-interest", "exchange-rate"],
    blogSlugs: ["stock-calculator-before-trading", "irp-tax-credit-strategy-2026", "dsr-ltv-practical-difference"],
    sections: [
      {
        title: "투자 계산은 수익률보다 실제 손익이 먼저입니다.",
        body: "수익률은 보기 쉬운 숫자지만, 실제 판단에는 매수 총비용, 매도 실수령액, 수수료, 거래세, 환율, 투자 기간이 함께 필요합니다. 특히 단기 매매와 변동성이 큰 자산은 작은 비용 차이도 누적 손익에 영향을 줍니다."
      },
      {
        title: "암호화폐 적립식 투자는 여러 시나리오를 함께 봐야 합니다.",
        body: "비트코인과 알트코인은 장기 성장 기대가 있어도 중간 낙폭이 클 수 있습니다. 기준 수익률만 보지 말고 보수·낙관 시나리오를 함께 비교해 투자금 규모와 기간을 조정하는 것이 좋습니다."
      },
      {
        title: "PER/PBR은 참고 배수이지 정답이 아닙니다.",
        body: "PER과 PBR은 종목을 빠르게 비교하는 데 유용하지만 성장률, 이익 안정성, 부채, 업종 사이클을 모두 설명하지는 못합니다. 계산값은 후보를 좁히는 출발점으로 쓰는 것이 좋습니다."
      }
    ],
    checklist: ["수수료와 거래세를 함께 반영", "평균단가보다 총 투자금 변화 확인", "암호화폐는 손실 시나리오도 함께 확인", "업종 평균 배수와 성장률 차이 비교"]
  },
  life: {
    key: "life",
    group: "life",
    path: "/life",
    eyebrow: "생활 계산 허브",
    title: "날짜, 단위, 거리, 퍼센트 생활 계산기",
    description: "날짜 차이, D-Day, 단위변환, 거리계산, 할인율, 퍼센트처럼 매일 쓰는 계산을 빠르게 처리합니다.",
    featuredSlugs: ["distance-calculator", "date-diff", "dday", "unit-converter", "percent", "discount-rate"],
    blogSlugs: ["distance-calculator-how-to-use"],
    sections: [
      {
        title: "생활 계산기는 빠른 판단을 줄여줍니다.",
        body: "약속일 계산, 할인율 비교, 거리 확인, 단위 변환처럼 작은 계산은 자주 반복됩니다. 계산기를 한곳에 모아두면 검색 시간을 줄이고 같은 기준으로 결과를 확인할 수 있습니다."
      },
      {
        title: "결과의 기준을 이해하면 더 정확합니다.",
        body: "거리계산기는 직선거리와 실제 이동거리가 다를 수 있고, 날짜 계산은 시작일 포함 여부에 따라 결과가 달라질 수 있습니다. 계산기별 안내와 체크포인트를 함께 확인하는 것이 좋습니다."
      },
      {
        title: "실생활 비교에는 여러 도구를 이어서 쓰면 좋습니다.",
        body: "이사나 출장, 구매 의사결정에서는 거리, 날짜, 할인율, 단위 환산이 함께 필요할 수 있습니다. 목적에 맞게 여러 계산기를 이어 사용하면 빠르게 후보를 좁힐 수 있습니다."
      }
    ],
    checklist: ["출발지와 목적지 기준 확인", "날짜 계산의 포함 범위 확인", "단위 변환 전 원본 단위 확인", "할인율과 최종 결제금액 함께 비교"]
  },
  business: {
    key: "business",
    group: "business",
    path: "/business",
    eyebrow: "사업·판매 허브",
    title: "판매 수익과 사업 비용 계산기",
    description: "부가세, 판매수익, 손익분기점, 구독 매출, 물류비처럼 소규모 사업자가 자주 보는 숫자를 정리했습니다.",
    featuredSlugs: ["vat", "seller-profit", "break-even", "subscription-revenue", "cbm-freight", "mobile-plan"],
    blogSlugs: ["break-even-checklist-20260926-00-hourly", "calcrule-content-hub-launch"],
    sections: [
      {
        title: "사업 계산은 매출보다 마진 구조가 먼저입니다.",
        body: "판매가만 보고 수익을 판단하면 플랫폼 수수료, 결제 수수료, 부가세, 배송비, 반품비를 놓치기 쉽습니다. 원가와 고정비, 변동비를 분리해야 실제 남는 금액이 보입니다."
      },
      {
        title: "손익분기점은 가격 결정의 기준이 됩니다.",
        body: "몇 개를 팔아야 고정비를 회수할 수 있는지 알면 광고비와 할인 정책을 더 현실적으로 정할 수 있습니다. 매출 목표보다 먼저 최소 판매량과 안전마진을 계산해 보세요."
      },
      {
        title: "반복 매출은 이탈률과 비용을 함께 봐야 합니다.",
        body: "구독형 상품은 월 반복 매출이 안정적으로 보여도 해지율, 고객 획득비용, 결제 실패율에 따라 실제 수익성이 달라집니다. 단기 매출과 장기 유지비를 함께 비교해야 합니다."
      }
    ],
    checklist: ["판매가와 원가를 분리", "플랫폼·결제·배송 수수료 반영", "고정비와 변동비 구분", "부가세 포함가와 별도가 확인"]
  },
  math: {
    key: "math",
    group: "math",
    path: "/math",
    eyebrow: "수학 도구 허브",
    title: "그래프, 공학용, 수학 노트 도구",
    description: "그래핑 계산기, 공학용 계산기, 행렬 계산기, 수학 노트처럼 학습과 풀이에 필요한 도구를 모았습니다.",
    featuredSlugs: ["math-notes", "graphing-calculator", "scientific-calculator", "matrix-calculator", "geometry-tool", "three-d-calculator"],
    blogSlugs: ["math-notes-classroom-guide"],
    sections: [
      {
        title: "수학 도구는 풀이 과정을 보존해야 합니다.",
        body: "정답만 확인하는 계산기보다 조건, 식, 표, 그래프를 함께 남길 수 있는 도구가 학습에 더 유리합니다. 풀이 과정이 남아야 오답 원인을 찾고 같은 유형을 다시 풀 수 있습니다."
      },
      {
        title: "그래프와 표를 함께 보면 개념이 선명해집니다.",
        body: "함수식만 보면 변화율이나 교점이 잘 보이지 않을 수 있습니다. 그래프와 표를 나란히 확인하면 식의 의미와 값의 변화를 한 번에 이해할 수 있습니다."
      },
      {
        title: "수업, 과외, 자기주도학습에 맞춰 쓸 수 있습니다.",
        body: "수학 노트는 설명 행, 식 행, 그래프 행, 이미지 행을 조합해 풀이 자료를 구성할 수 있습니다. 교사는 예시 노트를 만들고, 학생은 풀이 과정을 단계별로 정리할 수 있습니다."
      }
    ],
    checklist: ["문제 조건을 먼저 글로 정리", "식과 그래프를 같은 화면에서 비교", "표로 값의 변화를 확인", "풀이 과정을 저장하거나 다시 불러오기"]
  }
};

export const hubOrder: HubKey[] = ["tax", "labor", "loan", "stock", "life", "business", "math"];
