"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/components/LanguageProvider";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AdPlacement = "top" | "calculator" | "inArticle" | "bottom";

type AdSenseAdProps = {
  placement: AdPlacement;
  className?: string;
};

const AD_CLIENT = "ca-pub-5568924428249376";
const DEFAULT_DISPLAY_SLOT = "8858811048";
const DISPLAY_SLOT = process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT || DEFAULT_DISPLAY_SLOT;

const SLOT_BY_PLACEMENT: Record<AdPlacement, string | undefined> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT || DISPLAY_SLOT,
  calculator: process.env.NEXT_PUBLIC_ADSENSE_CALCULATOR_SLOT || DISPLAY_SLOT,
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT || DISPLAY_SLOT,
  bottom: process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || DISPLAY_SLOT
};

export function AdSenseAd({ placement, className = "" }: AdSenseAdProps) {
  const { t } = useLanguage();
  const slot = SLOT_BY_PLACEMENT[placement];
  const key = useMemo(() => `${placement}-${slot || "display"}`, [placement, slot]);
  const adRef = useRef<HTMLModElement>(null);
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement || adElement.dataset.calcruleAdPushed === "true") return;

    try {
      adElement.dataset.calcruleAdPushed = "true";
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      if (adElement) delete adElement.dataset.calcruleAdPushed;
      // Ad blockers or delayed AdSense loading can throw here; the page should keep working.
    }
  }, [slot, key]);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement || viewTrackedRef.current || typeof IntersectionObserver === "undefined") return;

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.5 || viewTrackedRef.current) return;
        timer = window.setTimeout(() => {
          if (viewTrackedRef.current) return;
          viewTrackedRef.current = true;
          window.gtag?.("event", "ad_slot_view", {
            ad_placement: placement,
            ad_slot: slot || "display"
          });
        }, 1000);
      },
      { threshold: [0.5] }
    );

    observer.observe(adElement);
    return () => {
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [placement, slot, key]);

  return (
    <div aria-label="광고" className={`ad-slot rounded-[20px] border border-line bg-white px-3 py-3 shadow-sm ${className}`}>
      <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-normal text-slate-400">{t(`ads.${placement}` as "ads.top" | "ads.calculator" | "ads.inArticle" | "ads.bottom")}</p>
      <ins
        ref={adRef}
        key={key}
        className="adsbygoogle block min-h-[90px] w-full"
        data-ad-placement={placement}
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot || undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
