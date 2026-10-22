import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";
import { buildHubMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHubMetadata("/labor", "급여·노무 계산기", "실수령액, 퇴직금, 주휴수당, 연차수당, 실업급여 계산 기준과 관련 가이드를 확인하세요.");

export default function LaborHubPage() {
  return <HubPage hub={hubContents.labor} />;
}
