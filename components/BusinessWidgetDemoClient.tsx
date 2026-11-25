"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function BusinessWidgetDemoClient() {
  const [price, setPrice] = useState("100000");
  const [cost, setCost] = useState("45000");
  const [fee, setFee] = useState("10000");
  const started = useRef(false);
  const result = useMemo(() => {
    const sale = toNumber(price);
    const profit = sale - toNumber(cost) - toNumber(fee);
    return { profit, margin: sale ? (profit / sale) * 100 : 0 };
  }, [price, cost, fee]);

  function update(setter: (value: string) => void, value: string) {
    setter(value.replace(/[^0-9]/g, ""));
    if (!started.current) {
      started.current = true;
      trackAnalyticsEvent("widget_demo_start", { widget: "seller_margin" });
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[28px] border border-line bg-white p-6 shadow-panel sm:p-8" aria-labelledby="widget-demo-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">WIDGET PREVIEW</p>
            <h2 id="widget-demo-title" className="mt-2 text-2xl font-extrabold text-ink">판매 마진 위젯 예시</h2>
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand">브라우저 데모</span>
        </div>
        <p className="mt-4 text-sm font-medium leading-7 text-slate-600">판매가·원가·수수료를 입력하면 외부 쇼핑몰이나 커뮤니티에 넣을 수 있는 결과 카드 형태를 미리 볼 수 있습니다. 입력값은 서버로 전송하지 않습니다.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <WidgetInput label="판매가" value={price} onChange={(value) => update(setPrice, value)} />
          <WidgetInput label="원가" value={cost} onChange={(value) => update(setCost, value)} />
          <WidgetInput label="수수료" value={fee} onChange={(value) => update(setFee, value)} />
        </div>
        <div className="mt-6 rounded-[24px] bg-ink p-5 text-white">
          <p className="text-xs font-extrabold text-brand">RESULT CARD</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4"><span className="block text-xs font-bold text-white/60">예상 이익</span><strong className="mt-2 block text-2xl font-extrabold">{Math.round(result.profit).toLocaleString("ko-KR")}원</strong></div>
            <div className="rounded-2xl bg-white/10 p-4"><span className="block text-xs font-bold text-white/60">이익률</span><strong className="mt-2 block text-2xl font-extrabold">{result.margin.toFixed(1)}%</strong></div>
          </div>
        </div>
      </section>

      <aside className="rounded-[28px] border border-brand/20 bg-[#f0fffa] p-6 shadow-panel sm:p-8">
        <p className="text-sm font-extrabold text-brand">FOR BUSINESS</p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink">업무 화면에 맞춰 도입하려면</h2>
        <p className="mt-4 text-sm font-medium leading-7 text-slate-600">브랜드 색상, 입력 항목, 계산 공식, 결과 표시 방식, 모바일 화면을 사용 목적에 맞게 설계할 수 있습니다. 현재는 데모 단계이며 실제 구축 범위와 일정은 문의 후 확인합니다.</p>
        <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-xs font-semibold leading-6 text-slate-500">
          <p className="font-extrabold text-ink">임베드 구성 예시</p>
          <code className="mt-2 block break-all">&lt;iframe src=&quot;계산기-위젯-주소&quot; title=&quot;판매 마진 계산기&quot; /&gt;</code>
        </div>
        <Link href="/contact?topic=widget" onClick={() => trackAnalyticsEvent("widget_demo_lead_click", { widget: "seller_margin" })} className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72]">위젯 도입 문의</Link>
      </aside>
    </div>
  );
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function WidgetInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <div className="flex items-center rounded-2xl border border-line bg-paper px-4 focus-within:border-brand">
        <input inputMode="numeric" value={Number(value || 0).toLocaleString("ko-KR")} onChange={(event) => onChange(event.target.value)} aria-label={`${label} 원`} className="h-12 min-w-0 flex-1 bg-transparent text-right font-bold text-ink outline-none" />
        <span className="ml-2 text-sm font-bold text-slate-500">원</span>
      </div>
    </label>
  );
}
