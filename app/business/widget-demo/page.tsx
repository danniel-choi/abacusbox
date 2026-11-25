import type { Metadata } from "next";
import Link from "next/link";
import { BusinessWidgetDemoClient } from "@/components/BusinessWidgetDemoClient";

export const metadata: Metadata = {
  title: "계산기 위젯 데모",
  description: "판매가·원가·수수료를 입력해 외부 사이트에 적용할 수 있는 계산기 위젯 결과 화면을 미리 확인하세요.",
  alternates: { canonical: "/business/widget-demo" },
  openGraph: {
    title: "계산기 위젯 데모 | 계산의정석",
    description: "기업용 계산기 위젯의 입력 화면과 결과 카드 예시를 확인하고 도입을 문의할 수 있습니다."
  }
};

export default function BusinessWidgetDemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-sm font-semibold text-slate-500"><Link href="/business" className="hover:text-brand">사업·판매 계산기</Link><span className="mx-2">›</span><span>위젯 데모</span></div>
      <section className="mt-5 rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel sm:p-10">
        <p className="text-sm font-extrabold text-brand">ABACUSBOX WIDGET</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">사이트 안에 계산기를 넣는 방법을 미리 확인하세요.</h1>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 sm:text-base">입력 화면과 결과 카드의 기본 흐름을 체험하는 데모입니다. 실제 위젯은 브랜드·공식·사용 환경을 확인한 뒤 별도로 설계합니다.</p>
      </section>
      <BusinessWidgetDemoClient />
      <section className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
        <h2 className="text-2xl font-extrabold text-ink">도입 전 확인할 항목</h2>
        <div className="mt-5 grid gap-3 text-sm font-medium leading-7 text-slate-700 md:grid-cols-3">
          <div className="rounded-2xl bg-paper p-4"><strong>계산 기준</strong><p className="mt-2">원가·수수료·세금·배송비 등 어떤 항목을 공식에 포함할지 정합니다.</p></div>
          <div className="rounded-2xl bg-paper p-4"><strong>사용 환경</strong><p className="mt-2">웹페이지, 쇼핑몰, 커뮤니티, 사내 시스템 중 적용 위치를 확인합니다.</p></div>
          <div className="rounded-2xl bg-paper p-4"><strong>운영 범위</strong><p className="mt-2">수정 요청, 기준 변경, 사용량, 장애 안내와 지원 범위를 협의합니다.</p></div>
        </div>
      </section>
    </main>
  );
}
