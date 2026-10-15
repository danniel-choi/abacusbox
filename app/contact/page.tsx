import type { Metadata } from "next";
import { ContactPageClient } from "@/components/ContactPageClient";

export const metadata: Metadata = {
  title: "문의",
  description: "계산의정석 문의 게시판에서 계산 기준 오류 제보, 기능 요청, 제휴 문의, 개인정보 관련 문의를 등록할 수 있습니다."
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <ContactPageClient />
    </main>
  );
}
