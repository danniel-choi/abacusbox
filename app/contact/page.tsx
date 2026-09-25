import type { Metadata } from "next";
import { InquiryBoardClient } from "@/components/InquiryBoardClient";

export const metadata: Metadata = {
  title: "문의",
  description: "계산의정석 문의 게시판에서 계산 기준 오류 제보, 기능 요청, 제휴 문의, 개인정보 관련 문의를 등록할 수 있습니다."
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-[28px] bg-navy px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">운영 문의</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">문의 게시판</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">
          계산 기준 오류, 기능 요청, 제휴 문의, 개인정보 처리 관련 문의를 남길 수 있습니다. 운영자는 접수된 내용을 확인해 계산식, 설명 문구, 출처 링크를 지속적으로 보완합니다.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "오류 제보", text: "계산 결과가 실제 기준과 다르거나 출처가 오래된 경우 알려주세요." },
          { title: "기능 요청", text: "필요한 계산기, 입력 항목, 비교 방식이 있으면 제안할 수 있습니다." },
          { title: "운영 문의", text: "광고, 개인정보, 제휴, 게시물 처리와 관련한 문의를 접수합니다." }
        ].map((item) => (
          <div key={item.title} className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
            <h2 className="text-lg font-extrabold text-ink">{item.title}</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <InquiryBoardClient />
    </main>
  );
}
