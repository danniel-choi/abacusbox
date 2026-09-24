export const fallbackBlogItems = [
  {
    id: 4,
    type: "blog",
    board: "guide",
    slug: "irp-tax-credit-strategy-2026",
    title: "IRP와 연금저축, 세액공제 한도를 어떻게 나눠 넣는 게 유리할까",
    excerpt: "총급여 구간과 납입 여력에 따라 IRP와 연금저축의 배분 전략을 실무적으로 정리했습니다.",
    body_md:
      "연금계좌 절세는 단순히 한도만 채운다고 끝나지 않습니다.\n\n총급여 구간, 기존 연금저축 납입액, 연말 현금흐름을 같이 봐야 실제 체감 효과가 달라집니다.\n\n계산의정석의 연금 절세 계산기는 예상 공제액을 빠르게 확인하는 용도에 맞고, 실제 납입 결정 전에는 올해 총급여와 이미 납입한 금액을 기준으로 최종 점검하는 편이 안전합니다.",
    published_at: "2026-08-20",
    featured: 1,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "금융 에디터",
    tags: [
      { slug: "IRP", name: "IRP" },
      { slug: "연금저축", name: "연금저축" },
      { slug: "세액공제", name: "세액공제" }
    ],
    calculators: ["pension-tax"]
  },
  {
    id: 5,
    type: "blog",
    board: "guide",
    slug: "weekly-holiday-pay-part-time-guide",
    title: "아르바이트 주휴수당, 실제로 어디까지 받을 수 있나",
    excerpt: "근무일수와 소정근로시간이 애매한 아르바이트 사례를 기준으로 주휴수당 판단 흐름을 정리했습니다.",
    body_md:
      "주휴수당은 주 15시간 이상이라는 한 줄 기준으로만 이해하면 놓치는 부분이 많습니다.\n\n소정근로일 개근 여부와 주간 스케줄 변동도 같이 봐야 합니다.\n\n계산기로 대략적인 주휴수당 규모를 확인한 뒤에는, 급여 산정 단위가 주 기준인지 월 기준인지와 근무표 변경 이력을 같이 확인하는 편이 실무적으로 맞습니다.",
    published_at: "2026-08-20",
    featured: 1,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "노무 에디터",
    tags: [
      { slug: "주휴수당", name: "주휴수당" },
      { slug: "아르바이트", name: "아르바이트" },
      { slug: "근로시간", name: "근로시간" }
    ],
    calculators: ["weekly-holiday"]
  },
  {
    id: 1,
    type: "blog",
    board: "guide",
    slug: "unemployment-guide-2026",
    title: "2026 실업급여 계산 전에 먼저 확인해야 할 5가지",
    excerpt: "평균임금, 가입기간, 이직 사유처럼 계산 결과보다 먼저 봐야 할 기준을 정리했습니다.",
    body_md:
      "실업급여는 단순히 평균임금만 넣어서 끝나는 계산이 아닙니다.\n\n이직 사유, 피보험 단위기간, 연령, 구직활동 인정 여부가 함께 작동합니다.\n\n계산의정석의 실업급여 계산기는 상한액과 하한액을 반영하지만, 실제 지급 여부는 고용센터 심사와 최신 기준 적용일에 따라 달라질 수 있습니다.",
    published_at: "2026-08-18",
    featured: 0,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "계산의정석",
    tags: [
      { slug: "실업급여", name: "실업급여" },
      { slug: "고용보험", name: "고용보험" },
      { slug: "퇴사", name: "퇴사" }
    ],
    calculators: ["unemployment"]
  },
  {
    id: 2,
    type: "blog",
    board: "guide",
    slug: "dsr-ltv-practical-difference",
    title: "DSR과 LTV, 실제 대출 한도에서는 무엇이 더 먼저 막을까",
    excerpt: "같은 집값과 소득이어도 어떤 규제가 먼저 한도를 막는지 실전 관점에서 설명합니다.",
    body_md:
      "LTV는 담보가치 기준이고, DSR은 상환능력 기준입니다.\n\n둘은 같은 듯 보이지만 실제로는 완전히 다른 제약입니다.\n\n상담 전에는 희망 대출금만 보지 말고, 월 상환액과 연 상환액이 소득 대비 어떤 압박을 만드는지 같이 보는 편이 맞습니다.",
    published_at: "2026-08-15",
    featured: 0,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "계산의정석",
    tags: [
      { slug: "DSR", name: "DSR" },
      { slug: "LTV", name: "LTV" },
      { slug: "주택담보대출", name: "주택담보대출" }
    ],
    calculators: ["loan-dsr"]
  },
  {
    id: 6,
    type: "blog",
    board: "guide",
    slug: "severance-common-mistakes-2026",
    title: "퇴직금 계산할 때 가장 자주 틀리는 4가지",
    excerpt: "평균임금, 계속근로기간, 상여 반영 방식처럼 퇴직금 계산에서 반복적으로 틀리는 지점을 정리했습니다.",
    body_md:
      "퇴직금 계산에서 가장 흔한 오해는 월급 한 달치를 그대로 기준으로 잡는 것입니다.\n\n실제로는 평균임금과 계속근로기간이 함께 작동합니다.\n\n계산기로 추정한 뒤에는 입사일·퇴사일, 무급휴직 여부, 정기 상여 지급 규칙을 다시 점검해야 실제 지급액과 오차를 줄일 수 있습니다.",
    published_at: "2026-08-19",
    featured: 1,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "노무 에디터",
    tags: [
      { slug: "퇴직금", name: "퇴직금" },
      { slug: "평균임금", name: "평균임금" },
      { slug: "상여금", name: "상여금" }
    ],
    calculators: ["severance"]
  },
  {
    id: 3,
    type: "blog",
    board: "guide",
    slug: "calcrule-content-hub-launch",
    title: "계산의정석 콘텐츠 허브 오픈: 계산기에서 정보 플랫폼으로 확장합니다",
    excerpt: "계산 결과만 제공하던 구조에서, 가이드와 커뮤니티까지 연결하는 이유를 정리했습니다.",
    body_md:
      "계산기는 빠른 판단에 유용하지만, 실제 의사결정에는 설명과 사례가 함께 필요합니다.\n\n블로그에서는 제도 가이드와 비교 글을 제공하고, 커뮤니티에서는 질문과 사례를 축적하는 방향으로 확장합니다.\n\n다음 단계에서는 계산기 결과와 관련 글을 더 촘촘하게 연결해 사용자가 계산에서 해석까지 바로 이동할 수 있게 만들 예정입니다.",
    published_at: "2026-08-20",
    featured: 0,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "계산의정석",
    tags: [
      { slug: "업데이트", name: "업데이트" },
      { slug: "블로그", name: "블로그" },
      { slug: "커뮤니티", name: "커뮤니티" }
    ],
    calculators: []
  },
  {
    id: 7,
    type: "blog",
    board: "guide",
    slug: "net-salary-payslip-checklist",
    title: "실수령액 계산기와 급여명세서를 같이 볼 때 체크할 항목",
    excerpt: "4대 보험, 소득세, 비과세 항목까지 급여명세서 비교에서 꼭 봐야 할 항목을 묶어 정리했습니다.",
    body_md:
      "실수령액 계산기는 빠르게 감을 잡기 좋지만, 실제 급여명세서와 1원 단위까지 맞추는 도구는 아닙니다.\n\n소득세, 지방소득세, 비과세 식대, 부양가족 수, 국민연금 상한 적용 여부처럼 작은 차이가 체감 실수령액을 크게 바꿀 수 있습니다.\n\n비교할 때는 총지급액과 공제총액만 보지 말고, 과세 대상 급여와 비과세 항목이 어떻게 분리됐는지까지 봐야 원인을 정확히 찾을 수 있습니다.",
    published_at: "2026-08-16",
    featured: 0,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "노무 에디터",
    tags: [
      { slug: "실수령액", name: "실수령액" },
      { slug: "급여명세서", name: "급여명세서" },
      { slug: "4대보험", name: "4대보험" }
    ],
    calculators: ["net-salary"]
  }
];

