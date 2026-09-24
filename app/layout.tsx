import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";
import { Header } from "@/components/Header";
import { VisitorCounter } from "@/components/VisitorCounter";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "계산의정석 - 노무·금융·생활 계산기 디렉토리",
    template: "%s | 계산의정석"
  },
  description: "노무, 금융, 절세, 생활, 사업 계산기와 수학 도구를 검색과 필터로 빠르게 찾고 실행할 수 있습니다.",
  openGraph: {
    title: "계산의정석 - 노무·금융·생활 계산기 디렉토리",
    description: "계산기와 수학 도구를 분야별로 정리하고 기준 설명까지 함께 제공하는 계산기 플랫폼.",
    type: "website",
    locale: "ko_KR",
    url: SITE_URL
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5568924428249376" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5568924428249376"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Header />
        {children}
        <footer className="mt-12 border-t border-white/10 bg-ink sm:mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-4">
              <VisitorCounter />
            </div>
            <div className="grid gap-4 text-sm text-white/60 md:grid-cols-[1fr_auto]">
              <p>계산 결과는 참고용 추정치이며, 실제 법률·세무·금융 판단은 관할 기관 또는 전문가 확인이 필요합니다.</p>
              <div className="flex flex-wrap gap-3 text-white/82">
                <Link href="/blog">블로그</Link>
                <Link href="/editorial-policy">운영 원칙</Link>
                <Link href="/privacy">개인정보처리방침</Link>
                <Link href="/contact">문의</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
