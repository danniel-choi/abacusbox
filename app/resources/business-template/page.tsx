import type { Metadata } from "next";
import Link from "next/link";
import { BusinessTemplateClient } from "@/components/BusinessTemplateClient";

export const metadata: Metadata = {
  title: "사업자 마진 관리 템플릿 무료 샘플",
  description: "판매가, 원가, 광고비, 기타비용을 입력해 상품별 매출총이익과 마진율을 비교하는 사업자용 CSV 템플릿 무료 샘플입니다.",
  alternates: { canonical: "/resources/business-template" },
  openGraph: {
    title: "사업자 마진 관리 템플릿 무료 샘플",
    description: "상품별 판매가·원가·광고비·마진율을 정리하는 계산의정석 무료 CSV 샘플입니다."
  }
};

export default function BusinessTemplatePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-sm font-semibold text-slate-500">
        <Link href="/resources" className="hover:text-brand">참고 자료</Link><span className="mx-2">›</span><span>사업자 마진 템플릿</span>
      </div>
      <section className="mt-5 rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel sm:p-10">
        <p className="text-sm font-extrabold text-brand">ABACUSBOX TEMPLATE</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">사업자 숫자를 한 장으로 정리하는 무료 샘플</h1>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 sm:text-base">판매가와 비용을 입력해 상품별 수익성을 비교할 수 있는 간단한 CSV 템플릿입니다. 실제 업무에 필요한 항목은 문의를 통해 범위를 먼저 확인합니다.</p>
      </section>
      <BusinessTemplateClient />
      <section className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
        <h2 className="text-2xl font-extrabold text-ink">사용 방법</h2>
        <ol className="mt-5 grid gap-3 text-sm font-medium leading-7 text-slate-700">
          <li className="rounded-2xl bg-paper p-4"><strong>1. 파일을 다운로드합니다.</strong> 스프레드시트나 엑셀에서 파일을 엽니다.</li>
          <li className="rounded-2xl bg-paper p-4"><strong>2. 판매가·원가·광고비·기타비용을 입력합니다.</strong> 샘플 행을 복사해 상품을 추가할 수 있습니다.</li>
          <li className="rounded-2xl bg-paper p-4"><strong>3. 매출총이익과 마진율을 비교합니다.</strong> 세무 신고 금액은 공식 자료와 전문가 확인이 필요합니다.</li>
        </ol>
      </section>
    </main>
  );
}
