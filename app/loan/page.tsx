import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";
import { buildHubMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHubMetadata("/loan", "대출 계산기", "대출이자, DSR, 원리금 상환, 대환대출과 중도상환수수료 계산기를 비교하세요.");

export default function LoanHubPage() {
  return <HubPage hub={hubContents.loan} />;
}
