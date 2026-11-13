import type { Metadata } from "next";
import { ToolboxClient } from "@/components/ToolboxClient";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "무료 웹툴 모음 | 이미지 압축·변환·JSON·텍스트 도구",
  description: "이미지 압축, 크기 조절, JPG·PNG·WebP 변환, JSON 정리, 텍스트 카운터를 브라우저에서 바로 사용하는 무료 웹툴 모음입니다.",
  keywords: ["웹툴", "이미지 압축", "이미지 변환", "JPG 변환", "PNG 변환", "JSON 정리", "글자수 세기"],
  alternates: { canonical: `${SITE_URL}/toolbox` },
  openGraph: { title: "무료 웹툴 모음 | 계산의정석", description: "파일을 서버에 올리지 않고 브라우저에서 바로 쓰는 무료 웹툴 모음입니다.", url: `${SITE_URL}/toolbox`, type: "website" }
};

export default function ToolboxPage() {
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "계산의정석 웹툴 모음",
    description: "이미지 압축, 크기 조절, 형식 변환, JSON 정리, 텍스트 카운터를 브라우저에서 바로 사용하는 무료 웹툴 모음입니다.",
    url: `${SITE_URL}/toolbox`,
    mainEntity: { "@type": "ItemList", numberOfItems: 3, itemListElement: ["이미지 작업실", "JSON 정리 도구", "텍스트 카운터"].map((name, index) => ({ "@type": "ListItem", position: index + 1, name })) }
  };
  return <main className="mx-auto max-w-6xl px-4 py-10"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} /><section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel"><p className="text-sm font-extrabold text-brand">웹툴 카테고리</p><h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">파일과 텍스트를 바로 다루는 무료 웹툴</h1><p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 md:text-base">이미지와 텍스트를 브라우저에서 빠르게 처리하세요. 간단한 작업은 설치와 회원가입 없이 사용할 수 있습니다.</p></section><ToolboxClient /></main>;
}
