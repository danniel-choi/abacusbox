import type { Metadata } from "next";
import { LocalizedInfoPage } from "@/components/LocalizedInfoPage";

export const metadata: Metadata = {
  title: "이용약관",
  description: "계산의정석 서비스 이용 범위와 계산 결과의 한계를 안내합니다.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return <LocalizedInfoPage kind="terms" />;
}
