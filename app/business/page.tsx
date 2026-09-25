import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "사업·판매 계산기",
  description: "부가세, 판매수익, 손익분기점, 구독 매출, 물류비 계산기로 사업 숫자를 점검하세요."
};

export default function BusinessHubPage() {
  return <HubPage hub={hubContents.business} />;
}
