import type { Metadata } from "next";
import { ToolboxClient } from "@/components/ToolboxClient";
import { SITE_URL } from "@/lib/constants";

const tools = [
  ["image-tools", "이미지 압축·리사이즈·변환", "이미지 압축, 크기 조절, 자르기와 JPG·PNG·WebP 변환"],
  ["json-formatter", "JSON 정리 도구", "JSON 문법을 확인하고 보기 좋게 정리하거나 압축"],
  ["text-counter", "텍스트 카운터", "글자 수, 공백 제외 글자 수, 단어 수와 줄 수 확인"],
  ["drawing-board", "브라우저 그림판", "펜, 도형, 텍스트로 메모를 만들고 PNG로 저장"],
  ["youtube-thumbnail", "유튜브 썸네일 추출", "유튜브 영상 URL에서 공개 썸네일 확인"],
  ["image-metadata", "이미지 정보 확인", "이미지의 크기, 비율과 파일 용량 확인"],
  ["developer-tools", "개발자 도구", "JWT·Unix timestamp·Base64·URL 인코딩 처리"]
] as const;

export const metadata: Metadata = {
  title: "무료 웹툴 모음 | 이미지·JSON·개발자 도구",
  description: "이미지 압축, JSON 정리, 텍스트 카운터, JWT 디코더, Unix timestamp 변환과 Base64 인코딩을 브라우저에서 바로 사용하는 무료 웹툴 모음입니다.",
  keywords: ["웹툴", "이미지 압축", "JSON 정리", "JWT 디코더", "Unix timestamp 변환", "Base64 인코더", "글자수 세기"],
  alternates: { canonical: `${SITE_URL}/toolbox` },
  openGraph: { title: "무료 웹툴 모음 | 계산의정석", description: "파일을 서버에 올리지 않고 브라우저에서 바로 쓰는 무료 웹툴 모음입니다.", url: `${SITE_URL}/toolbox`, type: "website" }
};

export default function ToolboxPage() {
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "계산의정석 웹툴 모음",
    description: "이미지 압축, 형식 변환, JSON 정리, 개발자용 토큰·시간·인코딩 도구를 브라우저에서 바로 사용하는 무료 웹툴 모음입니다.",
    url: `${SITE_URL}/toolbox`,
    mainEntity: { "@type": "ItemList", numberOfItems: tools.length, itemListElement: tools.map(([slug, name, description], index) => ({ "@type": "ListItem", position: index + 1, name, description, url: `${SITE_URL}/toolbox/${slug}` })) }
  };
  return <main className="mx-auto max-w-6xl px-4 py-10"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} /><section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel"><p className="text-sm font-extrabold text-brand">웹툴 카테고리</p><h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">파일과 텍스트를 바로 다루는 무료 웹툴</h1><p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 md:text-base">이미지와 텍스트를 브라우저에서 빠르게 처리하세요. 간단한 작업은 설치와 회원가입 없이 사용할 수 있습니다.</p></section><nav aria-label="웹툴 바로가기" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tools.map(([slug, name, description]) => <a key={slug} href={`/toolbox/${slug}`} className="rounded-2xl border border-line bg-white p-4 transition hover:border-brand hover:shadow-panel"><strong className="block text-sm font-extrabold text-ink">{name}</strong><span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{description}</span></a>)}</nav><ToolboxClient /></main>;
}
