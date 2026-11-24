import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";
import { buildHubMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHubMetadata(
  "/real-estate",
  "부동산 계산기",
  "집을 사고·팔고·보유하고 임대할 때 필요한 취득세, 양도소득세, 보유세, 대출, 전월세 계산기를 단계별로 비교하세요."
);

export default function RealEstateHubPage() {
  return <HubPage hub={hubContents["real-estate"]} />;
}
