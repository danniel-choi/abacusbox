import type { Metadata } from "next";
import { AdminAccessClient } from "@/components/AdminAccessClient";

export const metadata: Metadata = {
  title: "관리자 로그인",
  description: "계산의정석 관리자 전용 로그인",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminAccessClient />;
}
