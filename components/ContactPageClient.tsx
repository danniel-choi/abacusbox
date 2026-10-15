"use client";

import { InquiryBoardClient } from "@/components/InquiryBoardClient";
import { useLanguage } from "@/components/LanguageProvider";

export function ContactPageClient() {
  const { t } = useLanguage();
  const cards = [
    { title: t("contact.errorReport"), text: t("contact.errorReportText") },
    { title: t("contact.featureRequest"), text: t("contact.featureRequestText") },
    { title: t("contact.operation"), text: t("contact.operationText") }
  ];

  return (
    <>
      <section className="rounded-[28px] bg-navy px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">{t("contact.eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{t("contact.title")}</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">{t("contact.description")}</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((item) => (
          <div key={item.title} className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
            <h2 className="text-lg font-extrabold text-ink">{item.title}</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <InquiryBoardClient />
    </>
  );
}