export const fallbackCommunityItems = [
  {
    id: 101,
    type: "community",
    board: "qna",
    slug: "severance-includes-bonus",
    title: "퇴직금 계산에 상여금이 포함되는지 헷갈릴 때",
    excerpt: "정기 상여와 비정기 상여의 처리 차이를 실제 질문 형태로 정리한 글입니다.",
    body_md:
      "퇴직금 계산에서 상여금 포함 여부는 지급 주기와 정기성, 평균임금 산정기간 반영 방식에 따라 달라집니다.\n\n사용자 입장에서는 상여금이 '받은 돈'이기 때문에 무조건 포함된다고 보기 쉽지만, 실제 판단은 그보다 더 세부적입니다.\n\n복잡한 임금구조라면 단순 월급 기준 계산기 결과만 보지 말고, 임금명세서와 지급 규정을 같이 확인하는 편이 안전합니다.",
    published_at: "2026-08-19",
    featured: 0,
    view_count: 0,
    comment_count: 12,
    like_count: 18,
    author_name: "운영팀",
    tags: [],
    calculators: ["severance"]
  },
  {
    id: 102,
    type: "community",
    board: "case",
    slug: "net-salary-tax-gap-case",
    title: "실수령액 계산기 결과와 급여명세서가 다른 사례",
    excerpt: "4대 보험만 반영한 계산과 실제 급여명세서가 달라지는 대표 원인을 정리했습니다.",
    body_md:
      "가장 흔한 원인은 소득세와 지방소득세입니다. 4대 보험만 계산하면 실제 명세서보다 실수령액이 높게 보입니다.\n\n비과세 식대, 연장근로수당, 부양가족 수에 따른 세액 차이도 결과 오차를 크게 만듭니다.\n\n따라서 급여명세서 비교용 기능을 확장하려면 세금과 비과세 항목 구조를 함께 반영해야 합니다.",
    published_at: "2026-08-17",
    featured: 0,
    view_count: 0,
    comment_count: 9,
    like_count: 14,
    author_name: "관리자",
    tags: [],
    calculators: ["net-salary"]
  },
  {
    id: 103,
    type: "community",
    board: "notice",
    slug: "content-community-open",
    title: "블로그·커뮤니티 섹션을 새로 열었습니다",
    excerpt: "운영 공지와 함께 앞으로 어떤 글과 사례를 쌓아갈지 안내합니다.",
    body_md:
      "계산의정석은 계산 결과에 더해 설명, 사례, 질문을 연결하는 구조로 확장하고 있습니다.\n\n초기에는 운영팀이 정리한 글 중심으로 시작하고, 이후에는 자주 묻는 질문과 사례를 더 체계적으로 분류할 예정입니다.\n\n콘텐츠 허브가 자리 잡으면 계산기별 관련 글 추천도 함께 붙일 계획입니다.",
    published_at: "2026-08-20",
    featured: 0,
    view_count: 0,
    comment_count: 3,
    like_count: 21,
    author_name: "계산의정석",
    tags: [],
    calculators: []
  }
];

export function findFallbackPost(type, slug) {
  const source = type === "blog" ? fallbackBlogItems : fallbackCommunityItems;
  return source.find((item) => item.slug === slug) || null;
}
