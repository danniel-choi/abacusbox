import type { Metadata } from "next";
import { HubPage } from "@/components/HubPage";
import { hubContents } from "@/lib/hub-content";

export const metadata: Metadata = {
  title: "일상 도구 계산기",
  description: "날짜 차이, D-Day, 기념일, 만 나이, 단위변환, 퍼센트, 텍스트 세기, 비밀번호 생성처럼 자주 쓰는 일상 도구 계산기를 확인하세요."
};

export default function DailyHubPage() {
  return <HubPage hub={hubContents.daily} />;
}
