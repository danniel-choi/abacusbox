import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "건강 계산기",
  description: "BMI, 칼로리, 기초대사량, 표준체중, 수면, 러닝 페이스, 1RM처럼 건강과 운동에 필요한 계산기를 빠르게 찾으세요."
};

export default function HealthHubPage() {
  return <HubPage hub={hubContents.health} />;
}
