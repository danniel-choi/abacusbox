import type { Metadata } from "next";
import { AdminModerationClient } from "@/components/AdminModerationClient";

export const metadata: Metadata = {
  title: "관리자 모더레이션",
  description: "계산의정석 운영용 관리자 모더레이션 화면",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminModerationPage() {
  return <AdminModerationClient />;
}
