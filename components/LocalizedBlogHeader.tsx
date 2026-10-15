"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedBlogPresentation } from "@/lib/blog-i18n";
import type { BlogPost } from "@/lib/content";

export function LocalizedBlogHeader({ post }: { post: BlogPost }) {
  const { locale, t } = useLanguage();
  const presentation = getLocalizedBlogPresentation(post, locale);
  const copy = locale === "en"
    ? { back: "← Back to blog", reading: "Read time", brand: "CalcRule", related: "Related calculator" }
    : locale === "ja"
      ? { back: "← ブログ一覧", reading: "読了時間", brand: "計算の定石", related: "関連計算機" }
      : { back: "← 블로그 목록", reading: "읽는 시간", brand: "계산의정석", related: "이 글과 연결된 계산기" };

  return (
    <>
      <Link href="/blog" className="text-sm font-extrabold text-brand">{copy.back}</Link>
      <div className="mt-5 flex flex-wrap gap-2 text-sm font-extrabold">
        <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{presentation.category}</span>
        <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{post.publishedAt}</span>
        <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{copy.reading} {post.readTime}</span>
        <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{copy.brand}</span>
      </div>
      <h1 className="mt-5 break-words text-3xl font-extrabold leading-tight text-ink [word-break:normal] sm:text-4xl">{presentation.title}</h1>
      <p className="mt-4 break-words text-base font-medium leading-7 text-slate-600 [word-break:normal]">{presentation.excerpt}</p>
      <p className="sr-only">{t("blog.contentHub")} · {copy.related}</p>
    </>
  );
}
