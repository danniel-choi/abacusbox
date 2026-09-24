import type { Metadata } from "next";
import { CalculatorDirectoryClient } from "@/components/CalculatorDirectoryClient";

export const metadata: Metadata = {
  title: "전체 계산기",
  description: "계산기와 수학 도구를 검색, 그룹 필터, 정렬 기준으로 빠르게 찾고 바로 실행할 수 있습니다."
};

export default function CalculatorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">CALCULATORS</p>
        <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">전체 계산기</h1>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 md:text-base">
          노무, 금융, 절세, 생활, 사업 계산기와 수학 도구를 그룹별로 정리하고 검색과 필터로 바로 찾을 수 있게 구성했습니다.
        </p>
      </section>

      <div className="mt-8">
        <CalculatorDirectoryClient />
      </div>
    </main>
  );
}
