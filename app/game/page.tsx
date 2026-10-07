import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "게임 계산기",
  description: "뽑기 확률, 클래시 오브 클랜즈 업그레이드 자원·시간, 로블록스 로벅스 원화 환산, 리니지 클래식 사냥 효율, 블록스 프루츠 거래 W/F/L 계산기를 확인하세요."
};

export default function GameHubPage() {
  return <HubPage hub={hubContents.game} />;
}
