"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n";
import { calculators } from "@/lib/calculators";
import {
  CALCULATOR_GROUP_META,
  getCalculatorsByGroup,
  getFeaturedCalculators,
  getLocalizedGroupMeta,
  getPopularCalculators,
} from "@/lib/calculator-directory";
import { getLatestBlogPosts } from "@/lib/content";
import { getLocalizedCalculatorPresentation } from "@/lib/calculator-i18n";
import { legalStandards } from "@/lib/constants";
import { formatWon } from "@/lib/format";
import { hubContents, hubOrder } from "@/lib/hub-content";
import { AdSenseAd } from "@/components/AdSenseAd";
import { HomeBlogRoller } from "@/components/HomeBlogRoller";
import { Logo } from "@/components/Logo";
import { MarketIndicators } from "@/components/MarketIndicators";
import { RelatedSearchTags } from "@/components/RelatedSearchTags";
import { HomeFormulaCalculator } from "@/components/HomeFormulaCalculator";

const brandRelatedLinks = [
  { href: "/calculators", label: "계산의정석 계산기 모음" },
  { href: "/calculators/minimum-wage", label: "최저임금 계산기" },
  { href: "/calculators/net-salary", label: "실수령액 계산기" },
  { href: "/calculators/severance", label: "퇴직금 계산기" },
  { href: "/calculators/loan-interest", label: "대출 이자 계산기" },
  { href: "/calculators/year-end-tax-settlement", label: "연말정산 계산기" },
  { href: "/calculators/lotto-probability", label: "복권 당첨 확률 계산기" },
  { href: "/calculators/lightning-strike-probability", label: "번개 맞을 확률 계산기" }
];

