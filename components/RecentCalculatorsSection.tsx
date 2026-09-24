"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { calculators, type CalculatorSlug } from "@/lib/calculators";
import { CALCULATOR_GROUP_META, getCalculatorGroup } from "@/lib/calculator-directory";

const RECENT_CALCULATORS_STORAGE_KEY = "calcrule:recent-calculators";

function readRecentSlugs(): CalculatorSlug[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(RECENT_CALCULATORS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as CalculatorSlug[];
  } catch {
    return [];
  }
}

export function RecentCalculatorsSection() {
  const [recentSlugs, setRecentSlugs] = useState<CalculatorSlug[]>(() => readRecentSlugs());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleChange = () => {
      setRecentSlugs(readRecentSlugs());
    };

    window.addEventListener("storage", handleChange);
    window.addEventListener("calcrule:recent-calculators", handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("calcrule:recent-calculators", handleChange);
    };
  }, []);

  const recentCalculators = recentSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter((calculator): calculator is (typeof calculators)[number] => Boolean(calculator))
    .slice(0, 4);

  if (recentCalculators.length === 0) {
    return null;
  }

  return (
    <section className="page-shell py-2 md:py-3">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
        <div className="section-heading">
          <div>
            <p className="text-sm font-extrabold text-brand">최근 사용</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ink md:text-3xl">이어서 계산할 수 있습니다.</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem(RECENT_CALCULATORS_STORAGE_KEY);
              window.dispatchEvent(new CustomEvent("calcrule:recent-calculators"));
            }}
            className="text-sm font-extrabold text-slate-500 transition hover:text-brand"
          >
            기록 지우기
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recentCalculators.map((calculator) => {
            const groupMeta = CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)];
            return (
              <Link
                key={calculator.slug}
                href={`/calculators/${calculator.slug}`}
                className="rounded-[20px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl text-lg ${groupMeta.softClass} ${groupMeta.accentClass}`}>
                    {groupMeta.icon}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-500">{groupMeta.label}</span>
                </div>
                <h3 className="mt-4 text-base font-extrabold text-ink">{calculator.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{calculator.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand">이어서 계산하기 <span>↗</span></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
