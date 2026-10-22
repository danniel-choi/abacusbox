import type { Metadata } from "next";
import { LocalizedInfoPage } from "@/components/LocalizedInfoPage";

export const metadata: Metadata = {
  title: "계산의정석 소개",
  description: "계산의정석 서비스 범위와 운영 기준을 안내합니다.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return <LocalizedInfoPage kind="about" />;
}
