import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants";
import { AdSenseLoader } from "@/components/AdSenseLoader";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "계산의정석",
  title: {
    default: "계산의정석(계산의 정석) - 노무·금융·건강·일상·생활 계산기 디렉토리",
    template: "%s | 계산의정석"
  },
  description: "계산의정석, 계산의 정석은 노무, 금융, 절세, 건강, 일상 도구, 생활, 사업 계산기와 수학 도구를 검색과 필터로 빠르게 찾고 실행할 수 있는 계산기 디렉토리입니다.",
  alternates: {
    canonical: SITE_URL
  },
  keywords: [
    "계산의정석",
    "계산의 정석",
    "계산의정석 계산기",
    "계산의 정석 계산기",
    "무료 온라인 계산기",
    "생활 계산기 모음",
    "세금 계산기",
    "연말정산 계산기",
    "실수령액 계산기",
    "퇴직금 계산기",
    "대출 계산기"
  ],
  openGraph: {
    title: "계산의정석(계산의 정석) - 노무·금융·건강·일상·생활 계산기 디렉토리",
    description: "계산의 정석이라는 이름으로 찾을 수 있는 계산기와 수학 도구 플랫폼. 분야별 계산기와 기준 설명을 함께 제공합니다.",
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "계산의정석 계산기 디렉토리"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "계산의정석(계산의 정석) - 노무·금융·건강·일상·생활 계산기 디렉토리",
    description: "계산의 정석이라는 이름으로 찾을 수 있는 계산기와 수학 도구 플랫폼. 분야별 계산기와 기준 설명을 함께 제공합니다.",
    images: [DEFAULT_OG_IMAGE]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "계산의정석",
    alternateName: ["계산의 정석", "Abacusbox", "abacusbox"],
    url: SITE_URL,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/calculators?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: "계산의정석",
      alternateName: "계산의 정석",
      url: SITE_URL
    }
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5568924428249376" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </head>
      <body className="min-h-screen antialiased">
        <LanguageProvider>
          <AdSenseLoader />
          <GoogleAnalytics />
          <Header />
          {children}
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
