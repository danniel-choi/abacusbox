import type { Metadata } from "next";
import { AdminAutomationClient } from "@/components/AdminAutomationClient";

export const metadata: Metadata = {
  title: "관리자 자동화 캔버스",
  description: "계산의정석 블로그 자동 생성과 배포 흐름을 확인하는 관리자 화면",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminAutomationPage() {
  return <AdminAutomationClient />;
}
