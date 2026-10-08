import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "사주 계산기",
  description: "띠, 삼재, 육십갑자, 만세력, 사주 오행, 일간, 시주, 타로 탄생 카드, 별자리 궁합, 신살·귀인 계산기를 확인하세요."
};

export default function SajuHubPage() {
  return <HubPage hub={hubContents.saju} />;
}
