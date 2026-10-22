import type { Metadata } from "next";
import { LocalizedInfoPage } from "@/components/LocalizedInfoPage";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "계산의정석의 개인정보, 쿠키, 광고 및 게시물 처리 방침입니다.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return <LocalizedInfoPage kind="privacy" />;
}
