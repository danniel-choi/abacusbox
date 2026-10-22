import type { Metadata } from "next";
import { AdSenseAd } from "@/components/AdSenseAd";
import { CalculatorDirectoryClient } from "@/components/CalculatorDirectoryClient";
import { LocalizedDirectoryIntro } from "@/components/LocalizedDirectoryIntro";

export const metadata: Metadata = {
  title: "전체 계산기",
  description: "계산기와 수학 도구를 검색, 그룹 필터, 정렬 기준으로 빠르게 찾고 바로 실행할 수 있습니다.",
  alternates: { canonical: "/calculators" }
};

export default function CalculatorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <LocalizedDirectoryIntro />

      <div className="mt-8">
        <AdSenseAd placement="top" />
      </div>

      <div className="mt-8">
        <CalculatorDirectoryClient />
      </div>
    </main>
  );
}
