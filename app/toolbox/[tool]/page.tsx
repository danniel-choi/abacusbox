import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolboxClient, type ToolboxTool } from "@/components/ToolboxClient";
import { SITE_URL } from "@/lib/constants";

const toolPages = {
  "image-tools": { active: "image", title: "이미지 압축·리사이즈·변환", description: "이미지를 브라우저에서 압축하고 크기를 조절하며 JPG, PNG, WebP로 변환하는 무료 웹툴입니다.", keywords: ["이미지 압축", "이미지 리사이즈", "JPG 변환", "PNG 변환", "WebP 변환"] },
  "json-formatter": { active: "json", title: "JSON 정리 도구", description: "JSON 문법을 확인하고 보기 좋게 정리하거나 용량을 줄여 압축하는 무료 웹툴입니다.", keywords: ["JSON 정리", "JSON 포맷터", "JSON 검사", "JSON 압축"] },
  "text-counter": { active: "text", title: "텍스트 글자 수 세기", description: "입력한 텍스트의 글자 수, 공백 제외 글자 수, 단어 수와 줄 수를 바로 확인하는 무료 웹툴입니다.", keywords: ["글자 수 세기", "글자수 계산기", "단어 수 세기", "텍스트 카운터"] },
  "drawing-board": { active: "drawing", title: "브라우저 그림판", description: "설치 없이 브라우저에서 펜, 도형, 텍스트로 그림과 주석을 만들고 PNG로 저장하는 무료 그림판입니다.", keywords: ["온라인 그림판", "브라우저 그림판", "웹 그림판", "그림판 PNG 저장"] },
  "youtube-thumbnail": { active: "youtube", title: "유튜브 썸네일 추출", description: "유튜브 영상 URL을 입력해 공개된 해상도별 썸네일을 확인하고 저장하는 무료 웹툴입니다.", keywords: ["유튜브 썸네일 추출", "유튜브 썸네일 다운로드", "유튜브 이미지 추출"] },
  "image-metadata": { active: "metadata", title: "이미지 정보 확인", description: "이미지 파일의 가로·세로 크기, 비율과 파일 용량을 브라우저에서 확인하는 무료 웹툴입니다.", keywords: ["이미지 크기 확인", "이미지 용량 확인", "사진 비율 확인", "이미지 메타데이터"] }
} as const satisfies Record<string, { active: ToolboxTool; title: string; description: string; keywords: string[] }>;

export function generateStaticParams() {
  return Object.keys(toolPages).map((tool) => ({ tool }));
}

export function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  return params.then(({ tool }) => {
    const page = toolPages[tool as keyof typeof toolPages];
    if (!page) return {};
    return {
      title: `${page.title} | 계산의정석 웹툴`,
      description: page.description,
      keywords: page.keywords,
      alternates: { canonical: `${SITE_URL}/toolbox/${tool}` },
      openGraph: { title: `${page.title} | 계산의정석`, description: page.description, url: `${SITE_URL}/toolbox/${tool}`, type: "website" }
    };
  });
}

export default async function ToolboxToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const page = toolPages[tool as keyof typeof toolPages];
  if (!page) notFound();
  const appLd = { "@context": "https://schema.org", "@type": "WebApplication", name: page.title, description: page.description, url: `${SITE_URL}/toolbox/${tool}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", isAccessibleForFree: true, inLanguage: "ko-KR" };
  return <main className="mx-auto max-w-6xl px-4 py-10"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} /><div className="mb-5 text-sm font-semibold text-slate-500"><Link href="/toolbox" className="hover:text-brand">웹툴 모음</Link><span className="mx-2">›</span><span>{page.title}</span></div><section className="rounded-[28px] bg-ink px-6 py-8 text-white shadow-panel"><p className="text-sm font-extrabold text-brand">계산의정석 무료 웹툴</p><h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{page.title}</h1><p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-white/72">{page.description} 파일과 입력 내용은 기본적으로 브라우저에서 처리됩니다.</p></section><ToolboxClient initialActive={page.active} /></main>;
}