export default function HomePage() {
  const { locale, t } = useLanguage();
  const featured = getFeaturedCalculators().slice(0, 4);
  const popular = getPopularCalculators().slice(0, 6);
  const latestBlogPosts = getLatestBlogPosts(3);
  const groups = Object.entries(CALCULATOR_GROUP_META).map(([key]) => ({
    key,
    ...getLocalizedGroupMeta(locale, key as keyof typeof CALCULATOR_GROUP_META),
    count: getCalculatorsByGroup(key as keyof typeof CALCULATOR_GROUP_META).length
  }));

  return (
    <main className="pb-4">
      <section className="bg-ink text-white">
        <div className="page-shell grid gap-10 pb-14 pt-10 md:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] md:items-center md:pb-20 md:pt-14">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-bold text-brand">
              {interpolate(t("home.heroBadge"), { year: legalStandards.year, count: calculators.length })}
            </p>
            <h1 className="max-w-3xl text-[clamp(2.15rem,10vw,3.75rem)] font-extrabold leading-tight md:text-6xl">계산의정석</h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/68 md:mt-5 md:text-lg md:leading-8">
              {t("footer.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#directory" className="min-h-12 w-full rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] sm:w-auto">
                {t("home.findCalculator")}
              </Link>
              <Link href="/calculators" className="min-h-12 w-full rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white/88 transition hover:border-brand hover:text-brand sm:w-auto">
                {t("home.allCalculators")}
              </Link>
              <Link href="/resources" className="min-h-12 w-full rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white/88 transition hover:border-brand hover:text-brand sm:w-auto">
                {t("home.viewResources")}
              </Link>
              <HomeFormulaCalculator trigger="desktop" />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HeroStat label={t("home.calculatorCount")} value={`${calculators.length}${t("directory.countCalculators")}`} />
              <HeroStat label={t("home.groupCount")} value={`${Object.keys(CALCULATOR_GROUP_META).length}${t("directory.countCalculators")}`} />
              <HeroStat label={t("home.standardYear")} value={`${legalStandards.year}`} />
            </div>
          </div>
          <div className="grid gap-4 self-stretch">
            <div className="rounded-[28px] border border-white/10 bg-white p-5 text-ink shadow-float md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <Logo />
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand">{t("home.live")}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label={t("home.metricMinimumWage")} value={formatWon(legalStandards.minimumWage)} compact />
                <Metric label={t("home.metricMonthlyWage")} value={formatWon(legalStandards.minimumMonthlyWage209h)} compact />
                <Metric label={t("home.metricHealthInsurance")} value="7.19%" compact />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {featured.map((calculator) => {
                  const presentation = getLocalizedCalculatorPresentation(calculator, locale);
                  return <Link
                    key={calculator.slug}
                    href={`/calculators/${calculator.slug}`}
                    className="flex h-full flex-col justify-between rounded-2xl border border-line bg-paper px-4 py-4 text-left transition hover:border-brand hover:bg-white"
                  >
                    <p className="text-xs font-extrabold text-brand">{presentation.badge}</p>
                    <h3 className="mt-2 text-base font-extrabold text-ink">{presentation.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{presentation.audience}</p>
                  </Link>
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-2 md:py-3">
        <div className="overflow-hidden rounded-[28px] border border-brand/20 bg-gradient-to-br from-[#e9fbf5] via-white to-[#eef3ff] p-6 shadow-panel md:p-7">
          <p className="text-sm font-extrabold text-brand">{t("home.indicatorEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl">{t("home.indicatorTitle")}</h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600 md:text-base">{t("home.indicatorDescription")}</p>
          <div className="mt-6">
            <MarketIndicators />
          </div>
        </div>
      </section>

      <section className="page-shell py-2 md:py-3">
        <AdSenseAd placement="top" />
      </section>

      <section id="directory" className="page-shell py-2 md:py-3">
        <div className="rounded-[28px] border border-line bg-white p-5 shadow-panel md:p-6">
          <div className="section-heading mb-4">
            <div>
            <p className="text-sm font-extrabold text-brand">{t("home.directoryEyebrow")}</p>
              <h2 className="mt-1 text-xl font-extrabold text-ink md:text-2xl">{t("home.directoryTitle")}</h2>
            </div>
            <Link href="/calculators" className="text-sm font-extrabold text-brand transition hover:text-ink">
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="grid gap-3 xl:grid-cols-6">
            {groups.map((group) => (
              <Link
                key={group.key}
                href={`/calculators?group=${group.key}`}
                className="flex h-full rounded-[22px] border border-line bg-paper px-4 py-4 text-left transition hover:border-brand hover:bg-white"
              >
                <div className="flex w-full flex-col justify-between gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-brand">
                      {group.icon} {group.label}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600">{group.count}{t("directory.countCalculators")}</span>
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-600">{group.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-brand/15 bg-brand/5 px-4 py-4">
            <p className="text-sm font-extrabold text-ink">계산의정석 계산기 빠른 검색</p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
              계산의 정석에서 찾는 무료 온라인 계산기와 생활 계산기 모음을 분야별로 바로 확인하세요.
            </p>
            <nav aria-label="계산의정석 주요 계산기" className="mt-3 flex flex-wrap gap-2">
              {brandRelatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-line bg-white px-3 py-2 text-xs font-extrabold text-brand transition hover:border-brand hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-4">
            <RelatedSearchTags />
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="section-heading mb-6">
          <div>
            <p className="text-sm font-extrabold text-brand">{t("home.guideEyebrow")}</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl">{t("home.guideTitle")}</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hubOrder.slice(0, 6).map((key) => {
            const hub = hubContents[key];
            return (
              <Link
                key={hub.key}
                href={hub.path}
                className="rounded-[24px] border border-line bg-white p-6 shadow-panel transition hover:-translate-y-1 hover:border-brand hover:shadow-float"
              >
                <p className="text-sm font-extrabold text-brand">{hub.eyebrow}</p>
                <h3 className="mt-3 text-xl font-extrabold text-ink">{hub.title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{hub.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-shell py-2 md:py-3">
        <AdSenseAd placement="bottom" />
      </section>

      <section className="page-shell py-2 md:py-3">
        <MiniCalculatorSection title={t("home.popular")} items={popular} locale={locale} viewAllLabel={t("home.viewAll")} />
        <div className="mt-4 flex justify-center">
          <Link href="/calculators" className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white transition hover:bg-brand">
            {t("home.allCalculators")}
          </Link>
        </div>
      </section>

      <section className="page-shell grid gap-6 pb-16">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
          <div className="section-heading">
            <div>
              <p className="text-sm font-extrabold text-brand">{t("home.blogEyebrow")}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight md:text-3xl text-ink">{t("home.blogTitle")}</h2>
            </div>
            <Link href="/blog" className="text-sm font-extrabold text-brand">
              {t("home.viewAll")}
            </Link>
          </div>
          <HomeBlogRoller posts={latestBlogPosts} />
        </div>
      </section>

      <section className="page-shell pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-4 shadow-panel">
          <p className="text-sm font-semibold text-slate-600">{t("home.trustDescription")}</p>
          <nav aria-label="사이트 안내" className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-extrabold text-brand">
            <Link href="/resources" className="transition hover:text-ink">{t("home.checkSources")}</Link>
            <Link href="/editorial-policy" className="transition hover:text-ink">{t("home.policy")}</Link>
            <Link href="/privacy" className="transition hover:text-ink">{t("home.privacy")}</Link>
            <Link href="/contact" className="transition hover:text-ink">{t("home.contact")}</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-line bg-white px-4 ${compact ? "py-4" : "py-4"}`}>
      <span className="block text-sm font-bold text-slate-500">{label}</span>
      <strong className={`mt-2 block font-extrabold text-ink ${compact ? "text-lg leading-6" : "text-xl"}`}>{value}</strong>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
      <p className="text-sm font-bold text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}

function MiniCalculatorSection({
  title,
  items,
  locale,
  viewAllLabel
}: {
  title: string;
  items: typeof calculators;
  locale: "ko" | "en" | "ja";
  viewAllLabel: string;
}) {
  return (
    <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-ink">{title}</h2>
        <Link href="/calculators" className="text-sm font-extrabold text-brand">
          {viewAllLabel}
        </Link>
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((calculator) => {
          const presentation = getLocalizedCalculatorPresentation(calculator, locale);
          return <Link
            key={calculator.slug}
            href={`/calculators/${calculator.slug}`}
            className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3 transition hover:bg-white"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-ink">{presentation.title}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">{presentation.audience}</span>
            </span>
            <span className="ml-3 text-sm font-extrabold text-brand">↗</span>
          </Link>;
        })}
      </div>
    </div>
  );
}
