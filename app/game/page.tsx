import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "게임 계산기",
  description: "뽑기 확률, 리니지 클래식 축캐 판정, 디아블로3 보석 제작, FC온라인 수수료, 포커 승률, eDPI처럼 게임 플레이와 확률 판단에 필요한 계산기를 확인하세요."
};

export default function GameHubPage() {
  return <HubPage hub={hubContents.game} />;
}
