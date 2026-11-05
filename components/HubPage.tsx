"use client";

import Link from "next/link";
import { AdSenseAd } from "@/components/AdSenseAd";
import { useLanguage } from "@/components/LanguageProvider";
import { getCalculatorsByGroup } from "@/lib/calculator-directory";
import { getLocalizedCalculatorPresentation } from "@/lib/calculator-i18n";
import { getLocalizedBlogPresentation } from "@/lib/blog-i18n";
import { calculators, type CalculatorConfig } from "@/lib/calculators";
import { blogPosts, type BlogPost } from "@/lib/content";
import type { HubContent } from "@/lib/hub-content";
import { getLocalizedHubContent } from "@/lib/hub-i18n";
import { SITE_URL } from "@/lib/constants";

export function HubPage({ hub }: { hub: HubContent }) {
  const { locale, t } = useLanguage();
  const localizedHub = getLocalizedHubContent(hub, locale);
  const groupCalculators = getCalculatorsByGroup(hub.group);
  const featured = hub.featuredSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter((calculator): calculator is CalculatorConfig => Boolean(calculator));
  const posts = hub.blogSlugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => Boolean(post));
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: localizedHub.title,
    description: localizedHub.description,
    url: `${SITE_URL}${hub.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "계산의정석",
      url: SITE_URL
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: featured.length,
      itemListElement: featured.map((calculator, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: calculator.title,
        url: `${SITE_URL}/calculators/${calculator.slug}`
      }))
    }
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: localizedHub.title, item: `${SITE_URL}${hub.path}` }
    ]
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">{localizedHub.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{localizedHub.title}</h1>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 md:text-base">{localizedHub.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/calculators?group=${hub.group}`} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72]">
            {t("hub.calculators")}
          </Link>
          <Link href="/blog" className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white/88 transition hover:border-brand hover:text-brand">
            {t("hub.relatedBlog")}
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {localizedHub.sections.map((section) => (
          <article key={section.title} className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <h2 className="text-lg font-extrabold leading-7 text-ink">{section.title}</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{section.body}</p>
          </article>
        ))}
      </section>

      {hub.key === "labor" && (
        <section className="mt-8 rounded-[28px] border border-brand/20 bg-brand/5 p-6 shadow-panel md:p-7" aria-labelledby="labor-start-title">
          <p className="text-sm font-extrabold text-brand">급여·노무 계산 순서</p>
          <h2 id="labor-start-title" className="mt-2 text-2xl font-extrabold text-ink">어떤 계산기부터 사용해야 할까요?</h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600">
            먼저 임금 기준과 근로시간을 확인하고, 세전·세후 급여를 구분한 뒤 퇴직·휴가·고용보험 항목을 각각 계산하면 결과를 해석하기 쉽습니다.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <StepCard number="01" title="임금 기준 확인" text="최저임금과 월급, 소정근로시간을 먼저 비교합니다." href="/calculators/minimum-wage" label="최저임금 계산기" />
            <StepCard number="02" title="급여명세서 비교" text="세전 급여와 4대 보험·소득세 공제 후 금액을 나눠 봅니다." href="/calculators/net-salary" label="실수령액 계산기" />
            <StepCard number="03" title="퇴직·고용 조건 확인" text="근속기간과 수급 요건을 확인한 뒤 예상 금액을 계산합니다." href="/calculators/severance" label="퇴직금 계산기" />
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-extrabold text-brand">
            <a href="https://www.moel.go.kr" target="_blank" rel="noreferrer">고용노동부 공식 안내 ↗</a>
            <a href="https://www.law.go.kr" target="_blank" rel="noreferrer">국가법령정보센터 ↗</a>
            <a href="https://www.ei.go.kr" target="_blank" rel="noreferrer">고용보험 공식 안내 ↗</a>
          </div>
        </section>
      )}

      <div className="mt-8">
        <AdSenseAd placement="top" />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-brand">{t("hub.featured")}</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">{t("hub.featuredTitle")}</h2>
            </div>
            <Link href={`/calculators?group=${hub.group}`} className="text-sm font-extrabold text-brand">
              {groupCalculators.length}{t("hub.allCount")}
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {featured.map((calculator) => {
              const presentation = getLocalizedCalculatorPresentation(calculator, locale);
              return <Link
                key={calculator.slug}
                href={`/calculators/${calculator.slug}`}
                className="rounded-[22px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
              >
                <p className="text-xs font-extrabold text-brand">{presentation.badge}</p>
                <h3 className="mt-2 text-lg font-extrabold text-ink">{presentation.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{presentation.description}</p>
              </Link>
            })}
          </div>
        </div>

        <aside className="rounded-[28px] bg-navy p-6 text-white shadow-panel">
          <p className="text-sm font-extrabold text-brand">{t("hub.checklist")}</p>
          <h2 className="mt-2 text-2xl font-extrabold">{t("hub.checklistTitle")}</h2>
          <div className="mt-5 grid gap-3">
            {localizedHub.checklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold leading-6 text-white/82">
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <div className="mt-8">
        <AdSenseAd placement="bottom" />
      </div>

      <section className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">{t("hub.related")}</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ink">{t("hub.relatedTitle")}</h2>
          </div>
          <Link href="/blog" className="text-sm font-extrabold text-brand">
            {t("hub.blogAll")}
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {posts.map((post) => (
            (() => {
              const presentation = getLocalizedBlogPresentation(post, locale);
              return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-[22px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
            >
              <p className="text-xs font-extrabold text-brand">{presentation.category}</p>
              <h3 className="mt-2 text-lg font-extrabold leading-7 text-ink">{presentation.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{presentation.excerpt}</p>
            </Link>
              );
            })()
          ))}
        </div>
      </section>
    </main>
  );
}

function StepCard({ number, title, text, href, label }: { number: string; title: string; text: string; href: string; label: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand">
      <span className="text-xs font-black text-brand">{number}</span>
      <h3 className="mt-2 text-base font-extrabold text-ink">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
      <span className="mt-3 block text-xs font-extrabold text-brand">{label} →</span>
    </Link>
  );
}
