import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";
import { buildHubMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHubMetadata(
  "/science",
  "과학 도구",
  "전류·전압, 전력 사용량, 물리, 천문 계산기를 한곳에서 확인하세요."
);

export default function ScienceHubPage() {
  return <HubPage hub={hubContents.science} />;
}
