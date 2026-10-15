"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n";
import { calculators } from "@/lib/calculators";
import {
  CALCULATOR_GROUP_META,
  getCalculatorIcon,
  getCalculatorsByGroup,
  getFeaturedCalculators,
  getCalculatorGroup,
  getLocalizedGroupMeta,
  getPopularCalculators,
  getRecentCalculators
} from "@/lib/calculator-directory";
import { getLatestBlogPosts } from "@/lib/content";
import { getLocalizedCalculatorPresentation } from "@/lib/calculator-i18n";
import { legalStandards } from "@/lib/constants";
import { formatWon } from "@/lib/format";
import { hubContents, hubOrder } from "@/lib/hub-content";
import { CalculatorDirectoryClient } from "@/components/CalculatorDirectoryClient";
import { AdSenseAd } from "@/components/AdSenseAd";
import { HomeBlogRoller } from "@/components/HomeBlogRoller";
import { Logo } from "@/components/Logo";
import { RecentCalculatorsSection } from "@/components/RecentCalculatorsSection";

export default function HomePage() {
  const { locale, t } = useLanguage();
  const featured = getFeaturedCalculators().slice(0, 4);
  const popular = getPopularCalculators();
  const recent = getRecentCalculators();
  const shareableSlugs = [
    "year-end-tax-settlement",
    "poker-equity-calculator",
    "spending-habit-score",
    "salary-vanish-calculator",
    "fire-retirement-age",
    "retirement-savings"
  ];
  const shareableCalculators = shareableSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter(Boolean) as typeof calculators;
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
        </div>
      </section>

      <RecentCalculatorsSection />

      <section className="page-shell py-2 md:py-3">
        <AdSenseAd placement="top" />
      </section>

      <section className="page-shell section-shell">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel md:p-7">
          <div className="section-heading mb-6">
            <div>
              <p className="text-sm font-extrabold text-brand">{t("home.shareEyebrow")}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl">{t("home.shareTitle")}</h2>
            </div>
            <Link href="/calculators" className="text-sm font-extrabold text-brand transition hover:text-ink">
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shareableCalculators.map((calculator) => {
              const groupMeta = CALCULATOR_GROUP_META[getCalculatorGroupForHome(calculator.slug)];
              const presentation = getLocalizedCalculatorPresentation(calculator, locale);
              return (
                <Link
                  key={calculator.slug}
                  href={`/calculators/${calculator.slug}`}
                  className="group flex h-full flex-col justify-between rounded-[22px] border border-line bg-paper p-5 transition hover:-translate-y-1 hover:border-brand hover:bg-white hover:shadow-float"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className={`grid h-11 w-11 place-items-center rounded-2xl text-lg ${groupMeta.softClass} ${groupMeta.accentClass}`}>
                        {getCalculatorIcon(calculator.slug)}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-500 group-hover:text-brand">{t("home.resultCard")}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold text-ink">{presentation.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{presentation.description}</p>
                  </div>
                  <div className="mt-5 rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs font-extrabold text-brand">{t("home.shareExample")}</p>
                    <p className="mt-1 text-sm font-extrabold leading-6 text-ink">{getShareExample(calculator.slug, locale)}</p>
                  </div>
                </Link>
              );
            })}
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
          {hubOrder.map((key) => {
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

      <section id="directory" className="page-shell section-shell">
        <CalculatorDirectoryClient compact />
      </section>

      <section className="page-shell py-2 md:py-3">
        <AdSenseAd placement="bottom" />
      </section>

      <section className="page-shell py-2 md:py-3">
        <div className="grid gap-6 lg:grid-cols-2">
          <MiniCalculatorSection title={t("home.popular")} items={popular} locale={locale} />
          <MiniCalculatorSection title={t("home.recent")} items={recent} locale={locale} />
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="section-heading mb-6">
          <div>
              <p className="text-sm font-extrabold text-brand">{t("home.flowEyebrow")}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl">{t("home.flowTitle")}</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <ProcessCard step="01" title={t("home.processFind")} text={t("home.processFindText")} />
          <ProcessCard step="02" title={t("home.processCalculate")} text={t("home.processCalculateText")} />
          <ProcessCard step="03" title={t("home.processReview")} text={t("home.processReviewText")} />
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
          <div className="section-heading mb-5">
            <div>
              <p className="text-sm font-extrabold text-brand">{t("home.siteGuide")}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl">{t("home.siteGuideTitle")}</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: t("home.siteFeature1Title"), text: t("home.siteFeature1Text") },
              { title: t("home.siteFeature2Title"), text: t("home.siteFeature2Text") },
              { title: t("home.siteFeature3Title"), text: t("home.siteFeature3Text") },
              { title: t("home.siteFeature4Title"), text: t("home.siteFeature4Text") }
            ].map((item) => (
              <div key={item.title} className="rounded-[20px] bg-paper p-5">
                <h3 className="text-base font-extrabold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/about" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">{t("home.reference")}</Link>
            <Link href="/editorial-policy" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">{t("home.policy")}</Link>
            <Link href="/privacy" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">{t("home.privacy")}</Link>
            <Link href="/terms" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">{t("home.terms")}</Link>
            <Link href="/contact" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">{t("home.contact")}</Link>
          </div>
        </div>
      </section>

      <section id="sources" className="page-shell pb-16">
        <div className="rounded-[28px] bg-navy p-6 text-white shadow-panel">
          <p className="text-sm font-extrabold text-brand">{t("home.trustEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight md:text-3xl">{t("home.trustTitle")}</h2>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">
            {t("home.trustDescription")}
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              t("home.trust1"),
              t("home.trust2"),
              t("home.trust3"),
              t("home.trust4")
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white/82">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/resources" className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72]">
              {t("home.checkSources")}
            </Link>
          </div>
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

function getCalculatorGroupForHome(slug: (typeof calculators)[number]["slug"]) {
  return getCalculatorGroup(slug);
}

function getShareExample(slug: (typeof calculators)[number]["slug"], locale: "ko" | "en" | "ja") {
  if (locale === "en") {
    const examples: Record<string, string> = {
      "year-end-tax-settlement": "Estimated refund: ₩420,000",
      "poker-equity-calculator": "Win probability: 68.4%",
      "spending-habit-score": "Spending score: 82",
      "salary-vanish-calculator": "Salary runs out on day 24",
      "fire-retirement-age": "FIRE possible at age 45",
      "retirement-savings": "Retirement savings gap: ₩180M"
    };
    return examples[slug] ?? "Check your result and share it";
  }
  if (locale === "ja") {
    const examples: Record<string, string> = {
      "year-end-tax-settlement": "還付見込み：₩420,000",
      "poker-equity-calculator": "勝率：68.4%",
      "spending-habit-score": "消費習慣スコア：82",
      "salary-vanish-calculator": "給料がなくなる日：24日",
      "fire-retirement-age": "45歳でFIRE可能",
      "retirement-savings": "老後資金の不足額：₩180M"
    };
    return examples[slug] ?? "結果を確認して共有できます";
  }
  if (slug === "year-end-tax-settlement") return "내 연말정산 예상 결과 환급 42만원";
  if (slug === "poker-equity-calculator") return "내 포커 승률 68.4%";
  if (slug === "spending-habit-score") return "내 소비 습관 점수 82점";
  if (slug === "salary-vanish-calculator") return "내 월급은 24일차에 사라짐";
  if (slug === "fire-retirement-age") return "내 FIRE 예상 결과 45세 FIRE 가능";
  if (slug === "retirement-savings") return "내 은퇴자금 부족 1.8억원";
  return "내 계산 결과를 이미지 카드로 공유";
}

function ProcessCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
      <p className="text-sm font-extrabold text-brand">{step}</p>
      <h3 className="mt-3 text-xl font-extrabold text-ink">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function MiniCalculatorSection({
  title,
  items,
  locale
}: {
  title: string;
  items: typeof calculators;
  locale: "ko" | "en" | "ja";
}) {
  return (
    <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-ink">{title}</h2>
        <Link href="/calculators" className="text-sm font-extrabold text-brand">
          전체 보기 ↗
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
