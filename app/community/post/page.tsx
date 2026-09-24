import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDetailClient } from "@/components/ContentDetailClient";
import { communityPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "커뮤니티 글",
  description: "계산의정석 커뮤니티 상세 페이지",
  robots: {
    index: false,
    follow: false
  }
};

export default function CommunityPostClientPage() {
  const fallbackItems = communityPosts.map((post, index) => ({
    id: index + 1,
    type: "community",
    board: post.board === "질문답변" ? "qna" : post.board === "사례공유" ? "case" : "notice",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body_md: post.content.join("\n\n"),
    published_at: post.publishedAt,
    featured: 0,
    view_count: 0,
    comment_count: post.comments,
    like_count: post.likes,
    author_name: post.author,
    tags: [],
    calculators: []
  }));

  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl px-4 py-12 text-sm font-semibold text-slate-500">콘텐츠를 불러오는 중입니다.</main>}>
      <ContentDetailClient apiBasePath="/api/community" listPath="/community" fallbackItems={fallbackItems} mode="community" />
    </Suspense>
  );
}
