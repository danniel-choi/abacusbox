"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LocalizedDirectoryIntro() {
  const { locale } = useLanguage();
  const copy = locale === "en"
    ? { eyebrow: "CALCULATORS", title: "All calculators", description: "Browse labor, finance, tax, health, everyday, life, game, fortune, business, and math tools with search and filters." }
    : locale === "ja"
      ? { eyebrow: "CALCULATORS", title: "すべての計算機", description: "労務、金融、税金、健康、日常、生活、ゲーム、占い、ビジネス、数学ツールを検索とフィルターで探せます。" }
      : { eyebrow: "CALCULATORS", title: "전체 계산기", description: "노무, 금융, 절세, 건강, 일상 도구, 생활, 게임, 사주, 사업 계산기와 수학 도구를 그룹별로 정리하고 검색과 필터로 바로 찾을 수 있게 구성했습니다." };
  return (
    <section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel">
      <p className="text-sm font-extrabold text-brand">{copy.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 md:text-base">{copy.description}</p>
    </section>
  );
}

export function LocalizedResourcesIntro() {
  const { locale } = useLanguage();
  const copy = locale === "en"
    ? { eyebrow: "Reference Sites", title: "Legal, tax, and finance references", description: "Check official sources before using a result for a filing, contract, loan, or investment decision. These public and official sites are useful for reviewing assumptions.", legal: "Legal", tax: "Tax", finance: "Finance", legalText: "Laws, cases, registration, litigation, and legal aid", taxText: "National and local tax, interpretation, and social insurance", financeText: "Consumer protection, product comparison, disclosures, and market data", notice: "Important note", noticeTitle: "Review official sources and professionals for final decisions.", noticeText: "CalcRule tools and reference links are for quick comparison and assumption checking. For filings, lawsuits, contracts, financial products, or investments, also review current rules and qualified professionals." }
    : locale === "ja"
      ? { eyebrow: "Reference Sites", title: "法律・税務・金融の参考サイト", description: "申告、契約、ローン、投資の判断に使う前に公式資料を確認してください。基準の確認に役立つ公的・公式サイトをまとめています。", legal: "法律", tax: "税務", finance: "金融", legalText: "法令、判例、登記、訴訟、法律支援", taxText: "国税・地方税、税法解釈、社会保険", financeText: "消費者保護、商品比較、開示、市場情報", notice: "注意事項", noticeTitle: "最終判断は公式資料と専門家の確認を合わせて行ってください。", noticeText: "計算の定石の計算機と参考リンクは比較と基準確認のための資料です。申告、訴訟、契約、金融商品、投資の判断では最新の制度と専門家の確認も必要です。" }
      : { eyebrow: "Reference Sites", title: "법률·세무·금융 참고 사이트", description: "계산 결과를 실제 신고, 계약, 대출, 투자 판단에 연결하기 전에는 공식 자료를 함께 확인해야 합니다. 기준 검토에 우선 참고하기 좋은 공공·공식 사이트를 모았습니다.", legal: "법률", tax: "세무", finance: "금융", legalText: "법령, 판례, 등기, 소송, 법률구조", taxText: "국세, 지방세, 세법 해석, 4대보험", financeText: "소비자보호, 상품 비교, 공시, 시장 정보", notice: "주의사항", noticeTitle: "최종 판단은 공식 자료와 전문가 검토를 함께 보세요.", noticeText: "계산의정석의 계산기와 참고 링크는 빠른 비교와 기준 확인을 돕기 위한 자료입니다. 실제 신고, 소송, 계약, 금융상품 가입, 투자 판단은 최신 기준과 전문가 검토를 함께 확인하세요." };

  return { copy };
}

export function LocalizedResourcesHeader() {
  const { copy } = LocalizedResourcesIntro();
  return (
    <>
      <p className="text-sm font-extrabold text-brand">{copy.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">{copy.title}</h1>
      <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-slate-600">{copy.description}</p>
    </>
  );
}

export function LocalizedSummaryTile({ kind, value }: { kind: "legal" | "tax" | "finance"; value: string }) {
  const { copy } = LocalizedResourcesIntro();
  const data = kind === "legal" ? [copy.legal, copy.legalText] : kind === "tax" ? [copy.tax, copy.taxText] : [copy.finance, copy.financeText];
  const count = copy.eyebrow === "Reference Sites" ? `${value} ${value === "1" ? "site" : "sites"}` : `${value}개`;
  return (
    <div className="rounded-[20px] bg-paper p-5">
      <p className="text-sm font-extrabold text-brand">{data[0]}</p>
      <p className="mt-2 text-3xl font-black text-ink">{count}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{data[1]}</p>
    </div>
  );
}

export function LocalizedResourcesNotice() {
  const { copy } = LocalizedResourcesIntro();
  return (
    <>
      <p className="text-sm font-extrabold text-brand">{copy.notice}</p>
      <h2 className="mt-2 text-2xl font-black">{copy.noticeTitle}</h2>
      <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72">{copy.noticeText}</p>
    </>
  );
}
