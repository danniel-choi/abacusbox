import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalculatorClient } from "@/components/CalculatorClient";
import { calculators, getCalculator } from "@/lib/calculators";
import { CALCULATOR_GROUP_META, getCalculatorGroup, getRelatedCalculators } from "@/lib/calculator-directory";
import { blogPosts } from "@/lib/content";
import { legalStandards, officialSources, SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

function buildSeoTitle(title: string) {
  return `${title} | ${legalStandards.year} 기준 빠른 계산과 설명`;
}

function buildSeoDescription(calculator: NonNullable<ReturnType<typeof getCalculator>>) {
  return `${calculator.description} ${calculator.audience}가 ${legalStandards.year}년 기준으로 바로 계산하고, 체크포인트와 FAQ까지 함께 확인할 수 있습니다.`;
}

function getRelatedBlogPosts(calculator: NonNullable<ReturnType<typeof getCalculator>>) {
  const titleNeedle = calculator.title.replace(" 계산기", "");
  return blogPosts
    .filter((post) => {
      const haystack = [post.title, post.excerpt, ...post.tags].join(" ");
      return calculator.keywords.some((keyword) => haystack.includes(keyword)) || haystack.includes(titleNeedle);
    })
    .slice(0, 3);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};

  return {
    title: buildSeoTitle(calculator.title),
    description: buildSeoDescription(calculator),
    keywords: [...calculator.keywords, calculator.title, `${calculator.title} ${legalStandards.year}`, `${calculator.category} 계산기`],
    alternates: {
      canonical: `${SITE_URL}/calculators/${calculator.slug}`
    },
    openGraph: {
      title: buildSeoTitle(calculator.title),
      description: buildSeoDescription(calculator),
      url: `${SITE_URL}/calculators/${calculator.slug}`,
      type: "article",
      locale: "ko_KR"
    },
    twitter: {
      card: "summary_large_image",
      title: buildSeoTitle(calculator.title),
      description: buildSeoDescription(calculator)
    }
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();
  const relatedCalculators = getRelatedCalculators(calculator.slug, 4);
  const relatedBlogPosts = getRelatedBlogPosts(calculator);
  const groupMeta = CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/calculators/${calculator.slug}`,
    description: calculator.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW"
    }
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calculator.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "계산기",
        item: `${SITE_URL}/calculators`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculator.title,
        item: `${SITE_URL}/calculators/${calculator.slug}`
      }
    ]
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8">
          <nav className="text-sm font-semibold text-white/56">
            <Link href="/" className="hover:text-brand">홈</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand">계산기</Link>
            <span className="mx-2">/</span>
            <span>{calculator.title}</span>
          </nav>
          <div className="py-8">
            <p className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-extrabold text-brand">
              {calculator.category} 계산기 · {calculator.badge}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-extrabold text-white/84">
              <span>{groupMeta.icon}</span>
              <span>{groupMeta.label}</span>
            </div>
            <h1 className="mt-5 text-[clamp(2rem,7vw,3.5rem)] font-extrabold leading-tight md:text-5xl md:leading-tight lg:text-6xl">{calculator.title}</h1>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-white/68">{calculator.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/72">
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">{calculator.audience}</span>
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">기준연도 {legalStandards.year} 반영</span>
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">공유 가능한 결과 화면</span>
            </div>
            <div className="mt-6 grid gap-3 md:max-w-4xl md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-sm font-extrabold text-brand">누가 많이 쓰나</p>
                <p className="mt-2 text-sm font-medium leading-6 text-white/74">{calculator.audience}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-sm font-extrabold text-brand">먼저 볼 것</p>
                <p className="mt-2 text-sm font-medium leading-6 text-white/74">{calculator.checkpoints[0]}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-sm font-extrabold text-brand">이 페이지에서 제공</p>
                <p className="mt-2 text-sm font-medium leading-6 text-white/74">빠른 계산, 기준 설명, FAQ, 관련 계산기까지 한 번에 확인</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-6xl px-4">
        <Suspense fallback={<div className="rounded-[20px] border border-line bg-white p-6 shadow-panel">계산기를 불러오는 중입니다.</div>}>
          <CalculatorClient slug={calculator.slug} />
        </Suspense>
      </div>

      <article className="mx-auto mt-10 grid max-w-6xl gap-8 px-4">
        <section className="grid gap-4 md:grid-cols-3">
          {calculator.checkpoints.map((item, index) => (
            <div key={item} className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
              <p className="text-sm font-extrabold text-brand">CHECK {index + 1}</p>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-700">{item}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="rounded-[20px] border border-line bg-white p-6 shadow-panel">
            <h2 className="text-2xl font-extrabold text-ink md:text-3xl">{calculator.guideTitle}</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
              {legalStandards.year}년 기준으로 {calculator.title}를 확인할 때 자주 놓치는 입력 기준과 해석 포인트를 함께 정리했습니다.
            </p>
            <div className="mt-5 grid gap-4 text-base font-medium leading-8 text-slate-700">
              {calculator.guide.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 className="text-2xl font-extrabold text-ink md:text-3xl">자주 묻는 질문</h2>
              <div className="mt-4 grid gap-3">
                {calculator.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-[18px] border border-line bg-white p-5 shadow-sm">
                    <summary className="cursor-pointer font-extrabold text-ink">{faq.question}</summary>
                    <p className="mt-3 font-medium leading-7 text-slate-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="rounded-[20px] border border-line bg-white p-6 shadow-panel">
              <p className="text-sm font-extrabold text-brand">빠른 안내</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">이 계산기를 이렇게 쓰면 됩니다.</h2>
              <div className="mt-5 grid gap-4">
                {[
                  "현재 조건 입력",
                  "핵심 결과와 비교 차트 확인",
                  "FAQ와 기준 설명까지 검토"
                ].map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="rounded-[20px] bg-navy p-6 text-white">
          <h2 className="text-2xl font-extrabold">기준 및 출처</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/68">
            계산 결과는 참고용이며, 아래 공식 기준과 안내 자료를 바탕으로 {legalStandards.year}년 기준 정보를 반영했습니다.
          </p>
          <ul className="mt-4 grid gap-2 text-sm font-semibold text-white/68">
            {officialSources.map((source) => (
              <li key={source.href}>
                <a href={source.href} rel="noreferrer" target="_blank" className="text-brand underline underline-offset-4">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {relatedCalculators.length > 0 && (
          <section className="rounded-[20px] border border-line bg-white p-6 shadow-panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-brand">관련 계산기</p>
                <h2 className="mt-2 text-2xl font-extrabold text-ink">같이 많이 보는 계산기</h2>
              </div>
              <Link href="/calculators" className="text-sm font-extrabold text-brand">
                전체 보기 ↗
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedCalculators.map((item) => {
                const relatedGroup = CALCULATOR_GROUP_META[getCalculatorGroup(item.slug)];
                return (
                  <Link
                    key={item.slug}
                    href={`/calculators/${item.slug}`}
                    className="rounded-[20px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`grid h-11 w-11 place-items-center rounded-2xl text-lg ${relatedGroup.softClass} ${relatedGroup.accentClass}`}>
                        {relatedGroup.icon}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-500">{relatedGroup.label}</span>
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{item.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand">바로 보기 <span>↗</span></span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {relatedBlogPosts.length > 0 && (
          <section className="rounded-[20px] border border-line bg-white p-6 shadow-panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-brand">관련 가이드</p>
                <h2 className="mt-2 text-2xl font-extrabold text-ink">계산 전에 같이 보면 좋은 글</h2>
              </div>
              <Link href="/blog" className="text-sm font-extrabold text-brand">
                블로그 전체 보기 ↗
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/post?slug=${encodeURIComponent(post.slug)}`}
                  className="rounded-[20px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
                >
                  <p className="text-xs font-extrabold text-brand">{post.category}</p>
                  <h3 className="mt-3 text-base font-extrabold text-ink">{post.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand">가이드 보기 <span>↗</span></span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
