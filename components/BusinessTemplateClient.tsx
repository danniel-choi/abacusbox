"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

const csvContent = [
  ["상품명", "판매가", "원가", "광고비", "기타비용", "부가세율", "매출총이익", "마진율"],
  ["샘플 상품", "100000", "45000", "10000", "5000", "0.1", "=B2-C2-D2-E2", "=IFERROR(G2/B2,0)"],
  ["직접 입력", "", "", "", "", "0.1", "=B3-C3-D3-E3", "=IFERROR(G3/B3,0)"]
]
  .map((row) => row.join(","))
  .join("\n");

export function BusinessTemplateClient() {
  const [inputs, setInputs] = useState({ price: "100000", cost: "45000", ads: "10000", other: "5000" });
  const previewStarted = useRef(false);
  const values = useMemo(() => {
    const price = toNumber(inputs.price);
    const profit = price - toNumber(inputs.cost) - toNumber(inputs.ads) - toNumber(inputs.other);
    return { profit, margin: price > 0 ? (profit / price) * 100 : 0 };
  }, [inputs]);

  function updateInput(key: keyof typeof inputs, value: string) {
    setInputs((current) => ({ ...current, [key]: value.replace(/[^0-9]/g, "") }));
    if (!previewStarted.current) {
      previewStarted.current = true;
      trackAnalyticsEvent("template_preview_start", { template: "business_margin_csv" });
    }
  }

  function downloadTemplate() {
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "abacusbox-business-margin-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    if (previewStarted.current) trackAnalyticsEvent("template_preview_complete", { template: "business_margin_csv" });
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

      <section className="rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8 lg:col-span-2">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold text-brand">LIVE PREVIEW</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">다운로드 전에 마진을 바로 확인하세요</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">입력값은 이 브라우저에서만 계산하며 서버로 보내지 않습니다. 부가세·세무 신고용 금액은 공식 기준과 전문가 확인이 필요합니다.</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PreviewInput label="판매가" value={inputs.price} onChange={(value) => updateInput("price", value)} />
          <PreviewInput label="원가" value={inputs.cost} onChange={(value) => updateInput("cost", value)} />
          <PreviewInput label="광고비" value={inputs.ads} onChange={(value) => updateInput("ads", value)} />
          <PreviewInput label="기타비용" value={inputs.other} onChange={(value) => updateInput("other", value)} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Metric label="예상 매출총이익" value={`${Math.round(values.profit).toLocaleString("ko-KR")}원`} />
          <Metric label="예상 마진율" value={`${values.margin.toFixed(1)}%`} />
        </div>
      </section>
    </div>
  );
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function PreviewInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <div className="flex items-center rounded-2xl border border-line bg-paper px-4 focus-within:border-brand">
        <input inputMode="numeric" value={Number(value || 0).toLocaleString("ko-KR")} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent text-right font-bold text-ink outline-none" aria-label={`${label} 원`} />
        <span className="ml-2 text-sm font-bold text-slate-500">원</span>
      </div>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-paper p-4"><p className="text-xs font-extrabold text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-brand">{value}</p></div>;
}
