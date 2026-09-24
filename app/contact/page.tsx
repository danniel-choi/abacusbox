import type { Metadata } from "next";
import { InquiryBoardClient } from "@/components/InquiryBoardClient";

export const metadata: Metadata = {
  title: "문의",
  description: "계산의정석 문의 게시판에서 오류 제보, 기능 요청, 제휴 문의를 등록할 수 있습니다.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[28px] bg-navy px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">운영 문의</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">문의 게시판</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">
          계산 기준 오류, 기능 요청, 제휴 문의를 남길 수 있습니다. 문의 영역은 운영 목적의 보조 채널로 사용되며 검색 노출보다는 처리 안정성을 우선합니다.
        </p>
      </section>

      <InquiryBoardClient />
    </main>
  );
}
