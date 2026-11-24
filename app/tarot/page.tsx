import type { Metadata } from "next";
import Link from "next/link";
import { DailyTarotClient } from "@/components/DailyTarotClient";
import { AdSenseAd } from "@/components/AdSenseAd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "오늘의 타로 운세 | 무료 타로 한 장 뽑기",
  description: "오늘의 타로 카드를 한 장 뽑고 종합운, 핵심 키워드, 실천 메시지를 가볍게 확인해 보세요.",
  keywords: ["오늘의 타로", "타로 운세", "무료 타로", "타로 한 장", "오늘 운세"],
  alternates: { canonical: `${SITE_URL}/tarot` },
  openGraph: {
    title: "오늘의 타로 운세 | 계산의정석",
    description: "오늘의 타로 카드를 한 장 뽑고 오늘의 메시지를 확인해 보세요.",
    url: `${SITE_URL}/tarot`,
    type: "website"
  }
};

export default function DailyTarotPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "오늘의 타로 운세",
    description: "오늘의 타로 카드를 한 장 뽑고 종합운과 실천 메시지를 확인하는 페이지입니다.",
    url: `${SITE_URL}/tarot`,
    isPartOf: { "@type": "WebSite", name: "계산의정석", url: SITE_URL }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="rounded-[30px] bg-gradient-to-br from-[#241344] via-[#3b1e61] to-[#7040a4] px-6 py-10 text-white shadow-panel sm:px-10 sm:py-14">
        <p className="text-sm font-extrabold tracking-[0.14em] text-[#e6ceff]">TODAY&apos;S TAROT</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">오늘의 타로 운세</h1>
        <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-white/75 sm:text-base">오늘의 흐름이 궁금한 순간, 타로 카드 한 장으로 마음을 정리해 보세요. 결과는 재미와 자기 점검을 위한 참고용 콘텐츠입니다.</p>
        <div className="mt-7 flex flex-wrap gap-3 text-sm font-extrabold">
          <span className="rounded-full bg-white/15 px-4 py-2">무료 이용</span>
          <span className="rounded-full bg-white/15 px-4 py-2">매일 새 결과</span>
          <span className="rounded-full bg-white/15 px-4 py-2">회원가입 없음</span>
        </div>
      </section>

      <DailyTarotClient />

      <div className="mt-8"><AdSenseAd placement="bottom" /></div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-line bg-white p-6 shadow-panel"><h2 className="text-lg font-extrabold text-ink">타로는 어떻게 볼까요?</h2><p className="mt-3 text-sm font-medium leading-7 text-slate-600">오늘의 타로는 미래를 확정하는 예언보다 현재의 감정과 선택을 돌아보는 질문 카드로 활용해 보세요.</p></article>
        <article className="rounded-[24px] border border-line bg-white p-6 shadow-panel"><h2 className="text-lg font-extrabold text-ink">질문을 정해 보세요</h2><p className="mt-3 text-sm font-medium leading-7 text-slate-600">오늘 집중할 일, 관계에서 필요한 태도, 지출 전에 확인할 점처럼 한 문장으로 질문하면 결과를 해석하기 쉽습니다.</p></article>
        <article className="rounded-[24px] border border-line bg-white p-6 shadow-panel"><h2 className="text-lg font-extrabold text-ink">다른 운세도 확인하기</h2><p className="mt-3 text-sm font-medium leading-7 text-slate-600">생년월일 기반 운세와 타로 탄생 카드가 궁금하다면 사주·운세 계산기 모음에서 이어서 확인할 수 있습니다.</p><Link href="/saju" className="mt-4 inline-flex text-sm font-extrabold text-brand">사주·운세 계산기 보기</Link></article>
      </section>

      <p className="mt-8 text-center text-xs font-medium leading-6 text-slate-400">본 콘텐츠는 오락 및 자기 점검을 위한 참고용이며, 건강·투자·법률·진로 등 중요한 결정은 실제 정보와 전문가의 조언을 함께 확인하세요.</p>
    </main>
  );
}
