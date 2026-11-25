"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-YR4TQPTLNL";

export function GoogleAnalytics() {
  const pathname = usePathname();

  // 관리자 화면은 공개 서비스 성과를 오염시키지 않도록 측정하지 않습니다.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `}
      </Script>
    </>
  );
}
