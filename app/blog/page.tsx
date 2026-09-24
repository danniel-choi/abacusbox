import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentListClient, type ContentListItem } from "@/components/ContentListClient";
import { getLatestBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "블로그",
  description: "노무·금융 계산과 연결되는 제도 해설, 실무 가이드, 운영 업데이트를 제공합니다."
};

export default function BlogPage() {
  const fallbackItems: ContentListItem[] = getLatestBlogPosts().map((post, index) => ({
    id: index + 1,
    type: "blog",
    board: "guide",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    published_at: post.publishedAt,
    featured: 0,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "계산의정석"
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">콘텐츠 허브</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">블로그</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">
          계산 결과를 이해하는 데 필요한 제도 설명, 비교 글, 운영 업데이트를 모아둔 공간입니다.
        </p>
      </section>

      <Suspense fallback={<section className="mt-8 text-sm font-semibold text-slate-500">콘텐츠를 불러오는 중입니다.</section>}>
        <ContentListClient apiPath="/api/blog" detailBasePath="/blog/post" fallbackItems={fallbackItems} meta="blog" pageSize={10} />
      </Suspense>
    </main>
  );
}
