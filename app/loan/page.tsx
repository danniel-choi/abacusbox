import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "대출·부동산 계산기",
  description: "대출이자, DSR, 원리금 상환, 대환대출, 중도상환수수료, 취득세 계산기를 비교하세요."
};

export default function LoanHubPage() {
  return <HubPage hub={hubContents.loan} />;
}
