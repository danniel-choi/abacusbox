import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "법률·세무·금융 참고 사이트",
  description: "법률, 세무, 금융 판단 전에 함께 확인하면 좋은 공식기관과 공공 정보 사이트를 분야별로 정리했습니다."
};

type ResourceItem = {
  title: string;
  href: string;
  owner: string;
  summary: string;
  useFor: string[];
};

const resourceSections: {
  eyebrow: string;
  title: string;
  description: string;
  items: ResourceItem[];
}[] = [
  {
    eyebrow: "Legal",
    title: "법률·판례·소송 참고 사이트",
    description: "법령 원문, 생활 법률 해설, 판례, 전자소송, 등기, 법률구조 상담처럼 법적 판단 전 확인할 만한 공공 사이트입니다.",
    items: [
      {
        title: "국가법령정보센터",
        href: "https://www.law.go.kr",
        owner: "법제처",
        summary: "현행 법령, 시행령, 시행규칙, 행정규칙, 자치법규를 검색할 수 있는 기본 법령 포털입니다.",
        useFor: ["법 조문 원문 확인", "시행일·개정 이력 확인", "위임 법령 추적"]
      },
      {
        title: "찾기쉬운 생활법령정보",
        href: "https://www.easylaw.go.kr",
        owner: "법제처",
        summary: "주거, 근로, 창업, 가족, 소비자 등 생활 주제별 법령을 이해하기 쉽게 정리한 사이트입니다.",
        useFor: ["생활 법률 입문", "상황별 체크리스트", "관련 법령 연결"]
      },
      {
        title: "대법원 종합법률정보",
        href: "https://glaw.scourt.go.kr",
        owner: "대한민국 법원",
        summary: "판례, 법령, 문헌, 규칙을 통합 검색할 수 있는 법원 공식 법률정보 서비스입니다.",
        useFor: ["판례 검색", "대법원 판결 확인", "사건 쟁점 참고"]
      },
      {
        title: "대한민국 법원 전자소송",
        href: "https://ecfs.scourt.go.kr",
        owner: "대한민국 법원",
        summary: "소장, 준비서면, 답변서 등 소송 서류 제출과 사건 진행 관리를 온라인으로 처리하는 공식 시스템입니다.",
        useFor: ["전자소송 제출", "소송 서류 관리", "진행 상황 확인"]
      },
      {
        title: "인터넷등기소",
        href: "https://www.iros.go.kr",
        owner: "대한민국 법원",
        summary: "부동산 등기, 법인 등기 열람·발급과 등기 신청을 처리하는 공식 사이트입니다.",
        useFor: ["등기사항증명서 발급", "법인 등기 확인", "부동산 권리관계 점검"]
      },
      {
        title: "대한법률구조공단",
        href: "https://www.klac.or.kr",
        owner: "대한법률구조공단",
        summary: "법률 상담, 소송구조, 서식, 생활법률 자료를 제공하는 공공 법률지원 기관입니다.",
        useFor: ["무료 법률상담", "소송구조 대상 확인", "법률서식 참고"]
      }
    ]
  },
  {
    eyebrow: "Tax",
    title: "세무·신고·사회보험 참고 사이트",
    description: "국세, 지방세, 세법 해석, 4대보험 기준처럼 세금 계산과 신고 전 확인해야 하는 공식 경로입니다.",
    items: [
      {
        title: "국세청",
        href: "https://www.nts.go.kr",
        owner: "국세청",
        summary: "소득세, 부가가치세, 상속·증여세, 연말정산 등 국세 제도 안내와 보도자료를 확인할 수 있습니다.",
        useFor: ["세목별 제도 안내", "신고 기간 확인", "개정·보도자료 확인"]
      },
      {
        title: "국세청 홈택스",
        href: "https://www.hometax.go.kr",
        owner: "국세청",
        summary: "국세 신고, 납부, 증명 발급, 연말정산, 사업자 관련 민원을 처리하는 전자 세무 서비스입니다.",
        useFor: ["세금 신고·납부", "소득자료 조회", "증명서 발급"]
      },
      {
        title: "국세법령정보시스템",
        href: "https://txsi.hometax.go.kr",
        owner: "국세청",
        summary: "세법 법령, 예규, 판례, 심판례를 검색해 세무 해석의 근거를 확인하는 사이트입니다.",
        useFor: ["세법 조문 검색", "예규·판례 확인", "쟁점 세무 검토"]
      },
      {
        title: "위택스",
        href: "https://www.wetax.go.kr",
        owner: "행정안전부",
        summary: "지방세 신고, 납부, 조회, 증명 발급을 처리하는 지방세 통합 전자 서비스입니다.",
        useFor: ["지방세 납부", "재산세·자동차세 확인", "지방세 증명 발급"]
      },
      {
        title: "국민건강보험",
        href: "https://www.nhis.or.kr",
        owner: "국민건강보험공단",
        summary: "건강보험 자격, 보험료, 장기요양보험, 건강검진 정보를 확인할 수 있는 공식 사이트입니다.",
        useFor: ["건강보험료 확인", "자격득실 확인", "직장·지역 보험료 점검"]
      },
      {
        title: "국민연금",
        href: "https://www.nps.or.kr",
        owner: "국민연금공단",
        summary: "국민연금 가입, 납부, 예상연금, 수급 정보를 확인할 수 있는 공식 사이트입니다.",
        useFor: ["예상연금 조회", "납부 내역 확인", "가입 기준 확인"]
      }
    ]
  },
  {
    eyebrow: "Finance",
    title: "금융·투자·소비자보호 참고 사이트",
    description: "금융상품 비교, 금융회사 조회, 금융 민원, 투자 공시, 시장 정보처럼 돈과 계약 판단 전에 확인할 만한 사이트입니다.",
    items: [
      {
        title: "금융감독원",
        href: "https://www.fss.or.kr",
        owner: "금융감독원",
        summary: "금융회사 감독, 금융소비자 보호, 보도자료, 민원 안내를 제공하는 금융감독기관 사이트입니다.",
        useFor: ["금융 민원 안내", "보도자료 확인", "감독 기준 참고"]
      },
      {
        title: "금융소비자정보포털 파인",
        href: "https://fine.fss.or.kr",
        owner: "금융감독원",
        summary: "금융상품, 금융회사, 휴면계좌, 불법금융 신고 등 소비자용 금융 정보를 모은 포털입니다.",
        useFor: ["금융회사 조회", "상품 비교 연결", "보이스피싱·불법금융 신고"]
      },
      {
        title: "금융상품한눈에",
        href: "https://finlife.fss.or.kr",
        owner: "금융감독원",
        summary: "예금, 적금, 대출, 연금저축 등 금융상품 조건을 비교할 수 있는 금융상품 비교 서비스입니다.",
        useFor: ["예금·적금 비교", "대출 조건 비교", "연금저축 상품 확인"]
      },
      {
        title: "금융위원회",
        href: "https://www.fsc.go.kr",
        owner: "금융위원회",
        summary: "금융 정책, 제도 개선, 보도자료, 금융규제 정보를 확인할 수 있는 정부 금융정책 기관입니다.",
        useFor: ["금융정책 확인", "제도 변경 확인", "보도자료 참고"]
      },
      {
        title: "서민금융진흥원",
        href: "https://www.kinfa.or.kr",
        owner: "서민금융진흥원",
        summary: "서민금융상품, 채무조정 연계, 금융교육, 정책서민금융 정보를 제공하는 공공기관 사이트입니다.",
        useFor: ["정책서민금융 확인", "금융교육", "상담 경로 확인"]
      },
      {
        title: "전자공시시스템 DART",
        href: "https://dart.fss.or.kr",
        owner: "금융감독원",
        summary: "상장·외감 기업의 사업보고서, 감사보고서, 주요사항보고서 등 공시 자료를 검색할 수 있습니다.",
        useFor: ["기업 공시 확인", "재무제표 확인", "투자 전 기업 자료 점검"]
      },
      {
        title: "한국거래소",
        href: "https://www.krx.co.kr",
        owner: "한국거래소",
        summary: "주식, ETF, 채권, 파생상품 시장 정보와 상장 제도, 통계 자료를 제공하는 거래소 공식 사이트입니다.",
        useFor: ["시장 정보 확인", "상장 종목 자료", "지수·통계 참고"]
      }
    ]
  }
];

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
        <p className="text-sm font-extrabold text-brand">Reference Sites</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">법률·세무·금융 참고 사이트</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-slate-600">
          계산 결과를 실제 신고, 계약, 대출, 투자 판단에 연결하기 전에는 공식 자료를 함께 확인해야 합니다.
          아래 목록은 계산의정석에서 기준 검토와 사용자 안내에 우선 참고하기 좋은 공공·공식 사이트입니다.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <SummaryTile label="법률" value="6개" text="법령, 판례, 등기, 소송, 법률구조" />
          <SummaryTile label="세무" value="6개" text="국세, 지방세, 세법 해석, 4대보험" />
          <SummaryTile label="금융" value="7개" text="소비자보호, 상품 비교, 공시, 시장 정보" />
        </div>
      </section>

      <div className="mt-8 grid gap-8">
        {resourceSections.map((section) => (
          <section key={section.title} className="rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-7">
            <div className="max-w-3xl">
              <p className="text-sm font-extrabold text-brand">{section.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-black text-ink">{section.title}</h2>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{section.description}</p>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {section.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-[20px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold text-brand">{item.owner}</p>
                      <h3 className="mt-1 text-lg font-black text-ink">{item.title}</h3>
                    </div>
                    <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-extrabold text-slate-500 group-hover:border-brand group-hover:text-brand">
                      바로가기
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.useFor.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 break-all text-xs font-bold text-slate-400">{item.href}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-[28px] bg-navy p-6 text-white shadow-panel sm:p-7">
        <p className="text-sm font-extrabold text-brand">주의사항</p>
        <h2 className="mt-2 text-2xl font-black">최종 판단은 공식 자료와 전문가 검토를 함께 보세요.</h2>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72">
          계산의정석의 계산기와 참고 링크는 빠른 비교와 기준 확인을 돕기 위한 자료입니다. 실제 신고, 소송, 계약, 금융상품 가입, 투자 판단은
          최신 법령·공시·기관 안내와 세무사, 변호사, 금융전문가의 검토를 함께 확인하는 것이 안전합니다.
        </p>
      </section>
    </main>
  );
}

function SummaryTile({ label, value, text }: { label: string; value: string; text: string }) {
  return (
    <div className="rounded-[20px] bg-paper p-5">
      <p className="text-sm font-extrabold text-brand">{label}</p>
      <p className="mt-2 text-3xl font-black text-ink">{value}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
    </div>
  );
}
