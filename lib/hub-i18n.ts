import type { HubContent } from "@/lib/hub-content";
import { getLocalizedGroupMeta } from "@/lib/calculator-directory";
import type { Locale } from "@/lib/i18n";

export function getLocalizedHubContent(hub: HubContent, locale: Locale): HubContent {
  if (locale === "ko") return hub;

  const group = getLocalizedGroupMeta(locale, hub.group);
  const isEnglish = locale === "en";
  const label = group.label;
  return {
    ...hub,
    eyebrow: isEnglish ? `${label} hub` : `${label}ハブ`,
    title: isEnglish ? `${label} calculators and guides` : `${label}の計算機とガイド`,
    description: isEnglish
      ? `${group.description}. Compare practical calculators and related guides in one place.`
      : `${group.description}。実用的な計算機と関連ガイドをまとめて確認できます。`,
    sections: [
      {
        title: isEnglish ? "Start with the right input assumptions." : "まず入力条件を確認しましょう。",
        body: isEnglish
          ? `Results in the ${label.toLowerCase()} category can change when dates, amounts, rates, or eligibility conditions change. Review the assumptions before comparing results.`
          : `${label}の計算結果は日付、金額、率、適用条件によって変わります。結果を比較する前に入力条件を確認してください。`
      },
      {
        title: isEnglish ? "Compare the result with related tools." : "関連ツールと結果を比較できます。",
        body: isEnglish
          ? "Use the featured calculators first, then open related tools to compare a different assumption or scenario. This makes the result easier to use in a real decision."
          : "おすすめの計算機を使った後、関連ツールで別の条件やシナリオを比較してみてください。実際の判断に結果を活用しやすくなります。"
      },
      {
        title: isEnglish ? "Treat the result as a practical estimate." : "결과는 참고용 추정치로 활용하세요.",
        body: isEnglish
          ? "The calculators are designed for quick comparison. Official rules, personal circumstances, and institution-specific decisions may produce a different final result."
          : "계산기는 빠른 비교를 위한 도구입니다. 공식 기준, 개인 상황, 기관별 판단에 따라 최종 결과가 달라질 수 있습니다."
      }
    ],
    checklist: isEnglish
      ? ["Confirm the date and reference year", "Check units, rates, and eligibility conditions", "Compare at least two scenarios", "Verify important decisions with an official source or professional"]
      : ["날짜와 기준연도 확인", "단위·비율·적용 조건 확인", "두 가지 이상 시나리오 비교", "중요한 판단은 공식 자료나 전문가에게 재확인"]
  };
}
