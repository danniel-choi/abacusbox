"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedCalculatorPresentation } from "@/lib/calculator-i18n";
import { getCalculatorGroup, getCalculatorIcon, getLocalizedGroupMeta } from "@/lib/calculator-directory";
import type { CalculatorCategory, CalculatorSlug } from "@/lib/calculators";
import { legalStandards } from "@/lib/constants";

const COPY = {
  ko: { home: "홈", calculators: "계산기", year: "기준연도", share: "공유 가능한 결과 화면", users: "누가 많이 쓰나", first: "먼저 볼 것", provided: "이 페이지에서 제공", providedText: "빠른 계산, 기준 설명, FAQ, 관련 계산기를 한 번에 확인" },
  en: { home: "Home", calculators: "Calculators", year: "Reference year", share: "Shareable result", users: "Who uses it", first: "Check first", provided: "What this page provides", providedText: "Calculation, assumptions, FAQs, and related tools in one place" },
  ja: { home: "ホーム", calculators: "計算機", year: "基準年", share: "共有できる結果画面", users: "よく使う方", first: "先に確認", provided: "このページでできること", providedText: "計算、基準の説明、FAQ、関連ツールをまとめて確認" }
} as const;

type HeroCalculator = {
  slug: CalculatorSlug;
  title: string;
  description: string;
  category: CalculatorCategory;
  badge: string;
  audience: string;
  checkpoints: string[];
};

export function LocalizedCalculatorHero({ calculator }: { calculator: HeroCalculator }) {
  const { locale } = useLanguage();
  const copy = COPY[locale];
  const presentation = getLocalizedCalculatorPresentation(calculator, locale);
  const groupMeta = getLocalizedGroupMeta(locale, getCalculatorGroup(calculator.slug));
  const checkpoint = calculator.checkpoints[0] || (locale === "ko" ? "입력 기준을 확인하세요." : locale === "en" ? "Review the input assumptions." : "入力条件を確認してください。 ");

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-8">
        <nav className="text-sm font-semibold text-white/56">
          <Link href="/" className="hover:text-brand">{copy.home}</Link>
          <span className="mx-2">/</span>
          <Link href="/calculators" className="hover:text-brand">{copy.calculators}</Link>
          <span className="mx-2">/</span>
          <span>{presentation.title}</span>
        </nav>
        <div className="py-8">
          <p className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-extrabold text-brand">
            {presentation.category} · {presentation.badge}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-extrabold text-white/84">
            <span>{getCalculatorIcon(calculator.slug)}</span>
            <span>{groupMeta.label}</span>
          </div>
          <h1 className="mt-5 text-[clamp(2rem,7vw,3.5rem)] font-extrabold leading-tight md:text-5xl md:leading-tight lg:text-6xl">{presentation.title}</h1>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-white/68">{presentation.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/72">
            <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">{presentation.audience}</span>
            <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">{copy.year} {legalStandards.year}</span>
            <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">{copy.share}</span>
          </div>
          <div className="mt-6 grid gap-3 md:max-w-4xl md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-sm font-extrabold text-brand">{copy.users}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/74">{presentation.audience}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-sm font-extrabold text-brand">{copy.first}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/74">{checkpoint}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-sm font-extrabold text-brand">{copy.provided}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/74">{copy.providedText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
