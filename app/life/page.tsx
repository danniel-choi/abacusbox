import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "생활 도구 계산기",
  description: "반려동물 나이, 교통 과태료, 유류비, K패스 환급, 출산 지원금, 생활비 습관처럼 생활 판단에 필요한 계산기를 빠르게 찾으세요."
};

export default function LifeHubPage() {
  return <HubPage hub={hubContents.life} />;
}
