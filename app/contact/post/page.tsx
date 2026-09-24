import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDetailClient } from "@/components/ContentDetailClient";

export const metadata: Metadata = {
  title: "문의 상세",
  description: "계산의정석 문의 게시판 글 상세 페이지입니다.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ContactPostPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl px-4 py-12 text-sm font-semibold text-slate-500">문의 글을 불러오는 중입니다.</main>}>
      <ContentDetailClient apiBasePath="/api/contact" listPath="/contact" fallbackItems={[]} mode="inquiry" />
    </Suspense>
  );
}
