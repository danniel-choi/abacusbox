import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "수학 도구",
  description: "수학 노트, 그래핑 계산기, 공학용 계산기, 행렬 계산기 등 학습용 수학 도구를 확인하세요."
};

export default function MathHubPage() {
  return <HubPage hub={hubContents.math} />;
}
