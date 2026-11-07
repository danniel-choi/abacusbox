import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "웹 부업·재테크 가이드",
  description: "콘텐츠, 제휴, 온라인 판매, 디지털 상품 등 웹에서 시작할 수 있는 부업의 수익 구조와 비용, 위험 신호를 비교합니다.",
  alternates: { canonical: "/side-income" },
  openGraph: {
    title: "웹 부업·재테크 가이드 | 계산의정석",
    description: "웹 부업의 수익 구조와 비용을 비교하고 관련 계산기로 손익을 점검하세요.",
    url: "/side-income",
    type: "article"
  }
};

const models = [
  { title: "콘텐츠·블로그", tag: "낮은 초기비용", text: "글·영상·뉴스레터를 꾸준히 발행하고 광고, 제휴, 유료 콘텐츠로 수익을 만드는 방식입니다.", check: "제작 시간, 검색 유입, 광고·제휴 전환율" },
  { title: "제휴·추천 수익", tag: "성과형", text: "상품이나 서비스를 소개하고 실제 구매·가입이 발생했을 때 수수료를 받는 방식입니다.", check: "수수료율, 취소율, 고지 의무, 채널 신뢰도" },
  { title: "온라인 판매", tag: "운영형", text: "마켓·자사몰·주문제작을 통해 상품을 판매하고 판매가와 모든 비용의 차이로 이익을 만듭니다.", check: "원가, 플랫폼 수수료, 광고비, 배송·반품비" },
  { title: "디지털 상품·서비스", tag: "지식형", text: "템플릿, 강의, 디자인, 개발·번역 같은 결과물을 온라인으로 판매하는 방식입니다.", check: "제작시간, 재판매 가능성, 환불·고객지원 비용" },
  { title: "장기 저축·투자", tag: "자산관리형", text: "부업으로 생긴 잉여 현금을 목적과 위험 수준에 맞춰 저축·투자하는 단계입니다.", check: "원금 손실 가능성, 수수료, 세금, 현금화 가능성" },
  { title: "앱·자동화 도구", tag: "확장형", text: "반복 업무를 줄이는 도구나 작은 SaaS를 만들어 구독·사용료를 받는 방식입니다.", check: "개발·운영비, 고객획득비, 해지율, 보안" }
];

const calculatorLinks = [
  ["/calculators/seller-profit", "판매자 수익 계산기", "판매가·원가·수수료·광고비를 반영한 순이익"],
  ["/calculators/break-even", "손익분기점 계산기", "고정비와 마진을 기준으로 필요한 판매량"],
  ["/calculators/ad-performance-calculator", "광고 성과 계산기", "광고비·매출·ROAS·전환 구조"],
  ["/calculators/adsense-revenue", "애드센스 수익 계산기", "페이지뷰·RPM 가정에 따른 예상 수익"],
  ["/calculators/youtube-ad-revenue", "유튜브 광고 수익 계산기", "조회수·RPM 가정에 따른 광고 수익"],
  ["/calculators/compound-interest", "복리 계산기", "정기 납입과 수익률 가정에 따른 장기 변화"]
] as const;

