"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const CACHE_KEY = "calcrule_market_indicators_v1";
const RATES_TTL = 1000 * 60 * 60 * 6;
const GOLD_TTL = 1000 * 60 * 10;

type MarketData = {
  rates: { usdKrw: number; jpyKrw: number; eurKrw: number } | null;
  gold: { krwPerGram: number; krwPerDon: number; usdPerOunce: number } | null;
  ratesFetchedAt: number | null;
  goldFetchedAt: number | null;
};

const emptyData: MarketData = {
  rates: null,
  gold: null,
  ratesFetchedAt: null,
  goldFetchedAt: null
};

export function MarketIndicators() {
  const { t } = useLanguage();
  const [data, setData] = useState<MarketData>(emptyData);
  const [goldUnit, setGoldUnit] = useState<"g" | "don">("g");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    let cached = readCache();
    const ratesFresh = Boolean(cached.rates && cached.ratesFetchedAt && now - cached.ratesFetchedAt < RATES_TTL);
    const goldFresh = Boolean(cached.gold && cached.goldFetchedAt && now - cached.goldFetchedAt < GOLD_TTL);

    try {
      const savedUnit = window.localStorage.getItem("calcrule_gold_unit");
      if (savedUnit === "don") setGoldUnit("don");
    } catch {
      // Ignore unavailable local storage.
    }

    setData(cached);
    setLoading(!cached.rates || !cached.gold);

    const load = async () => {
      try {
        const [ratesResult, goldResult] = await Promise.all([
          ratesFresh ? Promise.resolve(null) : fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" }).then(assertResponse).then((response) => response.json()),
          goldFresh ? Promise.resolve(null) : fetch("https://api.gold-api.com/price/XAU", { cache: "no-store" }).then(assertResponse).then((response) => response.json())
        ]);

        const usdKrw = ratesResult?.rates?.KRW ?? cached.rates?.usdKrw;
        const jpyKrw = ratesResult?.rates?.KRW && ratesResult?.rates?.JPY
          ? (ratesResult.rates.KRW / ratesResult.rates.JPY) * 100
          : cached.rates?.jpyKrw;
        const eurKrw = ratesResult?.rates?.KRW && ratesResult?.rates?.EUR
          ? ratesResult.rates.KRW / ratesResult.rates.EUR
          : cached.rates?.eurKrw;
        const usdPerOunce = goldResult?.price ?? cached.gold?.usdPerOunce;
        const krwPerGram = usdKrw && usdPerOunce ? (usdPerOunce * usdKrw) / 31.1034768 : cached.gold?.krwPerGram;
        const krwPerDon = krwPerGram ? krwPerGram * 3.75 : cached.gold?.krwPerDon;
        const next: MarketData = {
          rates: usdKrw && jpyKrw && eurKrw ? { usdKrw, jpyKrw, eurKrw } : null,
          gold: krwPerGram && krwPerDon && usdPerOunce ? { krwPerGram, krwPerDon, usdPerOunce } : null,
          ratesFetchedAt: ratesResult ? Date.now() : cached.ratesFetchedAt,
          goldFetchedAt: goldResult ? Date.now() : cached.goldFetchedAt
        };

        if (cancelled) return;
        cached = next;
        setData(next);
        setError(false);
        setLoading(false);
        writeCache(next);
      } catch {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateGoldUnit = (unit: "g" | "don") => {
    setGoldUnit(unit);
    try {
      window.localStorage.setItem("calcrule_gold_unit", unit);
    } catch {
      // Ignore unavailable local storage.
    }
  };

  const hasData = Boolean(data.rates || data.gold);

  return (
    <div aria-live="polite" aria-busy={loading}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("home.indicatorLive")}</p>
        {error && hasData && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-700">{t("home.indicatorDelayed")}</span>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <IndicatorValueCard label="USD/KRW" value={data.rates ? formatNumber(data.rates.usdKrw) : null} updatedAt={data.ratesFetchedAt} loading={loading} loadingLabel={t("home.indicatorLoading")} />
        <IndicatorValueCard label="JPY(100)/KRW" value={data.rates ? formatNumber(data.rates.jpyKrw) : null} updatedAt={data.ratesFetchedAt} loading={loading} loadingLabel={t("home.indicatorLoading")} />
        <IndicatorValueCard label="EUR/KRW" value={data.rates ? formatNumber(data.rates.eurKrw) : null} updatedAt={data.ratesFetchedAt} loading={loading} loadingLabel={t("home.indicatorLoading")} />
        <div className="rounded-2xl border border-line bg-white px-4 py-4">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-extrabold text-ink">GOLD</span>
            <div className="flex rounded-lg bg-paper p-0.5 text-[11px] font-extrabold">
              <button type="button" onClick={() => updateGoldUnit("g")} className={`rounded-md px-2 py-1 ${goldUnit === "g" ? "bg-ink text-white" : "text-slate-500"}`}>g</button>
              <button type="button" onClick={() => updateGoldUnit("don")} className={`rounded-md px-2 py-1 ${goldUnit === "don" ? "bg-ink text-white" : "text-slate-500"}`}>돈</button>
            </div>
          </div>
          <strong className="mt-3 block text-lg font-extrabold text-ink">{loading && !data.gold ? t("home.indicatorLoading") : data.gold ? formatGold(data.gold, goldUnit) : t("home.indicatorUnavailable")}</strong>
          <p className="mt-1 text-xs font-semibold text-slate-500">{data.gold ? `${formatNumber(data.gold.usdPerOunce)} USD/oz` : "\u00a0"}</p>
          <p className="mt-2 text-[11px] font-semibold text-slate-400">{formatUpdatedAt(data.goldFetchedAt)}</p>
        </div>
      </div>
      <p className="mt-4 text-xs font-medium leading-5 text-slate-400">{t("home.indicatorSource")}</p>
    </div>
  );
}

function IndicatorValueCard({ label, value, updatedAt, loading, loadingLabel }: { label: string; value: string | null; updatedAt: number | null; loading: boolean; loadingLabel: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-4">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <strong className="mt-3 block text-lg font-extrabold text-ink">{loading && !value ? loadingLabel : value ?? "-"}</strong>
      <p className="mt-2 text-[11px] font-semibold text-slate-400">{formatUpdatedAt(updatedAt)}</p>
    </div>
  );
}

function assertResponse(response: Response) {
  if (!response.ok) throw new Error("market data request failed");
  return response;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function formatGold(gold: NonNullable<MarketData["gold"]>, unit: "g" | "don") {
  const value = unit === "don" ? gold.krwPerDon : gold.krwPerGram;
  return `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(Math.round(value))} KRW/${unit}`;
}

function formatUpdatedAt(timestamp: number | null) {
  if (!timestamp) return "업데이트: -";
  const date = new Date(timestamp);
  return `업데이트: ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function readCache(): MarketData {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return emptyData;
    return { ...emptyData, ...JSON.parse(raw) };
  } catch {
    return emptyData;
  }
}

function writeCache(data: MarketData) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore unavailable local storage.
  }
}
