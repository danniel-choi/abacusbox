"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { calculators, type CalculatorSlug } from "@/lib/calculators";
import { CALCULATOR_GROUP_META, getCalculatorGroup, getCalculatorIcon } from "@/lib/calculator-directory";

export const FAVORITE_CALCULATORS_STORAGE_KEY = "calcrule:favorite-calculators";

function readFavorites(): CalculatorSlug[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITE_CALCULATORS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoriteCalculatorsSection() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<CalculatorSlug[]>(() => readFavorites());

  useEffect(() => {
    const handleChange = () => setFavoriteSlugs(readFavorites());
    window.addEventListener("storage", handleChange);
    window.addEventListener("calcrule:favorite-calculators", handleChange);
    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("calcrule:favorite-calculators", handleChange);
    };
  }, []);

  const favorites = favoriteSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter((calculator): calculator is (typeof calculators)[number] => Boolean(calculator))
    .slice(0, 6);

  if (favorites.length === 0) return null;

  return (
    <section className="page-shell py-2 md:py-3">
      <div className="rounded-[28px] border border-amber-200 bg-amber-50/70 p-6 shadow-panel md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-amber-700">★ 내가 저장한 계산기</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ink md:text-3xl">자주 쓰는 계산기를 바로 열어보세요.</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem(FAVORITE_CALCULATORS_STORAGE_KEY);
              window.dispatchEvent(new CustomEvent("calcrule:favorite-calculators"));
            }}
            className="text-sm font-extrabold text-slate-500 transition hover:text-amber-700"
          >
            전체 해제
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((calculator) => {
            const groupMeta = CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)];
            return (
              <Link key={calculator.slug} href={`/calculators/${calculator.slug}`} className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-amber-400">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg ${groupMeta.softClass} ${groupMeta.accentClass}`}>
                  {getCalculatorIcon(calculator.slug)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-ink">{calculator.title}</span>
                  <span className="mt-1 block truncate text-xs font-semibold text-slate-500">{calculator.badge}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
