"use client";

import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics";

const csvContent = [
  ["상품명", "판매가", "원가", "광고비", "기타비용", "부가세율", "매출총이익", "마진율"],
  ["샘플 상품", "100000", "45000", "10000", "5000", "0.1", "=B2-C2-D2-E2", "=IFERROR(G2/B2,0)"],
  ["직접 입력", "", "", "", "", "0.1", "=B3-C3-D3-E3", "=IFERROR(G3/B3,0)"]
]
  .map((row) => row.join(","))
  .join("\n");

export function BusinessTemplateClient() {
  function downloadTemplate() {
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "abacusbox-business-margin-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    trackAnalyticsEvent("template_download", { template: "business_margin_csv" });
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8">
        <p className="text-sm font-extrabold text-brand">FREE SAMPLE</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">사업자 마진 관리 템플릿</h2>
        <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
          판매가·원가·광고비·기타비용을 입력해 상품별 매출총이익과 마진율을 비교하는 CSV 샘플입니다. 다운로드 후 스프레드시트나 엑셀에서 열어 사용할 수 있습니다.
        </p>
        <button type="button" onClick={downloadTemplate} className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72]">
          무료 샘플 다운로드
        </button>
        <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">샘플은 일반적인 관리용 예시이며 세무 신고나 회계 자문을 대신하지 않습니다.</p>
      </section>

      <aside className="rounded-[28px] bg-navy p-6 text-white shadow-panel sm:p-8">
        <p className="text-sm font-extrabold text-brand">NEXT STEP</p>
        <h2 className="mt-2 text-2xl font-extrabold">업무에 맞는 템플릿이 필요하다면</h2>
        <p className="mt-4 text-sm font-medium leading-7 text-white/70">상품 수가 많거나 부가세·손익분기·광고 효율까지 함께 관리해야 한다면 사용 목적과 필요한 항목을 먼저 문의해 주세요.</p>
        <Link href="/contact?topic=template" onClick={() => trackAnalyticsEvent("template_lead_click", { template: "business_margin_csv" })} className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-extrabold text-navy transition hover:bg-brand hover:text-white">
          맞춤 템플릿 문의
        </Link>
      </aside>
    </div>
  );
}
