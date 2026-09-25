import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDetailClient } from "@/components/ContentDetailClient";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "블로그 글",
  description: "계산의정석 블로그 상세 페이지",
  robots: {
    index: false,
    follow: true
  }
};

export default function BlogPostClientPage() {
  const fallbackItems = blogPosts.map((post, index) => ({
    id: index + 1,
    type: "blog",
    board: "guide",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body_md: post.content.join("\n\n"),
    published_at: post.publishedAt,
    featured: 0,
    view_count: 0,
    comment_count: 0,
    like_count: 0,
    author_name: "계산의정석",
    tags: post.tags.map((tag) => ({ slug: tag, name: tag })),
    calculators: []
  }));

  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl px-4 py-12 text-sm font-semibold text-slate-500">콘텐츠를 불러오는 중입니다.</main>}>
      <ContentDetailClient apiBasePath="/api/blog" listPath="/blog" fallbackItems={fallbackItems} mode="blog" />
    </Suspense>
  );
}
