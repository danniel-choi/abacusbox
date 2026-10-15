"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { BlogPost } from "@/lib/content";
import { getLocalizedBlogPresentation } from "@/lib/blog-i18n";

type Props = {
  posts: BlogPost[];
};

const ROLLING_INTERVAL_MS = 4500;

export function HomeBlogRoller({ posts }: Props) {
  const { locale, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posts.length);
    }, ROLLING_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <div className="mt-6 rounded-[24px] border border-dashed border-line bg-paper px-5 py-8 text-sm font-semibold text-slate-500">
        {t("blog.loading")}
      </div>
    );
  }

  const currentIndex = activeIndex % posts.length;
  const activePost = posts[currentIndex];
  const activePresentation = getLocalizedBlogPresentation(activePost, locale);

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <div className="group relative overflow-hidden rounded-[28px] bg-ink px-6 py-6 text-white shadow-panel transition hover:-translate-y-1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,181,133,0.28),transparent_44%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
            <span className="rounded-full bg-brand/15 px-3 py-1 text-brand">{activePresentation.category}</span>
            <span className="rounded-full bg-white/8 px-3 py-1 text-white/72">{formatDate(activePost.publishedAt, locale)}</span>
            <span className="rounded-full bg-white/8 px-3 py-1 text-white/72">{t("blog.readTime")} {activePost.readTime}</span>
          </div>
          <h3 className="mt-5 max-w-2xl text-2xl font-extrabold leading-tight text-white md:text-[2rem]">
            {activePresentation.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/72 md:text-base">
            {activePresentation.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {activePresentation.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-bold text-white/78">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <Link
              href={`/blog/${encodeURIComponent(activePost.slug)}`}
              className="text-sm font-extrabold text-brand transition hover:text-white"
            >
              {t("hub.relatedBlog")} <span aria-hidden="true">↗</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex((current) => (current - 1 + posts.length) % posts.length);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-extrabold text-white/82 transition hover:bg-white/12"
                aria-label={t("blog.previous")}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveIndex((current) => (current + 1) % posts.length);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-extrabold text-white/82 transition hover:bg-white/12"
                aria-label={t("blog.next")}
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            {posts.map((post, index) => (
              <button
                key={post.slug}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                }}
                aria-label={`${index + 1} ${locale === "ko" ? "번째 글 보기" : locale === "en" ? "view post" : "番目の記事を見る"}`}
                aria-pressed={activeIndex === index}
                className={`h-2.5 rounded-full transition ${
                  currentIndex === index ? "w-8 bg-brand" : "w-2.5 bg-white/28 hover:bg-white/48"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {posts.map((post, index) => {
          const presentation = getLocalizedBlogPresentation(post, locale);
          return (
          <Link
            key={post.slug}
            href={`/blog/${encodeURIComponent(post.slug)}`}
            className={`rounded-[22px] border px-5 py-4 transition ${
              currentIndex === index
                ? "border-brand bg-brand/5 shadow-panel"
                : "border-line bg-paper hover:border-brand hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold text-brand">{presentation.category}</p>
              <span className="text-xs font-bold text-slate-500">{formatDate(post.publishedAt, locale)}</span>
            </div>
            <h4 className="mt-2 text-base font-extrabold leading-6 text-ink">{presentation.title}</h4>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{presentation.excerpt}</p>
          </Link>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(value: string, locale: "ko" | "en" | "ja") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : "ko-KR", {
    month: "long",
    day: "numeric"
  });
}
