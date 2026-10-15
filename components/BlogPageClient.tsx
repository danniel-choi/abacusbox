"use client";

import { Suspense } from "react";
import { AdSenseAd } from "@/components/AdSenseAd";
import { ContentListClient, type ContentListItem } from "@/components/ContentListClient";
import { useLanguage } from "@/components/LanguageProvider";

export function BlogPageClient({ fallbackItems }: { fallbackItems: ContentListItem[] }) {
  const { t } = useLanguage();

  return (
    <>
      <section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">{t("blog.contentHub")}</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{t("blog.title")}</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">{t("blog.description")}</p>
      </section>

      <div className="mt-8">
        <AdSenseAd placement="top" />
      </div>

      <Suspense fallback={<section className="mt-8 text-sm font-semibold text-slate-500">{t("blog.loading")}</section>}>
        <ContentListClient apiPath="/api/blog" detailBasePath="/blog" fallbackItems={fallbackItems} meta="blog" pageSize={10} detailMode="path" />
      </Suspense>
    </>
  );
}
