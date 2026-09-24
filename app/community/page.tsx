import type { Metadata } from "next";
import { Suspense } from "react";
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
      <section className="rounded-[28px] bg-navy px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">사용자 공간</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">커뮤니티</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">
          계산기 사용 중 생기는 질문, 실제 사례, 운영 공지를 모아두는 게시판형 공간입니다. 운영상 검토가 필요한 사용자 생성 콘텐츠가 포함될 수 있어 색인과 노출은 보수적으로 관리합니다.
        </p>
      </section>

      <Suspense fallback={<section className="mt-8 text-sm font-semibold text-slate-500">콘텐츠를 불러오는 중입니다.</section>}>
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
