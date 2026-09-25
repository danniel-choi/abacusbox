import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "주식 계산기",
  description: "주식 수익률, 물타기 평균단가, PER/PBR 가치평가 계산기로 매매 손익과 투자 기준을 점검하세요."
};

export default function StockHubPage() {
  return <HubPage hub={hubContents.stock} />;
}
