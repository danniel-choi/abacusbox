export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "노무 가이드" | "금융 가이드" | "운영";
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

export const blogPosts: BlogPost[] = [
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
