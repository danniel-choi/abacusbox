import type { Metadata } from "next";
import { Suspense } from "react";
import { CommunityIntro } from "@/components/CommunityIntro";
import { ContentListClient, type ContentListItem } from "@/components/ContentListClient";
import { communityPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "질문, 사례, 운영 공지를 한 곳에서 볼 수 있는 계산의정석 커뮤니티입니다.",
  robots: {
    index: false,
    follow: false
  }
};

export default function CommunityPage() {
  const fallbackItems: ContentListItem[] = communityPosts.map((post, index) => ({
    id: index + 1,
    type: "community",
    board: post.board === "질문답변" ? "qna" : post.board === "사례공유" ? "case" : "notice",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    published_at: post.publishedAt,
    featured: 0,
    view_count: 0,
    comment_count: post.comments,
    like_count: post.likes,
    author_name: post.author
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <CommunityIntro />

      <Suspense fallback={<section className="mt-8 text-sm font-semibold text-slate-500">게시판을 불러오는 중입니다.</section>}>
        <ContentListClient
          apiPath="/api/community"
          detailBasePath="/community/post"
          fallbackItems={fallbackItems}
          meta="community"
        />
      </Suspense>
    </main>
  );
}
