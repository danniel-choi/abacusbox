import type { Metadata } from "next";
import { BlogPageClient } from "@/components/BlogPageClient";
import type { ContentListItem } from "@/components/ContentListClient";
import { getLatestBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "블로그",
  description: "노무·금융 계산과 연결되는 제도 해설, 실무 가이드, 운영 업데이트를 제공합니다.",
  alternates: { canonical: "/blog" }
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
      <section className="mb-8 rounded-[24px] border border-line bg-white p-5 shadow-panel" aria-labelledby="featured-blog-links">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">계산기와 함께 보는 가이드</p>
            <h2 id="featured-blog-links" className="mt-1 text-xl font-extrabold text-ink">최근 계산·금융 가이드</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">주요 글 바로가기</span>
        </div>
        <nav className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="주요 블로그 글">
          {fallbackItems.slice(0, 6).map((item) => (
            <a
              key={item.slug}
              href={`/blog/${encodeURIComponent(item.slug)}`}
              className="rounded-[18px] border border-line bg-paper p-4 transition hover:border-brand hover:bg-white"
            >
              <p className="text-xs font-extrabold text-brand">{item.published_at || "계산 가이드"}</p>
              <p className="mt-2 line-clamp-2 text-sm font-extrabold leading-6 text-ink">{item.title}</p>
            </a>
          ))}
        </nav>
      </section>
      <BlogPageClient fallbackItems={fallbackItems} />
    </main>
  );
}
