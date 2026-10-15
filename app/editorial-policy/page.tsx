import type { Metadata } from "next";
import { LocalizedInfoPage } from "@/components/LocalizedInfoPage";

export const metadata: Metadata = {
  title: "운영 원칙",
  description: "계산의정석의 콘텐츠, 출처, 수정 및 사용자 콘텐츠 운영 원칙입니다."
};

export default function EditorialPolicyPage() {
  return <LocalizedInfoPage kind="editorial" />;
}
