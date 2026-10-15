import type { Metadata } from "next";
import { BlogPageClient } from "@/components/BlogPageClient";
import type { ContentListItem } from "@/components/ContentListClient";
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
      <BlogPageClient fallbackItems={fallbackItems} />
    </main>
  );
}