export default function SideIncomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <section className="overflow-hidden rounded-[32px] bg-ink p-6 text-white shadow-float sm:p-10">
        <p className="text-sm font-extrabold text-brand">SIDE INCOME · MONEY GUIDE</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">웹에서 할 수 있는 부업과 재테크, 숫자로 비교해 보세요.</h1>
        <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-white/70 sm:text-lg">
          부업은 수익률보다 시간·비용·위험을 함께 계산해야 합니다. 이 페이지는 특정 상품이나 수익을 보장하지 않고, 시작 전 비교해야 할 구조와 계산 순서를 정리합니다.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="#models" className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72]">부업 유형 비교</Link>
          <Link href="#calculators" className="rounded-full border border-white/20 px-5 py-3 text-sm font-extrabold text-white transition hover:border-brand hover:text-brand">관련 계산기 보기</Link>
        </div>
      </section>

      <section id="models" className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
        <p className="text-sm font-extrabold text-brand">부업 모델</p>
        <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">내 상황에 맞는 방식부터 고르세요.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {models.map((model) => (
            <article key={model.title} className="rounded-2xl border border-line bg-paper p-5">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand">{model.tag}</span>
              <h3 className="mt-4 text-lg font-black text-ink">{model.title}</h3>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{model.text}</p>
              <p className="mt-4 border-t border-line pt-3 text-xs font-bold leading-5 text-slate-500"><span className="text-ink">먼저 볼 숫자:</span> {model.check}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
          <p className="text-sm font-extrabold text-brand">시작 순서</p>
          <h2 className="mt-2 text-2xl font-black text-ink">수익보다 검증을 먼저 하세요.</h2>
          <ol className="mt-5 grid gap-3">
            {["내가 제공할 수 있는 문제 해결과 고객을 한 문장으로 정리", "일주일 단위의 제작·영업 시간을 정하고 초기비용 상한 설정", "첫 10건 또는 첫 30일의 목표를 정해 실제 반응 측정", "매출에서 원가·수수료·광고비·세금을 제외한 순이익 확인", "반복 가능한 구조인지 확인한 뒤에만 시간과 비용을 확대"].map((item, index) => (
              <li key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-black text-white">{index + 1}</span>
                <span className="text-sm font-semibold leading-6 text-slate-700">{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[28px] border border-rose-200 bg-rose-50/60 p-6 shadow-panel sm:p-8">
          <p className="text-sm font-extrabold text-rose-700">주의할 신호</p>
          <h2 className="mt-2 text-2xl font-black text-ink">이런 제안은 먼저 멈추고 확인하세요.</h2>
          <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-slate-700">
            <li className="rounded-2xl bg-white/80 px-4 py-4">원금 보장과 고정 수익을 동시에 약속하면서 출처·계약서가 불명확한 경우</li>
            <li className="rounded-2xl bg-white/80 px-4 py-4">가입비·교육비·리크루팅 비용을 먼저 내야 수익이 시작된다는 경우</li>
            <li className="rounded-2xl bg-white/80 px-4 py-4">수익 사례만 보여주고 환불, 세금, 수수료, 손실 조건을 설명하지 않는 경우</li>
            <li className="rounded-2xl bg-white/80 px-4 py-4">타인의 계정·명의·인증서를 빌리거나 불법적인 광고·리뷰를 요구하는 경우</li>
          </ul>
        </div>
      </section>

      <section id="calculators" className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">계산의정석 도구</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">부업 수익 구조를 계산해 보세요.</h2>
          </div>
          <Link href="/calculators" className="text-sm font-extrabold text-brand hover:text-ink">전체 계산기</Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {calculatorLinks.map(([href, title, description]) => (
            <Link key={href} href={href} className="rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-brand hover:bg-white">
              <h3 className="text-base font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
        <p className="text-sm font-extrabold text-brand">공식 확인 경로</p>
        <h2 className="mt-2 text-2xl font-black text-ink">수익이 생기면 신고·계약·금융 조건도 확인하세요.</h2>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-extrabold">
          <a className="rounded-full border border-line px-4 py-3 text-brand hover:border-brand" href="https://www.nts.go.kr" target="_blank" rel="noreferrer">국세청</a>
          <a className="rounded-full border border-line px-4 py-3 text-brand hover:border-brand" href="https://www.hometax.go.kr" target="_blank" rel="noreferrer">홈택스</a>
          <a className="rounded-full border border-line px-4 py-3 text-brand hover:border-brand" href="https://fine.fss.or.kr" target="_blank" rel="noreferrer">금융소비자정보포털 파인</a>
          <Link className="rounded-full border border-line px-4 py-3 text-brand hover:border-brand" href="/resources">공식 참고 사이트 모음</Link>
        </div>
        <p className="mt-5 text-xs font-medium leading-6 text-slate-500">계산 결과와 정보는 일반적인 비교를 위한 참고 자료입니다. 세금 신고, 투자, 대출, 계약, 사업자 등록 등 실제 결정은 현재 공식 안내와 전문가의 확인을 함께 거치세요.</p>
      </section>
    </main>
  );
}
