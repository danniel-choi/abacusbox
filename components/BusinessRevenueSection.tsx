"use client";

import Link from "next/link";
import { trackAnalyticsEvent } from "@/lib/analytics";

const offers = [
  {
    title: "계산기 위젯·맞춤 도구",
    text: "쇼핑몰, 커뮤니티, 사내 페이지에 필요한 계산 로직과 입력 화면을 정리해 임베드형 도구로 설계합니다.",
    label: "위젯 문의"
  },
  {
    title: "사업자용 계산 템플릿",
    text: "마진·부가세·손익분기·광고 효율을 반복해서 검토할 수 있는 실무용 표와 계산 기준을 구성합니다.",
    label: "템플릿 문의"
  },
  {
    title: "콘텐츠·제휴 검토",
    text: "계산 기준과 출처가 확인되는 서비스 소개, 공동 가이드, 도구 제휴 제안을 운영 기준에 따라 검토합니다.",
    label: "제휴 문의"
  }
];

export function BusinessRevenueSection() {
  function openContact(offer: string) {
    trackAnalyticsEvent("business_lead_click", { offer });
  }

  return (
    <section className="mx-auto mt-8 max-w-6xl px-4" aria-labelledby="business-revenue-title">
      <div className="rounded-[24px] bg-navy p-6 text-white shadow-panel sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold text-brand">BUSINESS SUPPORT</p>
          <h2 id="business-revenue-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">계산기를 업무에 맞게 활용하고 싶다면</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-white/70 sm:text-base">
            현재는 정해진 가격이나 자동 결제를 운영하지 않습니다. 필요한 도구와 사용 목적을 문의로 남겨주시면 범위·기준·일정을 먼저 확인해 맞는 방식만 제안합니다.
          </p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.title} className="rounded-[20px] border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-extrabold">{offer.title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-white/65">{offer.text}</p>
              <Link
                href="/contact"
                onClick={() => openContact(offer.title)}
                className="mt-5 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white transition hover:bg-white hover:text-navy"
              >
                {offer.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
