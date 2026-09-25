import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "생활 계산기",
  description: "날짜, 거리, 단위변환, 퍼센트, 할인율처럼 일상에서 자주 쓰는 계산기를 빠르게 찾으세요."
};

export default function LifeHubPage() {
  return <HubPage hub={hubContents.life} />;
}
