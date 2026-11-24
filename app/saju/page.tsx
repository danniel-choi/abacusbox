import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";
import { buildHubMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildHubMetadata("/saju", "사주 계산기", "띠, 삼재, 육십갑자, 만세력, 사주 오행, 일간, 시주, 타로 탄생 카드, 별자리 궁합, 신살·귀인 계산기를 확인하세요.");

export default function SajuHubPage() {
  return (
    <>
      <HubPage hub={hubContents.saju} />
      <div className="mx-auto -mt-4 max-w-6xl px-4 pb-10">
        <Link href="/tarot" className="block rounded-[24px] border border-[#eadcff] bg-[#f8f2ff] p-6 shadow-panel transition hover:border-[#7040a4]">
          <p className="text-sm font-extrabold text-[#7040a4]">새로운 운세 콘텐츠</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">오늘의 타로 운세 한 장 뽑기</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">오늘의 흐름과 실천 메시지를 타로 카드 한 장으로 가볍게 확인해 보세요.</p>
        </Link>
      </div>
    </>
  );
}
