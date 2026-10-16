"use client";

import { useLanguage } from "@/components/LanguageProvider";

type CopyId =
  | "loading" | "faq" | "quickGuide" | "quickGuideTitle" | "currentCondition" | "checkResult" | "reviewFaq"
  | "sources" | "sourceDescription" | "kasiNotice" | "kasiPolicy" | "publicNuri" | "officialSites" | "officialSitesTitle" | "viewResources"
  | "relatedGuides" | "readBefore" | "allBlogs" | "guideOpen" | "guideTitle" | "guideIntro" | "searchTitle";

const COPY: Record<CopyId, { ko: string; en: string; ja: string }> = {
  loading: { ko: "계산기를 불러오는 중입니다.", en: "Loading calculator...", ja: "計算機を読み込んでいます…" },
  faq: { ko: "자주 묻는 질문", en: "Frequently asked questions", ja: "よくある質問" },
  quickGuide: { ko: "빠른 안내", en: "Quick guide", ja: "クイックガイド" },
  quickGuideTitle: { ko: "이 계산기를 이렇게 쓰면 됩니다.", en: "How to use this calculator", ja: "この計算機の使い方" },
  currentCondition: { ko: "현재 조건 입력", en: "Enter your current conditions", ja: "現在の条件を入力" },
  checkResult: { ko: "핵심 결과와 비교 차트 확인", en: "Review the key result and comparison chart", ja: "主要結果と比較チャートを確認" },
  reviewFaq: { ko: "FAQ와 기준 설명까지 검토", en: "Review the FAQs and assumptions", ja: "FAQと基準の説明を確認" },
  sources: { ko: "기준 및 출처", en: "Standards and sources", ja: "基準と出典" },
  sourceDescription: { ko: "계산 결과는 참고용이며, 아래 공식 기준과 안내 자료를 바탕으로 기준 정보를 반영했습니다.", en: "Results are estimates based on the official standards and reference materials below.", ja: "計算結果は目安であり、以下の公式基準と資料をもとにしています。" },
  kasiNotice: { ko: "KASI 저작권 및 라이선스 고지", en: "KASI copyright and license notice", ja: "KASIの著作権・ライセンス表示" },
  kasiPolicy: { ko: "KASI 저작권정책 전문", en: "KASI copyright policy", ja: "KASI著作権ポリシー" },
  publicNuri: { ko: "공공누리 제1유형 전문", en: "Korea Open Government License Type 1", ja: "韓国オープンライセンス第1種" },
  officialSites: { ko: "공식 참고 사이트", en: "Official reference sites", ja: "公式参考サイト" },
  officialSitesTitle: { ko: "이 계산기와 함께 확인할 만한 기관", en: "Organizations to check with this calculator", ja: "この計算機と一緒に確認したい機関" },
  viewResources: { ko: "전체 참고 사이트 보기", en: "View all reference sites", ja: "参考サイトをすべて見る" },
  relatedGuides: { ko: "관련 가이드", en: "Related guides", ja: "関連ガイド" },
  readBefore: { ko: "계산 전에 같이 보면 좋은 글", en: "Guides to read before calculating", ja: "計算前に読んでおきたい記事" },
  allBlogs: { ko: "블로그 전체 보기 ↗", en: "View all blog posts ↗", ja: "ブログ一覧 ↗" },
  guideOpen: { ko: "가이드 보기", en: "Read guide", ja: "ガイドを見る" }
  ,guideTitle: { ko: "이 계산기를 이렇게 쓰면 됩니다.", en: "How to use this calculator", ja: "この計算機の使い方" }
  ,guideIntro: { ko: "계산 기준과 해석 포인트를 함께 정리했습니다.", en: "Review the key assumptions and interpretation points before using the result.", ja: "計算基準と結果の見方をまとめています。" }
  ,searchTitle: { ko: "이 계산기를 찾는 분들이 확인하는 핵심 기준", en: "Key points people check when using this calculator", ja: "この計算機を使う方が確認するポイント" }
};

export function LocalizedCalculatorCopy({ id }: { id: CopyId }) {
  const { locale } = useLanguage();
  return COPY[id][locale];
}
