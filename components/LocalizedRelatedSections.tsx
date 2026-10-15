"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedBlogPresentation } from "@/lib/blog-i18n";
import { getLocalizedCalculatorPresentation } from "@/lib/calculator-i18n";
import { getCalculatorGroup, getCalculatorIcon, getLocalizedGroupMeta } from "@/lib/calculator-directory";
import type { CalculatorCategory, CalculatorSlug } from "@/lib/calculators";
import type { BlogPost } from "@/lib/content";

type RelatedCalculator = Pick<
  { slug: CalculatorSlug; title: string; description: string; category: CalculatorCategory; badge: string; audience: string },
  "slug" | "title" | "description" | "category" | "badge" | "audience"
>;

export function LocalizedRelatedCalculatorSection({ items }: { items: RelatedCalculator[] }) {
  const { locale } = useLanguage();
  const copy = locale === "en"
    ? { eyebrow: "Related calculators", title: "Tools people often check together", all: "View all ↗", open: "Open" }
    : locale === "ja"
      ? { eyebrow: "関連計算機", title: "一緒によく見る計算機", all: "すべて見る ↗", open: "開く" }
      : { eyebrow: "관련 계산기", title: "같이 많이 보는 계산기", all: "전체 보기 ↗", open: "바로 보기" };

  return (
    <section className="rounded-[20px] border border-line bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-brand">{copy.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">{copy.title}</h2>
        </div>
        <Link href="/calculators" className="text-sm font-extrabold text-brand">{copy.all}</Link>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const presentation = getLocalizedCalculatorPresentation(item, locale);
          const group = getLocalizedGroupMeta(locale, getCalculatorGroup(item.slug));
          return (
            <Link key={item.slug} href={`/calculators/${item.slug}`} className="rounded-[20px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl text-lg ${group.softClass} ${group.accentClass}`}>{getCalculatorIcon(item.slug)}</span>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-500">{group.label}</span>
              </div>
              <h3 className="mt-4 text-base font-extrabold text-ink">{presentation.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{presentation.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand">{copy.open} <span>↗</span></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

type RelatedBlog = Pick<BlogPost, "slug" | "title" | "excerpt" | "category" | "tags">;

export function LocalizedRelatedBlogSection({ items }: { items: RelatedBlog[] }) {
  const { locale } = useLanguage();
  const copy = locale === "en"
    ? { eyebrow: "Related guides", title: "Read these before calculating", all: "View all blog posts ↗", open: "Read guide" }
    : locale === "ja"
      ? { eyebrow: "関連ガイド", title: "計算前に読んでおきたい記事", all: "ブログ一覧 ↗", open: "ガイドを見る" }
      : { eyebrow: "관련 가이드", title: "계산 전에 같이 보면 좋은 글", all: "블로그 전체 보기 ↗", open: "가이드 보기" };

  return (
    <section className="rounded-[20px] border border-line bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-brand">{copy.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">{copy.title}</h2>
        </div>
        <Link href="/blog" className="text-sm font-extrabold text-brand">{copy.all}</Link>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map((post) => {
          const presentation = getLocalizedBlogPresentation(post, locale);
          return (
            <Link key={post.slug} href={`/blog/${encodeURIComponent(post.slug)}`} className="rounded-[20px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white">
              <p className="text-xs font-extrabold text-brand">{presentation.category}</p>
              <h3 className="mt-3 text-base font-extrabold text-ink">{presentation.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{presentation.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand">{copy.open} <span>↗</span></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
