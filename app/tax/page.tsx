import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "세금 계산기와 절세 가이드",
  description: "근로소득세, 연말정산 환급액, 상속세, 종합소득세, 연금 세액공제 계산기를 한곳에서 확인하세요."
};

export default function TaxHubPage() {
  return <HubPage hub={hubContents.tax} />;
}
