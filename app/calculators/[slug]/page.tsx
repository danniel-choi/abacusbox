import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdSenseAd } from "@/components/AdSenseAd";
import { CalculatorClient } from "@/components/CalculatorClient";
import { LocalizedCalculatorHero } from "@/components/LocalizedCalculatorHero";
import { LocalizedRelatedBlogSection, LocalizedRelatedCalculatorSection } from "@/components/LocalizedRelatedSections";
import { LocalizedCalculatorCopy } from "@/components/LocalizedCalculatorCopy";
import { calculators, getCalculator } from "@/lib/calculators";
import { getCalculatorGroup, getRelatedCalculators } from "@/lib/calculator-directory";
import { calculatorSeoContent } from "@/lib/calculator-seo";
import { blogPosts } from "@/lib/content";
import { DEFAULT_OG_IMAGE, legalStandards, officialSources, SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

type ReferenceSite = {
  href: string;
  label: string;
  text: string;
  internal?: boolean;
};

const KASI_COPYRIGHT_NOTICE = {
  sourceHref: "https://astro.kasi.re.kr/",
  policyHref: "https://www.kasi.re.kr/kor/pageView/293",
  koglHref: "https://www.kogl.or.kr/info/licenseType1.do",
  copyright: "Copyright (C) Korea Astronomy and Space Science Institute. All Rights Reserved.",
  license: "공공누리 제1유형: 출처표시 조건에 따라 이용할 수 있습니다.",
  inclusion: "이 고지는 일출일몰시각계산 페이지 및 해당 기능의 복사본 또는 상당 부분에 함께 포함되어야 합니다."
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

function getReferenceSites(group: ReturnType<typeof getCalculatorGroup>) {
  const common: ReferenceSite[] = [
    {
      href: "/resources",
      label: "법률·세무·금융 참고 사이트",
      text: "공식기관과 공공 정보 사이트를 분야별로 모아둔 참고 링크 허브입니다.",
      internal: true
    }
  ];

  if (group === "tax") {
    return [
      ...common,
      { href: "https://www.nts.go.kr", label: "국세청", text: "소득세, 연말정산, 상속·증여세, 부가가치세 등 국세 제도 안내를 확인합니다." },
      { href: "https://www.hometax.go.kr", label: "홈택스", text: "신고, 납부, 증명 발급, 연말정산 자료 조회를 진행하는 공식 세무 서비스입니다." },
      { href: "https://txsi.hometax.go.kr", label: "국세법령정보시스템", text: "세법 법령, 예규, 판례, 심판례를 함께 확인할 수 있습니다." }
    ];
  }

  if (group === "loan" || group === "investment") {
    return [
      ...common,
      { href: "https://fine.fss.or.kr", label: "금융소비자정보포털 파인", text: "금융회사, 금융상품, 휴면계좌, 금융소비자 유의사항을 확인합니다." },
      { href: "https://finlife.fss.or.kr", label: "금융상품한눈에", text: "예금, 적금, 대출, 연금저축 등 금융상품 조건을 비교합니다." },
      { href: "https://dart.fss.or.kr", label: "전자공시시스템 DART", text: "상장·외감 기업의 공시와 재무제표를 확인합니다." }
    ];
  }

  if (group === "labor") {
    return [
      ...common,
      { href: "https://www.law.go.kr", label: "국가법령정보센터", text: "근로기준법, 시행령, 시행규칙 등 법령 원문과 개정 이력을 확인합니다." },
      { href: "https://www.moel.go.kr", label: "고용노동부", text: "임금, 휴가, 퇴직, 고용보험 관련 정책과 민원 안내를 확인합니다." },
      { href: "https://www.ei.go.kr", label: "고용보험", text: "실업급여, 고용보험 자격, 제도 안내를 확인합니다." }
    ];
  }

  if (group === "business") {
    return [
      ...common,
      { href: "https://www.hometax.go.kr", label: "홈택스", text: "사업자 세금 신고, 계산서, 부가가치세, 증명 발급을 처리합니다." },
      { href: "https://www.nts.go.kr", label: "국세청", text: "부가가치세, 종합소득세, 사업자 세무 안내를 확인합니다." },
      { href: "https://www.ftc.go.kr", label: "공정거래위원회", text: "전자상거래, 표시광고, 소비자거래 관련 제도와 사업자 유의사항을 확인합니다." }
    ];
  }

  return [
    ...common,
    { href: "https://www.law.go.kr", label: "국가법령정보센터", text: "생활 속 계약, 제도, 신고 기준과 관련된 법령 원문을 확인합니다." },
    { href: "https://www.easylaw.go.kr", label: "찾기쉬운 생활법령정보", text: "생활 주제별 법령 해설과 체크리스트를 확인합니다." },
    { href: "https://fine.fss.or.kr", label: "금융소비자정보포털 파인", text: "금융 관련 생활 정보와 소비자 보호 자료를 확인합니다." }
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};
  const seoContent = calculatorSeoContent[calculator.slug];

  return {
    title: seoContent?.title || buildSeoTitle(calculator.title),
    description: seoContent?.description || buildSeoDescription(calculator),
    keywords: [
      ...calculator.keywords,
      ...(seoContent?.keywords || []),
      calculator.title,
      `${calculator.title} ${legalStandards.year}`,
      `${calculator.category} 계산기`
    ],
    alternates: {
      canonical: `${SITE_URL}/calculators/${calculator.slug}`
    },
    openGraph: {
      title: seoContent?.title || buildSeoTitle(calculator.title),
      description: seoContent?.description || buildSeoDescription(calculator),
      url: `${SITE_URL}/calculators/${calculator.slug}`,
      type: "article",
      locale: "ko_KR",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${calculator.title} - 계산의정석`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seoContent?.title || buildSeoTitle(calculator.title),
      description: seoContent?.description || buildSeoDescription(calculator),
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();
  const relatedCalculators = getRelatedCalculators(calculator.slug, 4);
  const relatedBlogPosts = getRelatedBlogPosts(calculator);
  const referenceSites = getReferenceSites(getCalculatorGroup(calculator.slug));
  const seoContent = calculatorSeoContent[calculator.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/calculators/${calculator.slug}`,
    description: seoContent?.description || calculator.description,
    keywords: [...calculator.keywords, ...(seoContent?.keywords || [])].join(", "),
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
      <LocalizedCalculatorHero
        calculator={{
          slug: calculator.slug,
          title: calculator.title,
          description: calculator.description,
          category: calculator.category,
          badge: calculator.badge,
          audience: calculator.audience,
          checkpoints: calculator.checkpoints
        }}
      />

      <div className="mx-auto -mt-10 max-w-6xl px-4">
        <Suspense fallback={<div className="rounded-[20px] border border-line bg-white p-6 shadow-panel"><LocalizedCalculatorCopy id="loading" /></div>}>
          <CalculatorClient slug={calculator.slug} />
        </Suspense>
      </div>

      <article className="mx-auto mt-10 grid max-w-6xl gap-8 px-4">
        <AdSenseAd placement="calculator" />

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
            <h2 className="text-2xl font-extrabold text-ink md:text-3xl"><LocalizedCalculatorCopy id="guideTitle" /></h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
              <LocalizedCalculatorCopy id="guideIntro" />
            </p>
            <div className="mt-5 grid gap-4 text-base font-medium leading-8 text-slate-700">
              {calculator.guide.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {seoContent && (
          <section className="rounded-[20px] border border-line bg-white p-6 shadow-panel">
            <p className="text-sm font-extrabold text-brand"><LocalizedCalculatorCopy id="faq" /></p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl"><LocalizedCalculatorCopy id="searchTitle" /></h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {seoContent.sections.map((section) => (
                <article key={section.title} className="rounded-[18px] bg-paper p-5">
                  <h3 className="text-lg font-extrabold leading-7 text-ink">{section.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{section.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {seoContent.internalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[18px] border border-line bg-white p-5 transition hover:border-brand hover:bg-paper"
                >
                  <p className="text-sm font-extrabold text-brand">{item.label}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdSenseAd placement="inArticle" />

        <section>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 className="text-2xl font-extrabold text-ink md:text-3xl"><LocalizedCalculatorCopy id="faq" /></h2>
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
              <p className="text-sm font-extrabold text-brand"><LocalizedCalculatorCopy id="quickGuide" /></p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink"><LocalizedCalculatorCopy id="quickGuideTitle" /></h2>
              <div className="mt-5 grid gap-4">
                {[
                  <LocalizedCalculatorCopy key="current-condition" id="currentCondition" />,
                  <LocalizedCalculatorCopy key="check-result" id="checkResult" />,
                  <LocalizedCalculatorCopy key="review-faq" id="reviewFaq" />
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
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
          <h2 className="text-2xl font-extrabold"><LocalizedCalculatorCopy id="sources" /></h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/68">
            <LocalizedCalculatorCopy id="sourceDescription" />
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
          {calculator.slug === "sunrise-sunset-calculator" && (
            <div className="mt-6 rounded-[18px] border border-brand/30 bg-white/8 p-5">
              <p className="text-sm font-extrabold text-brand"><LocalizedCalculatorCopy id="kasiNotice" /></p>
              <div className="mt-4 grid gap-3 text-sm font-semibold leading-6 text-white/76">
                <p>
                  출처:
                  {" "}
                  <a href={KASI_COPYRIGHT_NOTICE.sourceHref} rel="noreferrer" target="_blank" className="text-brand underline underline-offset-4">
                    한국천문연구원 천문우주포털
                  </a>
                </p>
                <p>{KASI_COPYRIGHT_NOTICE.copyright}</p>
                <p>{KASI_COPYRIGHT_NOTICE.license}</p>
                <p>{KASI_COPYRIGHT_NOTICE.inclusion}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={KASI_COPYRIGHT_NOTICE.policyHref} rel="noreferrer" target="_blank" className="rounded-full border border-brand/40 px-4 py-2 text-xs font-extrabold text-brand transition hover:bg-brand hover:text-white">
                    <LocalizedCalculatorCopy id="kasiPolicy" />
                  </a>
                  <a href={KASI_COPYRIGHT_NOTICE.koglHref} rel="noreferrer" target="_blank" className="rounded-full border border-brand/40 px-4 py-2 text-xs font-extrabold text-brand transition hover:bg-brand hover:text-white">
                    <LocalizedCalculatorCopy id="publicNuri" />
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 rounded-[18px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-brand"><LocalizedCalculatorCopy id="officialSites" /></p>
                <h3 className="mt-2 text-xl font-extrabold text-white"><LocalizedCalculatorCopy id="officialSitesTitle" /></h3>
              </div>
              <Link href="/resources" className="rounded-full border border-brand/40 px-4 py-2 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white">
                <LocalizedCalculatorCopy id="viewResources" />
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {referenceSites.map((site) => {
                const className = "rounded-2xl border border-white/10 bg-white/6 p-4 transition hover:border-brand hover:bg-white/10";
                const content = (
                  <>
                    <p className="text-sm font-extrabold text-brand">{site.label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-white/70">{site.text}</p>
                  </>
                );
                return site.internal ? (
                  <Link key={site.href} href={site.href} className={className}>
                    {content}
                  </Link>
                ) : (
                  <a key={site.href} href={site.href} target="_blank" rel="noreferrer" className={className}>
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {relatedCalculators.length > 0 && (
          <LocalizedRelatedCalculatorSection
            items={relatedCalculators.map(({ slug, title, description, category, badge, audience }) => ({ slug, title, description, category, badge, audience }))}
          />
        )}

        <AdSenseAd placement="bottom" />

        {relatedBlogPosts.length > 0 && (
          <LocalizedRelatedBlogSection
            items={relatedBlogPosts.map(({ slug, title, excerpt, category, tags }) => ({ slug, title, excerpt, category, tags }))}
          />
        )}
      </article>
    </main>
  );
}
