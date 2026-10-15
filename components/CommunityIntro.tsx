"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function CommunityIntro() {
  const { t } = useLanguage();

  return (
    <section className="rounded-[28px] bg-navy px-6 py-10 text-white shadow-panel">
      <p className="text-sm font-extrabold text-brand">{t("community.eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{t("community.title")}</h1>
      <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">{t("community.description")}</p>
    </section>
  );
}
