"use client";

import { useEffect, useMemo } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdPlacement = "top" | "calculator" | "inArticle" | "bottom";

type AdSenseAdProps = {
  placement: AdPlacement;
  className?: string;
};

const AD_CLIENT = "ca-pub-5568924428249376";

const SLOT_BY_PLACEMENT: Record<AdPlacement, string | undefined> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT || process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT,
  calculator: process.env.NEXT_PUBLIC_ADSENSE_CALCULATOR_SLOT || process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT,
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT || process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT,
  bottom: process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT
};

const LABEL_BY_PLACEMENT: Record<AdPlacement, string> = {
  top: "추천 광고",
  calculator: "계산 결과 아래 광고",
  inArticle: "본문 중간 광고",
  bottom: "관련 콘텐츠 광고"
};

export function AdSenseAd({ placement, className = "" }: AdSenseAdProps) {
  const slot = SLOT_BY_PLACEMENT[placement];
  const key = useMemo(() => `${placement}-${slot || "display"}`, [placement, slot]);

  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or delayed AdSense loading can throw here; the page should keep working.
    }
  }, [slot, key]);

  return (
    <div className={`ad-slot rounded-[20px] border border-line bg-white px-3 py-3 shadow-sm ${className}`}>
      <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-normal text-slate-400">{LABEL_BY_PLACEMENT[placement]}</p>
      <ins
        key={key}
        className="adsbygoogle block min-h-[90px] w-full"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot || undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
